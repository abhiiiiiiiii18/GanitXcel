import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useTabSwitchDetection } from '../hooks/useTabSwitchDetection';
import { useQuizStore, useAuthStore } from '../store';
import { getQuizByLessonId, submitQuiz } from '../services/firebase';
import toast from 'react-hot-toast';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface QuizQuestion {
  id: string;
  question: string;
  hasLatex?: boolean;
  type: 'mcq' | 'numeric';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty?: string;
}

interface Quiz {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  passingScore: number;
  timeLimit: number;
  questions: QuizQuestion[];
}

const QuizPage: React.FC = () => {
  const { id } = useParams(); // lessonId
  const navigate = useNavigate();
  const { startQuiz, endQuiz, resetQuiz, isQuizActive } = useQuizStore();
  const { user } = useAuthStore();
  
  // Get courseId from URL search params or localStorage
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId') || localStorage.getItem('lastCourseId') || '1';
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showAITutor, setShowAITutor] = useState(false);
  const [aiExplanation, setAIExplanation] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tab switch detection - MUST be called before any conditional returns
  const { isViolated } = useTabSwitchDetection({
    isActive: isQuizActive && !showResults && !loading,
    onTabSwitch: () => {
      toast.error('⚠️ Tab switching detected! This will count as a violation.');
    },
    onViolation: () => {
      toast.error('❌ QUIZ TERMINATED: Too many tab switches!');
      if (quiz) {
        handleSubmit(true);
      }
    },
  });

  // Load quiz from Firestore
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) {
        console.log('No lesson ID provided');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Loading quiz for lesson:', id);
        const quizData = await getQuizByLessonId(id);
        console.log('Quiz data received:', quizData);
        
        if (quizData) {
          const loadedQuiz = quizData as Quiz;
          setQuiz(loadedQuiz);
          setTimeLeft(loadedQuiz.timeLimit * 60); // Convert minutes to seconds
          console.log('Quiz loaded successfully:', loadedQuiz.title);
        } else {
          console.log('No quiz found for lesson:', id);
          toast.error(`No quiz available for this lesson yet`);
          setTimeout(() => navigate(`/course/${courseId}`), 2000);
        }
      } catch (error: any) {
        console.error('Failed to load quiz:', error);
        toast.error(error.message || 'Failed to load quiz');
        setTimeout(() => navigate(`/course/${courseId}`), 2000);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [id, courseId, navigate]);

  // Start quiz when component mounts
  useEffect(() => {
    if (quiz && !showResults) {
      startQuiz();
    }
    return () => {
      endQuiz();
    };
  }, [quiz, showResults, startQuiz, endQuiz]);

  // Timer
  useEffect(() => {
    if (isQuizActive && !showResults && timeLeft > 0 && quiz) {
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
  }, [isQuizActive, showResults, timeLeft, quiz]);

  const handleAnswerChange = (answer: string) => {
    if (!quiz) return;
    setAnswers({
      ...answers,
      [quiz.questions[currentQuestionIndex].id]: answer,
    });
  };

  const handleNext = () => {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    if (!answers[currentQuestion.id]) {
      toast.error('Please select an answer before proceeding');
      return;
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
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

  const handleSubmit = async (isViolation: boolean) => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);
    endQuiz();

    if (isViolation) {
      setScore(0);
      setTotalPoints(quiz.questions.reduce((sum, q) => sum + q.points, 0));
      setShowResults(true);
      return;
    }

    try {
      // Submit quiz to Firestore and calculate score
      const result = await submitQuiz(
        quiz.id,
        quiz.lessonId,
        user?.id || '',
        answers,
        quiz.questions
      );

      setScore(result.score);
      setTotalPoints(result.totalPoints);
      setShowResults(true);

      if (result.passed) {
        toast.success(`🎉 Congratulations! You scored ${result.percentage.toFixed(0)}%`);
      } else {
        toast.error(`You scored ${result.percentage.toFixed(0)}%. Keep practicing!`);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getAIExplanation = (question: QuizQuestion) => {
    setShowAITutor(true);
    setAIExplanation('Loading AI explanation...');

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse = `
### Step-by-Step Solution:

**Question:** ${question.question}

**Step 1:** Identify what the question is asking
${question.explanation}

**Step 2:** Apply the concept
${question.type === 'mcq' ? 'Looking at the options, we can see that ' + question.correctAnswer + ' is the correct answer because:' : 'The numerical answer is ' + question.correctAnswer + ' because:'}

**Step 3:** Verify the answer
Let's double-check by substituting back into the original expression.

**Common Mistakes to Avoid:**
- Don't forget to combine like terms
- Watch out for sign errors
- Always show your work step by step

**Practice Tips:**
- Try solving similar problems
- Review the relevant chapter
- Ask for help if you're still confused
      `;
      setAIExplanation(aiResponse);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderLatex = (text: string) => {
    const isBlock = text.includes('\\n') || text.length > 50;
    if (isBlock) {
      return <BlockMath math={text} />;
    }
    return <InlineMath math={text} />;
  };

  // Loading state
  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quiz...</p>
              <p className="text-sm text-gray-500 mt-2">Lesson ID: {id}</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600">Quiz not found</p>
              <p className="text-sm text-gray-500 mt-2">Check console for details</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (showResults) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Results Header */}
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
                {passed ? 'Great Job!' : 'Keep Practicing!'}
              </h1>
              <p className="text-xl text-gray-600">
                You scored {score} out of {totalPoints} points
              </p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#E5E5E5"
                    strokeWidth="12"
                    fill="none"
                  />
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

            {/* Question Review */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Review Answers</h2>
              <div className="space-y-4">
                {quiz.questions.map((q, index) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = String(userAnswer).toLowerCase() === String(q.correctAnswer).toLowerCase();

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border-2 ${
                        isCorrect ? 'border-primary bg-primary-50' : 'border-accent-red bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold">Q{index + 1}: {q.question}</span>
                        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Your answer:</strong> {userAnswer || 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-accent-red">
                            <strong>Correct answer:</strong> {String(q.correctAnswer)}
                          </p>
                        )}
                      </div>

                      {!isCorrect && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          icon="🤖"
                          onClick={() => getAIExplanation(q)}
                        >
                          Get AI Explanation
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant={passed ? "primary" : "outline"}
                className="flex-1"
                onClick={() => navigate(`/course/${courseId}`)}
              >
                {passed ? '🎉 Continue to Next Lesson' : '📚 Back to Course'}
              </Button>
              <Button
                variant={passed ? "outline" : "primary"}
                className="flex-1"
                onClick={() => {
                  resetQuiz();
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                  setShowResults(false);
                  setScore(0);
                  setTimeLeft(600);
                  setIsSubmitting(false);
                  startQuiz();
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </motion.div>

          {/* AI Tutor Modal */}
          {showAITutor && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAITutor(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>🤖</span>
                    AI Step-by-Step Solution
                  </h2>
                  <button
                    onClick={() => setShowAITutor(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {aiExplanation}
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-accent-red animate-pulse' : 'text-gray-700'}`}>
              ⏰ {formatTime(timeLeft)}
            </div>
          </div>
          <ProgressBar progress={progress} showPercentage color="primary" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{quiz.questions.reduce((sum, q) => sum + q.points, 0)} total points</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {isViolated && (
        <div className="bg-accent-red text-white py-3 px-4 text-center font-semibold">
          ⚠️ WARNING: Tab switching detected. Quiz will be terminated on next violation!
        </div>
      )}

      {/* Quiz Content */}
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

              {/* Render LaTeX if needed */}
              {currentQuestion.hasLatex && currentQuestion.options && (
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="text-lg my-2">
                      {renderLatex(option)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Options */}
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
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Answer:</label>
                  <input
                    type="number"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter your answer"
                    className="input-field text-lg"
                  />
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
                  Submit Quiz
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

export default QuizPage;
