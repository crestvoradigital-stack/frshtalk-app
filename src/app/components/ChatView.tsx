import { useState } from 'react';
import { ArrowLeft, Send, Heart } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
}

interface ChatViewProps {
  match: {
    id: number;
    name: string;
    age: number;
    image: string;
  };
  onBack: () => void;
}

export function ChatView({ match, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hey! How are you?',
      sent: false,
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      text: 'Hi! I\'m doing great, thanks! How about you?',
      sent: true,
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      text: 'Pretty good! I saw you like hiking. Do you have a favorite trail?',
      sent: false,
      timestamp: '10:35 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: inputText,
          sent: true,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img
          src={match.image}
          alt={match.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-base">{match.name}, {match.age}</h3>
        </div>
        <button className="p-2">
          <Heart className="w-6 h-6 text-pink-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.sent
                  ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sent ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-br from-pink-500 to-red-500 rounded-full text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
