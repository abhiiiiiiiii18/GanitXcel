import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Import the already initialized Firebase services from config
import { auth, db } from '../config/firebase';

// ==================== AUTH FUNCTIONS ====================

/**
 * Register a new user with email/password and create their profile in Firestore
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: 'STUDENT' | 'TEACHER'
) => {
  try {
    console.log('📝 Registering new user:', { email, name, role });
    
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Firebase auth user created, UID:', user.uid);

    // Create user profile in Firestore
    const userProfile = {
      id: user.uid,
      email,
      name,
      role,
      createdAt: serverTimestamp(),
      isQualified: role === 'STUDENT' ? true : false, // Teachers need to pass qualification test
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      enrolledCourses: [],
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('✅ User profile created in Firestore');

    return { user, profile: userProfile };
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists. Please login instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

/**
 * Login user with email/password
 * For teachers, verify they are qualified before allowing login
 */
export const loginUser = async (email: string, password: string) => {
  try {
    console.log('🔐 Attempting login for:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Firebase auth successful, UID:', user.uid);

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.error('❌ User profile not found in Firestore for UID:', user.uid);
      throw new Error('User profile not found. Please contact support.');
    }

    const userProfile = userDoc.data();
    console.log('📋 User profile loaded:', {
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      isQualified: userProfile.isQualified
    });

    // If teacher, check if qualified
    if (userProfile.role === 'TEACHER' && !userProfile.isQualified) {
      await signOut(auth); // Log them out immediately
      console.warn('⚠️ Teacher not qualified yet');
      throw new Error('Teacher not qualified. Please complete the qualification test first.');
    }

    console.log('✅ Login successful for', userProfile.role);
    return { user, profile: userProfile };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please register first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    }
    
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
};

/**
 * Get current user profile from Firestore
 */
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return userDoc.data();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, updates: any) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Mark teacher as qualified after passing test
 */
export const qualifyTeacher = async (uid: string, testScore: number) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      isQualified: true,
      qualificationScore: testScore,
      qualifiedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to qualify teacher');
  }
};

// ==================== COURSES FUNCTIONS ====================

/**
 * Get all courses
 */
export const getAllCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch courses');
  }
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (courseId: string) => {
  try {
    console.log('🔥 Firebase - Fetching course:', courseId);
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    console.log('🔥 Firebase - Document exists:', courseDoc.exists());
    if (!courseDoc.exists()) {
      console.error('🔥 Firebase - Course not found:', courseId);
      throw new Error('Course not found');
    }
    const data = courseDoc.data();
    console.log('🔥 Firebase - Raw data:', data);
    const result = { id: courseDoc.id, ...data };
    console.log('🔥 Firebase - Returning:', result);
    return result;
  } catch (error: any) {
    console.error('🔥 Firebase - Error:', error);
    throw new Error(error.message || 'Failed to fetch course');
  }
};

/**
 * Get courses by teacher ID
 */
export const getCoursesByTeacher = async (teacherId: string) => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('teacherId', '==', teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch teacher courses');
  }
};

/**
 * Enroll student in a course
 */
export const enrollInCourse = async (userId: string, courseId: string) => {
  try {
    const enrollmentData = {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      progress: 0,
      completedLessons: [],
      lastAccessedAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'enrollments'), enrollmentData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to enroll in course');
  }
};

/**
 * Get user's course progress (completed lessons)
 */
export const getCourseProgress = async (userId: string, courseId: string) => {
  try {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Check if user owns the course
      const userDoc = await getDoc(doc(db, 'users', userId));
      const enrolledCourses = userDoc.data()?.enrolledCourses || [];
      
      // If user owns course but enrollment is missing, create it
      if (enrolledCourses.includes(courseId)) {
        console.log('🔧 Auto-creating missing enrollment on progress check', userId, courseId);
        await addDoc(collection(db, 'enrollments'), {
          userId,
          courseId,
          enrolledAt: serverTimestamp(),
          completedLessons: [],
          progress: 0,
          lastAccessedAt: serverTimestamp(),
        });
      }
      
      return { completedLessons: [], progress: 0 };
    }
    
    const enrollment = snapshot.docs[0].data();
    return {
      completedLessons: enrollment.completedLessons || [],
      progress: enrollment.progress || 0,
      enrollmentId: snapshot.docs[0].id
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch progress');
  }
};

/**
 * Mark lesson as completed
 */
