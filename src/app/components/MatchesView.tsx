interface Match {
  id: number;
  name: string;
  age: number;
  image: string;
  lastMessage?: string;
  unread?: boolean;
}

const mockMatches: Match[] = [
  {
    id: 1,
    name: 'Olivia',
    age: 26,
    image: 'https://images.unsplash.com/photo-1716428325370-c3f667316f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    lastMessage: 'Hey! How are you?',
    unread: true
  },
  {
    id: 2,
    name: 'James',
    age: 28,
    image: 'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    lastMessage: 'That sounds amazing!',
  },
  {
    id: 3,
    name: 'Ava',
    age: 24,
    image: 'https://images.unsplash.com/photo-1614436201459-156d322d38c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    lastMessage: 'Would love to grab coffee',
    unread: true
  }
];

interface MatchesViewProps {
  newMatches: any[];
  onSelectMatch: (match: Match) => void;
}

export function MatchesView({ newMatches, onSelectMatch }: MatchesViewProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {newMatches.length > 0 && (
        <div className="p-4">
          <h3 className="text-sm text-gray-500 mb-3">New Matches</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {newMatches.map((match) => (
              <div key={match.id} className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✨
                  </div>
                </div>
                <p className="text-center text-xs mt-1 w-20 truncate">{match.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-4">
        <h3 className="text-sm text-gray-500 mb-3">Messages</h3>
        <div className="space-y-2">
          {mockMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {match.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-base">{match.name}, {match.age}</h4>
                </div>
                {match.lastMessage && (
                  <p className={`text-sm ${match.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                    {match.lastMessage}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
