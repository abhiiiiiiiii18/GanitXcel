import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user by ID
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: userDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update user profile
router.patch('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Only allow updating certain fields
    const allowedFields = ['name', 'bio', 'avatar', 'phone', 'grade'];
    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    filteredUpdates.updatedAt = new Date().toISOString();

    await db.collection('users').doc(userId).update(filteredUpdates);

    const updatedDoc = await db.collection('users').doc(userId).get();

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's enrolled courses
router.get('/:userId/courses', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const enrolledCourses = userDoc.data().enrolledCourses || [];

    // Fetch course details
    const coursesPromises = enrolledCourses.map(courseId =>
      db.collection('courses').doc(courseId).get()
    );

    const courseDocs = await Promise.all(coursesPromises);
    const courses = courseDocs
      .filter(doc => doc.exists)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
