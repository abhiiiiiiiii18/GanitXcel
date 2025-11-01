import express from 'express';
import { db, auth } from '../config/firebase.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['STUDENT', 'TEACHER']).withMessage('Invalid role')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
      }

      const { email, password, name, role } = req.body;

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name
      });

      // Set custom claims for role
      await auth.setCustomUserClaims(userRecord.uid, { role });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        email,
        name,
        role,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          uid: userRecord.uid,
          email,
          name,
          role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
);

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();

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
    console.error('Profile fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
