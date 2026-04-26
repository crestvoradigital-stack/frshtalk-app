"use client"

import { useState, useEffect } from "react"
import { Phone, Video, Home, Clock, User, Shuffle, ChevronLeft, Circle, Square, ArrowUp, RefreshCw } from "lucide-react"
import { ConnectingScreen } from "./connecting-screen"
import { WalletScreen } from "./wallet-screen"

// Sample user data with status
const users = [
  {
    id: 1,
    username: "mouni_1612",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    voiceRate: 1,
    videoRate: 6,
    tags: ["Family and relationships", "Films and music", "Career"],
    isOnCall: true,
    waitTime: 10,
  },
  {
    id: 2,
    username: "rahul5525",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    voiceRate: 1,
    videoRate: 6,
    tags: ["Family and relationships", "Childhood memories", "Emotional"],
    isOnCall: false,
  },
  {
    id: 3,
    username: "eesha1908",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    voiceRate: 1,
    videoRate: 6,
    tags: [],
    isOnCall: false,
  },
  {
    id: 4,
    username: "paddu2508",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    voiceRate: 1,
    videoRate: 6,
    tags: ["Emotional or Supportive talk", "Culture, Roots & Memories"],
    isOnCall: false,
  },
]

const bannerSlides = [
  {
    id: 1,
    title: "Take action",
    subtitle: "Always report inappropriate behaviour",
    color: "from-[#5c3d2e] to-[#8b5a3c]",
  },
  {
    id: 2,
    title: "Stay safe",
    subtitle: "Your privacy is our priority",
    color: "from-[#2e4a5c] to-[#3c6b8b]",
  },
  {
    id: 3,
    title: "Be respectful",
    subtitle: "Treat others the way you want to be treated",
    color: "from-[#4a2e5c] to-[#6b3c8b]",
  },
]

const promoOffers = [
  {
    id: 1,
    discountAmount: "750",
    coins: 3600,
    price: 949,
  },
  {
    id: 2,
    discountAmount: "450",
    coins: 2500,
    price: 688,
  },
]

function FrshTalkLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 32 32" fill="none">
          <path 
            d="M16 28l-1.8-1.6C7.4 20.4 3 16.5 3 11.5 3 7.4 6.2 4 10.2 4c2.2 0 4.3 1 5.8 2.6C17.5 5 19.6 4 21.8 4 25.8 4 29 7.4 29 11.5c0 5-4.4 8.9-11.2 14.9L16 28z"
            fill="white"
          />
        </svg>
        <span className="absolute -bottom-1 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#fbbf24] rounded-full" />
      </div>
      <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
        FrshTalk
      </span>
    </div>
  )
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 9l10 13 10-13L12 2zm0 3.5L18.5 9 12 18.5 5.5 9 12 5.5z"/>
    </svg>
  )
}

function MegaphoneIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 64 64" fill="none">
      <path d="M48 16L20 28v12l28 12V16z" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2"/>
      <path d="M20 28H12a4 4 0 00-4 4v4a4 4 0 004 4h8V28z" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2"/>
      <circle cx="52" cy="32" r="6" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2"/>
      <path d="M12 40v8a4 4 0 004 4h2a4 4 0 004-4v-8" stroke="#d4c4b0" strokeWidth="2" fill="none"/>
    </svg>
  )
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#fbbf24" />
      <circle cx="12" cy="12" r="7" fill="#f59e0b" />
      <text x="12" y="16" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">$</text>
    </svg>
  )
}

interface HomeScreenProps {
  onBack?: () => void
}

