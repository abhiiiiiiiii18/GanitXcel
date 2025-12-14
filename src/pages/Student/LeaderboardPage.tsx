import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  coursesCompleted: number;
  currentStreak: number;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Mock leaderboard data (in production, fetch from Firestore)
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=FFD700&color=000',
      totalPoints: 8750,
      coursesCompleted: 12,
      currentStreak: 45,
      rank: 1,
    },
    {
      id: '2',
      name: 'Rahul Singh',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Singh&background=C0C0C0&color=000',
      totalPoints: 7890,
      coursesCompleted: 10,
      currentStreak: 38,
      rank: 2,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=CD7F32&color=fff',
      totalPoints: 7234,
      coursesCompleted: 9,
      currentStreak: 28,
      rank: 3,
    },
    {
      id: '4',
      name: 'Sneha Patel',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=1CB0F6&color=fff',
      totalPoints: 6543,
      coursesCompleted: 8,
      currentStreak: 25,
      rank: 4,
    },
    {
      id: '5',
      name: 'Arjun Reddy',
      avatar: 'https://ui-avatars.com/api/?name=Arjun+Reddy&background=58CC02&color=fff',
      totalPoints: 6234,
      coursesCompleted: 8,
      currentStreak: 22,
      rank: 5,
    },
    {
      id: '6',
      name: 'Neha Gupta',
      avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=FFC800&color=000',
      totalPoints: 5987,
      coursesCompleted: 7,
      currentStreak: 20,
      rank: 6,
    },
    {
      id: '7',
      name: 'Karan Malhotra',
      avatar: 'https://ui-avatars.com/api/?name=Karan+Malhotra&background=FF4B4B&color=fff',
      totalPoints: 5678,
      coursesCompleted: 7,
      currentStreak: 18,
      rank: 7,
    },
    {
      id: '8',
      name: 'Divya Nair',
      avatar: 'https://ui-avatars.com/api/?name=Divya+Nair&background=CE82FF&color=fff',
      totalPoints: 5456,
      coursesCompleted: 6,
      currentStreak: 15,
      rank: 8,
    },
    {
      id: '9',
      name: 'Rohan Verma',
      avatar: 'https://ui-avatars.com/api/?name=Rohan+Verma&background=1CB0F6&color=fff',
      totalPoints: 5234,
      coursesCompleted: 6,
      currentStreak: 14,
      rank: 9,
    },
    {
      id: '10',
      name: 'Ananya Das',
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Das&background=58CC02&color=fff',
      totalPoints: 5098,
      coursesCompleted: 6,
      currentStreak: 12,
      rank: 10,
    },
  ]);

  const [timeFilter, setTimeFilter] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');

  // Find current user's rank
  const currentUserRank = user ? leaderboard.findIndex(u => u.id === user.id) + 1 : null;
  const isInTop10 = currentUserRank && currentUserRank <= 10;

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-display font-bold">🏆 Leaderboard</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/dashboard')}
              icon="🏠"
            >
              Back to Dashboard
            </Button>
          </div>
          <p className="text-gray-600 text-lg">
            Compete with other students and climb to the top!
          </p>
        </motion.div>

        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex gap-4">
            <button
              onClick={() => setTimeFilter('all-time')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                timeFilter === 'all-time'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌟 All Time
            </button>
            <button
              onClick={() => setTimeFilter('monthly')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                timeFilter === 'monthly'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 This Month
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                timeFilter === 'weekly'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📆 This Week
            </button>
          </div>
        </motion.div>

        {/* Current User Card (if not in top 10) */}
        {user && !isInTop10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
                <div>
                  <h3 className="text-xl font-bold">Your Rank</h3>
                  <p className="text-2xl font-display font-bold">#{currentUserRank || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total Points</p>
                <p className="text-3xl font-bold">2450</p>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-90">
              Keep learning to climb the leaderboard! 🚀
            </p>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {/* 2nd Place */}
          {leaderboard[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="w-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl p-6 shadow-xl text-center h-48 flex flex-col justify-between">
                <div>
                  <div className="text-6xl mb-2">{getMedalIcon(2)}</div>
                  <img
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white mb-2"
                  />
                  <h3 className="font-bold text-lg text-white">{leaderboard[1].name}</h3>
                  <p className="text-2xl font-bold text-white">{leaderboard[1].totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-white opacity-80">points</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Taller) */}
          {leaderboard[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center -mt-8"
            >
              <div className="w-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-2xl text-center h-64 flex flex-col justify-between">
                <div>
                  <div className="text-7xl mb-2 animate-bounce">{getMedalIcon(1)}</div>
                  <img
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-white mb-2"
                  />
                  <h3 className="font-bold text-xl text-white">{leaderboard[0].name}</h3>
                  <p className="text-3xl font-bold text-white">{leaderboard[0].totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-white opacity-80">points</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 shadow-xl text-center h-48 flex flex-col justify-between">
                <div>
                  <div className="text-6xl mb-2">{getMedalIcon(3)}</div>
                  <img
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white mb-2"
                  />
                  <h3 className="font-bold text-lg text-white">{leaderboard[2].name}</h3>
                  <p className="text-2xl font-bold text-white">{leaderboard[2].totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-white opacity-80">points</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Top 10 Students</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {leaderboard.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  user?.id === student.id ? 'bg-primary-50 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg">
                      {getMedalIcon(student.rank) || `#${student.rank}`}
                    </div>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-lg">
                        {student.name}
                        {user?.id === student.id && (
                          <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>🔥 {student.currentStreak} day streak</span>
                        <span>📚 {student.coursesCompleted} courses</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {student.totalPoints.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-xl font-bold mb-3">💡 How to Earn Points?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <span>Complete lessons: +50 points</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <span>Pass quizzes: +100 points</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <span>Daily streak: +10 points/day</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <span>Complete course: +500 points</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
