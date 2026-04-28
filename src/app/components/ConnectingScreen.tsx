import { useState, useEffect, useRef } from 'react';
import { Video, Send, Smile, Mic, Phone, PhoneOff, VideoOff, MicOff, Maximize2, MessageSquare } from 'lucide-react';
import { generateVoiceToken, endCall } from '../../services/calling';

interface ConnectingScreenProps {
  username: string;
  avatar: string;
  callId?: string;
  isVideoCall?: boolean;
  onCancel: () => void;
  onCallEnd?: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

const topicTags = [
  { emoji: '🧳', text: 'Career Stress' },
  { emoji: '😞', text: 'Anxious Thoughts' },
  { emoji: '💔', text: 'Breakup Stress' },
  { emoji: '💬', text: 'Just Need To Talk' },
  { emoji: '😩', text: 'Missing Home' },
  { emoji: '🧠', text: 'Overthinking Again' },
  { emoji: '🌙', text: "Can't Sleep Properly" },
  { emoji: '👂', text: 'Need a Friend to Listen' },
  { emoji: '😰', text: 'Pressure' },
  { emoji: '🏠', text: 'Missing Home' },
];

const safetyMessages = [
  { icon: 'shield', text: 'Help keep our space safe' },
  { icon: 'check', text: 'Your safety comes first' },
  { emoji: '❤️', text: 'Be kind and respectful' },
];

export function ConnectingScreen({
  username,
  avatar,
  callId,
  isVideoCall = false,
  onCancel,
  onCallEnd
}: ConnectingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [dots, setDots] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [videoEnabled, setVideoEnabled] = useState(isVideoCall);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [myVideoEnabled, setMyVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callStartTime = useRef<Date | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle real call connection
  useEffect(() => {
    if (callId) {
      // Generate voice token and connect
      const connectCall = async () => {
        try {
          const tokenResult = await generateVoiceToken(`call-${callId}`);
          if (tokenResult.success) {
            // Here you would initialize Twilio Device with the token
            console.log('Voice token generated:', tokenResult.token);

            // Simulate connection after token generation
            setTimeout(() => {
              setIsConnected(true);
              setIsCallActive(true);
              callStartTime.current = new Date();

              // Start duration timer
              durationInterval.current = setInterval(() => {
                if (callStartTime.current) {
                  const elapsed = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
                  setCallDuration(elapsed);
                }
              }, 1000);

              // Send welcome message from listener
              setMessages([
                {
                  id: 1,
                  text: "Hi! I'm here to listen. How are you feeling today?",
                  sender: 'them',
                  timestamp: new Date(),
                },
              ]);
            }, 2000);
          }
        } catch (error) {
          console.error('Failed to connect call:', error);
          onCancel();
        }
      };

      connectCall();
    } else {
      // Fallback to simulation for demo purposes
      const timer = setTimeout(() => {
        setIsConnected(true);
        setIsCallActive(true);
        callStartTime.current = new Date();

        durationInterval.current = setInterval(() => {
          if (callStartTime.current) {
            const elapsed = Math.floor((Date.now() - callStartTime.current.getTime()) / 1000);
            setCallDuration(elapsed);
          }
        }, 1000);

        setMessages([
          {
            id: 1,
            text: "Hi! I'm here to listen. How are you feeling today?",
            sender: 'them',
            timestamp: new Date(),
          },
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callId, onCancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % safetyMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "I understand how you feel.",
        "That sounds really challenging.",
        "Tell me more about that.",
        "I'm here for you.",
        "That must be difficult.",
        "How did that make you feel?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: randomResponse,
          sender: 'them',
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndCall = async () => {
    try {
      if (callId) {
        await endCall(callId);
      }

      // Clear timer
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }

      setIsCallActive(false);
      onCallEnd?.();
    } catch (error) {
      console.error('Failed to end call:', error);
      // Still close the call UI even if API call fails
      onCallEnd?.();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const row1 = topicTags.slice(0, 4);
  const row2 = topicTags.slice(4, 7);
  const row3 = topicTags.slice(7, 10);

  // Connected interface with video/chat
  if (isConnected) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#0F0A1E] via-[#1A0F2E] to-[#0F0A1E] flex flex-col z-50">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/50"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F0A1E] shadow-lg shadow-emerald-500/50" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{username}</h3>
              <p className="text-emerald-400 text-xs font-medium">
                {isCallActive ? formatDuration(callDuration) : 'Connected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-full transition-all shadow-lg ${
                showChat
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-500/30'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleEndCall}
              className="p-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/30"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Section */}
          {videoEnabled && (
            <div className={`${showChat ? 'w-2/3' : 'w-full'} relative transition-all duration-300`}>
              {/* Listener Video (Main) */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
                <img
                  src={avatar}
                  alt={username}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Listener Name Overlay */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  <p className="text-white text-sm font-semibold">{username}</p>
                </div>
              </div>

              {/* Your Video (Picture-in-Picture) */}
              {myVideoEnabled && (
                <div className="absolute bottom-4 right-4 w-32 h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 group">
                  {/* Close Button */}
                  <button
                    onClick={() => setMyVideoEnabled(false)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm hover:bg-red-600 transition-all flex items-center justify-center z-10 opacity-0 group-hover:opacity-100"
                  >
                    <VideoOff className="w-3.5 h-3.5 text-white" />
                  </button>

                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-2xl font-bold">You</span>
                      </div>
                      <p className="text-white/70 text-xs">Camera Off</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show Your Camera Button (when hidden) */}
              {!myVideoEnabled && (
                <button
                  onClick={() => setMyVideoEnabled(true)}
                  className="absolute bottom-4 right-4 p-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-xl shadow-violet-500/30 transition-all active:scale-95"
                >
                  <Video className="w-5 h-5 text-white" />
                </button>
              )}

              {/* Video Controls Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-4 rounded-full transition-all shadow-xl ${
                    audioEnabled
                      ? 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'
                  }`}
                >
                  {audioEnabled ? (
                    <Mic className="w-6 h-6 text-white" />
                  ) : (
                    <MicOff className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setMyVideoEnabled(!myVideoEnabled)}
                  className={`p-4 rounded-full transition-all shadow-xl ${
                    myVideoEnabled
                      ? 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'
                  }`}
                  title={myVideoEnabled ? 'Turn off my camera' : 'Turn on my camera'}
                >
                  {myVideoEnabled ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setVideoEnabled(false)}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-xl"
                  title="Switch to audio only"
                >
                  <Phone className="w-6 h-6 text-white" />
                </button>

                <button className="p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-xl">
                  <Maximize2 className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Chat Section */}
          {(showChat || !videoEnabled) && (
            <div className={`${videoEnabled && showChat ? 'w-1/3 border-l border-white/10' : 'w-full'} flex flex-col transition-all duration-300`}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                        message.sender === 'me'
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                          : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-[10px] mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 bg-black/30 backdrop-blur-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Smile className="w-5 h-5 text-white/70" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-violet-500/50 transition-colors text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="p-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/30 active:scale-95"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio-only Mode */}
          {!videoEnabled && !showChat && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1 shadow-2xl shadow-violet-500/30 mb-6">
                <img
                  src={avatar}
                  alt={username}
                  className="w-full h-full rounded-full object-cover border-4 border-[#0F0A1E]"
                />
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">{username}</h2>
              <p className="text-emerald-400 text-sm font-medium mb-8">Voice Call Active</p>

              {/* Audio Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-5 rounded-full transition-all shadow-xl ${
                    audioEnabled
                      ? 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'
                  }`}
                >
                  {audioEnabled ? (
                    <Mic className="w-7 h-7 text-white" />
                  ) : (
                    <MicOff className="w-7 h-7 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setVideoEnabled(true)}
                  className="p-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-xl shadow-violet-500/30"
                >
                  <Video className="w-7 h-7 text-white" />
                </button>

                <button
                  onClick={() => setShowChat(true)}
                  className="p-5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-xl"
                >
                  <MessageSquare className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Connecting screen
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#8b5cf6] via-[#7c3aed] to-[#1a1035] flex flex-col z-50">
      <div className="flex justify-end p-4">
        {isVideoCall && (
          <div className="bg-green-500 rounded-lg p-2">
            <Video className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center px-4">
        <div className="mt-8 sm:mt-12">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-br from-yellow-200 to-yellow-100">
            <img
              src={avatar}
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-base sm:text-lg">{username}</p>
          <h2 className="text-white text-2xl sm:text-3xl mt-1">
            Connecting{dots}
          </h2>
        </div>

        <div className="mt-12 sm:mt-16 w-full overflow-hidden">
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

      <div className="px-6 pb-6 pt-8 bg-gradient-to-t from-[#1a1035] to-transparent">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-white/60 text-sm sm:text-base">
            {safetyMessages[currentMessage].text}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <button
          onClick={onCancel}
          className="w-full py-4 rounded-full border-2 border-white/80 text-white text-base sm:text-lg active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>

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
  );
}
