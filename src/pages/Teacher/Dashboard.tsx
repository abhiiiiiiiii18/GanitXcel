import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useAuthStore } from '../../store';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

// Professional Card Component - Memoized
const Card = memo(({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${className}`} onClick={onClick}>
    {children}
  </div>
));

Card.displayName = 'Card';

// Large Stat Card (TailAdmin Style) with Duolingo colors - Memoized
const StatCard = memo(({ 
  icon, 
  title, 
  value, 
  subtitle,
  trend,
  trendValue,
  color,
  onClick
}: {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
  onClick?: () => void;
}) => (
  <Card 
    className={`hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-105 transform' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-2xl`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">{title}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <span>{trend === 'up' ? '↑' : '↓'}</span>
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-black text-gray-900 mb-1">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
        </div>
      </div>
    </div>
  </Card>
));

StatCard.displayName = 'StatCard';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [isLiveDoubtModalOpen, setIsLiveDoubtModalOpen] = useState(false);
  const [isLiveDoubtActive, setIsLiveDoubtActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const videoPreviewRef = React.useRef<HTMLVideoElement>(null);
  const liveRecordingPreviewRef = React.useRef<HTMLVideoElement>(null);

  // Mock Data (Replace with real API calls)
  const stats = {
    totalRevenue: 234210,
    totalStudents: 1247,
    activeCourses: 8,
    avgRating: 4.8,
  };

  // Statistics Chart Data
  const statisticsData = [
    { name: 'Jan', revenue: 18500, students: 120 },
    { name: 'Feb', revenue: 21200, students: 145 },
    { name: 'Mar', revenue: 24800, students: 178 },
    { name: 'Apr', revenue: 22100, students: 165 },
    { name: 'May', revenue: 28400, students: 201 },
    { name: 'Jun', revenue: 32100, students: 234 },
  ];

  const quarterlyData = [
    { name: 'Q1 2024', revenue: 62500, students: 443 },
    { name: 'Q2 2024', revenue: 82600, students: 600 },
    { name: 'Q3 2024', revenue: 95300, students: 728 },
    { name: 'Q4 2024', revenue: 108400, students: 856 },
  ];

  const annualData = [
    { name: '2021', revenue: 245000, students: 1850 },
    { name: '2022', revenue: 312000, students: 2340 },
    { name: '2023', revenue: 387000, students: 2980 },
    { name: '2024', revenue: 456000, students: 3620 },
  ];

  // Get data based on selected time period
  const getChartData = () => {
    switch (timePeriod) {
      case 'quarterly':
        return quarterlyData;
      case 'annually':
        return annualData;
      default:
        return statisticsData;
    }
  };

  // Revenue Goals
  const revenueGoals = [
    { category: 'Monthly Target', goal: 30000, achieved: 28400, percentage: 94.7 },
    { category: 'Student Target', goal: 250, achieved: 234, percentage: 93.6 },
  ];

  // Course Categories Distribution
  const courseCategories = [
    { name: 'Algebra', value: 342, percentage: 27.4, color: '#58CC02' },    // Primary green
    { name: 'Calculus', value: 287, percentage: 23.0, color: '#1CB0F6' },   // Secondary blue
    { name: 'Geometry', value: 256, percentage: 20.5, color: '#CE82FF' },   // Accent purple
    { name: 'Trigonometry', value: 198, percentage: 15.9, color: '#FFC800' }, // Accent yellow
    { name: 'Statistics', value: 164, percentage: 13.2, color: '#FF9600' },  // Accent orange
  ];

  // Upcoming Live Classes
  const upcomingClasses = [
    { date: 'Dec 28', time: '10:00 AM', course: 'Algebra Mastery', students: 45, status: 'scheduled' },
    { date: 'Dec 28', time: '2:00 PM', course: 'Calculus Pro', students: 38, status: 'scheduled' },
    { date: 'Dec 29', time: '11:00 AM', course: 'Geometry Basics', students: 52, status: 'scheduled' },
    { date: 'Dec 29', time: '3:30 PM', course: 'Trigonometry', students: 31, status: 'scheduled' },
    { date: 'Dec 30', time: '10:30 AM', course: 'Statistics 101', students: 28, status: 'scheduled' },
  ];

  // Recent Enrollments
  const recentEnrollments = [
    { id: 1, student: 'Rahul Kumar', email: 'rahul@example.com', course: 'Algebra Mastery', amount: 1299, date: 'Dec 25, 2024', status: 'Complete' },
    { id: 2, student: 'Priya Sharma', email: 'priya@example.com', course: 'Calculus Pro', amount: 1499, date: 'Dec 25, 2024', status: 'Complete' },
    { id: 3, student: 'Amit Patel', email: 'amit@example.com', course: 'Geometry Basics', amount: 999, date: 'Dec 24, 2024', status: 'Pending' },
    { id: 4, student: 'Sneha Reddy', email: 'sneha@example.com', course: 'Trigonometry', amount: 1199, date: 'Dec 24, 2024', status: 'Complete' },
    { id: 5, student: 'Rohan Singh', email: 'rohan@example.com', course: 'Statistics 101', amount: 899, date: 'Dec 23, 2024', status: 'Complete' },
  ];

  // Student Doubts
  const studentDoubts = [
    { id: 1, student: 'Rahul Kumar', course: 'Algebra Mastery', question: 'How to solve quadratic equations with complex roots?', time: '10 min ago', priority: 'high', status: 'pending', avatar: '🤔' },
    { id: 2, student: 'Priya Sharma', course: 'Calculus Pro', question: 'Can you explain the chain rule with examples?', time: '25 min ago', priority: 'medium', status: 'pending', avatar: '📝' },
    { id: 3, student: 'Amit Patel', course: 'Geometry Basics', question: 'What is the difference between congruent and similar triangles?', time: '1 hour ago', priority: 'low', status: 'pending', avatar: '🔺' },
    { id: 4, student: 'Sneha Reddy', course: 'Trigonometry', question: 'Help with trigonometric identities proof', time: '2 hours ago', priority: 'high', status: 'pending', avatar: '📐' },
    { id: 5, student: 'Rohan Singh', course: 'Statistics 101', question: 'How to calculate standard deviation for grouped data?', time: '3 hours ago', priority: 'medium', status: 'pending', avatar: '📊' },
  ];

  // Best and Worst Performing Students
  const topPerformers = [
    { name: 'Priya Sharma', course: 'Calculus Pro', score: 98, quizzes: 15, avatar: '🏆', trend: 'up', improvement: '+5%' },
    { name: 'Karan Mehta', course: 'Algebra Mastery', score: 96, quizzes: 18, avatar: '⭐', trend: 'up', improvement: '+3%' },
    { name: 'Ananya Gupta', course: 'Geometry Basics', score: 94, quizzes: 12, avatar: '🌟', trend: 'up', improvement: '+7%' },
  ];

  const needsAttention = [
    { name: 'Vikram Singh', course: 'Trigonometry', score: 52, quizzes: 8, avatar: '📚', trend: 'down', improvement: '-3%' },
    { name: 'Neha Kapoor', course: 'Statistics 101', score: 58, quizzes: 10, avatar: '📖', trend: 'down', improvement: '-2%' },
    { name: 'Arjun Reddy', course: 'Calculus Pro', score: 61, quizzes: 7, avatar: '✍️', trend: 'down', improvement: '-5%' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/login', { replace: true });
  };

  const handleStartRecording = async (classItem: any) => {
    setSelectedClass(classItem);
    setIsPreviewReady(false);
    
    console.log('📹 Requesting camera/microphone access...');
    
    // Start preview
    try {
      const previewMediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      console.log('✅ Camera access granted!', previewMediaStream);
      setPreviewStream(previewMediaStream);
      
      // Open modal first so video element is rendered
      setIsRecordingModalOpen(true);
      
      // Set preview video source after a small delay to ensure element is mounted
      setTimeout(() => {
        if (videoPreviewRef.current) {
          console.log('🎥 Setting preview stream to video element');
          videoPreviewRef.current.srcObject = previewMediaStream;
          setIsPreviewReady(true);
        } else {
          console.error('❌ Video element ref not found');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Error accessing camera for preview:', error);
      toast.error('⚠️ Could not access camera. Please allow camera/microphone permissions and try again.');
    }
  };

  const handleConfirmRecording = async () => {
    // Stop preview stream
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
    
    setIsRecordingModalOpen(false);
    setIsPreviewReady(false);
    
    // Navigate to full-screen recording page
    navigate('/teacher/record', { state: { classData: selectedClass } });
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      // Stop duration counter
      if ((mediaRecorder as any).durationInterval) {
        clearInterval((mediaRecorder as any).durationInterval);
      }
      
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      setMediaRecorder(null);
    }
  };

  const handleCreateCourse = () => {
    toast.success('Redirecting to course creation... 📚');
    // In production: navigate('/teacher/create-course');
    setTimeout(() => {
      toast('Course creation page coming soon! 🚀', { icon: '⚠️' });
    }, 1000);
  };

  const handleViewAllEnrollments = () => {
    toast.success('Viewing all enrollments... 👥');
    // In production: navigate('/teacher/enrollments');
    setTimeout(() => {
      toast('Enrollments page coming soon! 🚀', { icon: '⚠️' });
    }, 1000);
  };

  const handleViewAllClasses = () => {
    toast.success('Viewing all scheduled classes... 📅');
    // In production: navigate('/teacher/schedule');
    setTimeout(() => {
      toast('Schedule page coming soon! 🚀', { icon: '⚠️' });
    }, 1000);
  };

  const handleSolveDoubt = (doubt: any) => {
    setSelectedDoubt(doubt);
    setIsDoubtModalOpen(true);
  };

  const handleConfirmSolveDoubt = () => {
    toast.success(`✅ Doubt resolved for ${selectedDoubt.student}!`);
    setIsDoubtModalOpen(false);
    // In production: API call to mark doubt as resolved
  };

  const handleStartLiveDoubtClass = async () => {
    try {
      // Get camera preview
      const previewMediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: false // No audio for preview
      });
      
      setPreviewStream(previewMediaStream);
      
      // Open modal first so video element is rendered
      setIsLiveDoubtModalOpen(true);
      
      // Set preview video source after a small delay to ensure element is mounted
      setTimeout(() => {
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = previewMediaStream;
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('⚠️ Could not access camera. Please allow camera/microphone permissions and try again.');
    }
  };

  const handleConfirmLiveDoubtClass = async () => {
    // Stop preview stream first
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
    
    setIsLiveDoubtModalOpen(false);
    
    try {
      // Request camera and microphone for live streaming
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      setStream(mediaStream);
      setIsLiveDoubtActive(true);
      setIsLiveStreaming(true);
      
      toast.success('🔴 Live Doubt Class is now active!');
      
      // In production, this would connect to a WebRTC signaling server
      // and broadcast the stream to all students
      console.log('Live stream started with stream ID:', mediaStream.id);
      
      // Show preview in a small window (optional)
      // You could create a video element to show the teacher's view
      
    } catch (error) {
      console.error('Error starting live class:', error);
      toast.error('❌ Failed to start live class. Please grant camera/microphone permissions.');
      setIsLiveDoubtModalOpen(false);
    }
  };

  const handleEndLiveDoubtClass = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsLiveDoubtActive(false);
    setIsLiveStreaming(false);
    toast.success('✅ Live Doubt Class ended successfully! 💚');
  };

  const handleViewStudentProfile = (studentName: string, type: 'top' | 'needs-attention') => {
    toast.success(`Viewing ${studentName}'s profile... 👤`);
    // In production: navigate(`/teacher/students/${studentId}`);
  };

  // Cleanup effect for media streams
  useEffect(() => {
    return () => {
      // Clean up any active streams when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [stream, mediaRecorder, previewStream]);

  const handleCancelRecording = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
    setIsPreviewReady(false);
    setIsRecordingModalOpen(false);
  };

  const handleCancelLiveClass = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(track => track.stop());
      setPreviewStream(null);
    }
    setIsPreviewReady(false);
    setIsLiveDoubtModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full m-0 p-0">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200 w-full">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/teacher/dashboard')}>
              <span className="text-3xl">📐</span>
              <div>
                <span className="text-2xl font-display font-bold text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  GanitXcel
                </span>
                <p className="text-xs text-gray-500 font-semibold">Teacher Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </motion.button>
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=58CC02&color=fff&bold=true`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-primary shadow-sm cursor-pointer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:block"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 md:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your courses today.</p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleCreateCourse}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <span>➕</span>
              Create New Course
            </Button>
          </div>
        </div>

        {/* Large Stats Grid - TailAdmin Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="💰"
            title="TOTAL REVENUE"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            subtitle="Last 30 days"
            trend="up"
            trendValue="12.5%"
            color="bg-gradient-to-br from-green-100 to-green-200"
            onClick={() => {
              toast.success('Viewing revenue analytics... 💰');
              // navigate('/teacher/revenue');
            }}
          />
          <StatCard
            icon="👥"
            title="TOTAL STUDENTS"
            value={stats.totalStudents.toLocaleString()}
            subtitle="Active learners"
            trend="up"
            trendValue="8.3%"
            color="bg-gradient-to-br from-blue-100 to-blue-200"
            onClick={() => {
              toast.success('Viewing student list... 👥');
              // navigate('/teacher/students');
            }}
          />
          <StatCard
            icon="📚"
            title="ACTIVE COURSES"
            value={stats.activeCourses}
            subtitle="Published courses"
            trend="up"
            trendValue="+2 new"
            color="bg-gradient-to-br from-purple-100 to-purple-200"
            onClick={() => {
              toast.success('Viewing courses... 📚');
              // navigate('/teacher/courses');
            }}
          />
          <StatCard
            icon="⭐"
            title="AVERAGE RATING"
            value={stats.avgRating.toFixed(1)}
            subtitle="Based on reviews"
            trend="up"
            trendValue="+0.2"
            color="bg-gradient-to-br from-yellow-100 to-yellow-200"
            onClick={() => {
              toast.success('Viewing reviews... ⭐');
              // navigate('/teacher/reviews');
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-3 gap-6 mb-6">
          {/* Statistics Chart - Takes 2 columns */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Statistics</h2>
                <p className="text-sm text-gray-600">Revenue and student growth</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(['monthly', 'quarterly', 'annually'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      timePeriod === period
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#58CC02" 
                  strokeWidth={3}
                  dot={{ fill: '#58CC02', r: 5 }}
                  name="Revenue (₹)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#1CB0F6" 
                  strokeWidth={3}
                  dot={{ fill: '#1CB0F6', r: 5 }}
                  name="Students" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Estimated Revenue Goals */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Goals</h2>
            <div className="space-y-6">
              {revenueGoals.map((goal, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">{goal.category}</p>
                    <p className="text-sm font-bold text-primary">{goal.percentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.percentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className="h-2.5 rounded-full"
                      style={{ 
                        background: idx === 0 
                          ? 'linear-gradient(to right, #58CC02, #3da002)' 
                          : 'linear-gradient(to right, #1CB0F6, #0d8fcc)'
                      }}
                    ></motion.div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {typeof goal.achieved === 'number' && goal.achieved > 1000 
                        ? `₹${goal.achieved.toLocaleString()}` 
                        : goal.achieved.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof goal.goal === 'number' && goal.goal > 1000 
                        ? `₹${goal.goal.toLocaleString()}` 
                        : goal.goal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid xl:grid-cols-3 gap-6 mb-6">
          {/* Course Categories Pie Chart */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Course Categories</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={courseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {courseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {courseCategories.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Live Classes */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Live Classes</h2>
              <Button variant="outline" size="sm" onClick={handleViewAllClasses}>View All</Button>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((classItem, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <p className="text-sm font-bold text-gray-900">{classItem.date}</p>
                      <p className="text-xs text-gray-500">{classItem.time}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{classItem.course}</p>
                      <p className="text-xs text-gray-500">{classItem.students} students registered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {classItem.status}
                    </span>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleStartRecording(classItem)}
                      className="flex items-center gap-2"
                    >
                      <span>🎥</span>
                      <span className="hidden md:inline">Record</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Third Row - Student Doubts, Performance, and Live Doubt Class */}
        <div className="grid xl:grid-cols-3 gap-6 mb-6">
          {/* Student Doubts Section */}
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Doubts</h2>
                <p className="text-sm text-gray-600">Recent questions from students</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {studentDoubts.filter(d => d.status === 'pending').length} Pending
                </span>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleStartLiveDoubtClass}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  🔴 Start Live Doubt Class
                </Button>
              </div>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {studentDoubts.map((doubt) => (
                <motion.div
                  key={doubt.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 hover:bg-gray-50 rounded-lg transition border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-3xl">{doubt.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{doubt.student}</p>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            doubt.priority === 'high' ? 'bg-red-100 text-red-700' :
                            doubt.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {doubt.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{doubt.course} • {doubt.time}</p>
                        <p className="text-sm text-gray-700">{doubt.question}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSolveDoubt(doubt)}
                      className="ml-2"
                    >
                      Solve
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Student Performance Cards */}
          <div className="space-y-6">
            {/* Top Performers */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">🏆 Top Performers</h3>
                <span className="text-xs text-green-600 font-semibold">Excellent</span>
              </div>
              <div className="space-y-3">
                {topPerformers.map((student, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    onClick={() => handleViewStudentProfile(student.name, 'top')}
                    className="flex items-center justify-between p-3 hover:bg-green-50 rounded-lg transition cursor-pointer border-l-4 border-green-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{student.avatar}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">{student.score}%</p>
                      <p className="text-xs text-green-500 font-semibold">{student.improvement}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Students Needing Attention */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">📚 Needs Attention</h3>
                <span className="text-xs text-orange-600 font-semibold">Action Required</span>
              </div>
              <div className="space-y-3">
                {needsAttention.map((student, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    onClick={() => handleViewStudentProfile(student.name, 'needs-attention')}
                    className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg transition cursor-pointer border-l-4 border-orange-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{student.avatar}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.course}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-orange-600">{student.score}%</p>
                      <p className="text-xs text-orange-500 font-semibold">{student.improvement}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Enrollments Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Enrollments</h2>
            <Button variant="outline" size="sm" onClick={handleViewAllEnrollments}>View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STUDENT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">COURSE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">AMOUNT</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">DATE</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${enrollment.student}&background=random`}
                          alt={enrollment.student}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{enrollment.student}</p>
                          <p className="text-xs text-gray-500">{enrollment.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{enrollment.course}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">₹{enrollment.amount}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{enrollment.date}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.status === 'Complete' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recording Modal */}
        <AnimatePresence>
          {isRecordingModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCancelRecording}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl mb-4"
                  >
                    🎥
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Recording Class?
                  </h2>
                  <p className="text-gray-600">
                    You're about to start recording for:
                  </p>
                </div>

                {/* Video Preview */}
                <div className="mb-6 bg-gray-900 rounded-xl overflow-hidden relative">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-64 object-cover"
                    style={{ backgroundColor: '#000' }}
                  />
                  {!isPreviewReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
                        <p className="text-white text-sm">Loading camera preview...</p>
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-800 px-4 py-2 text-center">
                    <p className="text-white text-sm font-semibold">
                      📹 Camera Preview
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    {selectedClass?.course}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>📅 {selectedClass?.date}</span>
                    <span>⏰ {selectedClass?.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    👥 {selectedClass?.students} students registered
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">⚠️</span>
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-800 mb-1">
                        Recording Tips:
                      </p>
                      <ul className="text-yellow-700 space-y-1 text-xs">
                        <li>• Ensure good lighting and audio</li>
                        <li>• Recording will be saved as WebM video</li>
                        <li>• Click Stop button when finished</li>
                        <li>• Video will auto-download after stopping</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelRecording}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmRecording}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    🔴 Start Recording
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Indicator - Shows when recording is active */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 h-4 bg-white rounded-full"
                  ></motion.div>
                  <div>
                    <p className="font-bold text-lg">Recording in Progress</p>
                    <p className="text-xs text-red-100">
                      {selectedClass?.course}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-mono bg-red-700 px-3 py-1 rounded-lg">
                    {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStopRecording}
                    className="bg-white text-red-600 hover:bg-red-50 border-none"
                  >
                    ⏹️ Stop
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doubt Solving Modal */}
        <AnimatePresence>
          {isDoubtModalOpen && selectedDoubt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsDoubtModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl mb-4"
                  >
                    {selectedDoubt.avatar}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Solve Student Doubt
                  </h2>
                  <p className="text-gray-600">
                    Help {selectedDoubt.student} with their question
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-gray-900">{selectedDoubt.student}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedDoubt.priority === 'high' ? 'bg-red-100 text-red-700' :
                      selectedDoubt.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedDoubt.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    📚 {selectedDoubt.course}
                  </p>
                  <div className="bg-white rounded-lg p-3 mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Question:</p>
                    <p className="text-sm text-gray-900">{selectedDoubt.question}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Answer/Solution:
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows={4}
                    placeholder="Type your detailed explanation here..."
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div className="text-sm">
                      <p className="font-semibold text-blue-800 mb-1">
                        Teaching Tips:
                      </p>
                      <ul className="text-blue-700 space-y-1 text-xs">
                        <li>• Break down complex concepts into simple steps</li>
                        <li>• Use examples and analogies</li>
                        <li>• Encourage follow-up questions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDoubtModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmSolveDoubt}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    ✅ Mark as Resolved
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Doubt Class Modal */}
        <AnimatePresence>
          {isLiveDoubtModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCancelLiveClass}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl mb-4"
                  >
                    🔴
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Live Doubt Class?
                  </h2>
                  <p className="text-gray-600">
                    Go live to solve student doubts in real-time
                  </p>
                </div>

                {/* Video Preview */}
                {previewStream && (
                  <div className="mb-6 bg-gray-900 rounded-xl overflow-hidden">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <div className="bg-gray-800 px-4 py-2 text-center">
                      <p className="text-white text-sm font-semibold">
                        📹 Camera Preview - Ready to Go Live
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">👥</span>
                      <span className="text-gray-700">
                        <strong>{studentDoubts.filter(d => d.status === 'pending').length}</strong> pending doubts
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">⏰</span>
                      <span className="text-gray-700">
                        Recommended duration: <strong>30-60 minutes</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-lg">📢</span>
                      <span className="text-gray-700">
                        All students will be <strong>notified</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6 rounded">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div className="text-sm">
                      <p className="font-semibold text-purple-800 mb-1">
                        Live Class Tips:
                      </p>
                      <ul className="text-purple-700 space-y-1 text-xs">
                        <li>• Test your camera and microphone</li>
                        <li>• Keep a whiteboard or screen share ready</li>
                        <li>• Encourage students to ask questions</li>
                        <li>• Record the session for later reference</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelLiveClass}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmLiveDoubtClass}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    🔴 Go Live
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Doubt Class Indicator */}
        <AnimatePresence>
          {isLiveDoubtActive && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 right-8 z-50"
            >
              <div className="bg-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 h-4 bg-white rounded-full"
                  ></motion.div>
                  <div>
                    <p className="font-bold text-lg">🔴 Live Doubt Class</p>
                    <p className="text-xs text-purple-100">
                      Students can join now
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEndLiveDoubtClass}
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 border-none"
                >
                  ✅ End Class
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button - Quick Actions */}
        {!isRecording && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCreateCourse}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl md:hidden"
            >
              ➕
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;