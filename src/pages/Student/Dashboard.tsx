import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthStore, useStreakStore, useUIStore } from '../../store';
import { Button } from '../../components/Button';
import { StreakDisplay, FriendStreakCard, BrokenStreakMessage } from '../../components/StreakDisplay';
import { CourseCard } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { NotificationPanel } from '../../components/NotificationPanel';
import { ProfileEditModal } from '../../components/ProfileEditModal';
import { CourseContentModal } from '../../components/CourseContentModal';
import { RecommendedCourses } from '../../components/RecommendedCourses';
import { getStreakStatus, formatDuration, getPointsBadge } from '../../utils/helpers';
import { joinLiveClass } from '../../services/firebase';
import toast from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const { currentStreak, lastActiveDate, checkAndUpdateStreak } = useStreakStore();
  const { setSadMode } = useUIStore();

  // State for modals/panels
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCourseContent, setShowCourseContent] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // State for purchased courses
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Live Class State
  const [liveClasses, setLiveClasses] = useState<any[]>([]);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success' as const,
      title: 'Lesson Completed!',
      message: 'Great job! You completed "Introduction to Variables"',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'course' as const,
      title: 'New Course Available',
      message: 'Check out the new "Advanced Calculus" course',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Assignment Due Soon',
      message: 'Your algebra assignment is due in 2 days',
      time: '1 day ago',
      read: true,
    },
  ]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/login', { replace: true });
  };

  const handleTestLesson = () => {
    navigate('/course/algebra-basics/lesson/1');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleProfileSave = async (updatedData: any) => {
    // Update user in store
    updateUser(updatedData);
    // TODO: Update in Firebase
  };

  const handleViewCourseContent = (course: any) => {
    setSelectedCourse(course);
    setShowCourseContent(true);
  };

  useEffect(() => {
    // Check and update streak on dashboard load
    checkAndUpdateStreak();
    
    // Check if streak is broken
    const streakStatus = getStreakStatus(lastActiveDate);
    if (streakStatus.isBroken && streakStatus.daysAgo > 1) {
      setSadMode(true);
    } else {
      setSadMode(false);
    }

    // Fetch purchased courses from Firestore
    const fetchPurchasedCourses = async () => {
      if (!user?.id) {
        setIsLoadingCourses(false);
        return;
      }

      try {
        // Get user document to fetch enrolledCourses array
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const enrolledCourseIds = userData.enrolledCourses || [];

          if (enrolledCourseIds.length > 0) {
            // Fetch course details for each enrolled course
            // Note: In production, use a batch query or denormalized data for better performance
            const coursePromises = enrolledCourseIds.map(async (courseId: string) => {
              // For now, match with popularCourses (mock data)
              // In production: const courseDoc = await getDoc(doc(db, 'courses', courseId));
              const course = popularCourses.find(c => c.id === courseId);
              return course;
            });

            const courses = await Promise.all(coursePromises);
            setPurchasedCourses(courses.filter(Boolean)); // Remove null/undefined
            console.log('✅ Loaded purchased courses:', courses.length);
          }
        }
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
        toast.error('Failed to load your courses');
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchPurchasedCourses();
  }, [user?.id]);

  // Real-time Live Class Listener
  useEffect(() => {
    if (!user?.id) return;

    // Set up real-time listener for live classes
    const liveClassesRef = collection(db, 'liveClasses');
    const q = query(liveClassesRef, where('isLive', '==', true));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        // Get user's enrolled courses
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);
        const enrolledCourses = userDoc.data()?.enrolledCourses || [];
        
        // Filter live classes for enrolled courses
        const activeLiveClasses = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((liveClass: any) => enrolledCourses.includes(liveClass.courseId));
        
        setLiveClasses(activeLiveClasses);
        
        // Show toast notification when new class starts
        if (activeLiveClasses.length > 0 && liveClasses.length === 0) {
          const liveClass: any = activeLiveClasses[0];
          toast.success(
            `🔴 ${liveClass.teacherName} just started a live class for ${liveClass.courseName}!`,
            { duration: 6000 }
          );
        }
      } catch (error) {
        console.error('Error fetching live classes:', error);
      }
    });

    return () => unsubscribe();
  }, [user?.id]);

  // Handle joining live class
  const handleJoinLiveClass = async (liveClass: any) => {
    try {
      await joinLiveClass(liveClass.id);
      window.open(liveClass.meetLink, '_blank');
      toast.success('Joining live class! 🎥');
    } catch (error) {
      console.error('Error joining class:', error);
    }
  };

  // Mock data (replace with actual API calls)
  const popularCourses = [
    {
      id: '1',
      title: 'Complete Algebra for Grade 10',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80',
      teacher: 'Rajesh Kumar',
      price: 599,
      rating: 4.8,
      totalStudents: 2456,
      duration: 45,
    },
    {
      id: '2',
      title: 'Geometry Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&h=300&fit=crop&q=80',
      teacher: 'Priya Sharma',
      price: 699,
      rating: 4.9,
      totalStudents: 1834,
      duration: 38,
    },
    {
      id: '3',
      title: 'Calculus Made Easy',
      thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop&q=80',
      teacher: 'Amit Patel',
      price: 799,
      rating: 4.7,
      totalStudents: 1567,
      duration: 52,
    },
  ];

  const friends = [
    { id: '1', name: 'Rahul Singh', avatar: 'https://ui-avatars.com/api/?name=Rahul+Singh', streak: 12 },
    { id: '2', name: user?.name || 'You', avatar: `https://ui-avatars.com/api/?name=${user?.name}`, streak: currentStreak, isCurrentUser: true },
    { id: '3', name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma', streak: 8 },
    { id: '4', name: 'Amit Kumar', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar', streak: 15 },
  ];

  // Sort friends by streak
  const sortedFriends = [...friends].sort((a, b) => (b.streak || 0) - (a.streak || 0));

  // Mock stats
  const stats = {
    totalPoints: 2450,
    activeTime: 240, // minutes
    coursesEnrolled: 3,
    quizzesCompleted: 24,
  };

  const badge = getPointsBadge(stats.totalPoints);
  const streakStatus = getStreakStatus(lastActiveDate);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 w-full m-0 p-0">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/student/dashboard')}
            >
              <span className="text-3xl">📐</span>
              <span className="text-2xl font-display font-bold text-gradient">GanitXcel</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/dashboard')}
                icon="🏠"
              >
                Home
              </Button>
              <button 
                className="relative"
                onClick={() => setShowNotifications(true)}
              >
                <span className="text-2xl">🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer"
                onClick={() => setShowProfileEdit(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Live Class Banner */}
      {liveClasses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 shadow-lg"
        >
          <div className="px-4 md:px-6 lg:px-8 py-4">
            {liveClasses.map((liveClass) => (
              <div key={liveClass.id} className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="text-4xl">🔴</span>
                    <span className="absolute top-0 right-0 animate-ping bg-white rounded-full w-3 h-3"></span>
                  </div>
                  <div>
                    <p className="font-bold text-xl flex items-center gap-2">
                      LIVE CLASS NOW
                      <span className="text-sm bg-white/20 px-2 py-1 rounded">LIVE</span>
                    </p>
                    <p className="text-red-100">
                      {liveClass.teacherName} is teaching <strong>{liveClass.courseName}</strong>
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleJoinLiveClass(liveClass)}
                  className="!bg-white !text-red-600 hover:!bg-red-50 font-bold px-6 py-3 shadow-xl animate-pulse"
                >
                  🎥 Join Now
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="px-4 md:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to continue your math journey?</p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleTestLesson}>
                🎬 Test Lesson
              </Button>
              <Button variant="outline" icon="🚪" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Streak Broken Message */}
        {streakStatus.isBroken && streakStatus.daysAgo > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <BrokenStreakMessage
              daysAgo={streakStatus.daysAgo}
              onRestart={() => {
                checkAndUpdateStreak();
                setSadMode(false);
              }}
            />
          </motion.div>
        )}

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                className="bg-white rounded-xl shadow p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-secondary">{formatDuration(stats.activeTime)}</div>
                <div className="text-sm text-gray-600">Active Time</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-accent-purple">{stats.coursesEnrolled}</div>
                <div className="text-sm text-gray-600">Enrolled</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-accent-orange">{stats.quizzesCompleted}</div>
                <div className="text-sm text-gray-600">Quizzes Done</div>
              </motion.div>
            </div>

            {/* Badge */}
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl mb-2">{badge.icon}</div>
                  <h3 className="text-2xl font-bold">{badge.name}</h3>
                  <p className="opacity-90">Keep learning to level up!</p>
                </div>
                <div className="text-6xl opacity-20">{badge.icon}</div>
              </div>
            </motion.div>

            {/* My Enrolled Courses */}
            {isLoadingCourses ? (
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="text-gray-600">Loading your courses...</p>
                </div>
              </div>
            ) : purchasedCourses.length > 0 ? (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">📚 My Courses</h2>
                  <span className="text-sm text-gray-600 bg-primary-100 px-3 py-1 rounded-full font-semibold">
                    {purchasedCourses.length} enrolled
                  </span>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {purchasedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      onClick={() => navigate(`/course/${course.id}`)}
                      onViewContent={() => handleViewCourseContent(course)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start your learning journey by enrolling in a course!
                  </p>
                  <Button variant="primary" onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </div>
              </div>
            )}

            {/* Personalized Recommendations */}
            <div className="mb-8">
              <RecommendedCourses
                onCourseClick={(courseId) => navigate(`/course/${courseId}`)}
                limit={6}
              />
            </div>

            {/* Popular Courses */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Popular Courses</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/courses')}>
                  View All
                </Button>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {popularCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onClick={() => navigate(`/course/${course.id}`)}
                    onViewContent={() => handleViewCourseContent(course)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Display */}
            <StreakDisplay
              currentStreak={currentStreak}
              longestStreak={15}
              showLongest
              animated
            />

            {/* Friends Streaks */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👥</span>
                Friends' Streaks
              </h3>
              <div className="space-y-3">
                {sortedFriends.slice(0, 4).map((friend) => (
                  <FriendStreakCard
                    key={friend.id}
                    name={friend.name}
                    avatar={friend.avatar}
                    streak={friend.streak || 0}
                    isCurrentUser={friend.isCurrentUser}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => navigate('/friends')}
              >
                Add Friends
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  icon="📚"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  icon="🏆"
                  onClick={() => navigate('/leaderboard')}
                >
                  Leaderboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon="💬"
                  onClick={() => window.open('https://discord.gg/ganitxcel', '_blank')}
                >
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Profile Edit Modal */}
      {user && (
        <ProfileEditModal
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
          user={user}
          onSave={handleProfileSave}
        />
      )}

      {/* Course Content Modal */}
      {selectedCourse && (
        <CourseContentModal
          isOpen={showCourseContent}
          onClose={() => setShowCourseContent(false)}
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          lessons={[
            { id: '1', title: 'Introduction to Variables', duration: 15, completed: true },
            { id: '2', title: 'Basic Algebraic Expressions', duration: 20, completed: false },
            { id: '3', title: 'Solving Linear Equations', duration: 25, completed: false, locked: true },
            { id: '4', title: 'Advanced Practice Problems', duration: 30, completed: false, locked: true },
          ]}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
