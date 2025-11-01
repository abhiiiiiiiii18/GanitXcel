# 🚀 BACKEND API QUICK REFERENCE

## 📍 Base URL
```
http://localhost:5000/api
```

## 🔑 Authentication Header
```javascript
headers: {
  'Authorization': 'Bearer YOUR_FIREBASE_ID_TOKEN'
}
```

---

## 📚 COURSES

### Get All Courses
```http
GET /courses?grade=10&subject=Algebra&limit=20
```

### Get Single Course
```http
GET /courses/:courseId
```

### Create Course (Teachers)
```http
POST /courses
{
  "title": "Algebra Basics",
  "description": "...",
  "price": 599,
  "grade": [10],
  "subject": "Algebra"
}
```

---

## 💳 PURCHASES

### Purchase Course
```http
POST /purchases
{
  "courseId": "course123",
  "paymentMethod": "card"
}
```

### Check Ownership
```http
GET /purchases/check/:userId/:courseId
```

---

## 🤖 AI FEATURES

### Generate Summary
```http
POST /ai/summarize
{
  "title": "Lesson Title",
  "description": "...",
  "duration": "30 mins"
}
```

### Solve Doubt
```http
POST /ai/doubt
{
  "question": "How to solve quadratic equations?",
  "context": "Grade 10 Algebra"
}
```

---

## 🏆 LEADERBOARD

### Get Top 10
```http
GET /leaderboard?limit=10
```

### Get User Rank
```http
GET /leaderboard/rank/:userId
```

---

## 👥 FRIENDS

### Search Users
```http
GET /friends/search/:query
```

### Send Friend Request
```http
POST /friends/request
{
  "fromUserId": "user1",
  "toUserId": "user2"
}
```

---

## 🎓 CERTIFICATES

### Generate Certificate
```http
POST /certificates/generate
{
  "userId": "user123",
  "courseId": "course456"
}
```

### Verify Certificate
```http
GET /certificates/verify/:certificateId
```

---

## 📝 QUIZZES

### Get Quiz for Lesson
```http
GET /quizzes/lesson/:lessonId
```

### Submit Quiz
```http
POST /quizzes/:quizId/submit
{
  "answers": [0, 2, 1, 3]
}
```

---

## 👤 USERS

### Get User Profile
```http
GET /users/:userId
```

### Update Profile
```http
PATCH /users/:userId
{
  "name": "New Name",
  "bio": "Updated bio"
}
```

---

## 📖 LESSONS

### Get Course Lessons
```http
GET /lessons/course/:courseId
```

### Mark Complete
```http
POST /lessons/:lessonId/complete
```

---

## 🔐 AUTH

### Register
```http
POST /auth/register
{
  "email": "user@test.com",
  "password": "pass123",
  "name": "User Name",
  "role": "STUDENT"
}
```

---

## ⚡ FRONTEND USAGE

```javascript
import { courseAPI, purchaseAPI, aiAPI } from '../services/api';

// Get courses
const courses = await courseAPI.getAll({ grade: 10 });

// Purchase
await purchaseAPI.purchase('course123', 'card');

// AI Summary
const summary = await aiAPI.summarize(lessonData);
```

---

## 🎯 STATUS CODES

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📞 HEALTH CHECK

```http
GET /health
```

**Response:**
```json
{
  "status": "success",
  "message": "GanitXcel API is running"
}
```
