# 🔥 FIRESTORE SECURITY RULES FIX

## Quick Fix (For Development/Testing)

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: GanitXcel
3. **Navigate to**: Firestore Database → Rules tab
4. **Replace current rules** with this temporary development rule:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. **Click "Publish"**
6. **Wait 1-2 minutes** for rules to propagate
7. **Try registering/logging in again**

---

## Production Rules (Use Later)

For production, use the rules in `firestore.rules` file which includes:
- User authentication checks
- Role-based access control
- Proper security for students and teachers

To deploy production rules:
```bash
firebase deploy --only firestore:rules
```

---

## Why This Error Happened

Firebase Firestore has security rules that control who can read/write data. By default, Firebase blocks all access for security. You need to set rules that allow:

1. ✅ Authenticated users to create their profile in `/users/{userId}`
2. ✅ Users to read/write their own data
3. ✅ Students to access courses, lessons, quizzes

The error "missing or insufficient permissions" means Firestore is blocking the registration/login attempts because the rules weren't configured.

---

## Steps to Fix Now:

### Option 1: Firebase Console (Recommended for Quick Fix)
1. Open https://console.firebase.google.com
2. Go to: Firestore Database → Rules
3. Copy content from `firestore.rules.dev`
4. Paste and Publish

### Option 2: Firebase CLI (If installed)
```bash
cd /e/lmsfinal
firebase deploy --only firestore:rules
```

After updating rules, student registration and login will work! 🎉
