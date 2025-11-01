import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  duration?: number;
  completed?: boolean;
  locked?: boolean;
}

interface CourseContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  lessons: Lesson[];
}

export const CourseContentModal: React.FC<CourseContentModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  lessons,
}) => {
  const navigate = useNavigate();

  const handleLessonClick = (lessonId: string, locked: boolean) => {
    if (locked) {
      return;
    }
    navigate(`/lesson/${courseId}/${lessonId}`);
    onClose();
  };

  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercent = (completedCount / lessons.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">📚 {courseTitle}</h2>
                    <p className="text-sm opacity-90">
                      {completedCount} of {lessons.length} lessons completed
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="bg-white h-full rounded-full"
                  />
                </div>
              </div>

              {/* Lessons List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleLessonClick(lesson.id, lesson.locked || false)}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${lesson.locked 
                          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
                          : lesson.completed
                          ? 'bg-green-50 border-green-200 hover:border-green-400'
                          : 'bg-white border-gray-200 hover:border-primary hover:shadow-md'
                        }
                      `}
                    >
                      {/* Lesson Number/Status */}
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                        ${lesson.locked
                          ? 'bg-gray-200 text-gray-400'
                          : lesson.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-primary text-white'
                        }
                      `}>
                        {lesson.locked ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : lesson.completed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold ${lesson.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                          {lesson.title}
                        </h3>
                        {lesson.duration && (
                          <p className="text-sm text-gray-500 mt-1">
                            ⏱️ {lesson.duration} minutes
                          </p>
                        )}
                      </div>

                      {/* Play/Lock Icon */}
                      <div className="flex-shrink-0">
                        {lesson.locked ? (
                          <span className="text-gray-400 text-sm">🔒 Locked</span>
                        ) : lesson.completed ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{completedCount}</span> /{' '}
                  <span>{lessons.length}</span> completed
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
