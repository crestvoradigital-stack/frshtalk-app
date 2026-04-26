import { motion } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface MatchModalProps {
  match: {
    id: number;
    name: string;
    age: number;
    image: string;
  };
  onClose: () => void;
  onMessage: () => void;
}

export function MatchModal({ match, onClose, onMessage }: MatchModalProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-pink-500 to-red-500 z-50 flex items-center justify-center p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="text-center">
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl text-white mb-8"
        >
          It's a Match!
        </motion.h1>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <img
            src="https://images.unsplash.com/photo-1592234789031-94bf65f630ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
            alt="You"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
          <div className="text-4xl">❤️</div>
          <img
            src={match.image}
            alt={match.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white text-xl mb-8"
        >
          You and {match.name} liked each other!
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onMessage}
          className="px-8 py-4 bg-white text-pink-500 rounded-full text-lg flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
          Send Message
        </motion.button>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={onClose}
          className="mt-4 text-white underline"
        >
          Keep Swiping
        </motion.button>
      </div>
    </motion.div>
  );
}
