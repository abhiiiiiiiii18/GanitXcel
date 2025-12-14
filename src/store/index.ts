import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Student, Teacher, UIState } from '../types';

interface AuthState {
  user: User | Student | Teacher | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User | Student | Teacher) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface UIStore extends UIState {
  setSadMode: (isSad: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSadMode: false,
      theme: 'light',
      sidebarOpen: true,
      setSadMode: (isSad) => set({ isSadMode: isSad }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

interface StreakState {
  currentStreak: number;
  lastActiveDate: Date | null;
  checkAndUpdateStreak: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      lastActiveDate: null,
      checkAndUpdateStreak: () => {
        const { lastActiveDate, currentStreak } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!lastActiveDate) {
          set({ currentStreak: 1, lastActiveDate: today });
          return;
        }

        const lastDate = new Date(lastActiveDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          // Consecutive day
          set({ currentStreak: currentStreak + 1, lastActiveDate: today });
        } else if (diffDays > 1) {
          // Streak broken
          set({ currentStreak: 1, lastActiveDate: today });
          useUIStore.getState().setSadMode(true);
        }
        // Same day, no change
      },
      incrementStreak: () =>
        set((state) => ({ currentStreak: state.currentStreak + 1 })),
      resetStreak: () => set({ currentStreak: 0, lastActiveDate: null }),
    }),
    {
      name: 'streak-storage',
    }
  )
);

interface CourseState {
  currentCourse: string | null;
  currentLesson: string | null;
  setCurrentCourse: (courseId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  clearCourse: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentCourse: null,
  currentLesson: null,
  setCurrentCourse: (courseId) => set({ currentCourse: courseId }),
  setCurrentLesson: (lessonId) => set({ currentLesson: lessonId }),
  clearCourse: () => set({ currentCourse: null, currentLesson: null }),
}));

interface QuizState {
  isQuizActive: boolean;
  tabSwitchCount: number;
  startTime: Date | null;
  startQuiz: () => void;
  endQuiz: () => void;
  incrementTabSwitch: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  isQuizActive: false,
  tabSwitchCount: 0,
  startTime: null,
  startQuiz: () => set({ isQuizActive: true, startTime: new Date(), tabSwitchCount: 0 }),
  endQuiz: () => set({ isQuizActive: false }),
  incrementTabSwitch: () =>
    set((state) => ({ tabSwitchCount: state.tabSwitchCount + 1 })),
  resetQuiz: () =>
    set({ isQuizActive: false, tabSwitchCount: 0, startTime: null }),
}));
