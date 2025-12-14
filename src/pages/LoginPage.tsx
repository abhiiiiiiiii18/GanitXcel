import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import { loginUser } from '../services/firebase';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(
    roleParam === 'teacher' ? 'TEACHER' : 'STUDENT'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔐 Login attempt started');
    console.log('   • Email:', email);
    console.log('   • Role:', role);

    try {
      // Login with Firebase
      const { user: firebaseUser, profile } = await loginUser(email, password);

      console.log('✅ Firebase login successful');
      console.log('   • User ID:', firebaseUser.uid);
      console.log('   • Profile Role:', profile.role);
      console.log('   • Selected Role:', role);

      // Verify role matches
      if (profile.role !== role) {
        console.error('❌ Role mismatch!');
        console.error('   • Expected:', role);
        console.error('   • Got:', profile.role);
        toast.error(`This account is registered as a ${profile.role.toLowerCase()}, not a ${role.toLowerCase()}.`);
        setIsLoading(false);
        return;
      }

      console.log('✅ Role verification passed');

      // Create user object for store
      const mockUser = {
        id: firebaseUser.uid,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        createdAt: new Date(),
      };

      login(mockUser);
      console.log('✅ User logged into Zustand store');
      toast.success(`Welcome back as ${role === 'STUDENT' ? 'Student' : 'Teacher'}! 🎉`);
      
      // Use replace to prevent back button issues
      if (role === 'STUDENT') {
        console.log('➡️  Navigating to /student/dashboard');
        navigate('/student/dashboard', { replace: true });
      } else {
        console.log('➡️  Navigating to /teacher/dashboard');
        navigate('/teacher/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-5xl">📐</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">Log in to continue your learning journey</p>
        </div>

        {/* Role Selector */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
            Select Your Role: <span className={role === 'STUDENT' ? 'text-primary' : 'text-secondary'}>{role === 'STUDENT' ? 'Student 🎓' : 'Teacher 👨‍🏫'}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            type="button"
            onClick={() => {
              setRole('STUDENT');
              console.log('Role changed to STUDENT');
            }}
            className={`p-4 rounded-xl font-semibold transition-all ${
              role === 'STUDENT'
                ? 'bg-primary text-white shadow-lg ring-4 ring-primary ring-opacity-50'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">🎓</div>
            <div>Student</div>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => {
              setRole('TEACHER');
              console.log('Role changed to TEACHER');
            }}
            className={`p-4 rounded-xl font-semibold transition-all ${
              role === 'TEACHER'
                ? 'bg-secondary text-white shadow-lg ring-4 ring-secondary ring-opacity-50'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div>Teacher</div>
          </motion.button>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" onClick={() => toast('Password reset coming soon!')} className="text-primary font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </motion.form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link
            to={`/register?role=${role.toLowerCase()}`}
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
