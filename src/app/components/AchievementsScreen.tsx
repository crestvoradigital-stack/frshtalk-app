import { ArrowLeft, Trophy, Award, Star, Heart, MessageCircle, Coins, Lock } from 'lucide-react';

interface AchievementsScreenProps {
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'award' | 'star' | 'heart' | 'message' | 'coins';
  unlocked: boolean;
  progress?: number;
  total?: number;
  reward: number;
  unlockedDate?: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Connection',
    description: 'Complete your first call',
    icon: 'message',
    unlocked: true,
    reward: 50,
    unlockedDate: 'Mar 15, 2026',
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Talk to 10 different listeners',
    icon: 'heart',
    unlocked: true,
    progress: 10,
    total: 10,
    reward: 100,
    unlockedDate: 'Mar 20, 2026',
  },
  {
    id: '3',
    title: 'Marathon Talker',
    description: 'Spend 100 minutes in calls',
    icon: 'star',
    unlocked: false,
    progress: 47,
    total: 100,
    reward: 150,
  },
  {
    id: '4',
    title: 'Loyal User',
    description: 'Use FrshTalk for 30 days',
    icon: 'trophy',
    unlocked: false,
    progress: 12,
    total: 30,
    reward: 200,
  },
  {
    id: '5',
    title: 'Five Star Reviewer',
    description: 'Leave 20 helpful reviews',
    icon: 'award',
    unlocked: false,
    progress: 5,
    total: 20,
    reward: 100,
  },
  {
    id: '6',
    title: 'Big Spender',
    description: 'Purchase 5000+ coins',
    icon: 'coins',
    unlocked: false,
    progress: 0,
    total: 5000,
    reward: 500,
  },
];

function AchievementIcon({ type, unlocked }: { type: string; unlocked: boolean }) {
  const iconClass = `w-8 h-8 ${unlocked ? 'text-yellow-400' : 'text-gray-600'}`;

  switch (type) {
    case 'trophy':
      return <Trophy className={iconClass} />;
    case 'award':
      return <Award className={iconClass} />;
    case 'star':
      return <Star className={iconClass} />;
    case 'heart':
      return <Heart className={iconClass} />;
    case 'message':
      return <MessageCircle className={iconClass} />;
    case 'coins':
      return <Coins className={iconClass} />;
    default:
      return <Trophy className={iconClass} />;
  }
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalRewards = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold ml-4">Achievements</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Your Progress</p>
              <p className="text-white text-2xl font-bold">
                {unlockedCount}/{achievements.length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white/80 text-xs mb-1">Total Coins Earned</p>
            <div className="flex items-center gap-2">
              <p className="text-white text-2xl font-bold">{totalRewards}</p>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-[#2a1a3a] to-[#1a1a1a] border border-purple-500/30'
                  : 'bg-[#1a1a1a]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                      : 'bg-[#2a2a2a]'
                  }`}
                >
                  {achievement.unlocked ? (
                    <AchievementIcon type={achievement.icon} unlocked={true} />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-white/60'}`}>
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-bold ${
                          achievement.unlocked ? 'text-yellow-400' : 'text-white/40'
                        }`}
                      >
                        +{achievement.reward}
                      </span>
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">$</span>
                      </div>
                    </div>
                  </div>

                  <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-white/70' : 'text-white/40'}`}>
                    {achievement.description}
                  </p>

                  {achievement.unlocked && achievement.unlockedDate && (
                    <p className="text-purple-400 text-xs">Unlocked on {achievement.unlockedDate}</p>
                  )}

                  {!achievement.unlocked && achievement.progress !== undefined && achievement.total && (
                    <>
                      <div className="bg-[#2a2a2a] rounded-full h-2 mb-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-white/40 text-xs">
                        {achievement.progress}/{achievement.total}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-6 bg-[#1a1a1a] rounded-xl p-4 text-center">
          <p className="text-white/60 text-sm">More achievements coming soon! 🎉</p>
        </div>
      </div>
    </div>
  );
}
