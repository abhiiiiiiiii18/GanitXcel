# GanitXcel Backend Server

Complete REST API backend for the GanitXcel Learning Management System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required environment variables:
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `GEMINI_API_KEY` - Google Gemini API key

### 3. Get Firebase Admin SDK Credentials
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract the values and add to `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 4. Start Server
```bash
npm run dev   # Development mode with auto-reload
npm start     # Production mode
```

Server will run on `http://localhost:5000`

---

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile/:uid` - Get user profile

### User Routes (`/api/users`)
- `GET /api/users/:userId` - Get user by ID
- `PATCH /api/users/:userId` - Update user profile
- `GET /api/users/:userId/courses` - Get user's enrolled courses

### Course Routes (`/api/courses`)
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:courseId` - Get single course
- `POST /api/courses` - Create course (Teachers only)
- `PATCH /api/courses/:courseId` - Update course (Teachers only)
- `DELETE /api/courses/:courseId` - Delete course (Teachers only)

### Lesson Routes (`/api/lessons`)
- `GET /api/lessons/course/:courseId` - Get course lessons
- `GET /api/lessons/:lessonId` - Get single lesson
- `POST /api/lessons/:lessonId/complete` - Mark lesson as completed

### Quiz Routes (`/api/quizzes`)
- `GET /api/quizzes/lesson/:lessonId` - Get quiz for lesson
- `POST /api/quizzes/:quizId/submit` - Submit quiz answers
- `GET /api/quizzes/user/:userId/results` - Get user's quiz results

### Purchase Routes (`/api/purchases`)
- `POST /api/purchases` - Purchase a course
- `GET /api/purchases/user/:userId` - Get purchase history
- `GET /api/purchases/check/:userId/:courseId` - Check if user owns course

### Leaderboard Routes (`/api/leaderboard`)
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user's rank

### Friends Routes (`/api/friends`)
- `GET /api/friends/:userId` - Get user's friends
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/accept/:requestId` - Accept friend request
- `GET /api/friends/search/:query` - Search users

### AI Routes (`/api/ai`)
- `POST /api/ai/summarize` - Generate lesson summary
- `POST /api/ai/doubt` - Solve student doubt
- `POST /api/ai/practice` - Generate practice questions

### Certificate Routes (`/api/certificates`)
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/user/:userId` - Get user's certificates
- `GET /api/certificates/verify/:certificateId` - Verify certificate

---

## 🔒 Authentication

All protected routes require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

Get the token from Firebase Auth on the client side:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

---

## 🛡️ Security Features

- **Helmet** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS** - Configured for frontend origin
- **Input Validation** - Using express-validator
- **Role-Based Access** - Student, Teacher, Admin roles
- **Token Verification** - Firebase Admin SDK

---

## 📁 Project Structure

```
server/
├── config/
│   └── firebase.js          # Firebase Admin initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User management
│   ├── course.js            # Course management
│   ├── lesson.js            # Lesson management
│   ├── quiz.js              # Quiz management
│   ├── purchase.js          # Purchase management
│   ├── leaderboard.js       # Leaderboard
│   ├── friends.js           # Friends system
│   ├── ai.js                # AI features
│   └── certificate.js       # Certificates
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md               # This file
```

---

## 🧪 Testing API

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "test123",
    "name": "Test Student",
    "role": "STUDENT"
  }'
```

**Get Courses:**
```bash
curl http://localhost:5000/api/courses?grade=10&limit=5
```

**Purchase Course:**
```bash
curl -X POST http://localhost:5000/api/purchases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "courseId": "course123",
    "paymentMethod": "card"
  }'
```

### Using Postman

1. Import the collection (create one with all endpoints)
2. Set environment variable `BASE_URL = http://localhost:5000/api`
3. For protected routes, add Authorization header with Firebase token

---

## 🚨 Error Handling

All errors return JSON in this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

Success responses:
```json
{
  "status": "success",
  "data": { },
  "message": "Optional message"
}
```

---

## 🔄 Connecting Frontend to Backend

Update your frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Create an API service file:
```javascript
// src/services/api.js
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async get(endpoint) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },
  
  async post(endpoint, data) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

---

## 🐛 Troubleshooting

**Firebase Admin not initializing:**
- Check that private key in .env has proper line breaks
- Ensure service account has Firestore permissions

**CORS errors:**
- Update `CORS_ORIGIN` in .env to match your frontend URL
- Restart server after changing .env

**Rate limiting too strict:**
- Adjust limits in `server.js` (increase `max` value)

**Gemini API errors:**
- Verify `GEMINI_API_KEY` is correct
- Check API quota limits

---

## 📦 Production Deployment

### Deploy to Heroku
```bash
heroku create ganitxcel-api
heroku config:set FIREBASE_PROJECT_ID=xxx
heroku config:set FIREBASE_CLIENT_EMAIL=xxx
# ... set all env vars
git subtree push --prefix server heroku main
```

### Deploy to Vercel
```bash
cd server
vercel
# Follow prompts and add environment variables
```

### Deploy to Railway
```bash
cd server
railway up
# Add environment variables in Railway dashboard
```

---

## 📄 License

MIT License - GanitXcel 2025

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📞 Support

For issues or questions:
- Open GitHub issue
- Email: support@ganitxcel.com
- Discord: [Join our community]

---

**Built with ❤️ for GanitXcel**
