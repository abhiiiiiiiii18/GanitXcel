# ��� GanitXcel - Mathematics Learning Platform

**A Personal Project: Duolingo-inspired Mathematics LMS for Indian Students (Grades 8-12)**

> This is a personal project built to create an engaging, gamified mathematics learning experience for students preparing for board exams and competitive tests.

---

## ���‍��� About This Project

GanitXcel is my personal learning management system that combines the best of gamification (inspired by Duolingo) with quality mathematics education. The platform helps students learn through:

- Interactive lessons using curated YouTube content
- Gamified progress tracking with streaks and rewards
- AI-powered doubt resolution
- Live classes with qualified teachers
- Comprehensive quizzes and assessments

## ��� Key Features

### For Students ���
- **Gamified Learning**: Earn points, maintain streaks, collect badges
- **AI Tutor**: 24/7 doubt bot powered by Gemini AI
- **Video Lessons**: Curated YouTube content organized by curriculum
- **Live Doubt Sessions**: Weekly classes with teachers
- **Rewards**: Certificates and scholarships for top performers
- **Community**: Discord channels for peer learning
- **Progress Tracking**: Visual analytics and achievement system

### For Teachers ���‍���
- **Course Creation**: Build courses using YouTube playlists
- **Quiz Management**: Create and manage assessments
- **Qualification System**: Verified teaching credentials
- **Analytics Dashboard**: Track student performance
- **Earnings Portal**: Manage course revenue (70% share)

## ���️ Tech Stack

**Frontend**: React 18 + TypeScript + Tailwind CSS + Framer Motion  
**Backend**: Firebase (Auth, Firestore, Storage)  
**State Management**: Zustand  
**Routing**: React Router v6  
**AI**: Google Gemini API  
**Video**: YouTube IFrame API  
**Charts**: Recharts  

## �� Getting Started

### Prerequisites
- Node.js 18+
- Firebase account
- Google Gemini API key

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/abhiiiiiiiii18/GanitXcel.git
cd GanitXcel

# Install dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase & Gemini API credentials

# Start backend server
cd server
npm start

# Start frontend (in another terminal)
cd ..
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## ��� Docker Support

Build and run with Docker Compose:

\`\`\`bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Access the app at http://localhost:3000
\`\`\`

## ��� Project Structure

\`\`\`
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand state management
│   ├── utils/          # Helper functions
│   ├── types/          # TypeScript definitions
│   ├── config/         # Firebase configuration
│   └── services/       # API services
├── server/             # Backend Node.js server
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── config/         # Server configuration
└── public/             # Static assets
\`\`\`

## ��� Design Philosophy

**Duolingo-Inspired UI:**
- Primary colors: Green (#58CC02), Blue (#1CB0F6), Yellow (#FFC800)
- Smooth animations and transitions
- Gamification elements throughout
- Motivational broken streak mode

## �� Business Model

- **Course Pricing**: ₹499-₹999 per course
- **Revenue Share**: Teachers get 70%, platform takes 30%
- **Student Rewards**: Top rankers receive ₹500-₹1000 scholarships
- **Freemium Model**: Basic content free, premium courses paid

## ��� Security Features

- Firebase Authentication
- Tab-switching detection for academic integrity
- Teacher qualification verification
- Secure payment integration (Razorpay)

## ��� License

This is a personal project. All rights reserved.

## ��� Author

**Abhi**  
GitHub: [@abhiiiiiiiii18](https://github.com/abhiiiiiiiii18)

---

**Note**: This project was built as a personal learning experience and portfolio piece. Feel free to explore the code and learn from it!

��� *Made with passion for mathematics education* ❤️
