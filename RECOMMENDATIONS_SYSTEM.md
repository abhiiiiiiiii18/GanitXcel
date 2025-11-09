# 🎯 Personalized Recommendations System

## Overview
The recommendations engine uses multiple data points to suggest the most relevant courses for each student, making your LMS truly dynamic and personalized.

## Features Implemented

### 1. **Smart Recommendation Algorithm**
The system calculates a recommendation score (0-100) based on:

- **Course Popularity & Quality** (30 points)
  - Student enrollment count
  - Average course rating
  
- **Weak Topic Identification** (25 points)
  - Analyzes quiz performance across topics
  - Prioritizes topics where student scored < 60%
  - Stronger recommendations for weaker areas

- **Collaborative Filtering** (20 points)
  - Finds students with similar learning patterns
  - Recommends courses popular among similar users
  - Uses Jaccard similarity for pattern matching

- **Difficulty Matching** (15 points)
  - Adapts to user's experience level
  - Beginner: 0-2 completed courses
  - Intermediate: 3-7 completed courses
  - Advanced: 8+ completed courses

- **Recency Bonus** (10 points)
  - Promotes newly added courses (< 3 months old)
  - Keeps recommendations fresh

### 2. **API Endpoints**

#### Get Personalized Recommendations
```
GET /api/recommendations?limit=10
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "status": "success",
  "count": 10,
  "data": [
    {
      "id": "course-123",
      "title": "Advanced Algebra",
      "recommendationScore": 87,
      "recommendationReason": "💡 Helps improve your Algebra (45% avg)",
      ...courseData
    }
  ],
  "metadata": {
    "weakTopics": [
      { "topic": "Algebra", "avgScore": 45, "attempts": 12 }
    ],
    "userGrade": 10,
    "completedCourses": 3
  }
}
```

#### Get Topic-Specific Recommendations
```
GET /api/recommendations/topic/:topic?limit=5
```

#### Get Trending Courses
```
GET /api/recommendations/trending?limit=6
```

### 3. **Frontend Components**

#### RecommendedCourses Component
```tsx
import { RecommendedCourses } from '../components/RecommendedCourses';

<RecommendedCourses
  onCourseClick={(courseId) => navigate(`/course/${courseId}`)}
  limit={6}
/>
```

**Features:**
- ✨ Displays personalized course cards
- 💡 Shows weak topic insights
- ⭐ Match percentage badge on each course
- 🔄 Refresh recommendations button
- 🤖 AI-powered explanation footer

#### TrendingCourses Component
```tsx
import { TrendingCourses } from '../components/TrendingCourses';

<TrendingCourses
  onCourseClick={(courseId) => navigate(`/course/${courseId}`)}
  limit={6}
/>
```

### 4. **Enhanced CourseCard**
Now supports recommendation badges:
```tsx
<CourseCard
  {...course}
  badge="💡 Helps improve your Algebra (45% avg)"
/>
```

## How It Works

### Data Flow
```
1. User takes quizzes → Quiz attempts stored in Firestore
2. User enrolls in courses → enrolledCourses array updated
3. Student views dashboard → Recommendations API called
4. Backend analyzes:
   - User's quiz performance (weak topics)
   - Similar users' preferences
   - Course popularity metrics
   - User's learning level
5. Returns sorted recommendations with reasons
6. Frontend displays with match percentage
```

### Weak Topic Detection
```javascript
// Identifies topics where user performs poorly
const weakTopics = await identifyWeakTopics(userId);
// Returns: [{ topic: 'Algebra', avgScore: 45, attempts: 12 }]
```

### Similar Users Algorithm
```javascript
// Jaccard Similarity: intersection / union
const similarity = sharedCourses.length / allUniqueCourses.length;
// Users with >20% similarity are considered
```

## Integration Points

### Student Dashboard
- **Location:** `src/pages/Student/Dashboard.tsx`
- **Component:** `<RecommendedCourses />` section after enrolled courses
- **Updates:** Real-time based on quiz performance