export const markLessonComplete = async (
  userId: string,
  courseId: string,
  lessonId: string
) => {
  try {
    // Find the enrollment
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    
    // If enrollment doesn't exist, create it (for users who purchased before the fix)
    if (snapshot.empty) {
      console.log('🔧 Auto-creating missing enrollment for', userId, courseId);
      const newEnrollmentRef = await addDoc(collection(db, 'enrollments'), {
        userId,
        courseId,
        enrolledAt: serverTimestamp(),
        completedLessons: [lessonId],
        progress: 0,
        lastAccessedAt: serverTimestamp(),
      });
      
      return { 
        alreadyCompleted: false,
        completedLessons: [lessonId],
        autoCreated: true
      };
    }
    
    const enrollmentDoc = snapshot.docs[0];
    const enrollment = enrollmentDoc.data();
    const completedLessons = enrollment.completedLessons || [];
    
    // Check if already completed
    if (completedLessons.includes(lessonId)) {
      return { alreadyCompleted: true };
    }
    
    // Add to completed lessons
    const updatedCompletedLessons = [...completedLessons, lessonId];
    
    // Update enrollment
    await updateDoc(doc(db, 'enrollments', enrollmentDoc.id), {
      completedLessons: updatedCompletedLessons,
      lastAccessedAt: serverTimestamp(),
    });
    
    return { 
      alreadyCompleted: false,
      completedLessons: updatedCompletedLessons
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark lesson complete');
  }
};

// ==================== COMMENTS FUNCTIONS ====================

/**
 * Add comment to a course/lesson
 */
export const addComment = async (
  courseId: string,
  lessonId: string,
  userId: string,
  userName: string,
  comment: string
) => {
  try {
    const commentData = {
      courseId,
      lessonId,
      userId,
      userName,
      comment,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'comments'), commentData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add comment');
  }
};

/**
 * Get comments for a lesson
 */
export const getComments = async (courseId: string, lessonId: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('courseId', '==', courseId),
      where('lessonId', '==', lessonId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch comments');
  }
};

// ==================== DOUBTS FUNCTIONS ====================

/**
 * Submit a doubt
 */
export const submitDoubt = async (
  studentId: string,
  studentName: string,
  courseId: string,
  question: string,
  subject: string
) => {
  try {
    const doubtData = {
      studentId,
      studentName,
      courseId,
      question,
      subject,
      status: 'pending',
      createdAt: serverTimestamp(),
      scheduledAt: null,
      resolvedAt: null,
    };

    const docRef = await addDoc(collection(db, 'doubts'), doubtData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit doubt');
  }
};

/**
 * Get all doubts for a teacher
 */
export const getDoubtsForTeacher = async (teacherId: string) => {
  try {
    // Get all courses by teacher
    const courses = await getCoursesByTeacher(teacherId);
    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) return [];

    // Get doubts for those courses
    const doubtsRef = collection(db, 'doubts');
    const q = query(doubtsRef, where('courseId', 'in', courseIds));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch doubts');
  }
};

/**
 * Update doubt status
 */
export const updateDoubtStatus = async (
  doubtId: string,
  status: 'pending' | 'scheduled' | 'resolved',
  scheduledAt?: Date
) => {
  try {
    const updates: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === 'scheduled' && scheduledAt) {
      updates.scheduledAt = Timestamp.fromDate(scheduledAt);
    }

    if (status === 'resolved') {
      updates.resolvedAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'doubts', doubtId), updates);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update doubt');
  }
};

// ==================== CLASSES FUNCTIONS ====================

/**
 * Schedule a new class
 */
export const scheduleClass = async (
  teacherId: string,
  title: string,
  dateTime: Date,
  duration: number,
  type: 'doubt' | 'regular',
  courseId?: string
) => {
  try {
    const classData = {
      teacherId,
      title,
      dateTime: Timestamp.fromDate(dateTime),
      duration,
      type,
      courseId: courseId || null,
      status: 'scheduled',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'classes'), classData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to schedule class');
  }
};

/**
 * Get classes for a teacher
 */
