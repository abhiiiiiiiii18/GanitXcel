import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken, isTeacher } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { grade, subject, search, limit = 20 } = req.query;

    let query = db.collection('courses');

    // Apply filters
    if (grade) {
      query = query.where('grade', 'array-contains', parseInt(grade));
    }
    if (subject) {
      query = query.where('subject', '==', subject);
    }

    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    let courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Search by title or description
    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(course =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
      );
    }

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

// Get single course
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseDoc = await db.collection('courses').doc(courseId).get();

    if (!courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.json({
      status: 'success',
      data: { id: courseDoc.id, ...courseDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create new course (Teachers only)
router.post('/', verifyToken, isTeacher, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      teacherId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const courseRef = await db.collection('courses').add(courseData);

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { id: courseRef.id, ...courseData }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update course
router.patch('/:courseId', verifyToken, isTeacher, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await db.collection('courses').doc(courseId).update(updates);

    const updatedDoc = await db.collection('courses').doc(courseId).get();

    res.json({
      status: 'success',
      message: 'Course updated successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete course
router.delete('/:courseId', verifyToken, isTeacher, async (req, res) => {
  try {
    const { courseId } = req.params;

    await db.collection('courses').doc(courseId).delete();

    res.json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
