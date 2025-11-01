import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken, isStudent } from '../middleware/auth.js';
import admin from 'firebase-admin';

const router = express.Router();

// Purchase a course
router.post('/', verifyToken, isStudent, async (req, res) => {
  try {
    const { courseId, paymentMethod } = req.body;
    const userId = req.user.uid;

    // Check if course exists
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const course = courseDoc.data();

    // Check if already purchased
    const userDoc = await db.collection('users').doc(userId).get();
    const enrolledCourses = userDoc.data().enrolledCourses || [];

    if (enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Course already purchased'
      });
    }

    // Create purchase record
    const purchaseRef = await db.collection('purchases').add({
      userId,
      courseId,
      amount: course.price,
      paymentMethod,
      status: 'completed',
      purchasedAt: new Date().toISOString()
    });

    // Add course to user's enrolled courses
    await db.collection('users').doc(userId).update({
      enrolledCourses: admin.firestore.FieldValue.arrayUnion(courseId),
      updatedAt: new Date().toISOString()
    });

    // Create enrollment record with initial progress
    await db.collection('enrollments').add({
      userId,
      courseId,
      enrolledAt: new Date(),
      completedLessons: [],
      progress: 0,
      lastAccessedAt: new Date(),
      status: 'active'
    });

    res.status(201).json({
      status: 'success',
      message: 'Course purchased successfully',
      data: {
        purchaseId: purchaseRef.id,
        courseId,
        courseName: course.title
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's purchase history
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('purchases')
      .where('userId', '==', userId)
      .orderBy('purchasedAt', 'desc')
      .get();

    const purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      count: purchases.length,
      data: purchases
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Check if user owns a course
router.get('/check/:userId/:courseId', verifyToken, async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();
    const enrolledCourses = userDoc.data().enrolledCourses || [];

    const isPurchased = enrolledCourses.includes(courseId);

    // If purchased but no enrollment exists, create it
    if (isPurchased) {
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .get();

      if (enrollmentsSnapshot.empty) {
        // Create missing enrollment
        await db.collection('enrollments').add({
          userId,
          courseId,
          enrolledAt: new Date(),
          completedLessons: [],
          progress: 0,
          lastAccessedAt: new Date(),
          status: 'active'
        });
      }
    }

    res.json({
      status: 'success',
      data: { isPurchased }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Fix missing enrollments for user's purchased courses
router.post('/fix-enrollments/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's enrolled courses
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const enrolledCourses = userDoc.data().enrolledCourses || [];
    
    if (enrolledCourses.length === 0) {
      return res.json({
        status: 'success',
        message: 'No courses to fix',
        data: { fixed: 0 }
      });
    }

    let fixedCount = 0;

    // Check each course for missing enrollment
    for (const courseId of enrolledCourses) {
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .get();

      if (enrollmentsSnapshot.empty) {
        // Create missing enrollment
        await db.collection('enrollments').add({
          userId,
          courseId,
          enrolledAt: new Date(),
          completedLessons: [],
          progress: 0,
          lastAccessedAt: new Date(),
          status: 'active'
        });
        fixedCount++;
      }
    }

    res.json({
      status: 'success',
      message: `Fixed ${fixedCount} missing enrollments`,
      data: { 
        fixed: fixedCount,
        totalCourses: enrolledCourses.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