export function HomeScreen({ onBack }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<"home" | "recents" | "profile">("home")
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentPromo, setCurrentPromo] = useState(0)
  const [coins] = useState(117)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showNewDostts, setShowNewDostts] = useState(true)
  const [connectingUser, setConnectingUser] = useState<typeof users[0] | null>(null)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [showWallet, setShowWallet] = useState(false)

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Auto-rotate promo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoOffers.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Auto-show New FrshTalks button every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showNewDostts) {
        setShowNewDostts(true)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [showNewDostts])

  const handleRefreshNewDostts = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setShowNewDostts(false)
    }, 1000)
  }

  const handleVoiceCall = (user: typeof users[0]) => {
    setConnectingUser(user)
    setIsVideoCall(false)
  }

  const handleVideoCall = (user: typeof users[0]) => {
    setConnectingUser(user)
    setIsVideoCall(true)
  }

  const handleCancelCall = () => {
    setConnectingUser(null)
  }

  // Show wallet screen
  if (showWallet) {
    return (
      <WalletScreen
        currentCoins={coins}
        onBack={() => setShowWallet(false)}
      />
    )
  }

  // Show connecting screen if a call is in progress
  if (connectingUser) {
    return (
      <ConnectingScreen
        username={connectingUser.username}
        avatar={connectingUser.avatar}
        isVideoCall={isVideoCall}
        onCancel={handleCancelCall}
      />
    )
  }

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
        <FrshTalkLogo />
        
        {/* Coin balance - clickable to open wallet */}
        <button 
          onClick={() => setShowWallet(true)}
          className="flex items-center gap-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-full px-3 py-1.5 sm:px-4 sm:py-2"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-[10px] sm:text-xs font-bold text-white">$</span>
          </div>
          <span className="text-white text-sm sm:text-base font-medium">{coins}</span>
        </button>
      </header>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
        {/* New Dostts Button */}
        {showNewDostts && (
          <div className="flex justify-center mb-4">
            <button 
              onClick={handleRefreshNewDostts}
              className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-full px-4 py-2 sm:px-5 sm:py-2.5"
            >
              {/* Overlapping Avatars */}
              <div className="flex -space-x-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#2a2a2a] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#2a2a2a] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#2a2a2a] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-white text-sm sm:text-base font-medium">New FrshTalks</span>
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>
        )}

        {/* Banner Carousel */}
        <div className="mb-4 sm:mb-6">
          <div 
            className={`relative bg-gradient-to-r ${bannerSlides[currentBanner].color} rounded-xl sm:rounded-2xl p-4 sm:p-5 overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
                  {bannerSlides[currentBanner].title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  {bannerSlides[currentBanner].subtitle}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <MegaphoneIcon />
              </div>
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentBanner ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* User Cards */}
        <div className="space-y-4 sm:space-y-5">
          {users.map((user) => (
            <div 
              key={user.id}
              className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden"
            >
              {/* Avatar Image */}
              <div className="relative h-48 sm:h-64 bg-gradient-to-b from-gray-300 to-gray-100">
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* User Info */}
              <div className="p-3 sm:p-4">
                <h4 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  {user.username}
                </h4>
                
                {/* Tags */}
                {user.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {user.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-[#2a2a2a] text-white/80 text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* On Call Status or Call Buttons */}
                {user.isOnCall ? (
                  <div className="bg-[#2a2a2a] rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-4">
                    <p className="text-center text-orange-400 text-sm sm:text-base font-medium">
                      On call, wait time ~ {user.waitTime} minutes
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={() => handleVoiceCall(user)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-lg sm:rounded-xl py-2.5 sm:py-3"
                    >
                      <DiamondIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                      <span className="text-white text-sm sm:text-base font-medium">{user.voiceRate}/min</span>
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </button>
                    <button 
                      onClick={() => handleVideoCall(user)}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-lg sm:rounded-xl py-2.5 sm:py-3"
                    >
                      <DiamondIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                      <span className="text-white text-sm sm:text-base font-medium">{user.videoRate}/min</span>
                      <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Floating Promo Banner - Bottom Left Overlay (narrow width, stacked layout) - clickable */}
      <button 
        onClick={() => setShowWallet(true)}
        className="fixed bottom-24 sm:bottom-28 left-3 sm:left-5 z-10 text-left"
      >
        <div className="bg-gradient-to-br from-[#0d5c3d] to-[#1a7a52] hover:from-[#0e6d48] hover:to-[#1f8b5d] transition-colors rounded-xl sm:rounded-2xl px-3 py-3 sm:px-4 sm:py-4 shadow-lg w-[200px] sm:w-[220px]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white text-sm sm:text-base font-bold leading-tight">
                Flat ₹{promoOffers[currentPromo].discountAmount} off
              </p>
              <p className="text-white/90 text-xs sm:text-sm mt-0.5">
                {promoOffers[currentPromo].coins} coins @ ₹{promoOffers[currentPromo].price} <span className="ml-0.5">&#9654;</span>
              </p>
            </div>
            <div className="flex-shrink-0 ml-2">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-md" />
                <div className="absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-md" />
                <div className="absolute top-4 left-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-md" />
              </div>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {promoOffers.map((_, index) => (
              <span
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentPromo ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </button>

      {/* Random FAB - Bottom Right */}
      <button className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg shadow-purple-500/30 z-10">
        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base font-medium">Random</span>
      </button>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-[#0d0d0d] border-t border-[#2a2a2a]">
        <div className="flex justify-around items-center py-2 sm:py-3">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-4 sm:px-6 py-1.5 sm:py-2 ${
              activeTab === "home" ? "text-white" : "text-gray-500"
            }`}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab("recents")}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-4 sm:px-6 py-1.5 sm:py-2 ${
              activeTab === "recents" ? "text-white" : "text-gray-500"
            }`}
          >
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Recents</span>
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 px-4 sm:px-6 py-1.5 sm:py-2 ${
              activeTab === "profile" ? "text-white" : "text-gray-500"
            }`}
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Profile</span>
          </button>
        </div>
        
        {/* Android Navigation Bar */}
        <div className="flex justify-around items-center py-3 sm:py-4 border-t border-[#2a2a2a]">
          <button onClick={onBack}>
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
      </div>
    </div>
  )
}
