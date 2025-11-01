import { db } from './config/firebase.js';

async function testQuizData() {
  try {
    console.log('🔍 Checking quiz data in Firestore...\n');

    const snapshot = await db.collection('quizzes').get();
    
    if (snapshot.empty) {
      console.log('❌ No quizzes found in Firestore!');
      console.log('Please run: node seed-quizzes.js');
      process.exit(1);
    }

    console.log(`✅ Found ${snapshot.size} quizzes:\n`);

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log(`📝 Quiz ID: ${doc.id}`);
      console.log(`   Lesson ID: ${data.lessonId}`);
      console.log(`   Title: ${data.title}`);
      console.log(`   Questions: ${data.questions.length}`);
      console.log(`   Time Limit: ${data.timeLimit} minutes`);
      console.log(`   Passing Score: ${data.passingScore}%`);
      console.log('');
    });

    console.log('✅ All quizzes are properly stored in Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testQuizData();
