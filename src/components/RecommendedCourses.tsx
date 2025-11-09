import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationsAPI } from '../services/api';
import { CourseCard } from './Card';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface RecommendedCoursesProps {
  onCourseClick: (courseId: string) => void;
  limit?: number;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({ 
  onCourseClick,
  limit = 6 
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await recommendationsAPI.getPersonalized(limit);
      
      if (response.status === 'success') {
        setRecommendations(response.data);
        setWeakTopics(response.metadata?.weakTopics || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
      toast.error('Could not load personalized recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">😞</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchRecommendations} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-2xl font-bold mb-2">No recommendations yet</h3>
        <p className="text-gray-600 mb-6">
          Take some quizzes to help us understand your learning needs better!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with insights */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <span>✨</span>
            Recommended For You
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on your learning patterns and performance
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchRecommendations}
          icon="🔄"
        >
          Refresh
        </Button>
      </div>

      {/* Weak topics insight */}
      {weakTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 mb-1">
                Areas for Improvement
              </h4>
              <p className="text-sm text-orange-800">
                We noticed you could improve in:{' '}
                <strong>
                  {weakTopics.map(t => t.topic).join(', ')}
                </strong>
                . Here are some courses to help!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {recommendations.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Recommendation badge */}
              <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <span>⭐</span>
                <span className="font-semibold">
                  {Math.round(course.recommendationScore)}% Match
                </span>
              </div>

              <CourseCard
                {...course}
                onClick={() => onCourseClick(course.id)}
                badge={course.recommendationReason}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AI insight footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <span className="text-xl">🤖</span>
          <p>
            <strong>AI-Powered:</strong> These recommendations use machine learning 
            to analyze your quiz performance, course history, and learning patterns 
            from thousands of students.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendedCourses;
