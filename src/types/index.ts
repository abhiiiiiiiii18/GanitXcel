// User Types
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  grade?: number; // For students (8-12)
  createdAt: Date;
  isQualified?: boolean; // For teachers
  isBanned?: boolean;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  enrolledCourses: string[]; // Course IDs
  friends: string[]; // User IDs
  stats: StudentStats;
  isAmbassador: boolean;
  referralCode: string;
  referredBy?: string;
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  bio: string;
  qualification: string;
  subjects: string[];
  rating: number;
  totalStudents: number;
  coursesCreated: string[]; // Course IDs
  earnings: TeacherEarnings;
}

// Stats Types
export interface StudentStats {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  totalPoints: number;
  totalActiveTime: number; // in minutes
  coursesCompleted: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface TeacherEarnings {
  totalRevenue: number;
  platformCommission: number; // 30%
  netEarnings: number;
  totalCoursesSold: number;
  monthlyBreakdown: MonthlyEarning[];
}

export interface MonthlyEarning {
  month: string;
  year: number;
  sales: number;
  revenue: number;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  teacher: Teacher;
  price: number; // in INR
  grade: number[];
  subject: string;
  syllabus: Lesson[];
  totalDuration: number; // in minutes
  rating: number;
  totalStudents: number;
  monthlyEnrollments: number;
  toppers: Topper[];
  discordLink?: string;
  finalExam: Quiz;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  duration: number; // in minutes
  order: number;
  notes: string; // Markdown or HTML
  quiz: Quiz;
  isCompleted?: boolean; // Student-specific
}

export interface Topper {
  studentId: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
}

// Quiz Types
export interface Quiz {
  id: string;
  lessonId?: string;
  courseId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts?: number; // Student-specific
  bestScore?: number; // Student-specific
}

export interface Question {
  id: string;
  question: string; // LaTeX supported
  type: 'mcq' | 'numeric' | 'subjective';
  options?: string[]; // For MCQ
  correctAnswer: string | number;
  explanation: string; // LaTeX supported
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  courseId: string;
  answers: StudentAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  startedAt: Date;
  submittedAt: Date;
  duration: number; // in seconds
  wasTabSwitched: boolean;
  tabSwitchCount: number;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
  timeTaken: number; // in seconds
}

// Live Class Types
export interface LiveClass {
  id: string;
  courseId: string;
  teacherId: string;
  title: string;
  scheduledAt: Date;
  duration: number; // in minutes
  meetingLink: string;
  doubts: Doubt[];
  attendance: string[]; // Student IDs
  isCompleted: boolean;
}

export interface Doubt {
  id: string;
  studentId: string;
  studentName: string;
  question: string;
  attachments?: string[];
  submittedAt: Date;
  isResolved: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Payment Types
export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'success' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'live_class' | 'feedback' | 'achievement' | 'payment' | 'general';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

// Feedback Types
export interface Feedback {
  id: string;
  courseId: string;
  studentId: string;
  teacherId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

// Certificate Types
export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  completionDate: Date;
  finalScore: number;
  rank?: number;
  certificateUrl: string;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  progress: CourseProgress;
  isCertified: boolean;
}

export interface CourseProgress {
  completedLessons: string[]; // Lesson IDs
  completedQuizzes: string[]; // Quiz IDs
  totalPoints: number;
  percentageComplete: number;
  lastAccessedAt: Date;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  points: number;
  quizScore: number;
  examScore: number;
  engagementScore: number;
  totalScore: number;
}

// Teacher Test Types
export interface TeacherTest {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit: number; // in minutes
}

export interface TeacherTestAttempt {
  id: string;
  teacherId: string;
  score: number;
  passed: boolean;
  wasTabSwitched: boolean;
  tabSwitchCount: number;
  attemptedAt: Date;
}

// Referral Types
export interface Referral {
  id: string;
  referrerId: string; // Student or Ambassador
  refereeId: string;
  courseId?: string;
  rewardAmount: number;
  status: 'pending' | 'completed';
  createdAt: Date;
}

// Discord Integration
export interface DiscordCommunity {
  courseId: string;
  inviteLink: string;
  moderatorId: string; // Student Ambassador
  memberCount: number;
}

// Analytics Types
export interface CourseAnalytics {
  courseId: string;
  averageQuizScore: number;
  completionRate: number;
  averageTimeSpent: number;
  commonMistakes: CommonMistake[];
  studentEngagement: EngagementMetric[];
}

export interface CommonMistake {
  questionId: string;
  question: string;
  incorrectCount: number;
  percentage: number;
}

export interface EngagementMetric {
  date: Date;
  activeStudents: number;
  quizzesTaken: number;
  averageTimeSpent: number;
}

// UI State Types
export interface UIState {
  isSadMode: boolean; // Broken streak mode
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

// Chat Types (AI Doubt Bot)
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  lessonContext?: string;
}

export interface ChatSession {
  id: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
