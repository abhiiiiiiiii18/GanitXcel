import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
  streak: number;
  totalPoints: number;
  isFriend: boolean;
  isPending?: boolean;
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Mock friends list (in production, fetch from Firestore)
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Rahul Singh',
      email: 'rahul@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Singh&background=1CB0F6&color=fff',
      streak: 12,
      totalPoints: 3450,
      isFriend: true,
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=58CC02&color=fff',
      streak: 8,
      totalPoints: 2890,
      isFriend: true,
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=FFC800&color=000',
      streak: 15,
      totalPoints: 4567,
      isFriend: true,
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState<Friend[]>([
    {
      id: '4',
      name: 'Sneha Patel',
      email: 'sneha@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=FF4B4B&color=fff',
      streak: 5,
      totalPoints: 1890,
      isFriend: false,
      isPending: true,
    },
  ]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (searchEmail === user?.email) {
      toast.error('You cannot add yourself as a friend!');
      return;
    }

    setIsSearching(true);

    // Mock search (in production, query Firestore)
    setTimeout(() => {
      // Simulate search result
      const mockUser: Friend = {
        id: 'search-' + Date.now(),
        name: 'New User',
        email: searchEmail,
        avatar: `https://ui-avatars.com/api/?name=New+User&background=CE82FF&color=fff`,
        streak: 3,
        totalPoints: 1200,
        isFriend: false,
      };

      // Check if already friends
      const alreadyFriend = friends.find(f => f.email === searchEmail);
      if (alreadyFriend) {
        toast.error('Already friends with this user!');
        setSearchResult(null);
        setIsSearching(false);
        return;
      }

      // Check if pending
      const alreadyPending = pendingRequests.find(f => f.email === searchEmail);
      if (alreadyPending) {
        toast.error('Friend request already sent!');
        setSearchResult(null);
        setIsSearching(false);
        return;
      }

      setSearchResult(mockUser);
      setIsSearching(false);
      toast.success('User found!');
    }, 1000);
  };

  const handleSendRequest = () => {
    if (!searchResult) return;

    // Mock send request (in production, create Firestore document)
    setPendingRequests([...pendingRequests, { ...searchResult, isPending: true }]);
    toast.success(`Friend request sent to ${searchResult.name}!`);
    setSearchResult(null);
    setSearchEmail('');

    // TODO: In production, add to Firestore
    // await addDoc(collection(db, 'friendRequests'), {
    //   fromUserId: user.id,
    //   toUserId: searchResult.id,
    //   status: 'pending',
    //   createdAt: new Date()
    // });
  };

  const handleAcceptRequest = (friend: Friend) => {
    // Remove from pending and add to friends
    setPendingRequests(pendingRequests.filter(f => f.id !== friend.id));
    setFriends([...friends, { ...friend, isFriend: true }]);
    toast.success(`You are now friends with ${friend.name}! 🎉`);

    // TODO: In production, update Firestore
    // await updateDoc(doc(db, 'users', user.id), {
    //   friends: arrayUnion(friend.id)
    // });
  };

  const handleRejectRequest = (friend: Friend) => {
    setPendingRequests(pendingRequests.filter(f => f.id !== friend.id));
    toast.success('Friend request declined');
  };

  const handleRemoveFriend = (friend: Friend) => {
    if (window.confirm(`Remove ${friend.name} from friends?`)) {
      setFriends(friends.filter(f => f.id !== friend.id));
      toast.success(`${friend.name} removed from friends`);

      // TODO: In production, update Firestore
      // await updateDoc(doc(db, 'users', user.id), {
      //   friends: arrayRemove(friend.id)
      // });
    }
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
            <h1 className="text-4xl font-display font-bold">👥 Friends</h1>
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
            Connect with friends and compare your learning progress!
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">🔍 Find Friends by Email</h2>
          <div className="flex gap-4">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter email address (e.g., friend@example.com)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none text-lg"
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={isSearching}
              icon="🔎"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Result */}
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={searchResult.avatar}
                      alt={searchResult.name}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="font-bold text-xl">{searchResult.name}</h3>
                      <p className="text-gray-600">{searchResult.email}</p>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>🔥 {searchResult.streak} day streak</span>
                        <span>⭐ {searchResult.totalPoints} points</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" onClick={handleSendRequest} icon="➕">
                    Send Request
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">
              📩 Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-14 h-14 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{friend.name}</h3>
                      <p className="text-sm text-gray-600">{friend.email}</p>
                      <div className="flex gap-3 text-sm text-gray-600 mt-1">
                        <span>🔥 {friend.streak} streak</span>
                        <span>⭐ {friend.totalPoints} pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptRequest(friend)}
                      icon="✅"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectRequest(friend)}
                      icon="❌"
                    >
                      Decline
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Friends List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">
            ✨ My Friends ({friends.length})
          </h2>
          
          {friends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No friends yet</h3>
              <p className="text-gray-600 mb-6">
                Search for friends by email to start connecting!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {friends
                .sort((a, b) => b.streak - a.streak)
                .map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 rounded-full border-2 border-primary"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{friend.name}</h3>
                        <p className="text-sm text-gray-600">{friend.email}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            🔥 <span className="font-semibold">{friend.streak}</span> day streak
                          </span>
                          <span className="flex items-center gap-1">
                            ⭐ <span className="font-semibold">{friend.totalPoints.toLocaleString()}</span> points
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFriend(friend)}
                        icon="👤"
                      >
                        View Profile
                      </Button>
                      <button
                        onClick={() => handleRemoveFriend(friend)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove friend"
                      >
                        ❌
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-xl font-bold mb-3">💡 Friend Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <span>Compare streaks and stay motivated</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <span>Compete on the leaderboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">💬</span>
              <span>Share doubts and tips</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span>Study together and achieve more</span>
            </div>
          </div>
        </motion.div>

        {/* Friend Profile Modal */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFriend(null)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Friend Profile</h2>
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-6">
                  <img
                    src={selectedFriend.avatar}
                    alt={selectedFriend.name}
                    className="w-24 h-24 rounded-full border-4 border-primary mb-4"
                  />
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedFriend.name}</h3>
                  <p className="text-gray-600">{selectedFriend.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🔥</span>
                      <div>
                        <p className="text-sm text-gray-600">Current Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedFriend.streak} days</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">⭐</span>
                      <div>
                        <p className="text-sm text-gray-600">Total Points</p>
                        <p className="text-2xl font-bold text-amber-600">{selectedFriend.totalPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">👥</span>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-lg font-bold text-green-600">Friends</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedFriend(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      toast.success('Feature coming soon!');
                      setSelectedFriend(null);
                    }}
                    icon="💬"
                  >
                    Message
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FriendsPage;
