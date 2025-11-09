import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useUIStore } from './store';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const BrowseCourses = lazy(() => import('./pages/Student/BrowseCourses'));
const LeaderboardPage = lazy(() => import('./pages/Student/LeaderboardPage'));
const FriendsPage = lazy(() => import('./pages/Student/FriendsPage'));
const TeacherDashboard = lazy(() => import('./pages/Teacher/Dashboard'));
const RecordingPage = lazy(() => import('./pages/Teacher/RecordingPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const TeacherTestPage = lazy(() => import('./pages/TeacherTestPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 font-semibold">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { isSadMode } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen w-full ${isSadMode ? 'sad-mode-bg' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
          <Suspense fallback={<LoadingFallback />}>
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
              path="/teacher/record"
              element={
                isAuthenticated ? (
                  user?.role === 'TEACHER' ? (
                    <RecordingPage />
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
          </Suspense>
          
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
