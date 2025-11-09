import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useAuthStore } from '../../store';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';

// Professional Card Component matching site theme
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${className}`}
  >
    {children}
  </motion.div>
);

// Stats Card with Duolingo-style design
const StatCard = ({ icon, title, value, change, gradient }: {
  icon: string;
  title: string;
  value: string | number;
  change?: string;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white cursor-pointer transform transition-all duration-300 border-b-4 border-opacity-50`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="text-4xl">{icon}</div>
      {change && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
        >
          {change.startsWith('+') ? '📈' : '📉'}
          {change}
        </motion.span>
      )}
    </div>
    <h3 className="text-white text-opacity-90 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</h3>
    <p className="text-4xl font-black">{value}</p>
  </motion.div>
);

const TeacherDashboardProfessional: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'analytics'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock Data (Replace with real API calls)
  const stats = {
    totalRevenue: 145250,
    totalStudents: 1247,
    activeCourses: 8,
    avgRating: 4.8,
    monthlyGrowth: '+12.5%',
    studentGrowth: '+8.3%',
    courseGrowth: '+2',
    ratingChange: '+0.2'
  };

  const revenueData = [
    { month: 'Jan', revenue: 12500, students: 150 },
    { month: 'Feb', revenue: 15800, students: 180 },
    { month: 'Mar', revenue: 18200, students: 220 },
    { month: 'Apr', revenue: 16500, students: 210 },
    { month: 'May', revenue: 21000, students: 250 },
    { month: 'Jun', revenue: 24500, students: 287 },
  ];

  const coursePerformance = [
    { name: 'Algebra Mastery', students: 342, revenue: 45600, rating: 4.9, completion: 78 },
    { name: 'Calculus Pro', students: 287, revenue: 38200, rating: 4.8, completion: 72 },
    { name: 'Geometry Basics', students: 256, revenue: 32100, rating: 4.7, completion: 81 },
    { name: 'Trigonometry', students: 198, revenue: 24500, rating: 4.6, completion: 68 },
    { name: 'Statistics 101', students: 164, revenue: 18900, rating: 4.8, completion: 75 },
  ];

  const studentEngagement = [
    { day: 'Mon', active: 145, quizzes: 89, lessons: 234 },
    { day: 'Tue', active: 178, quizzes: 112, lessons: 287 },
    { day: 'Wed', active: 156, quizzes: 98, lessons: 256 },
    { day: 'Thu', active: 189, quizzes: 124, lessons: 312 },
    { day: 'Fri', active: 167, quizzes: 105, lessons: 278 },
    { day: 'Sat', active: 134, quizzes: 87, lessons: 198 },
    { day: 'Sun', active: 98, quizzes: 56, lessons: 145 },
  ];

  const topicDistribution = [
    { name: 'Algebra', value: 342, color: '#58CC02' },    // Primary green
    { name: 'Calculus', value: 287, color: '#1CB0F6' },   // Secondary blue
    { name: 'Geometry', value: 256, color: '#CE82FF' },   // Accent purple
    { name: 'Trigonometry', value: 198, color: '#FFC800' }, // Accent yellow
    { name: 'Statistics', value: 164, color: '#FF9600' },  // Accent orange
  ];

  const recentActivities = [
    { type: 'enrollment', student: 'Rahul Kumar', course: 'Algebra Mastery', time: '5 min ago', icon: '👤' },
    { type: 'quiz', student: 'Priya Sharma', course: 'Calculus Pro', score: 95, time: '12 min ago', icon: '📝' },
    { type: 'feedback', student: 'Amit Patel', rating: 5, comment: 'Excellent teaching!', time: '25 min ago', icon: '⭐' },
    { type: 'doubt', student: 'Sneha Reddy', question: 'Help with quadratic equations', time: '1 hour ago', icon: '❓' },
    { type: 'completion', student: 'Rohan Singh', course: 'Geometry Basics', time: '2 hours ago', icon: '🎉' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    navigate('/login', { replace: true });
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Top Navigation - Matching site theme */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
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
            
            {/* Tab Navigation with Duolingo style */}
            <div className="flex items-center gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'courses', label: 'Courses', icon: '📚' },
                { id: 'students', label: 'Students', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg border-b-4 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <span className="text-2xl">🔔</span>
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-red rounded-full"
                ></motion.span>
              </motion.button>
              <div className="flex items-center gap-3">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=58CC02&color=fff&bold=true`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-3 border-primary shadow-lg cursor-pointer"
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header with fun animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-5xl font-display font-black mb-3 bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Welcome back, {user?.name}! 👋
          </motion.h1>
          <p className="text-gray-600 text-lg font-medium">Here's what's happening with your courses today.</p>
        </motion.div>

        {/* Stats Grid - Duolingo style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="💰"
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
            change={stats.monthlyGrowth}
            gradient="from-green-400 to-green-600"
          />
          <StatCard
            icon="👥"
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change={stats.studentGrowth}
            gradient="from-blue-400 to-blue-600"
          />
          <StatCard
            icon="📚"
            title="Active Courses"
            value={stats.activeCourses}
            change={stats.courseGrowth}
            gradient="from-purple-400 to-purple-600"
          />
          <StatCard
            icon="⭐"
            title="Average Rating"
            value={stats.avgRating.toFixed(1)}
            change={stats.ratingChange}
            gradient="from-yellow-400 to-orange-500"
          />
        </div>

        {/* Main Content Grid */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue & Student Growth */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-800 mb-1">Revenue & Student Growth</h2>
                  <p className="text-sm text-gray-600">Last 6 months performance</p>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#58CC02" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#58CC02" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1CB0F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1CB0F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontWeight: 600 }} />
                  <YAxis stroke="#6b7280" style={{ fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#58CC02" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenue (₹)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#1CB0F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorStudents)" 
                    name="Students" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Activities */}
            <Card>
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Recent Activities</h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {recentActivities.map((activity, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-start gap-3 p-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-xl transition cursor-pointer border-l-4 border-transparent hover:border-primary"
                    >
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl"
                      >
                        {activity.icon}
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {activity.student}
                          {activity.type === 'enrollment' && ` enrolled in ${activity.course}`}
                          {activity.type === 'quiz' && ` scored ${activity.score}% in ${activity.course}`}
                          {activity.type === 'feedback' && ` rated you ${activity.rating}⭐`}
                          {activity.type === 'doubt' && ` asked: ${activity.question}`}
                          {activity.type === 'completion' && ` completed ${activity.course}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-semibold">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>

            {/* Student Engagement */}
            <Card className="lg:col-span-2">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Student Engagement (This Week)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" style={{ fontWeight: 600 }} />
                  <YAxis stroke="#6b7280" style={{ fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                  <Bar dataKey="active" fill="#CE82FF" name="Active Students" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="quizzes" fill="#1CB0F6" name="Quizzes Taken" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="lessons" fill="#58CC02" name="Lessons Watched" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Topic Distribution */}
            <Card>
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Course Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ fontWeight: 'bold', fontSize: '12px' }}
                  >
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topicDistribution.map((topic, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div 
                        whileHover={{ scale: 1.3 }}
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: topic.color }}
                      ></motion.div>
                      <span className="font-semibold text-gray-700">{topic.name}</span>
                    </div>
                    <span className="font-black text-gray-900">{topic.value} students</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Course Performance Tab */}
        {activeTab === 'courses' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-display font-black text-gray-900">Course Performance</h2>
                <p className="text-gray-600 font-semibold">Detailed analytics for all your courses</p>
              </div>
              <Button variant="primary" className="flex items-center gap-2">
                <span>➕</span>
                Create New Course
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-black text-gray-800">Course Name</th>
                    <th className="text-center py-4 px-4 font-black text-gray-800">Students</th>
                    <th className="text-center py-4 px-4 font-black text-gray-800">Revenue</th>
                    <th className="text-center py-4 px-4 font-black text-gray-800">Rating</th>
                    <th className="text-center py-4 px-4 font-black text-gray-800">Completion</th>
                    <th className="text-center py-4 px-4 font-black text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursePerformance.map((course, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ backgroundColor: '#f9fafb', scale: 1.01 }}
                      className="border-b border-gray-100 transition"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.5 }}
                            className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                          >
                            {course.name[0]}
                          </motion.div>
                          <div>
                            <p className="font-bold text-gray-900">{course.name}</p>
                            <p className="text-sm text-primary font-semibold">Active</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-black text-2xl text-gray-900">{course.students}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-black text-xl text-primary">₹{(course.revenue / 1000).toFixed(1)}K</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-2xl">⭐</span>
                          <span className="font-black text-xl text-accent-yellow">{course.rating}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="w-full px-4">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.completion}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                            ></motion.div>
                          </div>
                          <span className="text-sm font-bold text-gray-700 mt-1 block">{course.completion}%</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="font-bold"
                        >
                          View Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardProfessional;
