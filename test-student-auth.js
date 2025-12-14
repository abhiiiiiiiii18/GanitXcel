/**
 * 🧪 STUDENT AUTHENTICATION TEST SUITE
 * 
 * This file helps diagnose Firebase authentication issues for students
 * Run this in browser console to debug auth problems
 * 
 * Usage:
 * 1. Open browser DevTools console
 * 2. Copy and paste this entire file
 * 3. Review the output for issues
 */

console.log('%c🧪 STUDENT AUTH TEST SUITE STARTING...', 'color: #58CC02; font-size: 18px; font-weight: bold;');
console.log('═══════════════════════════════════════════════════════════════');

// ==================== TEST 1: Environment Variables ====================
console.log('\n%c📋 TEST 1: Firebase Environment Variables', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== 'undefined') {
    console.log(`   ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.error(`   ❌ ${varName}: MISSING or UNDEFINED`);
  }
});

// ==================== TEST 2: LocalStorage Auth State ====================
console.log('\n%c💾 TEST 2: LocalStorage Auth State', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

const authStorage = localStorage.getItem('auth-storage');
if (authStorage) {
  try {
    const parsed = JSON.parse(authStorage);
    console.log('   ✅ Auth storage found');
    console.log('   📊 Auth State:', {
      isAuthenticated: parsed.state?.isAuthenticated,
      userId: parsed.state?.user?.id,
      userName: parsed.state?.user?.name,
      userEmail: parsed.state?.user?.email,
      userRole: parsed.state?.user?.role,
    });
    
    if (parsed.state?.isAuthenticated && parsed.state?.user?.role === 'STUDENT') {
      console.log('   ✅ STUDENT is logged in locally');
    } else if (parsed.state?.isAuthenticated) {
      console.log('   ⚠️  User logged in but role is:', parsed.state?.user?.role);
    } else {
      console.log('   ❌ User NOT authenticated in localStorage');
    }
  } catch (error) {
    console.error('   ❌ Failed to parse auth storage:', error);
  }
} else {
  console.log('   ❌ No auth storage found in localStorage');
}

// ==================== TEST 3: Firebase Auth State ====================
console.log('\n%c🔐 TEST 3: Firebase Current User', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

// Try to access Firebase auth (this assumes Firebase is already initialized)
try {
  // Access the global firebase instance if available
  if (window.firebase && window.firebase.auth) {
    const currentUser = window.firebase.auth().currentUser;
    if (currentUser) {
      console.log('   ✅ Firebase user signed in');
      console.log('   📊 Firebase User:', {
        uid: currentUser.uid,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
      });
    } else {
      console.log('   ❌ No Firebase user currently signed in');
    }
  } else {
    console.log('   ⚠️  Firebase not accessible in window (this is normal with modular SDK)');
    console.log('   ℹ️  Check the Network tab for Firebase API calls');
  }
} catch (error) {
  console.log('   ⚠️  Could not check Firebase auth state:', error.message);
}

// ==================== TEST 4: Network Connectivity ====================
console.log('\n%c🌐 TEST 4: Network & Firebase Connectivity', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

// Check if we can reach Firebase
fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo')
  .then(() => {
    console.log('   ✅ Firebase Identity Toolkit API is reachable');
  })
  .catch(() => {
    console.error('   ❌ Cannot reach Firebase Identity Toolkit API');
    console.error('   ⚠️  Check your internet connection');
  });

// ==================== TEST 5: Recommended Actions ====================
console.log('\n%c🔧 TEST 5: Troubleshooting Recommendations', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

const authData = authStorage ? JSON.parse(authStorage) : null;
const isStudentLoggedIn = authData?.state?.isAuthenticated && authData?.state?.user?.role === 'STUDENT';

if (!isStudentLoggedIn) {
  console.log('\n%c🔴 STUDENT NOT LOGGED IN - Try these steps:', 'color: #FF4B4B; font-weight: bold;');
  console.log('   1️⃣  Open browser console before logging in');
  console.log('   2️⃣  Enter student email and password');
  console.log('   3️⃣  Click "Log In" button');
  console.log('   4️⃣  Watch for console logs starting with 🔐, ✅, or ❌');
  console.log('   5️⃣  Check for any error messages');
  console.log('   6️⃣  Verify you\'re using the correct email/password');
  console.log('   7️⃣  Make sure you registered as a STUDENT, not TEACHER');
} else {
  console.log('\n%c🟢 STUDENT LOGGED IN SUCCESSFULLY!', 'color: #58CC02; font-weight: bold;');
  console.log('   ✅ Student Name:', authData.state.user.name);
  console.log('   ✅ Student Email:', authData.state.user.email);
  console.log('   ✅ User ID:', authData.state.user.id);
}

// ==================== TEST 6: Common Issues Checklist ====================
console.log('\n%c📝 TEST 6: Common Issues Checklist', 'color: #1CB0F6; font-size: 14px; font-weight: bold;');

const commonIssues = [
  {
    issue: 'Wrong email or password',
    check: '   • Double-check credentials',
  },
  {
    issue: 'Registered as TEACHER instead of STUDENT',
    check: '   • Verify role during registration',
  },
  {
    issue: 'Firestore user profile not created',
    check: '   • Check Firebase Console > Firestore > users collection',
  },
  {
    issue: 'Network/Internet issues',
    check: '   • Test Firebase API connectivity above',
  },
  {
    issue: 'Browser blocking third-party cookies',
    check: '   • Check browser privacy settings',
  },
  {
    issue: 'Firebase configuration incorrect',
    check: '   • Verify .env variables match Firebase Console',
  },
];

commonIssues.forEach((item, index) => {
  console.log(`\n   ${index + 1}. ${item.issue}`);
  console.log(`      ${item.check}`);
});

// ==================== FINAL SUMMARY ====================
console.log('\n%c═══════════════════════════════════════════════════════════════', 'color: #58CC02;');
console.log('%c✅ TEST SUITE COMPLETED', 'color: #58CC02; font-size: 16px; font-weight: bold;');
console.log('%cCheck the results above for any ❌ errors', 'color: #888;');
console.log('%cIf issues persist, try logging in with console open', 'color: #888;');
console.log('═══════════════════════════════════════════════════════════════\n');
