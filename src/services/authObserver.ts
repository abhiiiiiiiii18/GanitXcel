import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from './firebase';
import { useAuthStore } from '../store';

/**
 * Initialize Firebase auth state observer
 * This keeps the Zustand store in sync with Firebase auth state
 * Critical for maintaining student login sessions across page reloads
 */
export const initializeAuthObserver = () => {
  console.log('🔐 Initializing Firebase auth state observer...');

  onAuthStateChanged(auth, async (firebaseUser) => {
    const { login, logout } = useAuthStore.getState();

    if (firebaseUser) {
      // User is signed in
      console.log('✅ Firebase user detected:', firebaseUser.uid);

      try {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        
        console.log('📋 User profile loaded:', {
          name: profile.name,
          email: profile.email,
          role: profile.role,
        });

        // Update Zustand store
        const user = {
          id: firebaseUser.uid,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          createdAt: profile.createdAt?.toDate?.() || new Date(),
        };

        login(user);
        console.log('✅ Auth state synced to store for role:', profile.role);
      } catch (error) {
        console.error('❌ Failed to load user profile:', error);
        logout();
      }
    } else {
      // User is signed out
      console.log('🚪 No Firebase user detected - user logged out');
      logout();
    }
  });

  console.log('✅ Auth state observer initialized');
};
