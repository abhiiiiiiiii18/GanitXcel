import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin (only if credentials are provided)
let db, auth, storage;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();

    console.log('✅ Firebase Admin initialized successfully');
  } else {
    console.warn('⚠️  Firebase Admin not initialized - credentials missing');
    console.warn('⚠️  Backend will run in limited mode');
    console.warn('⚠️  Configure .env file with Firebase Admin SDK credentials');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.warn('⚠️  Backend will run in limited mode');
}

export { db, auth, storage };
export default admin;
