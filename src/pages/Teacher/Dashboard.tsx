import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { useAuthStore } from '../../store';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { scheduleClass, updateDoubtStatus, requestPayout, startLiveClass, endLiveClass } from '../../services/firebase';

type TabType = 'overview' | 'schedule' | 'doubts' | 'students' | 'earnings' | 'feedback';

interface CourseStats {
  id: string;
  title: string;
  studentsEnrolled: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

interface DoubtRequest {
  id: string;
  studentName: string;
  studentAvatar: string;
  question: string;
  subject: string;
  timestamp: Date;
  status: 'pending' | 'scheduled' | 'resolved';
}

interface ScheduledClass {
  id: string;
  title: string;
  studentCount: number;
  dateTime: Date;
  duration: number; // minutes
  type: 'doubt' | 'regular';
}

interface StudentProgress {
  id: string;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  lastActive: Date;
  quizScore: number;
}

interface Feedback {
  id: string;
  studentName: string;
  studentAvatar: string;
  course: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [classData, setClassData] = useState({
    title: '',
    dateTime: '',
    duration: 60,
    type: 'regular' as 'doubt' | 'regular',
  });

  // Live Class State
  const [activeLiveClass, setActiveLiveClass] = useState<any>(null);
  const [isStartingClass, setIsStartingClass] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/login', { replace: true });
  };

  // Start Live Class
  const handleStartLiveClass = async () => {
    if (isStartingClass) return;
    
    setIsStartingClass(true);
    try {
      // For demo, using first course. In real app, let teacher select course
      const courseId = courses[0]?.id || 'algebra-basics';
      const courseName = courses[0]?.title || 'Algebra Basics';
      
      const liveClass = await startLiveClass(
        user!.id,
        user!.name,
        courseId,
        courseName
      );
      
      setActiveLiveClass(liveClass);
      toast.success('🔴 Live class started! Students are being notified.', {
        duration: 4000
      });
      
      // Auto-open Google Meet link
      window.open(liveClass.meetLink, '_blank');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start live class');
    } finally {
      setIsStartingClass(false);
    }
  };

