import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Personalized Course Recommendations Engine
 * Factors considered:
 * 1. User's grade level
 * 2. Completed courses and performance
 * 3. Weak topics from quiz attempts
 * 4. Similar users' preferences (collaborative filtering)
 * 5. Popular courses in user's grade
 * 6. Course ratings and engagement
 */

// Get personalized recommendations
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 10 } = req.query;

    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    const userGrade = userData.grade || 10;
    const enrolledCourses = userData.enrolledCourses || [];
    const completedCourses = userData.stats?.coursesCompleted || 0;

    // 1. Get user's quiz performance to identify weak topics
    const weakTopics = await identifyWeakTopics(userId);

    // 2. Get similar users (collaborative filtering)
    const similarUsers = await findSimilarUsers(userId, userGrade, enrolledCourses);

    // 3. Get all available courses
    const coursesSnapshot = await db.collection('courses')
      .where('isPublished', '==', true)
      .where('grade', 'array-contains', userGrade)
      .get();

    let allCourses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter out already enrolled courses
    allCourses = allCourses.filter(course => !enrolledCourses.includes(course.id));

    // 4. Calculate recommendation scores
    const recommendations = await Promise.all(
      allCourses.map(async (course) => {
        const score = await calculateRecommendationScore(
          course,
          userData,
          weakTopics,
          similarUsers
        );
        return { ...course, recommendationScore: score };
      })
    );

    // 5. Sort by score and apply limit
    const topRecommendations = recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, parseInt(limit))
      .map(course => ({
        ...course,
        recommendationReason: generateRecommendationReason(course, userData, weakTopics)
      }));

    res.json({
      status: 'success',
      count: topRecommendations.length,
      data: topRecommendations,
      metadata: {
        weakTopics,
        userGrade,
        completedCourses
      }
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get recommendations for specific weak topic
router.get('/topic/:topic', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { topic } = req.params;
    const { limit = 5 } = req.query;

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const userGrade = userData.grade || 10;
    const enrolledCourses = userData.enrolledCourses || [];

    // Find courses that cover this topic
    const coursesSnapshot = await db.collection('courses')
      .where('isPublished', '==', true)
      .where('grade', 'array-contains', userGrade)
      .where('subject', '==', topic)
      .get();

    let courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      recommendationReason: `Recommended to improve your ${topic} skills`
    }));

    // Filter out enrolled courses
    courses = courses.filter(course => !enrolledCourses.includes(course.id));

    // Sort by rating and popularity
    courses.sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.7 + (a.totalStudents || 0) * 0.3;
      const scoreB = (b.rating || 0) * 0.7 + (b.totalStudents || 0) * 0.3;
      return scoreB - scoreA;
    });

    res.json({
      status: 'success',
      count: courses.length,
      data: courses.slice(0, parseInt(limit))
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get trending courses for user's grade
router.get('/trending', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 6 } = req.query;

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const userGrade = userData.grade || 10;

    // Get courses with recent high enrollment
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const coursesSnapshot = await db.collection('courses')
      .where('isPublished', '==', true)
      .where('grade', 'array-contains', userGrade)
      .orderBy('monthlyEnrollments', 'desc')
      .limit(parseInt(limit))
      .get();

    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      recommendationReason: '🔥 Trending in your grade'
    }));

    res.json({
      status: 'success',
      count: courses.length,
      data: courses
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ===== Helper Functions =====

/**
 * Identify weak topics from quiz performance
 */
async function identifyWeakTopics(userId) {
  try {
    const quizAttemptsSnapshot = await db.collection('quizAttempts')
      .where('studentId', '==', userId)
      .orderBy('submittedAt', 'desc')
      .limit(50)
      .get();

    if (quizAttemptsSnapshot.empty) {
      return [];
    }

    const topicScores = {};
    const topicCounts = {};

    for (const doc of quizAttemptsSnapshot.docs) {
      const attempt = doc.data();
      
      // Get course to identify subject/topic
      const courseDoc = await db.collection('courses').doc(attempt.courseId).get();
      if (courseDoc.exists) {
        const subject = courseDoc.data().subject;
        
        if (!topicScores[subject]) {
          topicScores[subject] = 0;
          topicCounts[subject] = 0;
        }
        
        topicScores[subject] += attempt.percentage || 0;
        topicCounts[subject]++;
      }
    }

    // Calculate average scores and identify weak topics (< 60%)
    const weakTopics = [];
    for (const [topic, totalScore] of Object.entries(topicScores)) {
      const avgScore = totalScore / topicCounts[topic];
      if (avgScore < 60) {
        weakTopics.push({
          topic,
          avgScore: Math.round(avgScore),
          attempts: topicCounts[topic]
        });
      }
    }

    return weakTopics.sort((a, b) => a.avgScore - b.avgScore);
  } catch (error) {
    console.error('Error identifying weak topics:', error);
    return [];
  }
}

/**
 * Find users with similar learning patterns
 */
async function findSimilarUsers(userId, userGrade, enrolledCourses) {
  try {
    // Find users in same grade with overlapping courses
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'STUDENT')
      .where('grade', '==', userGrade)
      .limit(100)
      .get();

    const similarUsers = [];

    usersSnapshot.docs.forEach(doc => {
      if (doc.id === userId) return;

      const otherUser = doc.data();
      const otherEnrolled = otherUser.enrolledCourses || [];

      // Calculate Jaccard similarity
      const intersection = enrolledCourses.filter(c => otherEnrolled.includes(c));
      const union = new Set([...enrolledCourses, ...otherEnrolled]);
      const similarity = intersection.length / union.size;

      if (similarity > 0.2) { // At least 20% similarity
        similarUsers.push({
          userId: doc.id,
          similarity,
          enrolledCourses: otherEnrolled
        });
      }
    });

    return similarUsers.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  } catch (error) {
    console.error('Error finding similar users:', error);
    return [];
  }
}

/**
 * Calculate recommendation score for a course
 */
async function calculateRecommendationScore(course, userData, weakTopics, similarUsers) {
  let score = 0;

  // 1. Base score from course popularity and rating (0-30 points)
  const popularityScore = Math.min((course.totalStudents || 0) / 100, 10);
  const ratingScore = (course.rating || 0) * 4; // Max 20 points
  score += popularityScore + ratingScore;

  // 2. Weak topic match (0-25 points)
  const weakTopicMatch = weakTopics.find(wt => wt.topic === course.subject);
  if (weakTopicMatch) {
    // Lower score = weaker = higher priority
    score += (100 - weakTopicMatch.avgScore) / 4;
  }

  // 3. Similar users enrolled (0-20 points)
  const similarUsersCount = similarUsers.filter(su => 
    su.enrolledCourses.includes(course.id)
  ).length;
  score += Math.min(similarUsersCount * 2, 20);

  // 4. Course difficulty match with user level (0-15 points)
  const completedCourses = userData.stats?.coursesCompleted || 0;
  const userLevel = completedCourses < 3 ? 'beginner' : completedCourses < 8 ? 'intermediate' : 'advanced';
  
  if (course.difficulty === userLevel) {
    score += 15;
  } else if (
    (userLevel === 'beginner' && course.difficulty === 'intermediate') ||
    (userLevel === 'intermediate' && course.difficulty === 'advanced')
  ) {
    score += 10; // Next level up
  }

  // 5. Recent activity bonus (0-10 points)
  const monthsSinceCreated = (Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsSinceCreated < 3) {
    score += 10; // New course bonus
  }

  return Math.round(score);
}

/**
 * Generate human-readable recommendation reason
 */
function generateRecommendationReason(course, userData, weakTopics) {
  const reasons = [];

  // Check for weak topic match
  const weakTopic = weakTopics.find(wt => wt.topic === course.subject);
  if (weakTopic) {
    reasons.push(`💡 Helps improve your ${course.subject} (${weakTopic.avgScore}% avg)`);
  }

  // High rating
  if (course.rating >= 4.5) {
    reasons.push(`⭐ Highly rated (${course.rating}/5)`);
  }

  // Popular
  if (course.totalStudents >= 1000) {
    reasons.push(`🔥 ${course.totalStudents.toLocaleString()}+ students enrolled`);
  }

  // Perfect for grade
  if (course.grade?.includes(userData.grade)) {
    reasons.push(`📚 Perfect for Grade ${userData.grade}`);
  }

  return reasons.length > 0 ? reasons[0] : '✨ Recommended for you';
}

export default router;
