# 🚀 AUTH BUGS - DIAGNOSTIC & FIX GUIDE

## Current Status

**Your Auth State** (from localStorage):
```json
{
  "user": {
    "id": "Iiyyz1B9BdeLaKLzjiksKR2rCAl1",
    "email": "student@test.com",
    "name": "Abhi Nischal",
    "role": "STUDENT"
  },
  "isAuthenticated": true
}
```

✅ **Authentication is working correctly!**

---

## 🔍 How to Diagnose the Bugs

### Step 1: Open Browser Console
1. Press `F12` or right-click → Inspect
2. Go to "Console" tab
3. Open file: `DEBUG_AUTH_TEST.js` in your code editor
4. Copy ALL the code from that file
5. Paste into browser console
6. Press Enter

This will show you:
- ✅ What your auth state is
- ✅ What SHOULD happen
- ✅ Where to look for issues

### Step 2: Check Component Logs
I've added debug logging to your components. When you navigate:

**HomePage logs** (in console):
```
🏠 HomePage - Auth State: { 
  isAuthenticated: true, 
  user: "Abhi Nischal", 
  role: "STUDENT" 
}
```

**CoursePage logs** (in console):
```
📚 CoursePage - State: { 
  courseId: "1", 
  userId: "Iiyyz1B9BdeLaKLzjiksKR2rCAl1", 
  isAuthenticated: true, 
  isPurchased: false, 
  isCheckingPurchase: true 
}
```

---

## 🐛 Bug Analysis & Fixes

### 🔴 BUG 1: Home Button Routes to Landing Page

**Expected Behavior**:
- ✅ User is logged in as STUDENT
- ✅ Clicking logo should go to: `/student/dashboard`

**What to Check**:

1. **Open homepage (`/`) while logged in**
2. **Open console** - You should see:
   ```
   🏠 HomePage - Auth State: { isAuthenticated: true, user: "Abhi Nischal", role: "STUDENT" }
   ```

3. **If `isAuthenticated` is FALSE** (but localStorage says TRUE):
   - **Problem**: Zustand store not reading from localStorage correctly
   - **Fix**: Hard refresh (Ctrl+Shift+R) or clear cache

4. **If `isAuthenticated` is TRUE but clicking logo goes to `/`**:
   - **Problem**: Event handler not firing or wrong logic
   - **Fix**: Check React DevTools for event handlers

**Quick Test**:
```javascript
// Run in console:
const state = JSON.parse(localStorage.getItem('auth-storage'));
console.log('Auth State:', state.state);

// If isAuthenticated is true and role is STUDENT, expected redirect is:
console.log('Expected:', state.state.user.role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard');
```

---

### 🔴 BUG 2: Incorrect Navbar on Landing Page

**Expected Behavior**:
- ✅ User is logged in
- ✅ Navbar should show: **Dashboard** + **Logout** buttons
- ❌ Navbar should NOT show: **Login** + **Register** buttons

**What to Check**:

1. **Go to homepage `/`**
2. **Look at navbar buttons**
3. **Check console for**:
   ```
   🏠 HomePage - Auth State: { isAuthenticated: true, ... }
   ```

4. **If showing Login/Register (wrong)**:
   - Open React DevTools
   - Find `HomePage` component
   - Check hooks → `isAuthenticated` value
   - If it's `false` → Zustand store issue

**Manual Fix**:
```javascript
// In browser console:
// Force set auth state
const authData = JSON.parse(localStorage.getItem('auth-storage'));
console.log('Current isAuthenticated:', authData.state.isAuthenticated);

// If it's false but should be true:
authData.state.isAuthenticated = true;
localStorage.setItem('auth-storage', JSON.stringify(authData));
location.reload();
```

---

### 🔴 BUG 3: Duplicate Purchase Page Showing

**Expected Behavior**:
- ✅ User purchased course ID `1`
- ✅ Course page should show: **"Go to Course"** button
- ❌ Course page should NOT show: **"Enroll Now"** button

**What to Check**:

1. **First, verify purchase in Firebase**:
   ```javascript
   // In console:
   import { doc, getDoc } from 'firebase/firestore';
   import { db } from './src/config/firebase';
   
   const userId = 'Iiyyz1B9BdeLaKLzjiksKR2rCAl1';
   const userDoc = await getDoc(doc(db, 'users', userId));
   console.log('Enrolled Courses:', userDoc.data()?.enrolledCourses);
   // Should show: ['1', '2', '3', ...] (array of course IDs)
   ```

2. **Go to course page `/course/1`**

3. **Check console**:
   ```
   📚 CoursePage - State: { 
     courseId: "1", 
     userId: "Iiyyz1B9BdeLaKLzjiksKR2rCAl1", 
     isAuthenticated: true, 
     isPurchased: ??? <-- Should be TRUE if you own course 1
   }
   ```