export const getClassesForTeacher = async (teacherId: string) => {
  try {
    const classesRef = collection(db, 'classes');
    const q = query(classesRef, where('teacherId', '==', teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch classes');
  }
};

// ==================== EARNINGS FUNCTIONS ====================

/**
 * Request payout for teacher
 */
export const requestPayout = async (
  teacherId: string,
  amount: number
) => {
  try {
    const payoutData = {
      teacherId,
      amount,
      status: 'processing',
      requestedAt: serverTimestamp(),
      processedAt: null,
    };

    const docRef = await addDoc(collection(db, 'payouts'), payoutData);
    
    // Update teacher's available balance to 0
    await updateDoc(doc(db, 'users', teacherId), {
      availableBalance: 0,
      lastPayoutAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to request payout');
  }
};

// ==================== LIVE CLASSES FUNCTIONS ====================

/**
 * Generate a dummy Google Meet link
 */
const generateMeetLink = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const random = () => chars[Math.floor(Math.random() * chars.length)];
  const part1 = Array(3).fill(0).map(random).join('');
  const part2 = Array(4).fill(0).map(random).join('');
  const part3 = Array(3).fill(0).map(random).join('');
  return `https://meet.google.com/${part1}-${part2}-${part3}`;
};

/**
 * Start a live class (Teacher)
 */
export const startLiveClass = async (
  teacherId: string,
  teacherName: string,
  courseId: string,
  courseName: string
) => {
  try {
    const meetLink = generateMeetLink();
    
    const liveClassData = {
      teacherId,
      teacherName,
      courseId,
      courseName,
      meetLink,
      createdAt: serverTimestamp(),
      isLive: true,
      studentsJoined: 0
    };

    const docRef = await addDoc(collection(db, 'liveClasses'), liveClassData);
    
    return { id: docRef.id, ...liveClassData, meetLink };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to start live class');
  }
};

/**
 * End a live class (Teacher)
 */
export const endLiveClass = async (classId: string) => {
  try {
    await updateDoc(doc(db, 'liveClasses', classId), {
      isLive: false,
      endedAt: serverTimestamp()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to end live class');
  }
};

/**
 * Get active live classes for student's enrolled courses
 */
export const getActiveLiveClasses = async (studentId: string) => {
  try {
    // Get student's enrolled courses
    const userDoc = await getDoc(doc(db, 'users', studentId));
    const enrolledCourses = userDoc.data()?.enrolledCourses || [];
    
    if (enrolledCourses.length === 0) {
      return [];
    }

    // Get all active live classes
    const liveClassesRef = collection(db, 'liveClasses');
    const q = query(liveClassesRef, where('isLive', '==', true));
    const snapshot = await getDocs(q);
    
    // Filter for enrolled courses
    const liveClasses = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((liveClass: any) => enrolledCourses.includes(liveClass.courseId));
    
    return liveClasses;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch live classes');
  }
};

/**
 * Join a live class (increment student count)
 */
export const joinLiveClass = async (classId: string) => {
  try {
    const classDoc = await getDoc(doc(db, 'liveClasses', classId));
    if (classDoc.exists()) {
      const currentCount = classDoc.data().studentsJoined || 0;
      await updateDoc(doc(db, 'liveClasses', classId), {
        studentsJoined: currentCount + 1
      });
    }
  } catch (error: any) {
    console.error('Failed to update join count:', error);
  }
};

// ==================== QUIZ FUNCTIONS ====================

/**
 * Get quiz for a specific lesson
 */
export const getQuizByLessonId = async (lessonId: string) => {
  try {
    console.log('[getQuizByLessonId] Fetching quiz for lessonId:', lessonId);
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('lessonId', '==', lessonId));
    const snapshot = await getDocs(q);
    
    console.log('[getQuizByLessonId] Query completed. Empty?', snapshot.empty);
    console.log('[getQuizByLessonId] Number of docs:', snapshot.docs.length);
    
    if (snapshot.empty) {
      console.log('[getQuizByLessonId] No quiz found for lessonId:', lessonId);
      return null;
    }
    
    const quizDoc = snapshot.docs[0];
    const quizData = {
      id: quizDoc.id,
      ...quizDoc.data()
    };
    console.log('[getQuizByLessonId] Quiz found:', (quizData as any).title);
    return quizData;
  } catch (error: any) {
    console.error('[getQuizByLessonId] Error fetching quiz:', error);
    console.error('[getQuizByLessonId] Error details:', error.message, error.code);
    throw error;
  }
};

/**
 * Submit quiz answers and get score
 */
export const submitQuiz = async (
  quizId: string,
  lessonId: string,
  userId: string,
  answers: Record<string, string | number>,
  questions: any[]
) => {
  try {
    // Calculate score
    let score = 0;
    let totalPoints = 0;
    
    questions.forEach((question: any) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer && String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase()) {
        score += question.points;
      }
    });
    
    const percentage = (score / totalPoints) * 100;
    
    // Save result to Firestore
    const resultRef = await addDoc(collection(db, 'quizResults'), {
      userId,
      quizId,
      lessonId,
      score,
      totalPoints,
      percentage,
      answers,
      submittedAt: serverTimestamp()
    });
    
    return {
      id: resultRef.id,
      score,
      totalPoints,
      percentage,
      passed: percentage >= 70
    };
  } catch (error: any) {
    console.error('Failed to submit quiz:', error);
    throw error;
  }
};

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  qualifyTeacher,
  
  // Courses
  getAllCourses,
  getCourseById,
  getCoursesByTeacher,
  enrollInCourse,
  getCourseProgress,
  markLessonComplete,
  
  // Comments
  addComment,
  getComments,
  
  // Doubts
  submitDoubt,
  getDoubtsForTeacher,
  updateDoubtStatus,
  
  // Classes
  scheduleClass,
  getClassesForTeacher,
  
  // Live Classes
  startLiveClass,
  endLiveClass,
  getActiveLiveClasses,
  joinLiveClass,
  
  // Quizzes
  getQuizByLessonId,
  submitQuiz,
  
  // Earnings
  requestPayout,
};
