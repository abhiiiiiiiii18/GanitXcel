# Adding Course Images to Firestore

## Overview
This guide explains how to add course images (imageUrl field) to your Firestore database and how the system already supports displaying them.

## Current Implementation

### Course Interface (types/index.ts)
The `Course` interface already includes a `thumbnail` field:

```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;  // ← This is the image URL field
  teacherId: string;
  teacher: Teacher;
  price: number;
  grade: number[];
  subject: string;
  // ... other fields
}
```

### CourseCard Component (components/Card.tsx)
The CourseCard component already displays the image:

```tsx
<img
  src={thumbnail}  // ← Uses thumbnail prop
  alt={title}
  className="w-full h-full object-cover"
/>
```

## Firestore Data Structure

### Example Course Document
Add courses to the `courses` collection with this structure:

```json
{
  "id": "algebra-10-basics",
  "title": "Complete Algebra for Grade 10",
  "description": "Master all algebra concepts for Grade 10",
  "thumbnail": "https://example.com/images/algebra-course.jpg",
  "teacherId": "teacher-123",
  "price": 599,
  "grade": [10],
  "subject": "Algebra",
  "syllabus": [],
  "totalDuration": 1800,
  "rating": 4.8,
  "totalStudents": 2456,
  "monthlyEnrollments": 342,
  "toppers": [],
  "isPublished": true,
  "createdAt": "2025-01-15T00:00:00Z",
  "updatedAt": "2025-01-15T00:00:00Z"
}
```

## How to Add Images

### Option 1: Using Firebase Storage (Recommended)

1. **Upload images to Firebase Storage:**
```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

async function uploadCourseImage(file: File, courseId: string) {
  const storageRef = ref(storage, `course-images/${courseId}.jpg`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
```

2. **Update course document:**
```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

async function addImageToCourse(courseId: string, imageUrl: string) {
  const courseRef = doc(db, 'courses', courseId);
  await updateDoc(courseRef, {
    thumbnail: imageUrl,
    updatedAt: new Date()
  });
}
```

### Option 2: Using External URLs

Simply add the image URL to the `thumbnail` field:

```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

await setDoc(doc(db, 'courses', 'algebra-10'), {
  title: 'Complete Algebra for Grade 10',
  thumbnail: 'https://via.placeholder.com/400x300/58CC02/fff?text=Algebra',
  // ... other fields
});
```

## Image URL Sources

### 1. Placeholder Images (for testing)
```
https://via.placeholder.com/400x300/58CC02/fff?text=Algebra
https://via.placeholder.com/400x300/1CB0F6/fff?text=Geometry
https://via.placeholder.com/400x300/FFC800/fff?text=Calculus
```

### 2. Unsplash (free stock photos)
```
https://source.unsplash.com/400x300/?mathematics,education
https://source.unsplash.com/400x300/?algebra,math
https://source.unsplash.com/400x300/?geometry,shapes
```

### 3. Pexels (free stock photos)
- Visit pexels.com
- Search for math/education images
- Use direct image URLs

### 4. Custom Images
- Design custom course thumbnails using Canva/Figma
- Upload to Firebase Storage
- Use generated download URLs

## Bulk Import Script

Create a script to add images to existing courses:

```javascript
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const courseImages = {
  'algebra-10': 'https://via.placeholder.com/400x300/58CC02/fff?text=Algebra',
  'geometry-10': 'https://via.placeholder.com/400x300/1CB0F6/fff?text=Geometry',
  'calculus-11': 'https://via.placeholder.com/400x300/FFC800/fff?text=Calculus',
  'trigonometry-10': 'https://via.placeholder.com/400x300/FF4B4B/fff?text=Trigonometry',
};

async function updateCourseImages() {
  const coursesRef = collection(db, 'courses');
  const snapshot = await getDocs(coursesRef);
  
  for (const courseDoc of snapshot.docs) {
    const courseId = courseDoc.id;
    const imageUrl = courseImages[courseId];
    
    if (imageUrl) {
      await updateDoc(doc(db, 'courses', courseId), {
        thumbnail: imageUrl,
        updatedAt: new Date()
      });
      console.log(`✓ Updated image for ${courseId}`);
    }
  }
}

// Run the script
updateCourseImages();
```

## Sample Courses with Images

Here are example courses with different subjects and images:

```javascript
const sampleCourses = [
  {
    id: '1',
    title: 'Complete Algebra for Grade 10',
    thumbnail: 'https://via.placeholder.com/400x300/58CC02/fff?text=Algebra',
    subject: 'Algebra',
    grade: 10,
    teacher: 'Rajesh Kumar',
    price: 599,
    rating: 4.8,
    totalStudents: 2456,
    duration: 45,
  },
  {
    id: '2',
    title: 'Geometry Masterclass',
    thumbnail: 'https://via.placeholder.com/400x300/1CB0F6/fff?text=Geometry',
    subject: 'Geometry',
    grade: 10,
    teacher: 'Priya Sharma',
    price: 699,
    rating: 4.9,
    totalStudents: 1834,
    duration: 38,
  },
  {
    id: '3',
    title: 'Calculus Made Easy',
    thumbnail: 'https://via.placeholder.com/400x300/FFC800/fff?text=Calculus',
    subject: 'Calculus',
    grade: 11,
    teacher: 'Amit Patel',
    price: 799,
    rating: 4.7,
    totalStudents: 1567,
    duration: 52,
  },
];
```

## Testing

1. **Add test data:**
```bash
# Use Firebase Console or run script
node scripts/add-course-images.js
```

2. **Verify in UI:**
- Navigate to `/courses` (Browse Courses page)
- Check Dashboard "Popular Courses" section
- View individual course pages

3. **Check image loading:**
- Open browser DevTools → Network tab
- Filter by "Img"
- Verify images load successfully

## Best Practices

1. **Image Dimensions:**
   - Recommended: 400x300px (4:3 ratio)
   - Minimum: 400x300px
   - Maximum: 1200x900px

2. **File Size:**
   - Keep under 500KB per image
   - Use JPEG for photos
   - Use PNG for graphics with text

3. **Alt Text:**
   - Already implemented: `alt={title}`
   - Provides accessibility

4. **Lazy Loading:**
   - Browser native lazy loading is supported
   - Add `loading="lazy"` attribute if needed

5. **CDN Usage:**
   - Firebase Storage serves as CDN
   - Automatic caching
   - Global distribution

## Troubleshooting

### Image Not Displaying
1. Check URL is valid
2. Verify CORS settings
3. Check browser console for errors

### Slow Loading
1. Compress images before upload
2. Use Firebase Storage CDN
3. Implement progressive loading

### Broken Links
1. Use Firebase Storage for persistence
2. Avoid external URLs that might break
3. Implement fallback placeholder

## Next Steps

1. ✅ Course interface already has `thumbnail` field
2. ✅ CourseCard component already displays images
3. ⏳ Add images to Firestore courses collection
4. ⏳ Upload custom course thumbnails to Firebase Storage
5. ⏳ Update all existing courses with image URLs

## Conclusion

The system is **already built to support course images**! You just need to:
1. Add `thumbnail` URLs to your Firestore course documents
2. The UI will automatically display them

No code changes required! 🎉
