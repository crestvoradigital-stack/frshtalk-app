import { useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { X, Heart, RotateCcw } from 'lucide-react';

const mockProfiles = [
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Love hiking on weekends and trying new restaurants.',
    location: '2 miles away',
    image: 'https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking']
  },
  {
    id: 2,
    name: 'Alex',
    age: 26,
    bio: 'Software engineer by day, musician by night. Always up for spontaneous adventures.',
    location: '5 miles away',
    image: 'https://images.unsplash.com/photo-1592234789031-94bf65f630ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Music', 'Tech', 'Travel', 'Food']
  },
  {
    id: 3,
    name: 'Emma',
    age: 25,
    bio: 'Yoga instructor and plant mom. Looking for someone who appreciates good vibes and deep conversations.',
    location: '3 miles away',
    image: 'https://images.unsplash.com/photo-1676337415964-11046dda455e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Yoga', 'Wellness', 'Plants', 'Reading']
  },
  {
    id: 4,
    name: 'Michael',
    age: 30,
    bio: 'Chef and food lover. Let me cook you dinner on our first date!',
    location: '4 miles away',
    image: 'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Cooking', 'Wine', 'Travel', 'Art']
  },
  {
    id: 5,
    name: 'Sophia',
    age: 27,
    bio: 'Marketing creative with a passion for design. Weekend warrior looking for a travel buddy.',
    location: '6 miles away',
    image: 'https://images.unsplash.com/photo-1749700332031-cf99864959ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Design', 'Art', 'Travel', 'Fashion']
  },
  {
    id: 6,
    name: 'David',
    age: 29,
    bio: 'Fitness enthusiast and dog dad. Love outdoor activities and trying new workout routines.',
    location: '7 miles away',
    image: 'https://images.unsplash.com/photo-1668804985095-0e6c33f99fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    interests: ['Fitness', 'Dogs', 'Outdoors', 'Health']
  }
];

interface DiscoverViewProps {
  onMatch: (profile: typeof mockProfiles[0]) => void;
}

export function DiscoverView({ onMatch }: DiscoverViewProps) {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [undoStack, setUndoStack] = useState<typeof mockProfiles>([]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProfile = profiles[profiles.length - 1];

    if (direction === 'right') {
      if (Math.random() > 0.5) {
        onMatch(currentProfile);
      }
    }

    setUndoStack([...undoStack, currentProfile]);
    setProfiles(profiles.slice(0, -1));
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastProfile = undoStack[undoStack.length - 1];
      setProfiles([...profiles, lastProfile]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleAction = (action: 'reject' | 'like') => {
    handleSwipe(action === 'like' ? 'right' : 'left');
  };

  if (profiles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl mb-2">You're all caught up!</h2>
          <p className="text-gray-600">Check back later for new people</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 relative p-4 pb-0">
        <div className="relative w-full h-full max-w-md mx-auto">
          {profiles.slice().reverse().map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              style={{
                zIndex: index,
                scale: 1 - index * 0.05,
                y: index * -10
              }}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex items-center justify-center gap-4">
        <button
          onClick={() => handleAction('reject')}
          className="p-5 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>

        <button
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          <RotateCcw className="w-6 h-6 text-yellow-500" />
        </button>

        <button
          onClick={() => handleAction('like')}
          className="p-5 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </button>
      </div>
    </div>
  );
}
