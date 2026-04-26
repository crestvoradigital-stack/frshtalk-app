import { motion, useMotionValue, useTransform } from 'motion/react';
import { X, Heart, Info } from 'lucide-react';
import { useState } from 'react';

interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    bio: string;
    location: string;
    image: string;
    interests: string[];
  };
  onSwipe: (direction: 'left' | 'right') => void;
  style?: any;
}

export function ProfileCard({ profile, onSwipe, style }: ProfileCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, ...style }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full"
    >
      <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <motion.div
          initial={false}
          animate={{ opacity: Math.abs(x.get()) > 50 ? 1 : 0 }}
          className="absolute top-8 left-8"
        >
          {x.get() < -50 && (
            <div className="px-6 py-3 bg-red-500 text-white rounded-full transform rotate-12 border-4 border-white">
              <X className="w-8 h-8" />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: Math.abs(x.get()) > 50 ? 1 : 0 }}
          className="absolute top-8 right-8"
        >
          {x.get() > 50 && (
            <div className="px-6 py-3 bg-green-500 text-white rounded-full transform -rotate-12 border-4 border-white">
              <Heart className="w-8 h-8" />
            </div>
          )}
        </motion.div>

        {showInfo && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 bg-white p-6 overflow-y-auto"
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="pt-8">
              <h2 className="text-3xl mb-2">{profile.name}, {profile.age}</h2>
              <p className="text-gray-600 mb-4">{profile.location}</p>

              <div className="mb-6">
                <h3 className="text-lg mb-2">About</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>

              <div>
                <h3 className="text-lg mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <h2 className="text-white text-3xl mb-1">{profile.name}, {profile.age}</h2>
              <p className="text-white/90 text-sm mb-3">{profile.location}</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 3).map((interest, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowInfo(true)}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white"
            >
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
