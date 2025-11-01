// OpenAI Configuration for AI Chatbot
export const OPENAI_CONFIG = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
};

// Razorpay Configuration (Dummy for Hackathon)
export const RAZORPAY_CONFIG = {
  keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy',
  keySecret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || 'dummy_secret',
  isDummy: true, // Set to false for production
};

// Platform Configuration
export const PLATFORM_CONFIG = {
  name: 'GanitXcel',
  tagline: 'Master Mathematics, Grades 8-12',
  currency: 'INR',
  commissionRate: 0.30, // 30% platform commission
  minPrice: 499,
  maxPrice: 999,
  
  // Gamification
  pointsPerQuizQuestion: 10,
  pointsPerLiveClass: 5,
  pointsPerDailyLogin: 1,
  
  // Scholarships
  scholarships: {
    rank1: 1000,
    rank2: 750,
    rank3: 500,
  },
  
  // Live Class
  doubtSubmissionDeadline: 2, // hours before class
  liveClassFrequency: 'weekly',
  
  // Quiz
  tabSwitchPenalty: 'elimination',
  
  // Support
  supportEmail: 'support@ganitxcel.com',
  discordInvite: 'https://discord.gg/ganitxcel',
};

// YouTube Player Configuration
export const YOUTUBE_CONFIG = {
  playerVars: {
    autoplay: 0,
    controls: 1,
    disablekb: 1, // Disable keyboard controls
    fs: 0, // Disable fullscreen
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
  },
  // These will be enforced via API
  restrictSeek: true,
  restrictSpeed: true,
};

// Email Configuration
export const EMAIL_CONFIG = {
  service: 'gmail',
  from: 'noreply@ganitxcel.com',
  templates: {
    liveClassReminder: 'live-class-reminder',
    welcome: 'welcome',
    certificate: 'certificate',
    teacherAlert: 'teacher-alert',
  },
};

// Tab Switch Detection
export const TAB_SWITCH_CONFIG = {
  maxAllowed: 0, // Zero tolerance
  checkInterval: 1000, // Check every second
  warningThreshold: 1,
};

// Grades
export const GRADES = [8, 9, 10, 11, 12];

// Subjects
export const SUBJECTS = [
  'Algebra',
  'Geometry',
  'Trigonometry',
  'Calculus',
  'Statistics',
  'Probability',
  'Number Theory',
  'Coordinate Geometry',
  'Mensuration',
];

// Routes
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  studentDashboard: '/student/dashboard',
  teacherDashboard: '/teacher/dashboard',
  course: '/course/:id',
  lesson: '/course/:courseId/lesson/:lessonId',
  quiz: '/quiz/:id',
  liveClass: '/live-class/:id',
  certificate: '/certificate/:id',
  teacherTest: '/teacher/qualification-test',
  profile: '/profile',
  leaderboard: '/leaderboard/:courseId',
};
