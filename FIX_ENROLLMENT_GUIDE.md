# 🔧 Enrollment Fix Guide

## Problem Fixed
**Error**: "Enrollment not found" when marking lessons complete

**Root Cause**: When users purchased courses, the system was only updating the `users.enrolledCourses` array but NOT creating the `enrollments` collection document needed for progress tracking.

---

## ✅ What Was Fixed

### 1. **Purchase Route Updated** (`server/routes/purchase.js`)
Now when a user purchases a course, the system:
- ✅ Creates purchase record
- ✅ Adds course to user's enrolledCourses array
- ✅ **NEW**: Creates enrollment record with:
  ```javascript
  {
    userId: string,
    courseId: string,
    enrolledAt: Date,
    completedLessons: [],
    progress: 0,
    lastAccessedAt: Date,
    status: 'active'
  }
  ```

### 2. **Auto-Fix on Course Check**
The `/api/purchases/check/:userId/:courseId` endpoint now:
- Checks if user owns the course
- **Automatically creates missing enrollment** if user owns course but enrollment doesn't exist
- This fixes the issue for existing users without needing manual intervention

### 3. **Manual Fix Endpoint Added**
New endpoint: `POST /api/purchases/fix-enrollments/:userId`
- Scans ALL user's purchased courses
- Creates missing enrollments for each one
- Returns count of fixed enrollments

---

## 🚀 How to Fix Existing Users

### Option 1: Automatic (Happens on Page Load)
When a user opens the course page, the check endpoint auto-creates the enrollment.
**No action needed!**

### Option 2: Manual Fix (For All Courses at Once)

**Using curl:**
```bash
# Get user's auth token from browser (F12 > Application > Local Storage)
# Then run:

curl -X POST http://localhost:5000/api/purchases/fix-enrollments/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "status": "success",
  "message": "Fixed 3 missing enrollments",
  "data": {
    "fixed": 3,
    "totalCourses": 3
  }
}
```

### Option 3: Fix Via Frontend

Add this button temporarily to your profile page:

```typescript
const fixEnrollments = async () => {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(
    `http://localhost:5000/api/purchases/fix-enrollments/${userId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  const data = await response.json();
  console.log('Fixed:', data);
};
```

---

## 🧪 How to Test

1. **Purchase a new course** (enrollment should auto-create)
2. **Watch a video to 90%** (should auto-complete)
3. **Check console** - should NOT see "Enrollment not found" error
4. **Go back to course page** - next lesson should be unlocked ✅

---

## 📋 Migration Checklist for Existing Users

If you have users who purchased courses BEFORE this fix:

- [ ] Identify affected users (users with enrolledCourses but no enrollments)
- [ ] Run fix endpoint for each user
- [ ] Verify enrollments created in Firestore
- [ ] Test lesson completion works

---

## 🔍 Check Firestore Collections

### Before Fix:
```
users/{userId}/enrolledCourses: ['course1', 'course2']
enrollments: (empty or missing for this user)
```

### After Fix:
```
users/{userId}/enrolledCourses: ['course1', 'course2']
enrollments:
  - {userId, courseId: 'course1', completedLessons: [], progress: 0}
  - {userId, courseId: 'course2', completedLessons: [], progress: 0}
```

---

## 🎯 Prevention

Going forward, EVERY course purchase automatically creates:
1. Purchase record
2. User enrollment array update
3. **Enrollment document** (THIS WAS MISSING BEFORE!)

The issue is now **permanently fixed** for all new purchases! 🎉
