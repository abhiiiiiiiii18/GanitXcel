import { useEffect, useCallback } from 'react';
import { useQuizStore } from '../store';
import { TAB_SWITCH_CONFIG } from '../config/constants';

interface UseTabSwitchDetectionProps {
  isActive: boolean;
  onTabSwitch?: () => void;
  onViolation?: () => void;
}

/**
 * Hook to detect tab switching during quizzes/exams
 * Triggers penalties when user switches tabs or windows
 */
export const useTabSwitchDetection = ({
  isActive,
  onTabSwitch,
  onViolation,
}: UseTabSwitchDetectionProps) => {
  const { incrementTabSwitch, tabSwitchCount } = useQuizStore();

  const handleVisibilityChange = useCallback(() => {
    if (!isActive) return;

    if (document.hidden) {
      // User switched away from tab
      incrementTabSwitch();
      onTabSwitch?.();

      // Check if exceeded allowed switches
      if (tabSwitchCount + 1 > TAB_SWITCH_CONFIG.maxAllowed) {
        onViolation?.();
      }
    }
  }, [isActive, incrementTabSwitch, tabSwitchCount, onTabSwitch, onViolation]);

  const handleBlur = useCallback(() => {
    if (!isActive) return;

    // Window lost focus
    incrementTabSwitch();
    onTabSwitch?.();

    if (tabSwitchCount + 1 > TAB_SWITCH_CONFIG.maxAllowed) {
      onViolation?.();
    }
  }, [isActive, incrementTabSwitch, tabSwitchCount, onTabSwitch, onViolation]);

  useEffect(() => {
    if (!isActive) return;

    // Listen for visibility change (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for window blur (switching to another window)
    window.addEventListener('blur', handleBlur);

    // Prevent right-click during quiz
    const preventContextMenu = (e: MouseEvent) => {
      if (isActive) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', preventContextMenu);

    // Prevent common keyboard shortcuts
    const preventShortcuts = (e: KeyboardEvent) => {
      if (!isActive) return;

      // Prevent F12, Ctrl+Shift+I, Ctrl+U (dev tools)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }

      // Prevent Ctrl+Tab (tab switching)
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault();
      }

      // Prevent Alt+Tab detection (not fully preventable, but we can detect)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', preventShortcuts);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventShortcuts);
    };
  }, [isActive, handleVisibilityChange, handleBlur]);

  return {
    tabSwitchCount,
    isViolated: tabSwitchCount > TAB_SWITCH_CONFIG.maxAllowed,
  };
};
