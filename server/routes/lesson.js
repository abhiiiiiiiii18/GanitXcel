import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get lessons for a course
router.get('/course/:courseId', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;

    const snapshot = await db.collection('lessons')
      .where('courseId', '==', courseId)
      .orderBy('order', 'asc')
      .get();

    const lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get single lesson
router.get('/:lessonId', verifyToken, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lessonDoc = await db.collection('lessons').doc(lessonId).get();

    if (!lessonDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Lesson not found'
      });
    }

    res.json({
      status: 'success',
      data: { id: lessonDoc.id, ...lessonDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Mark lesson as completed
router.post('/:lessonId/complete', verifyToken, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { courseId } = req.body;
    const userId = req.user.uid;

    if (!courseId) {
      return res.status(400).json({
        status: 'error',
        message: 'courseId is required'
      });
    }

    // Find enrollment
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .get();

    if (enrollmentsSnapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'Enrollment not found. Please purchase the course first.'
      });
    }

    const enrollmentDoc = enrollmentsSnapshot.docs[0];
    const enrollment = enrollmentDoc.data();
    const completedLessons = enrollment.completedLessons || [];

    // Check if already completed
    if (completedLessons.includes(lessonId)) {
      return res.json({
        status: 'success',
        message: 'Lesson already completed',
        alreadyCompleted: true,
        completedLessons
      });
    }

    // Add to completed lessons
    const updatedCompletedLessons = [...completedLessons, lessonId];

    // Update enrollment
    await enrollmentDoc.ref.update({
      completedLessons: updatedCompletedLessons,
      lastAccessedAt: new Date(),
      progress: (updatedCompletedLessons.length / 10) * 100 // Dynamic based on course lessons
    });

    res.json({
      status: 'success',
      message: 'Lesson marked as completed. Next lesson unlocked!',
      alreadyCompleted: false,
      completedLessons: updatedCompletedLessons,
      nextLessonUnlocked: true
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get course progress for student
router.get('/course/:courseId/progress', verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.uid;

    // Find enrollment
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .get();

    if (enrollmentsSnapshot.empty) {
      return res.json({
        status: 'success',
        progress: 0,
        completedLessons: [],
        enrolled: false
      });
    }

    const enrollment = enrollmentsSnapshot.docs[0].data();

    res.json({
      status: 'success',
      progress: enrollment.progress || 0,
      completedLessons: enrollment.completedLessons || [],
      enrolled: true,
      lastAccessedAt: enrollment.lastAccessedAt
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
