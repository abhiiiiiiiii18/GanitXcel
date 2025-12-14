import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CourseCard } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store';

const BrowseCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock courses data (in production, fetch from Firestore)
  const allCourses = [
    {
      id: '1',
      title: 'Complete Algebra for Grade 10',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80',
      teacher: 'Rajesh Kumar',
      price: 599,
      rating: 4.8,
      totalStudents: 2456,
      duration: 45,
      grade: 10,
      subject: 'Algebra',
    },
    {
      id: '2',
      title: 'Geometry Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&h=300&fit=crop&q=80',
      teacher: 'Priya Sharma',
      price: 699,
      rating: 4.9,
      totalStudents: 1834,
      duration: 38,
      grade: 10,
      subject: 'Geometry',
    },
    {
      id: '3',
      title: 'Calculus Made Easy',
      thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop&q=80',
      teacher: 'Amit Patel',
      price: 799,
      rating: 4.7,
      totalStudents: 1567,
      duration: 52,
      grade: 11,
      subject: 'Calculus',
    },
    {
      id: '4',
      title: 'Trigonometry Essentials - Grade 10',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop&q=80',
      teacher: 'Sneha Reddy',
      price: 499,
      rating: 4.6,
      totalStudents: 1234,
      duration: 32,
      grade: 10,
      subject: 'Trigonometry',
    },
    {
      id: '5',
      title: 'Advanced Algebra - Grade 11',
      thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop&q=80',
      teacher: 'Rajesh Kumar',
      price: 699,
      rating: 4.9,
      totalStudents: 987,
      duration: 48,
      grade: 11,
      subject: 'Algebra',
    },
    {
      id: '6',
      title: 'Coordinate Geometry - Grade 11',
      thumbnail: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=300&fit=crop&q=80',
      teacher: 'Priya Sharma',
      price: 599,
      rating: 4.7,
      totalStudents: 876,
      duration: 40,
      grade: 11,
      subject: 'Geometry',
    },
    {
      id: '7',
      title: 'Probability & Statistics - Grade 12',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80',
      teacher: 'Amit Patel',
      price: 799,
      rating: 4.8,
      totalStudents: 1456,
      duration: 50,
      grade: 12,
      subject: 'Statistics',
    },
    {
      id: '8',
      title: 'Vectors & 3D Geometry - Grade 12',
      thumbnail: 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=400&h=300&fit=crop&q=80',
      teacher: 'Sneha Reddy',
      price: 699,
      rating: 4.9,
      totalStudents: 765,
      duration: 45,
      grade: 12,
      subject: 'Geometry',
    },
  ];

  // Filter courses based on selected grade and subject
  const filteredCourses = allCourses.filter(course => {
    const gradeMatch = selectedGrade === 'all' || course.grade === selectedGrade;
    const subjectMatch = selectedSubject === 'all' || course.subject === selectedSubject;
    return gradeMatch && subjectMatch;
  });

  // Get unique subjects
  const subjects = ['all', ...Array.from(new Set(allCourses.map(c => c.subject)))];
  const grades: Array<'all' | number> = ['all', 10, 11, 12];

  const handleViewCourseContent = (course: any) => {
    // Navigate to course detail page
    navigate(`/course/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/student/dashboard')}>
              <span className="text-3xl">📐</span>
              <span className="text-2xl font-display font-bold text-gradient">GanitXcel</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/dashboard')}
                icon="🏠"
              >
                Home
              </Button>
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer"
                onClick={() => navigate('/student/dashboard')}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-4">📚 Browse All Courses</h1>
          <p className="text-gray-600 text-lg">
            Explore our comprehensive catalog of courses designed for grades 10-12
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Filter by Grade
              </label>
              <div className="flex flex-wrap gap-3">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      selectedGrade === grade
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Filter by Subject
              </label>
              <div className="flex flex-wrap gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      selectedSubject === subject
                        ? 'bg-secondary text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {subject === 'all' ? 'All Subjects' : subject}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Showing <span className="font-bold text-primary">{filteredCourses.length}</span> course
              {filteredCourses.length !== 1 ? 's' : ''}
              {selectedGrade !== 'all' && ` for Grade ${selectedGrade}`}
              {selectedSubject !== 'all' && ` in ${selectedSubject}`}
            </p>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard
                  {...course}
                  onClick={() => navigate(`/course/${course.id}`)}
                  onViewContent={() => handleViewCourseContent(course)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more courses
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedGrade('all');
                setSelectedSubject('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
};

export default BrowseCourses;
