# 🧪 Firebase Integration Testing Guide

## Quick Test Checklist

### ✅ BUG 1: Duplicate Purchase Prevention

**Test Steps:**
```
1. Login as student
2. Go to /course/1
3. Click "Enroll Now" → Complete payment
4. Return to /course/1
5. ✓ Button should show "Go to Course" ✅
6. ✓ Cannot purchase again
```

**Firestore Verification:**
```javascript
// Firebase Console → Firestore → users/{userId}
{
  "enrolledCourses": ["1"]  // ← Course ID added
}
```

---

### ✅ BUG 2: Purchased Courses Display

**Test Steps:**
```
1. Login as student
2. Purchase 2 courses
3. Go to /student/dashboard
4. ✓ "My Courses" section appears
5. ✓ Shows "2 enrolled"
6. ✓ Both courses display as cards
```

**Firestore Verification:**
```javascript
// Firebase Console → Firestore → users/{userId}
{
  "enrolledCourses": ["1", "2"]
}

// courses/1, courses/2 should exist
```

---

### ✅ BUG 3: Home Button Routing

**Test Steps:**
```
NOT LOGGED IN:
1. Click logo → Goes to /
2. Navigation shows: Login | Get Started

LOGGED IN (Student):
1. Click logo → Goes to /student/dashboard
2. Click "Home" button → Stays on /student/dashboard
3. From /courses → Click "Home" → /student/dashboard

LOGGED IN (Teacher):
1. Click logo → Goes to /teacher/dashboard
```

---

## 🔍 Firebase Console Checks

### Check User Document
```
1. Open Firebase Console
2. Go to Firestore Database
3. Navigate to: users/{userId}
4. Verify fields:
   - enrolledCourses: []  (array)
   - role: "STUDENT"
   - email: "user@example.com"
```

### Check Course Documents
```
1. Navigate to: courses/{courseId}
2. Verify fields exist:
   - id: "1"
   - title: "Course Name"
   - thumbnail: "https://..."
   - price: 599
   - rating: 4.8
   - totalStudents: 2456
   - duration: 45
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Checking..." Never Changes
**Problem:** Button stuck on "Checking..."
**Fix:** Check Firebase config in `.env` file
```bash
# .env
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

### Issue 2: "Failed to check purchase status"
**Problem:** Cannot read from Firestore
**Fix:** Check Firestore security rules
```javascript
// Allow read for authenticated users
allow read: if request.auth != null;
```

### Issue 3: Courses Not Displaying on Dashboard
**Problem:** "My Courses" section empty after purchase
**Fix 1:** Check user document has enrolledCourses array
**Fix 2:** Check course documents exist in Firestore
**Fix 3:** Open console, look for errors

### Issue 4: Payment Fails
**Problem:** Error toast: "Payment failed"
**Fix:** Check user.id exists and Firestore write rules allow update

---

## 🔥 Firebase Security Rules (Required!)

Copy these rules to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/update their own document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read courses
    match /courses/{courseId} {
      allow read: if true;
    }
  }
}
```

**Click "Publish" to save rules!**

---

## 📊 Expected Console Logs

### When Loading Course Page:
```
✅ User already owns this course
```
OR
```
⏳ Checking purchase status...
```

### When Purchasing:
```
🔥 Processing payment...
✅ Course added to Firestore
✅ Local state updated
🎉 Enrollment successful!
```

### When Loading Dashboard:
```
⏳ Fetching purchased courses...
✅ Loaded purchased courses: 2
```

---

## 🎯 Success Criteria

### All Tests Pass When:

1. **Purchase Prevention Works:**
   - [ ] First visit shows "Enroll Now"
   - [ ] After purchase shows "Go to Course"
   - [ ] Button disabled during processing
   - [ ] Toast shows success message
   - [ ] Course ID in Firestore array

2. **Dashboard Display Works:**
   - [ ] "My Courses" section appears
   - [ ] Correct enrollment count
   - [ ] Course cards display with images
   - [ ] Clicking course navigates correctly
   - [ ] Empty state if no courses

3. **Navigation Works:**
   - [ ] Logo routes based on auth state
   - [ ] Home button visible when logged in
   - [ ] Dashboard button on landing page
   - [ ] No redirect loops

---

## 🚀 Quick Commands

```bash
# Start dev server
npm start

# Open Firebase Console
https://console.firebase.google.com

# Clear browser cache
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)

# View Firestore data
Firebase Console → Firestore Database

# Check Network Tab
F12 → Network → Filter: "firestore"
```

---

## 📞 Troubleshooting Steps

1. **Clear browser cache and reload**
2. **Check Firebase Console for data**
3. **Verify security rules are published**
4. **Check browser console for errors**
5. **Check network tab for failed requests**
6. **Restart development server**

---

## ✨ All Features Working!

If all tests pass, you have:
- ✅ Real-time duplicate purchase prevention
- ✅ Live purchased courses display
- ✅ Smart navigation routing
- ✅ Full Firebase CRUD integration

**Your app is production-ready! 🎉**
