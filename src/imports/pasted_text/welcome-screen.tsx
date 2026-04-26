import { useState, useEffect, useCallback } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Circle, Square } from "lucide-react"

interface WelcomeScreenProps {
  onLogin: () => void;
}

const slides = [
  {
    id: 1,
    title: "Feeling low? Talk to our listeners",
    subtitle: "Speak to people who understand and support you without judgment",
    illustration: "chat",
  },
  {
    id: 2,
    title: "Every call is safe and secure",
    subtitle: "No abuse, no misbehaviour. We ensure a respectful platform",
    illustration: "secure",
  },
  {
    id: 3,
    title: "Your name & face, always private",
    subtitle: "Your identity stays anonymous. Just a safe space to talk.",
    illustration: "anonymous",
  },
]

function ChatIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto transform scale-90 sm:scale-100 origin-center">
      {/* Phone */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-56 bg-[#2a1f4e] rounded-3xl border-4 border-[#3d2d6b] shadow-2xl">
        {/* Screen */}
        <div className="m-2 h-[calc(100%-16px)] bg-gradient-to-b from-[#1a1035] to-[#2a1f4e] rounded-2xl p-3 flex flex-col">
          {/* Chat bubbles */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="self-start bg-[#4fd1c5] text-[#1a1035] text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">
              Hey, how are you?
            </div>
            <div className="self-end bg-[#6366f1] text-white text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
              {"I'm here for you"}
            </div>
            <div className="self-start bg-[#4fd1c5] text-[#1a1035] text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%]">
              {"Let's talk"}
            </div>
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
      </div>
      {/* Heart icons */}
      <div className="absolute top-8 right-8 w-8 h-8 text-pink-400">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="absolute bottom-12 left-4 w-6 h-6 text-pink-300">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>
  )
}

function SecureIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto transform scale-90 sm:scale-100 origin-center">
      {/* Phone */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-56 bg-[#2a1f4e] rounded-3xl border-4 border-[#3d2d6b] shadow-2xl">
        {/* Screen */}
        <div className="m-2 h-[calc(100%-16px)] bg-gradient-to-b from-[#1a1035] to-[#2a1f4e] rounded-2xl flex items-center justify-center">
          {/* Lock icon */}
          <div className="w-16 h-16 bg-[#4fd1c5] rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-[#1a1035]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"/>
            </svg>
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
      </div>
      {/* Shield icon */}
      <div className="absolute bottom-8 left-6 w-20 h-24">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path fill="url(#shieldGradient)" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          <path fill="white" d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      </div>
    </div>
  )
}

function AnonymousIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto transform scale-90 sm:scale-100 origin-center">
      {/* Phone */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-56 bg-[#2a1f4e] rounded-3xl border-4 border-[#3d2d6b] shadow-2xl">
        {/* Screen */}
        <div className="m-2 h-[calc(100%-16px)] bg-gradient-to-b from-[#1a1035] to-[#2a1f4e] rounded-2xl flex flex-col items-center justify-center p-4">
          {/* Anonymous avatar */}
          <div className="w-20 h-20 bg-[#4fd1c5] rounded-2xl flex items-center justify-center mb-3">
            {/* Hat and glasses icon */}
            <svg className="w-14 h-14 text-[#1a1035]" viewBox="0 0 24 24">
              {/* Hat */}
              <ellipse cx="12" cy="8" rx="7" ry="2.5" fill="currentColor" />
              <path d="M5 8c0 0 0 3 7 3s7-3 7-3" strokeWidth="2" stroke="currentColor" fill="none"/>
              {/* Glasses */}
              <circle cx="8" cy="16" r="2.5" fill="#6366f1" stroke="#1a1035" strokeWidth="0.5"/>
              <circle cx="16" cy="16" r="2.5" fill="#6366f1" stroke="#1a1035" strokeWidth="0.5"/>
              <path d="M10.5 16h3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          {/* Name field */}
          <div className="w-full">
            <p className="text-[#4fd1c5] text-xs mb-1">Name</p>
            <div className="flex gap-0.5">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="text-[#f97316] text-sm">*</span>
              ))}
            </div>
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
      </div>
      {/* Shield icon */}
      <div className="absolute bottom-4 left-4 w-20 h-24">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="shieldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path fill="url(#shieldGradient2)" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          <path fill="white" d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      </div>
    </div>
  )
}

function FrshTalkLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Heart icon with yellow dot below-left */}
      <div className="relative">
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path 
            d="M16 28l-1.8-1.6C7.4 20.4 3 16.5 3 11.5 3 7.4 6.2 4 10.2 4c2.2 0 4.3 1 5.8 2.6C17.5 5 19.6 4 21.8 4 25.8 4 29 7.4 29 11.5c0 5-4.4 8.9-11.2 14.9L16 28z"
            fill="white"
          />
        </svg>
        {/* Yellow dot positioned below-right of heart */}
        <span className="absolute -bottom-1 -right-0.5 w-2 h-2 bg-[#fbbf24] rounded-full" />
      </div>
      {/* Logo text */}
      <span className="text-white text-xl font-medium tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        FrshTalk
      </span>
    </div>
  )
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const minSwipeDistance = 50
  const autoScrollInterval = 4000 // 4 seconds

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true) // Pause auto-scroll on touch
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
    
    // Resume auto-scroll after a delay
    setTimeout(() => setIsPaused(false), 5000)
  }

  const renderIllustration = (type: string) => {
    switch (type) {
      case "chat":
        return <ChatIllustration />
      case "secure":
        return <SecureIllustration />
      case "anonymous":
        return <AnonymousIllustration />
      default:
        return null
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035] flex flex-col justify-between safe-area-inset">
      {/* Header with logo */}
      <header className="p-6 pt-12 flex-shrink-0">
        <FrshTalkLogo />
      </header>

      {/* Carousel */}
      <div 
        className="flex-1 flex flex-col justify-center px-6 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
          >
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className="flex flex-col items-center px-4"
                style={{ width: `${100 / slides.length}%` }}
              >
                {/* Illustration */}
                <div className="mb-8">
                  {renderIllustration(slide.illustration)}
                </div>
                
                {/* Text content */}
                <div className="text-left w-full max-w-sm">
                  <h2 className="text-white text-2xl font-bold mb-3 leading-tight text-balance">
                    {slide.title}
                  </h2>
                  <p className="text-white/70 text-base leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop navigation arrows (hidden on mobile) */}
        <div className="hidden md:flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30"
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white w-2" 
                  : "bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        {/* Login button */}
        <div className="p-6 pb-6">
          <Button 
            onClick={onLogin}
            className="w-full h-14 text-lg font-semibold bg-white text-[#1a1035] hover:bg-white/90 rounded-full shadow-lg"
          >
            Log In
          </Button>
        </div>

        {/* Android Navigation Bar */}
        <div className="flex justify-around items-center py-4 border-t border-[#3d2d6b]">
          <ChevronLeft className="w-6 h-6 text-gray-500" />
          <Circle className="w-5 h-5 text-gray-500" />
          <Square className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  )
}