  // End Live Class
  const handleEndLiveClass = async () => {
    if (!activeLiveClass) return;
    
    try {
      await endLiveClass(activeLiveClass.id);
      toast.success('Live class ended successfully!');
      setActiveLiveClass(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to end live class');
    }
  };

  // Schedule a new class
  const handleScheduleClass = async () => {
    if (!classData.title || !classData.dateTime) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await scheduleClass(
        user!.id,
        classData.title,
        new Date(classData.dateTime),
        classData.duration,
        classData.type
      );
      
      toast.success('Class scheduled successfully! 📅');
      setShowScheduleModal(false);
      setClassData({ title: '', dateTime: '', duration: 60, type: 'regular' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule class');
    }
  };

  // Handle doubt resolution
  const handleAnswerDoubt = (doubtId: string) => {
    // In a real app, this would open a chat interface or video call
    toast.success('Opening doubt resolution interface... 💬');
    // navigate(`/teacher/doubt/${doubtId}`);
  };

  const handleScheduleDoubt = async (doubtId: string) => {
    try {
      const scheduledTime = new Date();
      scheduledTime.setHours(scheduledTime.getHours() + 2); // Schedule 2 hours from now
      
      await updateDoubtStatus(doubtId, 'scheduled', scheduledTime);
      toast.success('Doubt session scheduled! 📅');
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule doubt');
    }
  };

  // Request payout
  const [payoutAmount, setPayoutAmount] = useState(0);
  
  const handleRequestPayout = async () => {
    if (payoutAmount <= 0) {
      toast.error('Invalid payout amount');
      return;
    }

    try {
      await requestPayout(user!.id, payoutAmount);
      toast.success(`Payout of ${formatCurrency(payoutAmount)} is processing! 💰`);
      setShowPayoutModal(false);
      setPayoutAmount(0);
      
      // Update local stats
      stats.netEarnings = 0;
    } catch (error: any) {
      toast.error(error.message || 'Failed to request payout');
    }
  };

  // Mock data
  const stats = {
    totalStudents: 1247,
    activeCourses: 8,
    totalRevenue: 2845600, // ₹28,45,600
    platformCommission: 853680, // 30% of revenue
    netEarnings: 1991920, // 70% of revenue
    avgRating: 4.8,
    pendingDoubts: 12,
    upcomingClasses: 3,
  };

  const courses: CourseStats[] = [
    {
      id: '1',
      title: 'Algebraic Expressions - Grade 8',
      studentsEnrolled: 342,
      revenue: 682000,
      rating: 4.9,
      completionRate: 87,
    },
    {
      id: '2',
      title: 'Quadratic Equations - Grade 10',
      studentsEnrolled: 289,
      revenue: 723750,
      rating: 4.8,
      completionRate: 82,
    },
    {
      id: '3',
      title: 'Trigonometry Mastery - Grade 11',
      studentsEnrolled: 256,
      revenue: 640000,
      rating: 4.7,
      completionRate: 79,
    },
    {
      id: '4',
      title: 'Calculus Foundation - Grade 12',
      studentsEnrolled: 198,
      revenue: 495000,
      rating: 4.9,
      completionRate: 85,
    },
  ];

  const doubts: DoubtRequest[] = [
    {
      id: '1',
      studentName: 'Priya Sharma',
      studentAvatar: '👧',
      question: 'How do I factor x² + 5x + 6?',
      subject: 'Algebra',
      timestamp: new Date(2025, 9, 31, 14, 30),
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Rahul Kumar',
      studentAvatar: '👦',
      question: 'Can you explain the discriminant method in quadratic equations?',
      subject: 'Quadratic Equations',
      timestamp: new Date(2025, 9, 31, 13, 15),
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'Ananya Patel',
      studentAvatar: '👧',
      question: 'What is the difference between sin²x and (sinx)²?',
      subject: 'Trigonometry',
      timestamp: new Date(2025, 9, 31, 12, 45),
      status: 'scheduled',
    },
  ];

  const scheduledClasses: ScheduledClass[] = [
    {
      id: '1',
      title: 'Doubt Resolution - Algebra',
      studentCount: 8,
      dateTime: new Date(2025, 9, 31, 18, 0),
      duration: 60,
      type: 'doubt',
    },
    {
      id: '2',
      title: 'Weekly Live Class - Trigonometry',
      studentCount: 45,
      dateTime: new Date(2025, 10, 1, 10, 0),
      duration: 90,
      type: 'regular',
    },
    {
      id: '3',
      title: 'Doubt Resolution - Calculus',
      studentCount: 5,
      dateTime: new Date(2025, 10, 1, 16, 0),
      duration: 45,
      type: 'doubt',
    },
  ];

  const students: StudentProgress[] = [
    {
      id: '1',
      name: 'Aarav Singh',
      avatar: '👦',
      course: 'Algebraic Expressions',
      progress: 87,
      lastActive: new Date(2025, 9, 31, 9, 30),
      quizScore: 92,
    },
    {
      id: '2',
      name: 'Diya Verma',
      avatar: '👧',
      course: 'Quadratic Equations',
      progress: 65,
      lastActive: new Date(2025, 9, 30, 20, 15),
      quizScore: 78,
    },
    {
      id: '3',
      name: 'Arjun Reddy',
      avatar: '👦',
      course: 'Trigonometry Mastery',
      progress: 92,
      lastActive: new Date(2025, 9, 31, 11, 0),
      quizScore: 95,
    },
  ];

  const feedback: Feedback[] = [
    {
      id: '1',
      studentName: 'Ishaan Malhotra',
      studentAvatar: '👦',
      course: 'Algebraic Expressions',
      rating: 5,
      comment: 'Best teacher! Explains concepts very clearly with great examples.',
      timestamp: new Date(2025, 9, 30, 15, 30),
    },
    {
      id: '2',
      studentName: 'Kavya Nair',
      studentAvatar: '👧',
      course: 'Quadratic Equations',
      rating: 5,
      comment: 'The doubt resolution sessions are extremely helpful!',
      timestamp: new Date(2025, 9, 29, 18, 45),
    },
    {
      id: '3',
      studentName: 'Siddharth Rao',
      studentAvatar: '👦',
      course: 'Trigonometry Mastery',
      rating: 4,
      comment: 'Great course! Would love more practice problems.',
      timestamp: new Date(2025, 9, 29, 12, 20),
    },
  ];

  const tabs = [
    { id: 'overview' as TabType, label: '📊 Overview', icon: '📊' },
    { id: 'schedule' as TabType, label: '📅 Schedule', icon: '📅' },
    { id: 'doubts' as TabType, label: '❓ Doubts', icon: '❓', badge: stats.pendingDoubts },
    { id: 'students' as TabType, label: '👥 Students', icon: '👥' },
    { id: 'earnings' as TabType, label: '💰 Earnings', icon: '💰' },
    { id: 'feedback' as TabType, label: '⭐ Feedback', icon: '⭐' },
  ];

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Teacher'} 👨‍🏫
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your courses today</p>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" icon="➕">
                Create New Course
              </Button>
              <Button variant="outline" icon="🚪" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-primary to-primary-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-3xl font-bold">{stats.totalStudents}</div>
                    <div className="text-primary-100 mt-1">Total Students</div>
                  </div>
                  <div className="bg-gradient-to-br from-secondary to-secondary-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold">{stats.activeCourses}</div>
                    <div className="text-secondary-100 mt-1">Active Courses</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent-orange to-accent-yellow text-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-3xl font-bold">{formatCurrency(stats.netEarnings)}</div>
                    <div className="text-yellow-100 mt-1">Net Earnings (70%)</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent-purple to-accent-blue text-white rounded-2xl p-6 shadow-lg">
                    <div className="text-4xl mb-2">⭐</div>
                    <div className="text-3xl font-bold">{stats.avgRating}</div>
                    <div className="text-purple-100 mt-1">Average Rating</div>
                  </div>
                </div>

                {/* Live Class Section */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {activeLiveClass ? '🔴 Live Class Active' : '📹 Start Live Class'}
                      </h2>
                      <p className="text-red-100 mb-4">
                        {activeLiveClass 
                          ? `Teaching: ${activeLiveClass.courseName} • ${activeLiveClass.studentsJoined || 0} students joined`
                          : 'Go live and students will be notified instantly!'
                        }
                      </p>
                      {activeLiveClass && (
                        <a 
                          href={activeLiveClass.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-red-100 underline hover:text-white"
                        >
                          {activeLiveClass.meetLink}
                        </a>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {!activeLiveClass ? (
                        <Button
                          onClick={handleStartLiveClass}
                          disabled={isStartingClass}
                          className="!bg-white !text-red-600 hover:!bg-red-50 font-bold px-8 py-3 text-lg shadow-xl"
                        >
                          {isStartingClass ? '⏳ Starting...' : '🎥 Start Live Class'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleEndLiveClass}
                          className="!bg-white !text-red-600 hover:!bg-red-50 font-bold px-8 py-3 text-lg shadow-xl"
                        >
                          🛑 End Class
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Performance */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">📚 Course Performance</h2>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span>👥 {course.studentsEnrolled} students</span>
                              <span>💰 {formatCurrency(course.revenue)}</span>
                              <span>⭐ {course.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-semibold">{course.completionRate}%</span>
                          </div>
                          <ProgressBar progress={course.completionRate} color="primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" icon="➕">
                        Create New Lesson
                      </Button>
                      <Button variant="outline" className="w-full justify-start" icon="📝">
                        Create Quiz
                      </Button>
                      <Button variant="outline" className="w-full justify-start" icon="📊">
                        View Analytics
                      </Button>
                      <Button variant="outline" className="w-full justify-start" icon="💬">
                        Message Students
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">🔔 Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-2xl">✅</span>
                        <div className="flex-1">
                          <p className="font-medium">New enrollment!</p>
                          <p className="text-sm text-gray-600">12 students joined Algebra course</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-2xl">❓</span>
                        <div className="flex-1">
                          <p className="font-medium">{stats.pendingDoubts} pending doubts</p>
                          <p className="text-sm text-gray-600">Students need your help</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-2xl">⭐</span>
                        <div className="flex-1">
                          <p className="font-medium">New 5-star review!</p>
                          <p className="text-sm text-gray-600">Kavya rated your course</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">📅 Upcoming Classes</h2>
                    <Button 
                      variant="primary" 
                      icon="➕"
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Schedule Class
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {scheduledClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className={`border-2 rounded-xl p-5 ${
                          cls.type === 'doubt' ? 'border-accent-orange bg-orange-50' : 'border-primary bg-primary-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{cls.type === 'doubt' ? '❓' : '📚'}</span>
                              <h3 className="text-xl font-bold">{cls.title}</h3>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-700">
                              <span>📅 {formatDate(cls.dateTime)}</span>
                              <span>🕐 {formatTime(cls.dateTime)}</span>
                              <span>⏱️ {cls.duration} mins</span>
                              <span>👥 {cls.studentCount} students</span>
                            </div>
                          </div>
                          <Button variant="primary" size="sm">
                            Start Class
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar View */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">📆 This Week</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className={`text-center p-4 rounded-lg ${index === 3 ? 'bg-primary text-white font-bold' : 'bg-gray-100'}`}>
                        <div className="text-xs mb-1">{day}</div>
                        <div className="text-xl">{index + 28}</div>
                        {index === 3 && <div className="text-xs mt-1">Today</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Doubts Tab */}
            {activeTab === 'doubts' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">❓ Student Doubts</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {doubts.filter(d => d.status === 'pending').length} pending
                      </span>
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {doubts.map((doubt) => (
                      <div key={doubt.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{doubt.studentAvatar}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{doubt.studentName}</h3>
                                <span className="text-sm text-gray-600">{doubt.subject}</span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  doubt.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : doubt.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {doubt.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{doubt.question}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                🕐 {formatTime(doubt.timestamp)} • {formatDate(doubt.timestamp)}
                              </span>
                              <div className="flex gap-2">
                                {doubt.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleScheduleDoubt(doubt.id)}
                                    >
                                      Schedule
                                    </Button>
                                    <Button 
                                      variant="primary" 
                                      size="sm"
                                      onClick={() => handleAnswerDoubt(doubt.id)}
                                    >
                                      Answer Now
                                    </Button>
                                  </>
                                )}
                                {doubt.status === 'scheduled' && (
                                  <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => toast.success('Starting doubt session... 🎥')}
                                  >
                                    Join Session
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">👥 Student Progress</h2>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
                      <Button variant="outline" size="sm">
                        Filter
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-semibold">Student</th>
                          <th className="text-left p-4 font-semibold">Course</th>
                          <th className="text-left p-4 font-semibold">Progress</th>
                          <th className="text-left p-4 font-semibold">Quiz Score</th>
                          <th className="text-left p-4 font-semibold">Last Active</th>
                          <th className="text-left p-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{student.avatar}</span>
                                <span className="font-medium">{student.name}</span>
                              </div>
                            </td>
                            <td className="p-4">{student.course}</td>
                            <td className="p-4">
                              <div className="w-32">
                                <ProgressBar progress={student.progress} color="primary" />
                                <span className="text-sm text-gray-600 mt-1">{student.progress}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold ${student.quizScore >= 80 ? 'text-primary' : 'text-accent-orange'}`}>
                                {student.quizScore}%
                              </span>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{formatDate(student.lastActive)}</td>
                            <td className="p-4">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Student Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold mb-3">📊 Engagement</h3>
                    <div className="text-3xl font-bold text-primary">87%</div>
                    <p className="text-sm text-gray-600">Avg. completion rate</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold mb-3">🎯 Performance</h3>
                    <div className="text-3xl font-bold text-secondary">84%</div>
                    <p className="text-sm text-gray-600">Avg. quiz score</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold mb-3">🔥 Active Students</h3>
                    <div className="text-3xl font-bold text-accent-orange">923</div>
                    <p className="text-sm text-gray-600">In last 7 days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                {/* Revenue Breakdown */}
                <div className="bg-gradient-to-br from-primary to-primary-600 text-white rounded-2xl shadow-2xl p-8">
                  <h2 className="text-3xl font-bold mb-6">💰 Earnings Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-primary-100 mb-2">Gross Revenue</div>
                      <div className="text-4xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                      <div className="text-sm text-primary-100 mt-1">Total sales from all courses</div>
                    </div>
                    <div>
                      <div className="text-primary-100 mb-2">Platform Commission (30%)</div>
                      <div className="text-4xl font-bold">- {formatCurrency(stats.platformCommission)}</div>
                      <div className="text-sm text-primary-100 mt-1">GanitXcel service fee</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4">
                      <div className="text-primary-100 mb-2">Your Net Earnings (70%)</div>
                      <div className="text-4xl font-bold">{formatCurrency(stats.netEarnings)}</div>
                      <div className="text-sm text-primary-100 mt-1">Available for payout</div>
                    </div>
                  </div>
                </div>

                {/* Commission Breakdown Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-6">📊 Revenue Split</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="h-12 flex rounded-xl overflow-hidden">
                        <div className="bg-primary flex-[7] flex items-center justify-center text-white font-bold">
                          You: 70%
                        </div>
                        <div className="bg-gray-300 flex-[3] flex items-center justify-center text-gray-700 font-bold">
                          Platform: 30%
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 text-sm">
                        <div>
                          <span className="text-gray-600">Your share:</span>
                          <span className="font-bold ml-2">{formatCurrency(stats.netEarnings)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Platform fee:</span>
                          <span className="font-bold ml-2">{formatCurrency(stats.platformCommission)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course-wise Revenue */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-6">📚 Course-wise Revenue</h3>
                  <div className="space-y-4">
                    {courses.map((course) => {
                      const commission = course.revenue * 0.3;
                      const netRevenue = course.revenue * 0.7;
                      return (
                        <div key={course.id} className="border border-gray-200 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-lg">{course.title}</h4>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Gross Revenue</div>
                              <div className="text-xl font-bold">{formatCurrency(course.revenue)}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Students</div>
                              <div className="font-bold">{course.studentsEnrolled}</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Commission (30%)</div>
                              <div className="font-bold text-accent-red">- {formatCurrency(commission)}</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-xs text-gray-600 mb-1">Net Earnings (70%)</div>
                              <div className="font-bold text-primary">{formatCurrency(netRevenue)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payout Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4">💳 Payout Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div>
                        <div className="font-bold">Available for Withdrawal</div>
                        <div className="text-sm text-gray-600">Minimum withdrawal: ₹1,000</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{formatCurrency(stats.netEarnings)}</div>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setPayoutAmount(stats.netEarnings);
                            setShowPayoutModal(true);
                          }}
                        >
                          Request Payout
                        </Button>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="font-bold mb-2">Payment Schedule</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Payouts processed every Monday</li>
                        <li>• Bank transfer takes 2-3 business days</li>
                        <li>• GST will be deducted as per regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">⭐ Student Feedback</h2>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{stats.avgRating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {feedback.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{review.studentAvatar}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-lg">{review.studentName}</h3>
                                <span className="text-sm text-gray-600">{review.course}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-xl">{renderStars(review.rating)}</div>
                                <span className="text-sm text-gray-500">{formatDate(review.timestamp)}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 italic">"{review.comment}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4">📊 Rating Distribution</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-4">
                        <span className="font-semibold w-12">{star} ⭐</span>
                        <div className="flex-1">
                          <ProgressBar
                            progress={star === 5 ? 75 : star === 4 ? 20 : 5}
                            color={star >= 4 ? 'primary' : 'secondary'}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {star === 5 ? '75%' : star === 4 ? '20%' : '5%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Schedule Class Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-4">📅 Schedule New Class</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Class Title</label>
                <input
                  type="text"
                  value={classData.title}
                  onChange={(e) => setClassData({ ...classData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary outline-none"
                  placeholder="e.g., Doubt Clearing Session"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={classData.dateTime}
                  onChange={(e) => setClassData({ ...classData, dateTime: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={classData.duration}
                  onChange={(e) => setClassData({ ...classData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary outline-none"
                  min="30"
                  step="15"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Class Type</label>
                <select
                  value={classData.type}
                  onChange={(e) => setClassData({ ...classData, type: e.target.value as 'doubt' | 'regular' })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary outline-none"
                >
                  <option value="regular">Regular Lecture</option>
                  <option value="doubt">Doubt Clearing</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleScheduleClass}>
                  Schedule Class
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold mb-4">💰 Request Payout</h2>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">Amount to withdraw</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(payoutAmount)}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="text-sm">
                <div className="font-semibold mb-2">⚠️ Important Notes:</div>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Processing takes 2-3 business days</li>
                  <li>• GST will be deducted as applicable</li>
                  <li>• Minimum withdrawal: ₹1,000</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to request a payout of <strong>{formatCurrency(payoutAmount)}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayoutModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleRequestPayout}>
                Confirm Payout
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
