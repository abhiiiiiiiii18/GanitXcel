import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getCourseProgress } from '../services/firebase';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useAuthStore } from '../store';
import { formatCurrency, formatDuration, getRatingStars } from '../utils/helpers';
import toast from 'react-hot-toast';

const CoursePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Debug logging
  console.log('📚 CoursePage - State:', { 
    courseId: id, 
    userId: user?.id, 
    isAuthenticated, 
    isPurchased, 
    isCheckingPurchase,
    completedLessons
  });

  // Check if user has already purchased this course
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user?.id || !id) {
        setIsCheckingPurchase(false);
        return;
      }

      try {
        // Fetch user document from Firestore
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const purchasedCourses = userData.enrolledCourses || [];
          
          // Check if current course ID is in purchased courses array
          const alreadyPurchased = purchasedCourses.includes(id);
          setIsPurchased(alreadyPurchased);

          if (alreadyPurchased) {
            console.log('✅ User already owns this course');
            
            // Fetch course progress (completed lessons)
            try {
              const progress = await getCourseProgress(user.id, id);
              setCompletedLessons(progress.completedLessons || []);
              console.log('📊 Completed lessons:', progress.completedLessons);
            } catch (error) {
              console.error('Error fetching progress:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
        toast.error('Failed to check purchase status');
      } finally {
        setIsCheckingPurchase(false);
      }
    };

    checkPurchaseStatus();
  }, [user?.id, id]);

  // Mock course data (replace with API call)
  const course = {
    id: id || '1',
    title: 'Complete Algebra Mastery - Grade 10',
    description: 'Master all algebra concepts for Grade 10 with interactive lessons, quizzes, and live doubt sessions. Perfect for CBSE, ICSE, and State Board students.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop&q=80',
    price: 599,
    originalPrice: 999,
    rating: 4.8,
    totalStudents: 2456,
    monthlyEnrollments: 342,
    grade: [10],
    subject: 'Algebra',
    duration: 45, // lessons
    totalDuration: 1800, // minutes
    language: 'English & Hindi',
    lastUpdated: '2025-10-15',
    teacher: {
      id: 't1',
      name: 'Rajesh Kumar',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=1CB0F6&color=fff',
      bio: '15+ years of teaching experience. IIT Delhi graduate. Helped 10,000+ students ace their exams.',
      rating: 4.9,
      totalStudents: 12500,
      coursesCreated: 8,
    },
    toppers: [
      { studentId: 's1', name: 'Priya Sharma', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma', score: 98, rank: 1 },
      { studentId: 's2', name: 'Amit Patel', avatar: 'https://ui-avatars.com/api/?name=Amit+Patel', score: 96, rank: 2 },
      { studentId: 's3', name: 'Neha Singh', avatar: 'https://ui-avatars.com/api/?name=Neha+Singh', score: 95, rank: 3 },
    ],
    syllabus: [
      {
        id: 'l1',
        title: 'Introduction to Algebraic Expressions',
        duration: 45,
        order: 0,
      },
      {
        id: 'l2',
        title: 'Linear Equations in One Variable',
        duration: 52,
        order: 1,
      },
      {
        id: 'l3',
        title: 'Linear Equations in Two Variables',
        duration: 48,
        order: 2,
      },
      {
        id: 'l4',
        title: 'Quadratic Equations - Part 1',
        duration: 55,
        order: 3,
      },
      {
        id: 'l5',
        title: 'Quadratic Equations - Part 2',
        duration: 50,
        order: 4,
      },
    ],
    features: [
      '45 HD video lessons',
      'Quiz after every lesson',
      'Weekly live doubt classes',
      'AI-powered doubt bot (24/7)',
      'Downloadable notes & worksheets',
      'Certificate on completion',
      'Discord community access',
      'Lifetime access',
    ],
    reviews: [
      { id: 'r1', studentName: 'Rahul M.', rating: 5, comment: 'Best algebra course! Cleared all my doubts.', date: '2025-10-20' },
      { id: 'r2', studentName: 'Sneha K.', rating: 5, comment: 'Rajesh sir explains everything so clearly!', date: '2025-10-18' },
      { id: 'r3', studentName: 'Arjun P.', rating: 4, comment: 'Great content, would love more practice problems.', date: '2025-10-15' },
    ],
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    if (user?.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return;
    }

    // Check if already purchased - redirect to course
    if (isPurchased) {
      toast.success('You already own this course! Redirecting to lessons...');
      localStorage.setItem('lastCourseId', course.id);
      navigate(`/course/${course.id}/lesson/${course.syllabus[0].id}`);
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!user?.id) {
      toast.error('User not found. Please login again.');
      return;
    }

    try {
      toast.loading('Processing payment...', { id: 'payment' });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add course to user's enrolledCourses in Firestore
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        enrolledCourses: arrayUnion(course.id)
      });

      // Update local state
      setIsPurchased(true);
      
      // Update Zustand store
      if ('enrolledCourses' in user) {
        const updatedUser = {
          ...user,
          enrolledCourses: [...(user.enrolledCourses || []), course.id]
        };
        useAuthStore.getState().login(updatedUser);
      }

      toast.success('🎉 Enrollment successful! Redirecting to your course...', { id: 'payment' });
      setShowPaymentModal(false);
      
      // Store courseId and auto-redirect to first lesson immediately
      localStorage.setItem('lastCourseId', course.id);
      navigate(`/course/${course.id}/lesson/${course.syllabus[0].id}`);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.', { id: 'payment' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Breadcrumb */}
                <div className="text-sm text-gray-600 mb-4">
                  <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span>
                  <span className="mx-2">/</span>
                  <span className="hover:text-primary cursor-pointer">Courses</span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-semibold">{course.subject}</span>
                </div>

                <h1 className="text-4xl font-display font-bold mb-4">{course.title}</h1>
                
                <p className="text-lg text-gray-700 mb-6">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold text-lg">{course.rating}</span>
                    <span className="text-gray-600">({course.totalStudents.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span className="font-semibold text-accent-orange">{course.monthlyEnrollments} enrolled this month!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span className="text-gray-600">{course.duration} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    <span className="text-gray-600">{formatDuration(course.totalDuration)}</span>
                  </div>
                </div>

                {/* Course Image */}
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full rounded-2xl shadow-xl mb-8"
                />

                {/* What You'll Learn */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">📝 What You'll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-primary text-xl">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">📚 Course Content</h2>
                  <p className="text-gray-600 mb-6">
                    {course.syllabus.length} lessons • {formatDuration(course.totalDuration)} total length
                  </p>
                  {isPurchased && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                      <p className="text-sm text-blue-800">
                        🔓 <strong>Sequential Learning:</strong> Complete each lesson to unlock the next one. 
                        {completedLessons.length > 0 && ` You've completed ${completedLessons.length} of ${course.syllabus.length} lessons!`}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {course.syllabus.map((lesson, index) => {
                      // Determine if lesson is locked based on sequential completion
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isLocked = isPurchased 
                        ? index > 0 && !completedLessons.includes(course.syllabus[index - 1].id)
                        : true; // All locked if not purchased
                      const isAccessible = !isLocked;
                      
                      return (
                        <motion.div
                          key={lesson.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${
                            isCompleted 
                              ? 'border-green-500 bg-green-50' 
                              : isLocked 
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                                : 'border-primary-200 bg-primary-50'
                          }`}
                          whileHover={isAccessible ? { scale: 1.02 } : {}}
                          onClick={() => {
                            if (isPurchased && isAccessible) {
                              localStorage.setItem('lastCourseId', course.id);
                              navigate(`/course/${course.id}/lesson/${lesson.id}`);
                            } else if (!isPurchased) {
                              toast.error('Please purchase the course to access lessons');
                            } else {
                              toast.error('Complete the previous lesson to unlock this one');
                            }
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isLocked 
                                  ? 'bg-gray-300 text-gray-600' 
                                  : 'bg-primary text-white'
                            }`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                {lesson.title}
                              </h3>
                              <p className="text-sm text-gray-600">{lesson.duration} min</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && <span className="text-green-500 text-sm font-semibold">Completed</span>}
                            {isLocked ? (
                              <span className="text-2xl">🔒</span>
                            ) : isCompleted ? (
                              <span className="text-2xl">✅</span>
                            ) : (
                              <span className="text-2xl">▶️</span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Top 3 Toppers (Social Proof) */}
                <div className="bg-gradient-to-r from-accent-yellow to-accent-orange text-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <span>🏆</span> Top 3 Performers (Last Batch)
                  </h2>
                  <p className="mb-6 opacity-90">Join them in achieving excellence!</p>
                  <div className="grid md:grid-cols-3 gap-6">
                    {course.toppers.map((topper, index) => (
                      <motion.div
                        key={topper.studentId}
                        className="bg-white text-gray-900 rounded-xl p-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative inline-block mb-4">
                          <img
                            src={topper.avatar}
                            alt={topper.name}
                            className="w-20 h-20 rounded-full border-4 border-accent-yellow"
                          />
                          <div className="absolute -top-2 -right-2 bg-accent-yellow text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            #{topper.rank}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{topper.name}</h3>
                        <p className="text-2xl font-bold text-primary">{topper.score}%</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Teacher Profile */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">👨‍🏫 Your Instructor</h2>
                  <div className="flex items-start gap-6">
                    <img
                      src={course.teacher.avatar}
                      alt={course.teacher.name}
                      className="w-24 h-24 rounded-full border-4 border-primary"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{course.teacher.name}</h3>
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="text-accent-yellow">⭐</span>
                          {course.teacher.rating} rating
                        </span>
                        <span>•</span>
                        <span>{course.teacher.totalStudents.toLocaleString()} students</span>
                        <span>•</span>
                        <span>{course.teacher.coursesCreated} courses</span>
                      </div>
                      <p className="text-gray-700">{course.teacher.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">⭐ Student Reviews</h2>
                  <div className="space-y-6">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{review.studentName}</span>
                          <span className="text-sm text-gray-600">{review.date}</span>
                        </div>
                        <div className="text-accent-yellow mb-2">
                          {getRatingStars(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary">{formatCurrency(course.price)}</span>
                    <span className="text-xl text-gray-400 line-through">{formatCurrency(course.originalPrice)}</span>
                  </div>
                  <div className="inline-block bg-accent-red text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </div>
                </div>

                <Button
                  variant={isPurchased ? "secondary" : "primary"}
                  size="lg"
                  className="w-full mb-4"
                  icon={isPurchased ? "✅" : "🚀"}
                  onClick={handleEnroll}
                  disabled={isCheckingPurchase}
                >
                  {isCheckingPurchase ? 'Checking...' : isPurchased ? "Go to Course" : "Enroll Now"}
                </Button>

                <p className="text-center text-sm text-gray-600 mb-6">
                  30-day money-back guarantee
                </p>

                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-gray-900">This course includes:</h3>
                  {[
                    { icon: '📺', text: `${course.duration} video lessons` },
                    { icon: '📝', text: 'Quizzes & assignments' },
                    { icon: '🤖', text: 'AI doubt bot (24/7)' },
                    { icon: '👨‍🏫', text: 'Weekly live classes' },
                    { icon: '📄', text: 'Certificate of completion' },
                    { icon: '♾️', text: 'Lifetime access' },
                    { icon: '💬', text: 'Discord community' },
                    { icon: '📱', text: 'Mobile & desktop access' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-3"
                    icon="💬"
                    onClick={() => window.open('https://discord.gg/ganitxcel', '_blank')}
                  >
                    Join Discord Community
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon="❤️"
                  >
                    Add to Wishlist
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal (Dummy Razorpay) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <p className="text-gray-600 mb-6">
              This is a dummy payment interface for hackathon demonstration.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Course:</span>
                <span className="font-semibold">{course.title}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">{formatCurrency(course.price)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary text-xl">{formatCurrency(course.price)}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  className="input-field"
                  defaultValue="4111 1111 1111 1111"
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input-field"
                    defaultValue="12/25"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="input-field"
                    defaultValue="123"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handlePayment}
                className="flex-1"
              >
                Pay Now
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Dummy Razorpay Integration (No real transaction)
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
