import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';
import admin from 'firebase-admin';

const router = express.Router();

// Get user's friends
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

    const friendIds = userDoc.data().friends || [];

    // Fetch friend details
    const friendsPromises = friendIds.map(friendId =>
      db.collection('users').doc(friendId).get()
    );

    const friendDocs = await Promise.all(friendsPromises);
    const friends = friendDocs
      .filter(doc => doc.exists)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      count: friends.length,
      data: friends
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Send friend request
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    // Create friend request
    await db.collection('friendRequests').add({
      from: fromUserId,
      to: toUserId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      status: 'success',
      message: 'Friend request sent'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Accept friend request
router.post('/accept/:requestId', verifyToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const requestDoc = await db.collection('friendRequests').doc(requestId).get();
    if (!requestDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Friend request not found'
      });
    }

    const request = requestDoc.data();

    // Add to both users' friends lists
    await db.collection('users').doc(request.from).update({
      friends: admin.firestore.FieldValue.arrayUnion(request.to)
    });

    await db.collection('users').doc(request.to).update({
      friends: admin.firestore.FieldValue.arrayUnion(request.from)
    });

    // Update request status
    await db.collection('friendRequests').doc(requestId).update({
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    });

    res.json({
      status: 'success',
      message: 'Friend request accepted'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Search users
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const { query } = req.params;

    const snapshot = await db.collection('users')
      .where('role', '==', 'STUDENT')
      .get();

    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 20);

    res.json({
      status: 'success',
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
