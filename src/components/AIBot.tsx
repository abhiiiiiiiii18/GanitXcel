import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './AIBot.css';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

interface AIBotProps {
  lessonTitle?: string;
  lessonContext?: string;
}

const AIBot: React.FC<AIBotProps> = ({ lessonTitle = '', lessonContext = '' }) => {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: 'model',
      content: `Hi! I'm your AI math tutor! 🤖 I'm here to help you with ${lessonTitle || 'your math questions'}. Ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Initialize Gemini AI
  const initializeChat = async () => {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      console.log('🤖 Initializing Gemini with API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
      
      if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        setError('Please add your Gemini API key to the .env file');
        return null;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      console.log('🤖 Creating model instance...');
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        systemInstruction: `You are an expert math tutor for GanitXcel, an Indian Learning Management System. 
Your purpose is to help students solve math problems and understand concepts clearly.

Context: ${lessonContext || 'General mathematics tutoring'}
Current Lesson: ${lessonTitle || 'Mathematics'}

CORE RESPONSIBILITIES:
1. Solve math problems step-by-step with clear explanations
2. Teach mathematical concepts in simple language
3. Provide practice problems when requested
4. Check student work and identify mistakes
5. Give hints before full solutions when appropriate

RESPONSE FORMAT:
- For problem-solving: Show all steps clearly
- Use numbered steps (Step 1, Step 2, etc.)
- Explain WHY each step is done, not just HOW
- Show the final answer clearly marked
- Use simple language suitable for Indian students (CBSE/ICSE)

GUIDELINES:
✓ Always be encouraging and supportive
✓ Break complex problems into smaller steps
✓ Use examples relevant to Indian curriculum
✓ Show calculations and intermediate results
✓ Verify answers when possible
✓ Use emojis occasionally (📝, ✓, ➡️) to keep it friendly
✓ If question is unclear, ask for clarification
✗ Don't just give answers - teach the method
✗ Don't skip steps in calculations
✗ Don't use overly complex terminology

EXAMPLE RESPONSE STRUCTURE:
Problem: Solve 2x + 5 = 15

Step 1: Subtract 5 from both sides
2x + 5 - 5 = 15 - 5
2x = 10

Step 2: Divide both sides by 2
2x ÷ 2 = 10 ÷ 2
x = 5

✓ Final Answer: x = 5

Remember: Your goal is to help students LEARN, not just get answers.`,
      });

      const chat = model.startChat({
        history: chatHistory.slice(1).map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      });

      return chat;
    } catch (err: any) {
      console.error('Error initializing Gemini:', err);
      setError('Failed to initialize AI. Please check your API key.');
      return null;
    }
  };

  // Send message to Gemini
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim() || isLoading) return;

    const trimmedMessage = userMessage.trim();
    
    console.log('🤖 Sending message to Gemini:', trimmedMessage);
    
    // Add user message to chat
    const userMsg: Message = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setUserMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Initialize or get existing chat
      if (!chatRef.current) {
        console.log('🤖 Initializing Gemini chat...');
        chatRef.current = await initializeChat();
      }

      if (!chatRef.current) {
        throw new Error('Failed to initialize chat');
      }

      console.log('🤖 Calling Gemini API...');
      
      // Send message and get response with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - API took too long to respond')), 30000)
      );
      
      const apiCallPromise = (async () => {
        const result = await chatRef.current.sendMessage(trimmedMessage);
        const response = await result.response;
        return response.text();
      })();
      
      const botReply = await Promise.race([apiCallPromise, timeoutPromise]) as string;

      console.log('🤖 Gemini response received:', botReply);

      // Add bot response to chat
      const botMsg: Message = {
        role: 'model',
        content: botReply,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('❌ Error sending message:', err);
      console.error('❌ Error name:', err.name);
      console.error('❌ Error message:', err.message);
      console.error('❌ Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      
      let errorMessage = '❌ Sorry, I encountered an error. ';
      let technicalDetails = '';
      
      // Provide specific error messages based on error type
      if (err.message?.toLowerCase().includes('api key') || err.message?.includes('API_KEY_INVALID')) {
        errorMessage += 'Invalid API key. Please check your Gemini API key in the .env file.';
        technicalDetails = 'Check: REACT_APP_GEMINI_API_KEY in .env';
      } else if (err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('limit') || err.message?.includes('429')) {
        errorMessage += 'API quota exceeded. You have reached the free tier limit. Please try again later.';
        technicalDetails = 'Free tier: 60 requests/min, 1500/day';
      } else if (err.message?.toLowerCase().includes('timeout')) {
        errorMessage += 'Request timeout. The AI took too long to respond. Please try again.';
        technicalDetails = 'Try a simpler question or check API status';
      } else if (err.message?.toLowerCase().includes('blocked') || err.message?.toLowerCase().includes('safety')) {
        errorMessage += 'Content was blocked by safety filters. Please rephrase your question.';
        technicalDetails = 'Gemini safety filters triggered';
      } else if (err.name === 'TypeError' || err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('network')) {
        errorMessage += 'Network error. This might be due to:\n';
        errorMessage += '• No internet connection\n';
        errorMessage += '• Firewall blocking the request\n';
        errorMessage += '• CORS or browser security policy\n';
        errorMessage += '• Invalid API endpoint\n\n';
        errorMessage += 'Try: Check internet, disable VPN, or restart browser';
        technicalDetails = 'Network/CORS issue detected';
      } else if (err.message?.includes('404')) {
        errorMessage += 'API endpoint not found. The model might not be available.';
        technicalDetails = 'Try changing model to "gemini-pro"';
      } else {
        errorMessage += `Unexpected error: ${err.message || 'Unknown error'}\n\n`;
        errorMessage += 'Please try again or contact support.';
        technicalDetails = err.stack || 'No stack trace available';
      }
      
      console.error('💡 Technical details:', technicalDetails);
      setError(errorMessage);
      
      // Add error message to chat
      const errorMsg: Message = {
        role: 'model',
        content: errorMessage,
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatHistory([
      {
        role: 'model',
        content: `Hi! I'm your AI math tutor! 🤖 I'm here to help you with ${lessonTitle || 'your math questions'}. Ask me anything!`,
        timestamp: new Date(),
      },
    ]);
    chatRef.current = null;
    setError(null);
  };

  return (
    <div className="aibot-container">
      <div className="aibot-header">
        <div className="aibot-header-content">
          <span className="aibot-icon">🤖</span>
          <div>
            <h3 className="aibot-title">AI Math Tutor</h3>
            <p className="aibot-subtitle">Powered by Google Gemini</p>
          </div>
        </div>
        <button 
          onClick={clearChat} 
          className="aibot-clear-btn"
          title="Clear chat"
        >
          🗑️
        </button>
      </div>

      {error && (
        <div className="aibot-error">
          ⚠️ {error}
        </div>
      )}

      <div className="aibot-messages">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`aibot-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="aibot-message bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-loading">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="aibot-input-form">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me a math question..."
          className="aibot-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="aibot-send-btn"
          disabled={isLoading || !userMessage.trim()}
        >
          {isLoading ? '...' : '📤'}
        </button>
      </form>
    </div>
  );
};

export default AIBot;
