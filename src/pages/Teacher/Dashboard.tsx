import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';

// Material-UI style components (custom implementation to avoid dependency issues)
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon, title, value, change, color }: {
  icon: string;
  title: string;
  value: string | number;
  change?: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 border-l-4"
    style={{ borderLeftColor: color }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
           style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      {change && (
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold" style={{ color }}>{value}</p>
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
    { name: 'Algebra', value: 342, color: '#8b5cf6' },
    { name: 'Calculus', value: 287, color: '#3b82f6' },
    { name: 'Geometry', value: 256, color: '#10b981' },
    { name: 'Trigonometry', value: 198, color: '#f59e0b' },
    { name: 'Statistics', value: 164, color: '#ef4444' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/teacher/dashboard')}>
              <span className="text-3xl">📐</span>
              <div>
                <span className="text-2xl font-display font-bold text-gradient">GanitXcel</span>
                <p className="text-xs text-gray-500">Teacher Portal</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'courses', label: 'Courses', icon: '📚' },
                { id: 'students', label: 'Students', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=8b5cf6&color=fff`}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer"
                />
                <button
                  onClick={handleLogout}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your courses today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="💰"
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
            change={stats.monthlyGrowth}
            color="#10b981"
          />
          <StatCard
            icon="👥"
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change={stats.studentGrowth}
            color="#3b82f6"
          />
          <StatCard
            icon="📚"
            title="Active Courses"
            value={stats.activeCourses}
            change={stats.courseGrowth}
            color="#8b5cf6"
          />
          <StatCard
            icon="⭐"
            title="Average Rating"
            value={stats.avgRating.toFixed(1)}
            change={stats.ratingChange}
            color="#f59e0b"
          />
        </div>

        {/* Main Content Grid */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue & Student Growth */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Revenue & Student Growth</h2>
                  <p className="text-sm text-gray-600">Last 6 months performance</p>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
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
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="Students" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Activities */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {recentActivities.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.student}
                        {activity.type === 'enrollment' && ` enrolled in ${activity.course}`}
                        {activity.type === 'quiz' && ` scored ${activity.score}% in ${activity.course}`}
                        {activity.type === 'feedback' && ` rated you ${activity.rating}⭐`}
                        {activity.type === 'doubt' && ` asked: ${activity.question}`}
                        {activity.type === 'completion' && ` completed ${activity.course}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Student Engagement */}
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Student Engagement (This Week)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#8b5cf6" name="Active Students" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="quizzes" fill="#3b82f6" name="Quizzes Taken" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="lessons" fill="#10b981" name="Lessons Watched" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Topic Distribution */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Course Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topicDistribution.map((topic, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }}></div>
                      <span>{topic.name}</span>
                    </div>
                    <span className="font-semibold">{topic.value} students</span>
                  </div>
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
                <h2 className="text-2xl font-bold">Course Performance</h2>
                <p className="text-gray-600">Detailed analytics for all your courses</p>
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition flex items-center gap-2">
                <span>➕</span>
                Create New Course
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Course Name</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Students</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Revenue</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Rating</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Completion</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursePerformance.map((course, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {course.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold">{course.name}</p>
                            <p className="text-sm text-gray-500">Active</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-semibold text-lg">{course.students}</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="font-semibold text-green-600">₹{(course.revenue / 1000).toFixed(1)}K</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span>⭐</span>
                          <span className="font-semibold">{course.rating}</span>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1">{course.completion}%</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <button className="px-4 py-2 text-primary hover:bg-primary-50 rounded-lg font-medium transition">
                          View Details
                        </button>
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
