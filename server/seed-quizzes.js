import { db } from './config/firebase.js';

const quizzes = [
  {
    lessonId: 'l2',
    courseId: '1',
    title: 'Linear Equations in One Variable - Quiz',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'Solve for x: 2x + 5 = 15',
        type: 'mcq',
        options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'],
        correctAnswer: 'x = 5',
        explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'What is the solution to: 3x - 7 = 14?',
        type: 'numeric',
        correctAnswer: 7,
        explanation: 'Add 7 to both sides: 3x = 21, then divide by 3: x = 7',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q3',
        question: 'Solve: 5(x + 2) = 25',
        type: 'mcq',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
        correctAnswer: 'x = 3',
        explanation: 'Divide both sides by 5: x + 2 = 5, then subtract 2: x = 3',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q4',
        question: 'If 4x - 8 = 16, what is the value of x?',
        type: 'numeric',
        correctAnswer: 6,
        explanation: 'Add 8 to both sides: 4x = 24, then divide by 4: x = 6',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q5',
        question: 'Solve for x: (x/3) + 4 = 10',
        type: 'mcq',
        options: ['x = 6', 'x = 12', 'x = 18', 'x = 24'],
        correctAnswer: 'x = 18',
        explanation: 'Subtract 4: x/3 = 6, then multiply by 3: x = 18',
        points: 20,
        difficulty: 'hard'
      }
    ]
  },
  {
    lessonId: 'l3',
    courseId: '1',
    title: 'Linear Equations in Two Variables - Quiz',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following is a solution to: x + y = 10?',
        type: 'mcq',
        options: ['(3, 7)', '(4, 5)', '(2, 9)', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All three pairs satisfy the equation: 3+7=10, 4+5=10, 2+9=10',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Find the value of y when x = 2 in the equation: 2x + y = 10',
        type: 'numeric',
        correctAnswer: 6,
        explanation: 'Substitute x = 2: 2(2) + y = 10, so 4 + y = 10, therefore y = 6',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q3',
        question: 'What is the slope of the line: y = 3x + 5?',
        type: 'numeric',
        correctAnswer: 3,
        explanation: 'In the form y = mx + b, m is the slope. Here m = 3',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q4',
        question: 'Solve the system: x + y = 8 and x - y = 2. What is x?',
        type: 'numeric',
        correctAnswer: 5,
        explanation: 'Add both equations: 2x = 10, so x = 5. Then y = 3',
        points: 20,
        difficulty: 'hard'
      },
      {
        id: 'q5',
        question: 'Which point lies on the line: 2x - 3y = 6?',
        type: 'mcq',
        options: ['(0, -2)', '(3, 0)', '(6, 2)', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'Check: 2(0)-3(-2)=6, 2(3)-3(0)=6, 2(6)-3(2)=6. All satisfy the equation',
        points: 20,
        difficulty: 'medium'
      }
    ]
  },
  {
    lessonId: 'l4',
    courseId: '1',
    title: 'Quadratic Equations - Part 1 Quiz',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is the standard form of a quadratic equation?',
        type: 'mcq',
        options: ['ax² + bx + c = 0', 'y = mx + b', 'x² + y² = r²', 'ax + b = 0'],
        correctAnswer: 'ax² + bx + c = 0',
        explanation: 'The standard form is ax² + bx + c = 0 where a ≠ 0',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Solve: x² - 5x + 6 = 0. What are the roots?',
        type: 'mcq',
        options: ['x = 2, 3', 'x = 1, 6', 'x = -2, -3', 'x = 5, 1'],
        correctAnswer: 'x = 2, 3',
        explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q3',
        question: 'What is the discriminant of x² + 4x + 4 = 0?',
        type: 'numeric',
        correctAnswer: 0,
        explanation: 'Discriminant = b² - 4ac = 16 - 16 = 0. Equal roots exist',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q4',
        question: 'Solve using factorization: x² - 9 = 0',
        type: 'mcq',
        options: ['x = ±3', 'x = ±9', 'x = 3 only', 'x = -3 only'],
        correctAnswer: 'x = ±3',
        explanation: 'x² - 9 = (x+3)(x-3) = 0, so x = 3 or x = -3',
        points: 20,
        difficulty: 'easy'
      },
      {
        id: 'q5',
        question: 'For x² - 7x + 12 = 0, what is the sum of roots?',
        type: 'numeric',
        correctAnswer: 7,
        explanation: 'Sum of roots = -b/a = -(-7)/1 = 7. (Roots are 3 and 4: 3+4=7)',
        points: 20,
        difficulty: 'hard'
      }
    ]
  },
  {
    lessonId: 'l5',
    courseId: '1',
    title: 'Quadratic Equations - Part 2 Quiz',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'Using the quadratic formula, what is the value of x in x² + 6x + 5 = 0?',
        type: 'mcq',
        options: ['x = -1, -5', 'x = 1, 5', 'x = -2, -3', 'x = 2, 3'],
        correctAnswer: 'x = -1, -5',
        explanation: 'Using x = (-b ± √(b²-4ac))/2a with a=1, b=6, c=5: x = (-6 ± 4)/2 = -1 or -5',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q2',
        question: 'What type of roots does x² + 2x + 5 = 0 have?',
        type: 'mcq',
        options: ['Real and equal', 'Real and distinct', 'Imaginary', 'No solution'],
        correctAnswer: 'Imaginary',
        explanation: 'Discriminant = 4 - 20 = -16 < 0, so roots are imaginary',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'q3',
        question: 'Solve by completing the square: x² + 8x + 7 = 0. What is one root?',
        type: 'mcq',
        options: ['x = -1', 'x = -7', 'x = 1', 'Both -1 and -7'],
        correctAnswer: 'Both -1 and -7',
        explanation: '(x+4)² - 16 + 7 = 0, (x+4)² = 9, x+4 = ±3, so x = -1 or -7',
        points: 20,
        difficulty: 'hard'
      },
      {
        id: 'q4',
        question: 'For 2x² - 3x - 5 = 0, what is the product of roots?',
        type: 'numeric',
        correctAnswer: -2.5,
        explanation: 'Product of roots = c/a = -5/2 = -2.5',
        points: 20,
        difficulty: 'hard'
      },
      {
        id: 'q5',
        question: 'Which method is best for solving x² - 16 = 0?',
        type: 'mcq',
        options: ['Factorization', 'Quadratic formula', 'Completing the square', 'All are equal'],
        correctAnswer: 'Factorization',
        explanation: 'x² - 16 = (x+4)(x-4) = 0 is the simplest method. x = ±4',
        points: 20,
        difficulty: 'easy'
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    console.log('🌱 Starting to seed quizzes...\n');

    for (const quiz of quizzes) {
      // Check if quiz already exists
      const existingQuizQuery = await db.collection('quizzes')
        .where('lessonId', '==', quiz.lessonId)
        .get();

      if (!existingQuizQuery.empty) {
        console.log(`⚠️  Quiz for lesson ${quiz.lessonId} already exists. Updating...`);
        const docId = existingQuizQuery.docs[0].id;
        await db.collection('quizzes').doc(docId).update(quiz);
        console.log(`✅ Updated quiz for lesson ${quiz.lessonId}: ${quiz.title}`);
      } else {
        const docRef = await db.collection('quizzes').add(quiz);
        console.log(`✅ Created quiz for lesson ${quiz.lessonId}: ${quiz.title} (ID: ${docRef.id})`);
      }
    }

    console.log('\n🎉 Quiz seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Total quizzes: ${quizzes.length}`);
    console.log(`- Lessons covered: l2, l3, l4, l5`);
    console.log(`- Questions per quiz: 5`);
    console.log(`- Time limit: 10 minutes each`);
    console.log(`- Passing score: 70%`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    process.exit(1);
  }
}

seedQuizzes();
