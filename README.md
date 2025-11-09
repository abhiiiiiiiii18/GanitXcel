# í³ GanitXcel - Mathematics Learning Platform

**A Personal Project: Duolingo-inspired Mathematics LMS for Indian Students (Grades 8-12)**

> This is a personal project built to create an engaging, gamified mathematics learning experience for students preparing for board exams and competitive tests.

---

## í±¨â€í²» About This Project

GanitXcel is my personal learning management system that combines the best of gamification (inspired by Duolingo) with quality mathematics education. The platform helps students learn through:

- Interactive lessons using curated YouTube content
- Gamified progress tracking with streaks and rewards
- AI-powered doubt resolution
- Live classes with qualified teachers
- Comprehensive quizzes and assessments

## í¾¯ Key Features

### For Students í¾“
- **Gamified Learning**: Earn points, maintain streaks, collect badges
- **AI Tutor**: 24/7 doubt bot powered by Gemini AI
- **Video Lessons**: Curated YouTube content organized by curriculum
- **Live Doubt Sessions**: Weekly classes with teachers
- **Rewards**: Certificates and scholarships for top performers
- **Community**: Discord channels for peer learning
- **Progress Tracking**: Visual analytics and achievement system

### For Teachers í±©â€í¿«
- **Course Creation**: Build courses using YouTube playlists
- **Quiz Management**: Create and manage assessments
- **Qualification System**: Verified teaching credentials
- **Analytics Dashboard**: Track student performance
- **Earnings Portal**: Manage course revenue (70% share)

## í» ï¸ Tech Stack

**Frontend**: React 18 + TypeScript + Tailwind CSS + Framer Motion  
**Backend**: Firebase (Auth, Firestore, Storage)  
**State Management**: Zustand  
**Routing**: React Router v6  
**AI**: Google Gemini API  
**Video**: YouTube IFrame API  
**Charts**: Recharts  

## ï¿½ï¿½ Getting Started

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

## í°³ Docker Support

Build and run with Docker Compose:

\`\`\`bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Access the app at http://localhost:3000
\`\`\`

## í³ Project Structure

\`\`\`
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/     # Reusable UI components
â”‚   â”œâ”€â”€ pages/          # Route pages
â”‚   â”œâ”€â”€ hooks/          # Custom React hooks
â”‚   â”œâ”€â”€ store/          # Zustand state management
â”‚   â”œâ”€â”€ utils/          # Helper functions
â”‚   â”œâ”€â”€ types/          # TypeScript definitions
â”‚   â”œâ”€â”€ config/         # Firebase configuration
â”‚   â””â”€â”€ services/       # API services
â”œâ”€â”€ server/             # Backend Node.js server
â”‚   â”œâ”€â”€ routes/         # API routes
â”‚   â”œâ”€â”€ middleware/     # Auth middleware
â”‚   â””â”€â”€ config/         # Server configuration
â””â”€â”€ public/             # Static assets
\`\`\`

## í¾¨ Design Philosophy

**Duolingo-Inspired UI:**
- Primary colors: Green (#58CC02), Blue (#1CB0F6), Yellow (#FFC800)
- Smooth animations and transitions
- Gamification elements throughout
- Motivational broken streak mode

## ï¿½ï¿½ Business Model

- **Course Pricing**: â‚¹499-â‚¹999 per course
- **Revenue Share**: Teachers get 70%, platform takes 30%
- **Student Rewards**: Top rankers receive â‚¹500-â‚¹1000 scholarships
- **Freemium Model**: Basic content free, premium courses paid

## í´’ Security Features

- Firebase Authentication
- Tab-switching detection for academic integrity
- Teacher qualification verification
- Secure payment integration (Razorpay)

## í³ License

This is a personal project. All rights reserved.

## í±¤ Author

**Abhi**  
GitHub: [@abhiiiiiiiii18](https://github.com/abhiiiiiiiii18)

---

**Note**: This project was built as a personal learning experience and portfolio piece. Feel free to explore the code and learn from it!

í²¡ *Made with passion for mathematics education* â¤ï¸
