import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get global leaderboard
router.get('/', verifyToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const snapshot = await db.collection('users')
      .where('role', '==', 'STUDENT')
      .orderBy('totalPoints', 'desc')
      .limit(parseInt(limit))
      .get();

    const leaderboard = snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      status: 'success',
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's rank
router.get('/rank/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's points
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const userPoints = userDoc.data().totalPoints || 0;

    // Count users with more points
    const snapshot = await db.collection('users')
      .where('role', '==', 'STUDENT')
      .where('totalPoints', '>', userPoints)
      .get();

    const rank = snapshot.size + 1;

    res.json({
      status: 'success',
      data: {
        userId,
        rank,
        totalPoints: userPoints
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
