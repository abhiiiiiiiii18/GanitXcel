# 🔥 Firebase Implementation Guide for GanitXcel

## Current Status: ✅ Partially Implemented

### Completed:
1. ✅ Firebase service file created (`src/services/firebase.ts`)
2. ✅ Authentication functions (login, register, logout)
3. ✅ Teacher qualification checking
4. ✅ LoginPage connected to Firebase
5. ✅ RegisterPage connected to Firebase (students only)
6. ✅ Teacher Test Page connected to Firebase (partial)

### Critical Fixes Needed:

## 🔴 1. Fix HomePage Routing Issue

**File:** `src/pages/HomePage.tsx`

**Problem:** Teacher button routes to student dashboard

**Find this code:**
```tsx
// Look for the "I'm a Teacher" button
```

**Replace with:**
```tsx
<Button
  variant="secondary"
  size="lg"
  onClick={() => navigate('/login?role=teacher')}
>
  I'm a Teacher
</Button>
```

---

## 🟡 2. Create Firestore Sample Data

### Step 1: Setup Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing
3. Enable **Authentication** > **Email/Password**
4. Enable **Firestore Database**

### Step 2: Add Firebase Credentials
Create `.env` file in root:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 3: Firestore Collections Structure

#### Collection: `users`
```json
{
  "userId123": {
    "id": "userId123",
    "email": "student@example.com",
    "name": "Rahul Kumar",
    "role": "STUDENT",
    "isQualified": true,
    "avatar": "https://ui-avatars.com/api/?name=Rahul+Kumar",
    "xp": 1250,
    "level": 5,
    "streak": 7,
    "badges": ["first_quiz", "week_streak"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "teacherId456": {
    "id": "teacherId456",
    "email": "teacher@example.com",
    "name": "Priya Sharma",
    "role": "TEACHER",
    "isQualified": true,
    "qualificationScore": 95,
    "qualifiedAt": "2024-01-01T00:00:00.000Z",
    "avatar": "https://ui-avatars.com/api/?name=Priya+Sharma",
    "availableBalance": 45000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Collection: `courses`
```json
{
  "course1": {
    "id": "course1",
    "title": "Complete Algebra for Grade 10",
    "description": "Master algebraic expressions and equations",
    "teacherId": "teacherId456",
    "teacherName": "Priya Sharma",
    "thumbnail": "https://via.placeholder.com/400x300/58CC02/fff?text=Algebra",
    "price": 599,
    "rating": 4.8,
    "totalStudents": 2456,
    "duration": 45,
    "grade": 10,
    "subject": "Algebra",
    "lessons": [
      {
        "id": "lesson1",
        "title": "Introduction to Variables",
        "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
        "duration": 12,
        "notesUrl": "https://example.com/notes/lesson1.pdf"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Collection: `enrollments`
```json
{
  "enrollment1": {
    "userId": "userId123",
    "courseId": "course1",
    "enrolledAt": "2024-01-15T00:00:00.000Z",
    "progress": 45,
    "completedLessons": ["lesson1", "lesson2"],
    "lastAccessedAt": "2024-01-20T00:00:00.000Z"
  }
}
```

#### Collection: `comments`
```json
{
  "comment1": {
    "courseId": "course1",
    "lessonId": "lesson1",
    "userId": "userId123",
    "userName": "Rahul Kumar",
    "comment": "Great explanation!",
    "createdAt": "2024-01-16T00:00:00.000Z"
  }
}
```

#### Collection: `doubts`
```json
{
  "doubt1": {
    "studentId": "userId123",
    "studentName": "Rahul Kumar",
    "courseId": "course1",
    "question": "How to solve quadratic equations?",
    "subject": "Algebra",
    "status": "pending",
    "createdAt": "2024-01-17T00:00:00.000Z",
    "scheduledAt": null,
    "resolvedAt": null
  }
}
```

#### Collection: `classes`
```json
{
  "class1": {
    "teacherId": "teacherId456",
    "title": "Doubt Clearing Session",
    "dateTime": "2024-01-25T15:00:00.000Z",
    "duration": 60,
    "type": "doubt",
    "courseId": "course1",
    "status": "scheduled",
    "createdAt": "2024-01-18T00:00:00.000Z"
  }
}
```

#### Collection: `payouts`
```json
{
  "payout1": {
    "teacherId": "teacherId456",
    "amount": 45000,
    "status": "processing",
    "requestedAt": "2024-01-20T00:00:00.000Z",
    "processedAt": null
  }
}
```

---

## 🟠 3. Fix Student Dashboard Links

**File:** `src/pages/Student/Dashboard.tsx`

### Notifications
Add state and modal:
```tsx
const [showNotifications, setShowNotifications] = useState(false);

// In JSX:
<Button onClick={() => setShowNotifications(true)}>
  Notifications
</Button>

{showNotifications && (
  <NotificationModal onClose={() => setShowNotifications(false)} />
)}
```

### Browse Courses
```tsx
<Button onClick={() => navigate('/courses')}>
  Browse Courses
</Button>
```

### Leaderboard
```tsx
<Button onClick={() => navigate('/leaderboard')}>
  Leaderboard
</Button>
```

---

## 🔵 4. Fix Lesson Page to Show Correct Video

**File:** `src/pages/LessonPage.tsx`

**Add at top:**
```tsx
import { useParams } from 'react-router-dom';
import { getCourseById } from '../services/firebase';
import { useQuery } from '@tanstack/react-query';

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  
  // Fetch course data
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });

  // Find the specific lesson
  const lesson = course?.lessons?.find(l => l.id === lessonId);
  const videoUrl = lesson?.videoUrl || '';

  // Extract YouTube video ID
  const videoId = videoUrl.split('v=')[1]?.split('&')[0];

  return (
    // Use videoId in YouTube player
    <YouTube videoId={videoId} ... />
  );
};
```

---

## 🟢 5. Add Comments Feature

**File:** `src/pages/LessonPage.tsx`

```tsx
import { addComment, getComments } from '../services/firebase';

const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState('');

// Fetch comments
useEffect(() => {
  if (courseId && lessonId) {
    getComments(courseId, lessonId).then(setComments);
  }
}, [courseId, lessonId]);

const handleAddComment = async () => {
  if (!newComment.trim()) return;
  
  await addComment(
    courseId!,
    lessonId!,
    user!.id,
    user!.name,
    newComment
  );
  
  setNewComment('');
  // Refresh comments
  const updated = await getComments(courseId!, lessonId!);
  setComments(updated);
  toast.success('Comment added!');
};

// In JSX:
<div className="comments-section">
  <input
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Add a comment..."
  />
  <Button onClick={handleAddComment}>Post Comment</Button>
  
  {comments.map(c => (
    <div key={c.id}>
      <strong>{c.userName}</strong>: {c.comment}
    </div>
  ))}
</div>
```

---

## 🟣 6. Add Download Notes Button

**File:** `src/pages/LessonPage.tsx`

```tsx
const handleDownloadNotes = () => {
  if (lesson?.notesUrl) {
    window.open(lesson.notesUrl, '_blank');
    toast.success('Opening notes...');
  } else {
    toast.error('Notes not available for this lesson');
  }
};

// In JSX:
<Button onClick={handleDownloadNotes} icon="📄">
  Download Class Notes
</Button>
```

---

## 🔴 7. Fix Teacher Dashboard Buttons

**File:** `src/pages/Teacher/Dashboard.tsx`

### Schedule Class
```tsx
import { scheduleClass } from '../../services/firebase';

const [showScheduleModal, setShowScheduleModal] = useState(false);
const [classData, setClassData] = useState({
  title: '',
  dateTime: '',
  duration: 60,
  type: 'regular',
});

const handleScheduleClass = async () => {
  const { user } = useAuthStore.getState();
  
  await scheduleClass(
    user!.id,
    classData.title,
    new Date(classData.dateTime),
    classData.duration,
    classData.type as 'doubt' | 'regular'
  );
  
  toast.success('Class scheduled successfully!');
  setShowScheduleModal(false);
};
```

### Answer Doubt Now
```tsx
import { updateDoubtStatus } from '../../services/firebase';

const handleAnswerDoubt = (doubtId: string) => {
  // Open chat modal or navigate to doubt resolution page
  navigate(`/teacher/doubt/${doubtId}`);
};
```

### Schedule Doubt Session
```tsx
const handleScheduleDoubt = async (doubtId: string, dateTime: Date) => {
  await updateDoubtStatus(doubtId, 'scheduled', dateTime);
  toast.success('Doubt session scheduled!');
};
```

---

## 💰 8. Implement Payout Request

**File:** `src/pages/Teacher/Dashboard.tsx`

```tsx
import { requestPayout } from '../../services/firebase';

const [showPayoutModal, setShowPayoutModal] = useState(false);
const [payoutAmount, setPayoutAmount] = useState(0);

const handleRequestPayout = async () => {
  const { user } = useAuthStore.getState();
  
  try {
    await requestPayout(user!.id, payoutAmount);
    toast.success(`Payout of ₹${payoutAmount.toLocaleString()} is processing! 💰`);
    setShowPayoutModal(false);
    
    // Update local state
    setStats(prev => ({
      ...prev,
      netEarnings: 0,
    }));
  } catch (error: any) {
    toast.error(error.message);
  }
};

// In JSX (Earnings Tab):
<Button onClick={() => {
  setPayoutAmount(stats.netEarnings);
  setShowPayoutModal(true);
}}>
  Request Payout
</Button>

{showPayoutModal && (
  <Modal>
    <h2>Request Payout</h2>
    <p>Amount: ₹{payoutAmount.toLocaleString()}</p>
    <Button onClick={handleRequestPayout}>Confirm Payout</Button>
    <Button onClick={() => setShowPayoutModal(false)}>Cancel</Button>
  </Modal>
)}
```

---

## 📋 Quick Testing Steps

1. **Test Teacher Auth:**
   - Register as teacher → Should redirect to qualification test
   - Fail test (score <80%) → Should NOT be able to login
   - Pass test (score ≥80%) → Should auto-login to teacher dashboard

2. **Test Student Features:**
   - Register as student → Should go directly to dashboard
   - Enroll in course → Check Firestore `enrollments` collection
   - Add comment → Check Firestore `comments` collection

3. **Test Teacher Features:**
   - Schedule class → Check Firestore `classes` collection
   - Request payout → Check Firestore `payouts` collection
   - View doubts → Check Firestore `doubts` collection

---

## 🚨 Common Errors & Fixes

### Error: "Property 'env' does not exist"
**Fix:** Use `process.env.REACT_APP_` not `import.meta.env.VITE_`

### Error: "Firebase not initialized"
**Fix:** Check `.env` file exists and has correct credentials

### Error: "Permission denied"
**Fix:** Update Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📦 Required NPM Packages

Already installed:
- ✅ firebase
- ✅ react-router-dom
- ✅ @tanstack/react-query
- ✅ react-hot-toast

---

## 🎯 Next Steps

1. Setup Firebase project and get credentials
2. Add credentials to `.env` file
3. Create sample data in Firestore collections
4. Test each feature one by one
5. Fix any TypeScript errors as they appear

**Happy Coding! 🚀**
