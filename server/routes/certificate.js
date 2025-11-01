import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Generate certificate
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Check if user completed the course
    const userDoc = await db.collection('users').doc(userId).get();
    const courseDoc = await db.collection('courses').doc(courseId).get();

    if (!userDoc.exists || !courseDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User or course not found'
      });
    }

    const user = userDoc.data();
    const course = courseDoc.data();

    // Check if already has certificate
    const existingCert = await db.collection('certificates')
      .where('userId', '==', userId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingCert.empty) {
      return res.json({
        status: 'success',
        data: { id: existingCert.docs[0].id, ...existingCert.docs[0].data() }
      });
    }

    // Generate certificate
    const certificateRef = await db.collection('certificates').add({
      userId,
      courseId,
      userName: user.name,
      courseName: course.title,
      completedAt: new Date().toISOString(),
      certificateNumber: `GX-${Date.now()}-${userId.slice(0, 6).toUpperCase()}`
    });

    const certificate = {
      id: certificateRef.id,
      userId,
      courseId,
      userName: user.name,
      courseName: course.title,
      completedAt: new Date().toISOString()
    };

    res.status(201).json({
      status: 'success',
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's certificates
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('certificates')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .get();

    const certificates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Verify certificate
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certDoc = await db.collection('certificates').doc(certificateId).get();

    if (!certDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.json({
      status: 'success',
      data: { id: certDoc.id, ...certDoc.data(), verified: true }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
