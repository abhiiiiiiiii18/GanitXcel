import React from 'react';
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak?: number;
  showLongest?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  showLongest = true,
  size = 'md',
  animated = true,
}) => {
  const sizeConfig = {
    sm: {
      container: 'p-4',
      icon: 'text-4xl',
      number: 'text-2xl',
      label: 'text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'text-6xl',
      number: 'text-4xl',
      label: 'text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'text-8xl',
      number: 'text-5xl',
      label: 'text-base',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="space-y-4">
      <motion.div
        className={`streak-card ${config.container}`}
        initial={animated ? { scale: 0.9, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className={config.icon}
              animate={animated && currentStreak > 0 ? {
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              🔥
            </motion.div>
            <div>
              <motion.div
                className={`${config.number} font-bold`}
                key={currentStreak}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {currentStreak}
              </motion.div>
              <div className={`${config.label} uppercase font-semibold opacity-90`}>
                Day Streak
              </div>
            </div>
          </div>
          {currentStreak > 0 && (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          )}
        </div>
      </motion.div>

      {showLongest && longestStreak !== undefined && (
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-xl font-bold text-gray-800">{longestStreak}</div>
              <div className="text-xs text-gray-600 uppercase font-semibold">
                Longest Streak
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface FriendStreakProps {
  name: string;
  avatar: string;
  streak: number;
  isCurrentUser?: boolean;
}

export const FriendStreakCard: React.FC<FriendStreakProps> = ({
  name,
  avatar,
  streak,
  isCurrentUser = false,
}) => {
  return (
    <motion.div
      className={`flex items-center justify-between p-4 rounded-xl ${
        isCurrentUser ? 'bg-primary-50 border-2 border-primary' : 'bg-white border border-gray-200'
      } hover:shadow-md transition-shadow`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-primary"
        />
        <div>
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            {name}
            {isCurrentUser && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">You</span>}
          </div>
          <div className="text-sm text-gray-600">{streak} day streak</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-xl font-bold text-accent-orange">{streak}</span>
      </div>
    </motion.div>
  );
};

interface BrokenStreakMessageProps {
  daysAgo: number;
  onRestart: () => void;
}

export const BrokenStreakMessage: React.FC<BrokenStreakMessageProps> = ({
  daysAgo,
  onRestart,
}) => {
  return (
    <motion.div
      className="bg-sad-100 border-2 border-sad-300 rounded-2xl p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl mb-4">😢</div>
      <h3 className="text-xl font-bold text-sad-700 mb-2">
        Your streak broke!
      </h3>
      <p className="text-sad-600 mb-4">
        You were away for {daysAgo} day{daysAgo > 1 ? 's' : ''}. Don't give up!
      </p>
      <motion.button
        onClick={onRestart}
        className="bg-primary hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Fresh Today! 💪
      </motion.button>
    </motion.div>
  );
};
