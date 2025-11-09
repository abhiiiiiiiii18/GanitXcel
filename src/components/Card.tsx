import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const CardComponent = onClick ? motion.div : 'div';

  return (
    <CardComponent
      className={`card ${paddingClasses[padding]} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      {...(hover && onClick
        ? {
            whileHover: { scale: 1.02, y: -2 },
            whileTap: { scale: 0.98 },
          }
        : {})}
    >
      {children}
    </CardComponent>
  );
};

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  teacher: string;
  price: number;
  rating: number;
  totalStudents: number;
  duration: number;
  onClick: () => void;
  onViewContent?: () => void;
  badge?: string; // Recommendation reason or special badge
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  thumbnail,
  teacher,
  price,
  rating,
  totalStudents,
  duration,
  onClick,
  onViewContent,
  badge,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
      whileHover={{ y: -4 }}
    >
      <div 
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={onClick}
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-accent-yellow text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          ₹{price}
        </div>
        {badge && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 cursor-pointer" onClick={onClick}>
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">by {teacher}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-accent-yellow">⭐</span>
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span>{totalStudents.toLocaleString()} students</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>📚 {duration} lessons</span>
          {onViewContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewContent();
              }}
              className="text-primary hover:text-primary-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>📋</span>
              View Content
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
