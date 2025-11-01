import { PLATFORM_CONFIG } from '../config/constants';
import { LeaderboardEntry, QuizAttempt, StudentStats } from '../types';

/**
 * Format currency in INR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate platform commission
 */
export const calculateCommission = (amount: number): {
  gross: number;
  commission: number;
  net: number;
} => {
  const commission = amount * PLATFORM_CONFIG.commissionRate;
  return {
    gross: amount,
    commission,
    net: amount - commission,
  };
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format time (hours and minutes only)
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return formatDate(d);
};

/**
 * Calculate streak status
 */
export const getStreakStatus = (lastActiveDate: Date | null): {
  isActive: boolean;
  isBroken: boolean;
  daysAgo: number;
} => {
  if (!lastActiveDate) {
    return { isActive: false, isBroken: false, daysAgo: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastActiveDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return {
    isActive: diffDays <= 1,
    isBroken: diffDays > 1,
    daysAgo: diffDays,
  };
};

/**
 * Calculate quiz percentage
 */
export const calculateQuizPercentage = (score: number, total: number): number => {
  return Math.round((score / total) * 100);
};

/**
 * Determine pass/fail status
 */
export const isQuizPassed = (percentage: number, passingScore: number): boolean => {
  return percentage >= passingScore;
};

/**
 * Calculate weighted leaderboard score
 */
export const calculateLeaderboardScore = (
  quizScore: number,
  examScore: number,
  engagementPoints: number
): number => {
  // Weighted formula: 40% quizzes, 50% final exam, 10% engagement
  return (quizScore * 0.4) + (examScore * 0.5) + (engagementPoints * 0.1);
};

/**
 * Extract YouTube video ID from URL
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Generate random avatar URL
 */
export const generateAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
};

/**
 * Generate referral code
 */
export const generateReferralCode = (userId: string): string => {
  return `GNX${userId.substring(0, 6).toUpperCase()}`;
};

/**
 * Calculate course completion percentage
 */
export const calculateCourseProgress = (
  completedLessons: number,
  totalLessons: number
): number => {
  return Math.round((completedLessons / totalLessons) * 100);
};

/**
 * Get rating stars
 */
export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return '⭐'.repeat(fullStars) + (hasHalfStar ? '✨' : '');
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate certificate ID
 */
export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Check if time is within deadline for doubt submission
 */
export const isWithinDoubtDeadline = (classTime: Date): boolean => {
  const now = new Date();
  const deadline = new Date(classTime);
  deadline.setHours(deadline.getHours() - PLATFORM_CONFIG.doubtSubmissionDeadline);
  return now < deadline;
};

/**
 * Shuffle array (for quiz questions)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get badge based on points
 */
export const getPointsBadge = (points: number): {
  name: string;
  color: string;
  icon: string;
} => {
  if (points >= 10000) return { name: 'Math Legend', color: 'purple', icon: '👑' };
  if (points >= 5000) return { name: 'Math Master', color: 'gold', icon: '🏆' };
  if (points >= 2000) return { name: 'Math Expert', color: 'blue', icon: '🎖️' };
  if (points >= 1000) return { name: 'Math Pro', color: 'green', icon: '⭐' };
  if (points >= 500) return { name: 'Math Student', color: 'orange', icon: '📚' };
  return { name: 'Math Beginner', color: 'gray', icon: '🌱' };
};

/**
 * Calculate average
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

/**
 * Group array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Local storage helpers
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
};
