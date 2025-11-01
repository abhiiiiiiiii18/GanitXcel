/**
 * 🔍 AUTHENTICATION DEBUG TEST SCRIPT
 * 
 * Run this in your browser console to diagnose auth issues
 * Instructions: Copy and paste into DevTools Console while on any page
 */

console.log('%c🔍 AUTH DEBUG TEST STARTING...', 'color: #58CC02; font-size: 16px; font-weight: bold;');
console.log('═══════════════════════════════════════════════════════');

// TEST 1: Check localStorage
console.log('\n%c📦 TEST 1: LocalStorage Auth Data', 'color: #1CB0F6; font-weight: bold;');
const authData = localStorage.getItem('auth-storage');
if (authData) {
  const parsed = JSON.parse(authData);
  console.log('✅ Auth data found:', parsed);
  console.log('   • User ID:', parsed.state?.user?.id);
  console.log('   • User Name:', parsed.state?.user?.name);
  console.log('   • User Role:', parsed.state?.user?.role);
  console.log('   • Is Authenticated:', parsed.state?.isAuthenticated);
} else {
  console.log('❌ No auth data in localStorage!');
}

// TEST 2: Expected Navigation
console.log('\n%c🧭 TEST 2: Expected Navigation Behavior', 'color: #1CB0F6; font-weight: bold;');
if (authData) {
  const parsed = JSON.parse(authData);
  const isAuth = parsed.state?.isAuthenticated;
  const role = parsed.state?.user?.role;
  
  if (isAuth) {
    const expectedDashboard = role === 'STUDENT' ? '/student/dashboard' : '/teacher/dashboard';
    console.log('✅ User IS authenticated');
    console.log('   • Home button should go to:', expectedDashboard);
    console.log('   • Navbar should show: Dashboard + Logout buttons');
    console.log('   • Should NOT show: Login + Register buttons');
  } else {
    console.log('⚠️  User NOT authenticated');
    console.log('   • Home button should go to: /');
    console.log('   • Navbar should show: Login + Register buttons');
    console.log('   • Should NOT show: Dashboard + Logout buttons');
  }
}

// TEST 3: Check Current Page
console.log('\n%c📍 TEST 3: Current Page State', 'color: #1CB0F6; font-weight: bold;');
console.log('   • Current URL:', window.location.href);
console.log('   • Current Path:', window.location.pathname);

// TEST 4: Manual Navigation Test
console.log('\n%c🎯 TEST 4: Manual Navigation Functions', 'color: #1CB0F6; font-weight: bold;');
console.log('Run these commands to test navigation:');
console.log('   • window.location.href = "/"');
console.log('   • window.location.href = "/student/dashboard"');
console.log('   • window.location.href = "/course/1"');

// TEST 5: Force Logout (if needed)
console.log('\n%c🚪 TEST 5: Force Logout (if needed)', 'color: #1CB0F6; font-weight: bold;');
console.log('To force logout and clear state, run:');
console.log('   localStorage.removeItem("auth-storage");');
console.log('   localStorage.removeItem("ui-storage");');
console.log('   localStorage.removeItem("streak-storage");');
console.log('   location.reload();');

// TEST 6: Check Firebase User Doc (requires Firebase SDK loaded)
console.log('\n%c🔥 TEST 6: Check Firebase User Document', 'color: #1CB0F6; font-weight: bold;');
if (authData) {
  const parsed = JSON.parse(authData);
  const userId = parsed.state?.user?.id;
  if (userId) {
    console.log('To check Firebase user document, run:');
    console.log(`
// Copy this to console:
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const userDoc = await getDoc(doc(db, 'users', '${userId}'));
console.log('User Document:', userDoc.data());
console.log('Enrolled Courses:', userDoc.data()?.enrolledCourses);
    `);
  }
}

// TEST 7: BUG-SPECIFIC TESTS
console.log('\n%c🐛 TEST 7: Bug-Specific Checks', 'color: #FF6B6B; font-weight: bold;');
console.log('═══════════════════════════════════════════════════════');

// BUG 1: Home Button
console.log('\n🔴 BUG 1: Home Button Routing');
console.log('ACTION: Click the logo or "Home" button');
console.log('EXPECTED: Should go to /student/dashboard (you are logged in as STUDENT)');
console.log('ACTUAL: Check where it actually goes');
console.log('STATUS: Watch the console for "🏠 HomePage - Auth State" log');

// BUG 2: Navbar Buttons
console.log('\n🔴 BUG 2: Navbar Button Visibility');
console.log('ACTION: Look at the navbar on the landing page (/)');
console.log('EXPECTED: Should show "Dashboard" + "Logout" buttons');
console.log('ACTUAL: What buttons do you see?');
console.log('STATUS: Check the React DevTools component state');

// BUG 3: Duplicate Purchase
console.log('\n🔴 BUG 3: Duplicate Purchase Detection');
console.log('ACTION: Go to /course/1 or any course page');
console.log('EXPECTED: If already purchased, show "Go to Course" button');
console.log('ACTUAL: Watch console for "📚 CoursePage - State" log');
console.log('STATUS: Check if isPurchased is true/false');

console.log('\n═══════════════════════════════════════════════════════');
console.log('%c✅ DEBUG TEST COMPLETE!', 'color: #58CC02; font-size: 16px; font-weight: bold;');
console.log('Check the logs above and compare expected vs actual behavior.');
console.log('If bugs persist, check:');
console.log('  1. Browser cache (hard refresh: Ctrl+Shift+R)');
console.log('  2. React DevTools → Components → useAuthStore state');
console.log('  3. Network tab → Firebase requests');
console.log('═══════════════════════════════════════════════════════\n');