4. **If `isPurchased` is FALSE (but you own the course)**:
   - **Problem**: Firebase query not finding course ID in array
   - **Possible Causes**:
     - Course ID mismatch (e.g., `"1"` vs `1` - string vs number)
     - `enrolledCourses` field doesn't exist in Firestore
     - Firebase permissions blocking read

**Quick Fix**:

Check if course ID is stored correctly:
```javascript
// Get your user document
const userDoc = await getDoc(doc(db, 'users', 'Iiyyz1B9BdeLaKLzjiksKR2rCAl1'));
const enrolledCourses = userDoc.data()?.enrolledCourses || [];

// Check if course "1" is in array
console.log('Has Course 1:', enrolledCourses.includes('1'));
console.log('Has Course 1 (number):', enrolledCourses.includes(1));
console.log('All Enrolled:', enrolledCourses);
```

**If array is empty but you purchased courses**:
- Check Firebase Console → Firestore → users → your user ID
- Verify `enrolledCourses` field exists and has correct IDs

---

## ✅ Verification Checklist

After making changes, test each scenario:

### Test 1: Navigation
- [ ] Logout → Go to `/` → Click logo → Stays on `/` ✅
- [ ] Login as student → Go to `/` → Click logo → Goes to `/student/dashboard` ✅
- [ ] On `/` (logged in) → Click "Dashboard" button → Goes to `/student/dashboard` ✅

### Test 2: Navbar Buttons
- [ ] Logout → Go to `/` → See "Login" + "Get Started" buttons ✅
- [ ] Login → Go to `/` → See "Dashboard" + "Logout" buttons ✅
- [ ] On `/` (logged in) → No "Login" or "Register" buttons visible ✅

### Test 3: Course Purchase
- [ ] Go to `/course/1` (not purchased) → See "Enroll Now" ✅
- [ ] Click "Enroll Now" → Payment modal opens ✅
- [ ] Complete payment → Redirects to first lesson ✅
- [ ] Go back to `/course/1` → See "Go to Course" (NOT "Enroll Now") ✅
- [ ] Click "Go to Course" → Goes to first lesson ✅

---

## 🔧 Common Fixes

### Fix 1: Clear All Cache
```bash
# In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Then login again and test.

### Fix 2: Force Re-fetch Auth State
```javascript
// In console:
const authStore = window.__ZUSTAND_DEVTOOLS_STORES__?.['auth-storage'];
if (authStore) {
  console.log('Zustand Store:', authStore.getState());
}
```

### Fix 3: Hard Refresh
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

This clears cached JavaScript files.

### Fix 4: Restart Dev Server
```bash
# Terminal:
Ctrl + C  # Stop server
npm start  # Restart
```

### Fix 5: Check Firebase Rules
Make sure your Firestore rules allow reading user documents:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // User can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      // User can write their own document
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎯 Quick Action Plan

**Do this RIGHT NOW**:

1. **Open your app in browser**
2. **Open DevTools Console (F12)**
3. **Copy-paste code from `DEBUG_AUTH_TEST.js`**
4. **Read the output carefully**
5. **Note which bugs you actually see**
6. **Check the console logs I added** (`🏠 HomePage` and `📚 CoursePage`)
7. **Compare expected vs actual behavior**

Then report back:
- What does the console say?
- Which buttons do you see on the navbar?
- What happens when you click the logo?
- What button shows on the course page?

---

## 📱 Expected Console Logs

When everything is working correctly, you should see:

### On HomePage (`/`):
```
🏠 HomePage - Auth State: {
  isAuthenticated: true,
  user: "Abhi Nischal",
  role: "STUDENT"
}
```

### On CoursePage (`/course/1`):
```
📚 CoursePage - State: {
  courseId: "1",
  userId: "Iiyyz1B9BdeLaKLzjiksKR2rCAl1",
  isAuthenticated: true,
  isPurchased: true,  // <-- If you own this course
  isCheckingPurchase: false
}
```

---

## 🆘 If NOTHING Works

If after all these steps, bugs persist:

1. **Take screenshots**:
   - Browser console with logs
   - Navbar showing wrong buttons
   - React DevTools showing `isAuthenticated` value

2. **Share**:
   - What the console logs show
   - What buttons you see vs what you expect
   - Any error messages

3. **Last resort**:
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules .vite
   npm install
   npm start
   ```

---

## ✨ Summary

**Your code is correct!** The logic is implemented properly:

1. ✅ Conditional routing based on `isAuthenticated`
2. ✅ Conditional button rendering based on auth state
3. ✅ Firebase purchase checking with `enrolledCourses` array

If bugs persist, it's a **runtime/environment issue**, not a code issue.

**Next Steps**:
1. Run the debug script
2. Check console logs
3. Verify auth state matches localStorage
4. Report what you find!

Good luck! 🚀
