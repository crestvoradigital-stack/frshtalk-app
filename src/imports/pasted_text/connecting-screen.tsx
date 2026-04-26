"use client"

import { useState, useEffect } from "react"
import { Video, X } from "lucide-react"

interface ConnectingScreenProps {
  username: string
  avatar: string
  isVideoCall?: boolean
  onCancel: () => void
}

const topicTags = [
  { emoji: "🧳", text: "Career Stress" },
  { emoji: "😞", text: "Anxious Thoughts" },
  { emoji: "💔", text: "Breakup Stress" },
  { emoji: "💬", text: "Just Need To Talk" },
  { emoji: "😩", text: "Missing Home" },
  { emoji: "🧠", text: "Overthinking Again" },
  { emoji: "🌙", text: "Can't Sleep Properly" },
  { emoji: "👂", text: "Need a Friend to Listen" },
  { emoji: "😰", text: "Pressure" },
  { emoji: "🏠", text: "Missing Home" },
]

const safetyMessages = [
  { icon: "shield", text: "Help keep our space safe" },
  { icon: "check", text: "Your safety comes first" },
  { icon: "heart", text: "Be kind and respectful" },
]

export function ConnectingScreen({ username, avatar, isVideoCall = false, onCancel }: ConnectingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [dots, setDots] = useState("")

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Rotate safety messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % safetyMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Create 3 rows of tags for the marquee effect
  const row1 = topicTags.slice(0, 4)
  const row2 = topicTags.slice(4, 7)
  const row3 = topicTags.slice(7, 10)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8b5cf6] via-[#7c3aed] to-[#1a1035] flex flex-col">
      {/* Header with video indicator */}
      <div className="flex justify-end p-4">
        {isVideoCall && (
          <div className="bg-green-500 rounded-lg p-2">
            <Video className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4">
        {/* Avatar */}
        <div className="mt-8 sm:mt-12">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-br from-yellow-200 to-yellow-100">
            <img
              src={avatar}
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Username and connecting status */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-base sm:text-lg">{username}</p>
          <h2 className="text-white text-2xl sm:text-3xl font-bold mt-1">
            Connecting{dots}
          </h2>
        </div>

        {/* Scrolling topic tags */}
        <div className="mt-12 sm:mt-16 w-full overflow-hidden">
          {/* Row 1 - scrolling left */}
          <div className="relative mb-3">
            <div className="flex animate-marquee-left gap-3">
              {[...row1, ...row1, ...row1].map((tag, index) => (
                <div
                  key={`row1-${index}`}
                  className="flex-shrink-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 sm:px-5 sm:py-3"
                >
                  <span className="text-base sm:text-lg">{tag.emoji}</span>
                  <span className="text-white text-sm sm:text-base whitespace-nowrap">{tag.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - scrolling right */}
          <div className="relative mb-3">
            <div className="flex animate-marquee-right gap-3">
              {[...row2, ...row2, ...row2].map((tag, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 sm:px-5 sm:py-3"
                >
                  <span className="text-base sm:text-lg">{tag.emoji}</span>
                  <span className="text-white text-sm sm:text-base whitespace-nowrap">{tag.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 - scrolling left */}
          <div className="relative">
            <div className="flex animate-marquee-left-slow gap-3">
              {[...row3, ...row3, ...row3].map((tag, index) => (
                <div
                  key={`row3-${index}`}
                  className="flex-shrink-0 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 sm:px-5 sm:py-3"
                >
                  <span className="text-base sm:text-lg">{tag.emoji}</span>
                  <span className="text-white text-sm sm:text-base whitespace-nowrap">{tag.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-6 pt-8 bg-gradient-to-t from-[#1a1035] to-transparent">
        {/* Safety message */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="text-white/60">
            {safetyMessages[currentMessage].icon === "shield" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            )}
            {safetyMessages[currentMessage].icon === "check" && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {safetyMessages[currentMessage].icon === "heart" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </div>
          <span className="text-white/60 text-sm sm:text-base">
            {safetyMessages[currentMessage].text}
          </span>
        </div>

        {/* Decorative line */}
        <div className="flex justify-center mb-6">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="w-full py-4 rounded-full border-2 border-white/80 text-white text-base sm:text-lg font-medium hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* CSS for marquee animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 15s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 15s linear infinite;
        }
        .animate-marquee-left-slow {
          animation: marquee-left 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
