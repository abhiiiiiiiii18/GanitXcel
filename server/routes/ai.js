import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate lesson summary
router.post('/summarize', verifyToken, async (req, res) => {
  try {
    const { title, description, duration, content } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Create a comprehensive summary of this lesson:

Title: ${title}
Description: ${description}
Duration: ${duration}
${content ? `Content: ${content}` : ''}

Please provide:
1. A brief overview (2-3 sentences)
2. Key concepts covered (3-5 bullet points)
3. Main learning objectives (3-4 items)
4. Important points to remember (2-3 items)

Format the response in clear sections with proper markdown formatting.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({
      status: 'success',
      data: { summary }
    });
  } catch (error) {
    console.error('AI Summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate summary'
    });
  }
});

// Solve doubt
router.post('/doubt', verifyToken, async (req, res) => {
  try {
    const { question, context } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a helpful mathematics tutor for students in grades 8-12.

Student's question: ${question}
${context ? `Context: ${context}` : ''}

Please provide:
1. A clear explanation of the concept
2. Step-by-step solution (if applicable)
3. Key formulas or theorems used
4. A similar practice problem

Keep the language simple and friendly. Use examples where helpful.`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({
      status: 'success',
      data: { answer }
    });
  } catch (error) {
    console.error('AI Doubt solver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to solve doubt'
    });
  }
});

// Generate practice questions
router.post('/practice', verifyToken, async (req, res) => {
  try {
    const { topic, difficulty, count = 5 } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Generate ${count} practice questions for the topic: ${topic}
Difficulty level: ${difficulty}

For each question, provide:
1. The question
2. Four multiple choice options (A, B, C, D)
3. The correct answer
4. A brief explanation

Format as JSON array.`;

    const result = await model.generateContent(prompt);
    const questions = result.response.text();

    res.json({
      status: 'success',
      data: { questions }
    });
  } catch (error) {
    console.error('AI Practice questions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate practice questions'
    });
  }
});

export default router;
