import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useTabSwitchDetection } from '../hooks/useTabSwitchDetection';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { registerUser, qualifyTeacher } from '../services/firebase';

interface TestQuestion {
  id: string;
  question: string;
  hasLatex: boolean;
  latexExpression?: string;
  type: 'mcq' | 'numeric' | 'text';
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation: string;
}

const TeacherTestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, login } = useAuthStore();
  const teacherData = location.state as { formData?: any; role?: string } | null;
  
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // Strict tab switch detection - auto-fail on first violation
  const { isViolated, tabSwitchCount } = useTabSwitchDetection({
    isActive: hasStarted && !showResults && !isBanned,
    onTabSwitch: () => {
      toast.error('⚠️ TAB SWITCHING DETECTED! Test will be terminated immediately!');
    },
    onViolation: () => {
      setIsBanned(true);
      handleBan();
    },
  });

  // Teacher qualification test - advanced math questions
  const test = {
    title: 'GanitXcel Teacher Qualification Test',
    description: 'This test evaluates your mathematical knowledge and teaching ability. Passing score: 80%',
    passingScore: 80,
    timeLimit: 30, // minutes
    questions: [
      {
        id: 'q1',
        question: 'Solve for x: 2x² - 5x - 3 = 0',
        hasLatex: true,
        latexExpression: '2x^2 - 5x - 3 = 0',
        type: 'mcq' as const,
        options: ['x = 3 or x = -0.5', 'x = -3 or x = 0.5', 'x = 2 or x = 1.5', 'x = -2 or x = -1.5'],
        correctAnswer: 'x = 3 or x = -0.5',
        points: 10,
        explanation: 'Using the quadratic formula or factoring: (2x + 1)(x - 3) = 0, so x = -1/2 or x = 3',
      },
      {
        id: 'q2',
        question: 'What is the derivative of f(x) = 3x³ - 2x² + 5x - 1?',
        hasLatex: true,
        latexExpression: 'f(x) = 3x^3 - 2x^2 + 5x - 1',
        type: 'mcq' as const,
        options: [
          "f'(x) = 9x² - 4x + 5",
          "f'(x) = 9x² - 4x",
          "f'(x) = 6x² - 4x + 5",
          "f'(x) = 3x² - 2x + 5",
        ],
        correctAnswer: "f'(x) = 9x² - 4x + 5",
        points: 15,
        explanation: 'Using power rule: d/dx(3x³) = 9x², d/dx(-2x²) = -4x, d/dx(5x) = 5, d/dx(-1) = 0',
      },
      {
        id: 'q3',
        question: 'Simplify: (sin²θ + cos²θ) / (1 + tan²θ)',
        hasLatex: true,
        latexExpression: '\\frac{\\sin^2\\theta + \\cos^2\\theta}{1 + \\tan^2\\theta}',
        type: 'mcq' as const,
        options: ['cos²θ', 'sin²θ', '1', 'tan²θ'],
        correctAnswer: 'cos²θ',
        points: 15,
        explanation: 'sin²θ + cos²θ = 1, and 1 + tan²θ = sec²θ = 1/cos²θ. So 1/(1/cos²θ) = cos²θ',
      },
      {
        id: 'q4',
        question: 'What is the value of the definite integral ∫₀¹ x² dx?',
        hasLatex: true,
        latexExpression: '\\int_0^1 x^2 \\, dx',
        type: 'mcq' as const,
        options: ['1/3', '1/2', '1', '2/3'],
        correctAnswer: '1/3',
        points: 15,
        explanation: '∫x² dx = x³/3. Evaluating from 0 to 1: [1³/3 - 0³/3] = 1/3',
      },
      {
        id: 'q5',
        question: 'If matrix A = [[2, 1], [3, 4]], what is the determinant of A?',
        hasLatex: false,
        type: 'numeric' as const,
        correctAnswer: 5,
        points: 10,
        explanation: 'For a 2×2 matrix [[a,b],[c,d]], det(A) = ad - bc = (2×4) - (1×3) = 8 - 3 = 5',
      },
      {
        id: 'q6',
        question: 'Explain in 1-2 sentences how you would teach the Pythagorean theorem to Grade 8 students.',
        hasLatex: false,
        type: 'text' as const,
        correctAnswer: 'teaching explanation', // Will be manually graded
        points: 20,
        explanation: 'Good answers should mention visual aids, right-angled triangles, real-world examples, and the relationship a² + b² = c²',
      },
      {
        id: 'q7',
        question: 'Find the sum of the arithmetic series: 2 + 5 + 8 + 11 + ... (20 terms)',
        hasLatex: false,
        type: 'numeric' as const,
        correctAnswer: 610,
        points: 15,
        explanation: 'First term a=2, common difference d=3, n=20. Sum = n/2 × [2a + (n-1)d] = 10 × [4 + 57] = 610',
      },
    ],
  };

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const totalPoints = test.questions.reduce((sum, q) => sum + q.points, 0);

  // Timer
  useEffect(() => {
    if (hasStarted && !showResults && !isBanned && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            toast.error('⏰ Time\'s up!');
            handleSubmit(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasStarted, showResults, isBanned, timeLeft]);

  const handleBan = () => {
    setIsBanned(true);
    setShowResults(true);
    setScore(0);
    toast.error('❌ YOU HAVE BEEN BANNED FROM THE TEST!');
    
    // Update user status to banned
    if (user) {
      updateUser({
        ...user,
        isBanned: true,
      });
    }

    // Auto-redirect after 5 seconds
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id] && currentQuestion.type !== 'text') {
      toast.error('Please answer the question before proceeding');
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (isBan: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isBan) {
      setScore(0);
      setShowResults(true);
      return;
    }

    // Calculate score (excluding text questions)
    let totalScore = 0;
    test.questions.forEach((q) => {
      if (q.type !== 'text') {
        const userAnswer = answers[q.id];
        if (userAnswer && String(userAnswer).toLowerCase() === String(q.correctAnswer).toLowerCase()) {
          totalScore += q.points;
        }
      } else {
        // Auto-award 15/20 points for text answer if provided (simulating review)
        if (answers[q.id] && answers[q.id].length > 20) {
          totalScore += 15; // Partial credit
        }
      }
    });

    setScore(totalScore);
    setShowResults(true);

    const percentage = (totalScore / totalPoints) * 100;

    if (percentage >= test.passingScore) {
      toast.success(`🎉 Congratulations! You passed with ${percentage.toFixed(0)}%`);
      
      try {
        // If coming from registration, create the teacher account
        if (teacherData && teacherData.formData) {
          const { formData } = teacherData;
          
          // Register teacher with Firebase
          const { user: firebaseUser, profile } = await registerUser(
            formData.email,
            formData.password,
            formData.name,
            'TEACHER'
          );

          // Mark teacher as qualified
          await qualifyTeacher(firebaseUser.uid, percentage);

          // Login the teacher with minimal required fields
          const teacherUser: any = {
            id: firebaseUser.uid,
            email: profile.email,
            name: profile.name,
            role: 'TEACHER' as const,
            avatar: profile.avatar,
            phone: formData.phone,
            createdAt: new Date(),
            isQualified: true,
            // Add minimal teacher fields
            bio: '',
            qualification: '',
            subjects: [],
            rating: 0,
            totalStudents: 0,
            coursesCreated: [],
            earnings: {
              totalRevenue: 0,
              platformCommission: 0,
              netEarnings: 0,
              totalCoursesSold: 0,
              monthlyBreakdown: [],
            },
          };

          login(teacherUser);
          toast.success('Teacher account created successfully! 🎉');
          setTimeout(() => {
            navigate('/teacher/dashboard', { replace: true });
          }, 2000);
        } else if (user) {
          // Existing user taking re-qualification test
          await qualifyTeacher(user.id, percentage);
          
          updateUser({
            ...user,
            isQualified: true,
          });

          setTimeout(() => {
            navigate('/teacher/dashboard', { replace: true });
          }, 2000);
        }
      } catch (error: any) {
        console.error('Qualification error:', error);
        toast.error(error.message || 'Failed to save qualification status');
      }
    } else {
      toast.error(`You scored ${percentage.toFixed(0)}%. Minimum required: ${test.passingScore}%`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Introduction screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h1 className="text-4xl font-bold mb-2">{test.title}</h1>
            <p className="text-gray-600">{test.description}</p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-xl mb-3 text-yellow-900">⚠️ STRICT RULES - READ CAREFULLY</h2>
            <ul className="space-y-2 text-sm text-yellow-900">
              <li className="flex items-start gap-2">
                <span className="font-bold">❌</span>
                <span><strong>ZERO TOLERANCE:</strong> Switching tabs or windows will result in IMMEDIATE TERMINATION and PERMANENT BAN</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">⏰</span>
                <span><strong>TIME LIMIT:</strong> {test.timeLimit} minutes. Test auto-submits when time expires</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">🎯</span>
                <span><strong>PASSING SCORE:</strong> {test.passingScore}% minimum required to become a verified teacher</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">📝</span>
                <span><strong>QUESTIONS:</strong> {totalQuestions} questions covering algebra, calculus, trigonometry, and teaching methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">🚫</span>
                <span><strong>NO RETAKES:</strong> If you fail or get banned, you cannot retake the test for 30 days</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold mb-3">Test Details:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Questions</div>
                <div className="font-bold text-lg">{totalQuestions}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Points</div>
                <div className="font-bold text-lg">{totalPoints}</div>
              </div>
              <div>
                <div className="text-gray-600">Time Limit</div>
                <div className="font-bold text-lg">{test.timeLimit} minutes</div>
              </div>
              <div>
                <div className="text-gray-600">Passing Score</div>
                <div className="font-bold text-lg">{test.passingScore}%</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setHasStarted(true);
                toast.success('Test started! Good luck! 🍀');
              }}
            >
              Start Test
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Banned screen
  if (isBanned) {
    return (
      <div className="min-h-screen bg-accent-red flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center"
        >
          <div className="text-8xl mb-6">🚫</div>
          <h1 className="text-4xl font-bold text-accent-red mb-4">TEST TERMINATED</h1>
          <div className="bg-red-50 border-2 border-accent-red rounded-xl p-6 mb-6">
            <p className="text-lg mb-4">
              <strong>You have been permanently banned from this test due to tab switching violation.</strong>
            </p>
            <p className="text-gray-700">
              Academic integrity is paramount at GanitXcel. Tab switching during the qualification test is strictly prohibited and results in immediate disqualification.
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Your account has been flagged</p>
            <p>• You cannot retake this test for 30 days</p>
            <p>• Violation count: {tabSwitchCount}</p>
            <p>• Redirecting to homepage in 5 seconds...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= test.passingScore;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-8xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                {passed ? '🎉' : '😢'}
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">
                {passed ? 'Congratulations! 🎊' : 'Not Quite There Yet'}
              </h1>
              <p className="text-xl text-gray-600">
                You scored {score} out of {totalPoints} points ({percentage.toFixed(1)}%)
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="#E5E5E5" strokeWidth="12" fill="none" />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={passed ? '#58CC02' : '#FF4B4B'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={552}
                    initial={{ strokeDashoffset: 552 }}
                    animate={{ strokeDashoffset: 552 - (552 * percentage) / 100 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {passed ? (
              <div className="bg-green-50 border-2 border-primary rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-primary mb-3">✅ You're Now a Verified Teacher!</h2>
                <p className="text-gray-700 mb-4">
                  Congratulations on passing the qualification test! You can now create courses, earn money, and help students across India excel in mathematics.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ Create unlimited courses</li>
                  <li>✅ Earn 70% of course revenue</li>
                  <li>✅ Access teacher dashboard</li>
                  <li>✅ Conduct live doubt sessions</li>
                </ul>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-accent-red rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-accent-red mb-3">Minimum Score Not Met</h2>
                <p className="text-gray-700 mb-4">
                  You need {test.passingScore}% to become a verified teacher. You can retake the test after 30 days. Use this time to brush up on your mathematical concepts.
                </p>
                <p className="text-sm text-gray-600">
                  Next attempt available: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
              {passed && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => navigate('/teacher/dashboard')}
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Test in progress
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Teacher Qualification Test</h1>
            <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-accent-red animate-pulse' : 'text-gray-700'}`}>
              ⏰ {formatTime(timeLeft)}
            </div>
          </div>
          <ProgressBar progress={progress} showPercentage color="primary" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{totalPoints} total points</span>
          </div>
        </div>
      </div>

      {/* Violation Warning */}
      {isViolated && (
        <div className="bg-accent-red text-white py-3 px-4 text-center font-semibold animate-pulse">
          🚨 CRITICAL WARNING: Tab switch detected! You will be banned immediately on next violation!
        </div>
      )}

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold flex-1">
                  {currentQuestion.question}
                </h2>
                <span className="bg-primary text-white px-4 py-2 rounded-full font-bold">
                  {currentQuestion.points} pts
                </span>
              </div>

              {/* LaTeX Expression */}
              {currentQuestion.hasLatex && currentQuestion.latexExpression && (
                <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
                  <BlockMath math={currentQuestion.latexExpression} />
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              {currentQuestion.type === 'mcq' && currentQuestion.options ? (
                currentQuestion.options.map((option, index) => (
                  <motion.label
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-5 h-5 text-primary mr-4"
                    />
                    <span className="text-lg font-medium">{option}</span>
                  </motion.label>
                ))
              ) : currentQuestion.type === 'numeric' ? (
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Answer:</label>
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your numerical answer"
                    className="input-field text-lg"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Answer (Minimum 20 characters):</label>
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Explain your teaching approach..."
                    className="input-field text-base min-h-32"
                    rows={5}
                  />
                  <div className="text-sm text-gray-600 mt-2">
                    {answers[currentQuestion.id]?.length || 0} characters
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>
              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => handleSubmit(false)}
                >
                  Submit Test
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherTestPage;
