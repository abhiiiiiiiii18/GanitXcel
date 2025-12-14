import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import { UserRole } from '../types';
import { registerUser } from '../services/firebase';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(
    roleParam === 'teacher' ? 'TEACHER' : 'STUDENT'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    grade: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (role === 'TEACHER') {
      // Redirect teacher to qualification test first
      toast('Please complete the qualification test to continue.', { icon: 'ℹ️' });
      navigate('/teacher/qualification-test', { state: { formData, role } });
      return;
    }

    setIsLoading(true);
    console.log('📝 Registration attempt started');
    console.log('   • Email:', formData.email);
    console.log('   • Name:', formData.name);
    console.log('   • Role:', role);

    try {
      // Register with Firebase
      const { user: firebaseUser, profile } = await registerUser(
        formData.email,
        formData.password,
        formData.name,
        role
      );

      console.log('✅ Registration successful');
      console.log('   • User ID:', firebaseUser.uid);
      console.log('   • Profile created');

      const mockUser = {
        id: firebaseUser.uid,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        phone: formData.phone,
        grade: formData.grade ? parseInt(formData.grade) : undefined,
        createdAt: new Date(),
      };

      login(mockUser);
      console.log('✅ User logged into Zustand store');
      toast.success('Account created successfully! 🎉');
      console.log('➡️  Navigating to /student/dashboard');
      navigate('/student/dashboard', { replace: true });
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
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
            Join GanitXcel
          </h1>
          <p className="text-gray-600">Start your math mastery journey today!</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.button
            onClick={() => setRole('STUDENT')}
            className={`p-4 rounded-xl font-semibold transition-all ${
              role === 'STUDENT'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">🎓</div>
            <div>Student</div>
          </motion.button>

          <motion.button
            onClick={() => setRole('TEACHER')}
            className={`p-4 rounded-xl font-semibold transition-all ${
              role === 'TEACHER'
                ? 'bg-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div>Teacher</div>
          </motion.button>
        </div>

        {role === 'TEACHER' && (
          <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-secondary-800">
              <span className="font-bold">Note:</span> Teachers must pass a qualification test
              to create courses on our platform.
            </p>
          </div>
        )}

        {/* Registration Form */}
        <motion.form
          onSubmit={handleRegister}
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="9876543210"
                required
              />
            </div>

            {role === 'STUDENT' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select your grade</option>
                  {[8, 9, 10, 11, 12].map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {role === 'TEACHER' ? 'Continue to Test' : 'Create Account'}
            </Button>
          </div>
        </motion.form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link
            to={`/login?role=${role.toLowerCase()}`}
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