### Browse Courses
- **Optional:** Add `<TrendingCourses />` at the top
- **Dynamic filtering** by weak topics

### Course Detail Page
- **Suggested:** "Similar Courses" section using topic filtering

## Testing

### Test Scenarios

1. **New User (No Quiz History)**
   - Should show popular courses in user's grade
   - No weak topics displayed
   - Recommendations based purely on popularity

2. **User with Poor Algebra Performance**
   - Algebra courses ranked higher
   - Weak topic banner shows "Algebra"
   - Match percentage reflects weak topic bonus

3. **Advanced User (Many Completed Courses)**
   - Gets harder difficulty courses
   - Similar user recommendations weight increases
   - Diverse subject recommendations

### Manual Testing
```bash
# 1. Start backend
cd server && npm start

# 2. Login as student
# 3. Take some quizzes (score < 60% in specific subject)
# 4. View dashboard - should see recommendations for weak topics
# 5. Refresh recommendations - should recalculate
```

## Performance Considerations

### Caching Strategy
- Cache recommendations for 5 minutes per user
- Invalidate on:
  - New quiz completion
  - Course enrollment
  - Manual refresh

### Optimization Tips
```javascript
// Add to backend route
const cacheKey = `recommendations:${userId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Calculate recommendations...
await redis.setex(cacheKey, 300, JSON.stringify(recommendations));
```

### Firestore Query Optimization
- Index on: `courses.grade`, `courses.isPublished`, `courses.monthlyEnrollments`
- Limit similar user search to 100 users
- Limit quiz analysis to last 50 attempts

## Future Enhancements

### Phase 2
- [ ] Machine learning model for better predictions
- [ ] Time-of-day recommendations (study patterns)
- [ ] Exam-based urgency (prioritize topics before exams)
- [ ] Friend recommendations (courses your friends are taking)

### Phase 3
- [ ] Learning path recommendations (course sequences)
- [ ] Teacher recommendations (find the best teacher for your style)
- [ ] Study group matching (based on weak topics)
- [ ] Adaptive difficulty adjustment

### Phase 4
- [ ] Predictive analytics (predict final exam scores)
- [ ] Career path alignment (courses for engineering/medical)
- [ ] Competition prep recommendations (JEE/NEET focused)

## Analytics & Monitoring

### Track These Metrics
- Recommendation click-through rate (CTR)
- Course enrollment from recommendations
- User engagement improvement
- Weak topic improvement over time

### Dashboard Queries
```javascript
// Recommendation effectiveness
const enrolledFromRecs = await db.collection('enrollments')
  .where('source', '==', 'recommendation')
  .count();

// Weak topic improvement
const beforeScore = weakTopics[0].avgScore; // 45%
// After course completion
const afterScore = await calculateTopicScore(userId, topic); // 72%
const improvement = afterScore - beforeScore; // +27%
```

## API Service Usage

### Frontend Integration
```typescript
import { recommendationsAPI } from '../services/api';

// Get personalized recommendations
const recs = await recommendationsAPI.getPersonalized(10);

// Get trending courses
const trending = await recommendationsAPI.getTrending(6);

// Get topic-specific recommendations
const algebraCourses = await recommendationsAPI.getByTopic('Algebra', 5);
```

## Environment Variables
No additional environment variables needed. Uses existing Firebase and API setup.

## Dependencies
- ✅ Firebase Admin SDK (already installed)
- ✅ Express.js (already installed)
- ✅ Framer Motion (already installed)

## Deployment Notes
- Backend route automatically registers in `server.js`
- No database migrations needed (uses existing collections)
- Frontend components auto-import

## Summary
Your LMS is now **truly dynamic**! Students get personalized course suggestions based on their actual learning patterns, making it feel like a smart tutor that adapts to each student's needs. 🚀

---

**Built with ❤️ for GanitXcel**
