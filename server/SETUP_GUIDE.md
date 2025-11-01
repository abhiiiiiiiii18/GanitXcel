# 🚀 BACKEND SERVER SETUP - QUICK START

## ✅ What I've Created

A complete **Node.js/Express backend server** with:
- ✅ Firebase Admin SDK integration
- ✅ 10 REST API route modules
- ✅ JWT authentication middleware
- ✅ Rate limiting & security
- ✅ AI integration (Gemini API)
- ✅ All dependencies installed

---

## 📁 Project Structure

```
server/
├── config/
│   └── firebase.js              # Firebase Admin setup
├── middleware/
│   └── auth.js                  # JWT verification
├── routes/
│   ├── auth.js                  # Registration, login
│   ├── user.js                  # User profile management
│   ├── course.js                # Course CRUD operations
│   ├── lesson.js                # Lesson management
│   ├── quiz.js                  # Quiz & results
│   ├── purchase.js              # Course purchases
│   ├── leaderboard.js           # Global rankings
│   ├── friends.js               # Friend system
│   ├── ai.js                    # AI summarization & doubt solver
│   └── certificate.js           # Certificate generation
├── .env                         # Environment variables (YOU NEED TO CONFIGURE)
├── .env.example                 # Template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── server.js                    # Main server file
└── README.md                    # Full documentation
```

---

## ⚙️ CONFIGURATION REQUIRED

### Step 1: Create `.env` file

```bash
cd server
cp .env.example .env
```

### Step 2: Get Firebase Admin SDK Credentials

1. Go to **Firebase Console** → Your Project
2. Click **Project Settings** (gear icon)
3. Go to **Service Accounts** tab
4. Click **"Generate New Private Key"**
5. Download the JSON file

### Step 3: Fill in `.env` file

Open `server/.env` and fill in these values from the downloaded JSON:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (from downloaded JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# JWT Secret (generate a random string)
JWT_SECRET=your_secret_key_change_this_in_production

# CORS (your frontend URL)
CORS_ORIGIN=http://localhost:5173

# Google Gemini API (from your .env in main project)
GEMINI_API_KEY=AIzaSyCOqLb1pNXt2ro-s99unyeqBj180Gyjs8I
```

---

## 🚀 START THE SERVER

### Option 1: Development Mode (with auto-reload)
```bash
cd server
npm run dev
```

### Option 2: Production Mode
```bash
cd server
npm start
```

You should see:
```
🚀 GanitXcel Backend Server running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
📚 API Base URL: http://localhost:5000/api
```

---

## 🧪 TEST THE SERVER

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "GanitXcel API is running",
  "timestamp": "2025-11-01T...",
  "environment": "development"
}
```

### Test 2: Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123456",
    "name": "Test User",
    "role": "STUDENT"
  }'
```

### Test 3: Get Courses
```bash
curl http://localhost:5000/api/courses?limit=5
```

---

## 🔗 CONNECT FRONTEND TO BACKEND

### Step 1: Update Frontend `.env`

Add to your main project's `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Create API Service

Create `src/services/api.js`:
```javascript
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // GET request
  async get(endpoint) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  // POST request
  async post(endpoint, data) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // PATCH request
  async patch(endpoint, data) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // DELETE request
  async delete(endpoint) {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};
```

### Step 3: Use in Components

```javascript
import { api } from '../services/api';

// Example: Get courses
const courses = await api.get('/courses?grade=10');

// Example: Purchase course
const result = await api.post('/purchases', {
  courseId: 'course123',
  paymentMethod: 'card'
});

// Example: Get AI summary
const summary = await api.post('/ai/summarize', {
  title: lesson.title,
  description: lesson.description,
  duration: lesson.duration
});
```

---

## 📋 AVAILABLE API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register user
- `GET /api/auth/profile/:uid` - Get profile

### Users
- `GET /api/users/:userId` - Get user
- `PATCH /api/users/:userId` - Update profile
- `GET /api/users/:userId/courses` - Get enrolled courses

### Courses
- `GET /api/courses` - List courses (filters: grade, subject, search)
- `GET /api/courses/:courseId` - Get single course
- `POST /api/courses` - Create course (Teachers)
- `PATCH /api/courses/:courseId` - Update course (Teachers)
- `DELETE /api/courses/:courseId` - Delete course (Teachers)

### Lessons
- `GET /api/lessons/course/:courseId` - Get course lessons
- `GET /api/lessons/:lessonId` - Get single lesson
- `POST /api/lessons/:lessonId/complete` - Mark completed

### Quizzes
- `GET /api/quizzes/lesson/:lessonId` - Get quiz
- `POST /api/quizzes/:quizId/submit` - Submit answers
- `GET /api/quizzes/user/:userId/results` - Get results

### Purchases
- `POST /api/purchases` - Purchase course
- `GET /api/purchases/user/:userId` - Get history
- `GET /api/purchases/check/:userId/:courseId` - Check ownership

### Leaderboard
- `GET /api/leaderboard` - Global leaderboard
- `GET /api/leaderboard/rank/:userId` - User's rank

### Friends
- `GET /api/friends/:userId` - Get friends
- `POST /api/friends/request` - Send request
- `POST /api/friends/accept/:requestId` - Accept request
- `GET /api/friends/search/:query` - Search users

### AI Features
- `POST /api/ai/summarize` - Generate lesson summary
- `POST /api/ai/doubt` - Solve doubt
- `POST /api/ai/practice` - Generate practice questions

### Certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/user/:userId` - Get certificates
- `GET /api/certificates/verify/:certificateId` - Verify

---

## 🔒 AUTHENTICATION

All protected routes require Firebase ID token:

```javascript
// Get token
const user = firebase.auth().currentUser;
const token = await user.getIdToken();

// Add to request headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🐛 TROUBLESHOOTING

### Server won't start:
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# Kill the process or change PORT in .env
PORT=5001
```

### Firebase errors:
- Check `.env` has correct Firebase credentials
- Ensure private key has `\n` line breaks
- Verify service account has Firestore permissions

### CORS errors:
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Restart server after changing `.env`

### Module not found:
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 MONITORING

### View Logs
Server logs all requests using Morgan middleware:
```
GET /api/courses?grade=10 200 123ms
POST /api/purchases 201 456ms
```

### Check Rate Limits
Default: 100 requests per 15 minutes per IP

To adjust, edit `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200  // Increase limit
});
```

---

## 🚀 NEXT STEPS

1. ✅ Configure `.env` file
2. ✅ Start server: `npm run dev`
3. ✅ Test health endpoint
4. ✅ Connect frontend
5. ✅ Test API endpoints with your app

---

## 📞 NEED HELP?

Check the full documentation: `server/README.md`

---

**Backend is ready to power your LMS! 🎉**
