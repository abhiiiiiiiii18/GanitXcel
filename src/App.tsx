import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useUIStore } from './store';

// Pages (will be created)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/Student/Dashboard';
import BrowseCourses from './pages/Student/BrowseCourses';
import LeaderboardPage from './pages/Student/LeaderboardPage';
import FriendsPage from './pages/Student/FriendsPage';
import TeacherDashboard from './pages/Teacher/Dashboard';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import TeacherTestPage from './pages/TeacherTestPage';
import CertificatePage from './pages/CertificatePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { isSadMode } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen ${isSadMode ? 'sad-mode-bg' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard'} replace />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={user?.role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard'} replace />} />
            
            {/* Protected Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                isAuthenticated ? (
                  user?.role === 'STUDENT' ? (
                    <StudentDashboard />
                  ) : (
                    <Navigate to="/teacher/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/courses"
              element={isAuthenticated && user?.role === 'STUDENT' ? <BrowseCourses /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/leaderboard"
              element={isAuthenticated && user?.role === 'STUDENT' ? <LeaderboardPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/friends"
              element={isAuthenticated && user?.role === 'STUDENT' ? <FriendsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/course/:id"
              element={isAuthenticated ? <CoursePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/course/:courseId/lesson/:lessonId"
              element={isAuthenticated && user?.role === 'STUDENT' ? <LessonPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/quiz/:id"
              element={isAuthenticated && user?.role === 'STUDENT' ? <QuizPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/certificate/:courseId"
              element={isAuthenticated && user?.role === 'STUDENT' ? <CertificatePage /> : <Navigate to="/login" replace />}
            />
            
            {/* Protected Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                isAuthenticated ? (
                  user?.role === 'TEACHER' ? (
                    <TeacherDashboard />
                  ) : (
                    <Navigate to="/student/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/teacher/qualification-test"
              element={<TeacherTestPage />}
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#58CC02',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF4B4B',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
