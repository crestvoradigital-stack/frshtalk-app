"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, ChevronDown, Pencil, Loader2, ChevronLeft, Circle, Square } from "lucide-react"

type Screen = "phone" | "otp"

interface DosttLoginProps {
  onBack?: () => void
  onVerified?: () => void
}

export function DosttLogin({ onBack, onVerified }: DosttLoginProps) {
  const [screen, setScreen] = useState<Screen>("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const isValidPhone = phoneNumber.length === 10

  // Countdown timer for OTP screen
  useEffect(() => {
    if (screen === "otp" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [screen, countdown])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhoneNumber(value)
  }

  const handleLoginClick = () => {
    if (isValidPhone) {
      setScreen("otp")
      setCountdown(60)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleEditPhone = () => {
    setScreen("phone")
    setOtp(["", "", "", "", "", ""])
  }

  const handleBack = () => {
    if (screen === "otp") {
      handleEditPhone()
    } else if (onBack) {
      onBack()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isOtpComplete = otp.every((digit) => digit !== "")

  const handleVerifyOtp = () => {
    if (isOtpComplete && onVerified) {
      onVerified()
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pt-20 sm:pt-24 md:pt-28 max-w-md mx-auto w-full">
        <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-6">Login to get started</h1>

        {screen === "phone" ? (
          <>
            {/* Phone Input */}
            <div className="bg-[rgba(94,53,130,0.4)] rounded-xl flex items-center px-3 sm:px-4 py-3 sm:py-4 gap-2 sm:gap-3">
              {/* Country Selector */}
              <button className="flex items-center gap-1 shrink-0">
                <span className="text-base sm:text-lg">🇮🇳</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[rgba(200,180,220,0.7)]" />
              </button>
              
              {/* Divider */}
              <div className="w-px h-5 sm:h-6 bg-[rgba(200,180,220,0.3)]" />
              
              {/* Phone Input */}
              <span className="text-[rgba(200,180,220,0.7)] text-sm sm:text-base">+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder=""
                className="flex-1 bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-[rgba(200,180,220,0.7)] min-w-0"
              />
            </div>
            
            <p className="text-[rgba(200,180,220,0.7)] text-xs sm:text-sm mt-3">
              You will receive an OTP on this number.
            </p>
          </>
        ) : (
          <>
            {/* OTP Screen */}
            <p className="text-[rgba(200,180,220,0.7)] text-sm sm:text-base mb-2">
              OTP sent on SMS to{" "}
              <button onClick={handleEditPhone} className="inline-flex items-center gap-1">
                <span className="text-white underline underline-offset-2">{phoneNumber}</span>
                <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </button>
            </p>

            <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4">Enter OTP</p>

            {/* OTP Input Boxes */}
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-[rgba(94,53,130,0.4)] rounded-lg sm:rounded-xl text-white text-center text-lg sm:text-xl outline-none focus:ring-2 focus:ring-[#8b7aad]"
                />
              ))}
            </div>

            {/* Auto-fetching indicator */}
            <div className="flex items-center justify-center gap-2 text-[rgba(200,180,220,0.7)] text-xs sm:text-sm mb-3 sm:mb-4">
              <span>Auto-fetching OTP</span>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            </div>

            {/* Retry section */}
            <div className="text-center">
              <p className="text-white font-medium text-sm sm:text-base">{"Didn't receive the OTP ?"}</p>
              <p className="text-[#8b7aad] text-sm sm:text-base">Retry in {formatTime(countdown)}</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        <div className="px-6 pb-4 sm:pb-6 max-w-md mx-auto w-full">
          {screen === "phone" ? (
            <>
              <button
                onClick={handleLoginClick}
                disabled={!isValidPhone}
                className={`w-full py-3 sm:py-4 rounded-full flex items-center justify-center gap-2 font-medium text-sm sm:text-base transition-all ${
                  isValidPhone
                    ? "bg-white text-[#1a1035]"
                    : "bg-[rgba(94,53,130,0.5)] text-[rgba(200,180,220,0.7)] cursor-not-allowed"
                }`}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Login using SMS</span>
              </button>

              <p className="text-center text-[rgba(200,180,220,0.7)] text-xs sm:text-sm mt-3 sm:mt-4 px-2">
                {"By continuing, you agree to Dostt's "}
                <button className="text-white underline underline-offset-2">
                  Terms & Conditions
                </button>
                {" and WhatsApp/SMS updates"}
              </p>
            </>
          ) : (
            <button
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete}
              className={`w-full py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all ${
                isOtpComplete
                  ? "bg-white text-[#1a1035]"
                  : "bg-[rgba(94,53,130,0.5)] text-[rgba(200,180,220,0.7)] cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>
          )}
        </div>

        {/* Android Navigation Bar */}
        <div className="flex justify-around items-center py-3 sm:py-4 border-t border-[#3d2d6b]">
          <button onClick={handleBack} className="p-2">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
      </div>
    </div>
  )
}
