# Firebase Integration Testing Guide

## ✅ Setup Complete
- Firebase project: `ganitxcel`
- Authentication: Enabled
- Firestore Database: Enabled
- Sample course: `algebra-basics` with 2 lessons

## 🧪 Test Scenarios

### Test 1: Register as Student ✨
**Steps:**
1. Open `http://localhost:3000` in your browser
2. Click "Get Started" or navigate to `/register`
3. Fill in the form:
   - Email: `student1@test.com`
   - Password: `test123456`
   - Name: `John Student`
   - Role: Select **Student**
4. Click "Register"

**Expected Result:**
- ✅ Success toast: "Registration successful! 🎉"
- ✅ Redirected to Student Dashboard
- ✅ User profile created in Firestore `users` collection
- ✅ Can see dashboard with student features

**Check Firebase Console:**
- Go to Authentication → Users → Should see `student1@test.com`
- Go to Firestore → `users` collection → Should see new document with role: "STUDENT"

---

### Test 2: View Course with Firebase Video 📹
**Steps:**
1. While logged in as student, navigate to: `http://localhost:3000/lesson/algebra-basics/1`
2. Wait for page to load

**Expected Result:**
- ✅ YouTube video "Introduction to Variables" loads
- ✅ Video ID fetched from Firestore (NybHckSEQBI)
- ✅ Comments section visible at bottom
- ✅ "Download Notes" button present

**Check Browser Console (F12):**
- Should see no Firebase errors
- Network tab should show successful Firestore requests

---

### Test 3: Add Comment 💬
**Steps:**
1. On the lesson page, scroll to "Discussion & Comments"
2. Type a comment: `This lesson is very helpful!`
3. Click "Post Comment"

**Expected Result:**
- ✅ Success toast: "Comment added! 💬"
- ✅ Comment appears immediately in the list
- ✅ Shows your name and timestamp

**Check Firestore:**
- Go to Firestore → `comments` collection
- Should see new document with:
  - courseId: "algebra-basics"
  - lessonId: "1"
  - userId: (your user ID)
  - content: "This lesson is very helpful!"

---

### Test 4: Register as Teacher 👨‍🏫
**Steps:**
1. Logout (if logged in)
2. Navigate to `/register`
3. Fill in the form:
   - Email: `teacher1@test.com`
   - Password: `test123456`
   - Name: `Jane Teacher`
   - Role: Select **Teacher**
4. Click "Register"

**Expected Result:**
- ✅ Success toast about registration
- ✅ Redirected to **Teacher Test Page** (not dashboard)
- ✅ See qualification test with math questions

---

### Test 5: Pass Teacher Qualification Test 🎓
**Steps:**
1. On Teacher Test Page, answer the questions:
   - Question 1: `x = 5` (type: 5)
   - Question 2: `7` (select from options)
   - Question 3: `4` (type: 4)
   - Question 4: `12` (select from options)
   - Question 5: `2` (type: 2)
2. Click "Submit Test"

**Expected Result:**
- ✅ Score: 100% (5/5 correct)
- ✅ Success animation and confetti 🎉
- ✅ Toast: "Teacher account created successfully!"
- ✅ Auto-logged in to Teacher Dashboard after 2 seconds
- ✅ Firestore user document updated: `isQualified: true`

**Check Firestore:**
- Go to `users` collection → Find teacher document
- Should have `isQualified: true` and `qualificationScore: 100`

---

### Test 6: Test Teacher Dashboard Features 🎯
**Steps:**
1. On Teacher Dashboard, click "Schedule Class" button
2. Fill in the modal:
   - Date: (select future date)
   - Time: (select time)
   - Topic: `Quadratic Equations`
3. Click "Schedule"

**Expected Result:**
- ✅ Success toast: "Class scheduled successfully!"
- ✅ Modal closes
- ✅ New document created in Firestore `classes` collection

**Check Firestore:**
- Go to `classes` collection
- Should see new class with:
  - teacherId: (your teacher ID)
  - date, time, topic fields
  - status: "scheduled"

---

### Test 7: Request Payout 💰
**Steps:**
1. On Teacher Dashboard, click "Request Payout"
2. Enter amount: `500`
3. Click "Confirm Payout"

**Expected Result:**
- ✅ Success toast: "Payout requested!"
- ✅ Modal closes
- ✅ New document in Firestore `payouts` collection

**Check Firestore:**
- Go to `payouts` collection
- Should see payout request with:
  - teacherId: (your teacher ID)
  - amount: 500
  - status: "pending"

---

### Test 8: Login Validation (Teacher not qualified) ❌
**Steps:**
1. Go to Firestore → `users` collection
2. Find your teacher document, edit and set `isQualified: false`
3. Logout from app
4. Try to login with teacher credentials

**Expected Result:**
- ✅ Error toast: "Teacher account not qualified. Please complete the qualification test."
- ✅ Not allowed to login
- ✅ Stays on login page

---

### Test 9: Navigate Between Lessons 📚
**Steps:**
1. Login as student
2. Navigate to: `http://localhost:3000/lesson/algebra-basics/2`

**Expected Result:**
- ✅ Different video loads: "Solving Linear Equations"
- ✅ Video ID: kkGeOWYOFoA
- ✅ Comments are specific to lesson 2
- ✅ Different notes URL

---

## 🐛 Common Issues & Solutions

### Issue: "Firebase not initialized"
**Solution:** Make sure `.env` file is in project root and restart dev server

### Issue: "Permission denied" errors
**Solution:** 
1. Go to Firebase Console → Firestore Database
2. Click "Rules" tab
3. Make sure test mode rules are active (allow read, write)

### Issue: Video not loading
**Solution:**
1. Check Firestore `courses` collection
2. Verify `lessons` array has proper `videoUrl` field
3. Make sure videoUrl is full YouTube URL (not just video ID)

### Issue: Comments not appearing
**Solution:**
1. Check browser console for errors
2. Verify user is logged in (check auth state)
3. Check Firestore security rules

---

## 📊 Firebase Console Checks

After all tests, your Firebase should have:

**Authentication:**
- 2 users: student1@test.com, teacher1@test.com

**Firestore Collections:**
- `users`: 2 documents (1 student, 1 teacher)
- `courses`: 1 document (algebra-basics)
- `comments`: At least 1 comment document
- `classes`: At least 1 scheduled class
- `payouts`: At least 1 payout request

---

## ✅ Success Criteria

All tests passing means:
- ✅ Firebase Authentication working
- ✅ Firestore CRUD operations functioning
- ✅ Teacher qualification system operational
- ✅ Course/lesson data fetching correctly
- ✅ Comments system integrated
- ✅ Teacher dashboard features connected

---

## 🚀 Next Steps After Testing

1. Add more courses to Firestore
2. Implement AI chatbot with Google Gemini
3. Add enrollment system for students
4. Build course creation page for teachers
5. Add payment integration for course purchases
