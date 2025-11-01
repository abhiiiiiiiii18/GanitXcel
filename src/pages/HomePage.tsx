import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Debug logging
  console.log('🏠 HomePage - Auth State:', { isAuthenticated, user: user?.name, role: user?.role });

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(isAuthenticated ? (user?.role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard') : '/')}
            >
              <span className="text-3xl">📐</span>
              <span className="text-2xl font-display font-bold text-gradient">
                GanitXcel
              </span>
            </div>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(user?.role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard')}
                    icon="🏠"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      useAuthStore.getState().logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Master <span className="text-gradient">Mathematics</span>
              <br />
              Grades 8-12
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn math the fun way! Gamified learning experience inspired by Duolingo.
              Build streaks, compete with friends, and ace your exams! 🚀
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                icon="🎓"
                onClick={() => navigate('/register?role=student')}
              >
                I'm a Student
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="👨‍🏫"
                onClick={() => navigate('/register?role=teacher')}
              >
                I'm a Teacher
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <div className="text-3xl font-bold text-accent-orange">15</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-400 w-3/4"></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="text-2xl mb-2">📊 Your Progress</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Algebra</span>
                    <span className="font-bold text-primary">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Geometry</span>
                    <span className="font-bold text-primary">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Calculus</span>
                    <span className="font-bold text-primary">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-display font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose GanitXcel?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎮',
                title: 'Gamified Learning',
                description: 'Earn points, maintain streaks, and compete with friends. Learning math has never been this fun!',
              },
              {
                icon: '🤖',
                title: 'AI Doubt Solver',
                description: '24/7 AI assistant to help with doubts. Get step-by-step solutions instantly!',
              },
              {
                icon: '🎥',
                title: 'Quality Content',
                description: 'Curated YouTube videos from the best teachers, organized for structured learning.',
              },
              {
                icon: '🏆',
                title: 'Rewards & Certificates',
                description: 'Top performers earn cash scholarships (₹500-₹1000) and shareable certificates.',
              },
              {
                icon: '👥',
                title: 'Live Doubt Classes',
                description: 'Weekly live sessions with teachers to clear all your doubts.',
              },
              {
                icon: '💬',
                title: 'Discord Community',
                description: 'Join course-specific communities to connect with peers and learn together.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h2
            className="text-4xl font-display font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Ready to Excel in Mathematics?
          </motion.h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already mastering math with GanitXcel!
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/register')}
            className="!bg-white !text-primary !border-white hover:!bg-gray-100"
          >
            Start Learning Today! 🚀
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">📐</span>
                <span className="text-xl font-display font-bold">GanitXcel</span>
              </div>
              <p className="text-gray-400">
                Master Mathematics, Grades 8-12
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Courses</li>
                <li>Take Quizzes</li>
                <li>Join Community</li>
                <li>Earn Rewards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Teachers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Create Courses</li>
                <li>Qualification Test</li>
                <li>Dashboard</li>
                <li>Earnings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GanitXcel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
