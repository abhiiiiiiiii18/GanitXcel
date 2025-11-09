import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { recommendationsAPI } from '../services/api';
import { CourseCard } from './Card';
import toast from 'react-hot-toast';

interface TrendingCoursesProps {
  onCourseClick: (courseId: string) => void;
  limit?: number;
}

export const TrendingCourses: React.FC<TrendingCoursesProps> = ({ 
  onCourseClick,
  limit = 6 
}) => {
  const [trending, setTrending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      setIsLoading(true);
      const response = await recommendationsAPI.getTrending(limit);
      
      if (response.status === 'success') {
        setTrending(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch trending courses:', err);
      toast.error('Could not load trending courses');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔥</span>
        <div>
          <h2 className="text-2xl font-display font-bold">Trending This Month</h2>
          <p className="text-sm text-gray-600">Most popular courses in your grade</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard
              {...course}
              onClick={() => onCourseClick(course.id)}
              badge={course.recommendationReason}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCourses;
