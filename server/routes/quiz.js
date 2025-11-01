import express from 'express';
import { db } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get quiz for a lesson
router.get('/lesson/:lessonId', verifyToken, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const snapshot = await db.collection('quizzes')
      .where('lessonId', '==', lessonId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found for this lesson'
      });
    }

    const quiz = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

    res.json({
      status: 'success',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Submit quiz answers
router.post('/:quizId/submit', verifyToken, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user.uid;

    // Get quiz
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Quiz not found'
      });
    }

    const quiz = quizDoc.data();
    let score = 0;
    const totalQuestions = quiz.questions.length;

    // Calculate score
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / totalQuestions) * 100;

    // Save result
    const resultRef = await db.collection('quizResults').add({
      userId,
      quizId,
      lessonId: quiz.lessonId,
      score,
      totalQuestions,
      percentage,
      answers,
      submittedAt: new Date().toISOString()
    });

    res.json({
      status: 'success',
      message: 'Quiz submitted successfully',
      data: {
        resultId: resultRef.id,
        score,
        totalQuestions,
        percentage,
        passed: percentage >= 70
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get user's quiz results
router.get('/user/:userId/results', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection('quizResults')
      .where('userId', '==', userId)
      .orderBy('submittedAt', 'desc')
      .get();

    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({
      status: 'success',
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
