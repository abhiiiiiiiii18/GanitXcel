# 📐 GanitXcel - Mathematics LMS# Getting Started with Create React App



**A Duolingo-inspired mathematics learning platform for Indian students (Grades 8-12)**This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## 🎯 Features## Available Scripts



### Students 🎓In the project directory, you can run:

- Duolingo-style gamification (streaks, points, badges)

- AI doubt bot + post-quiz tutor### `npm start`

- YouTube-based curated lessons

- Live doubt classes (weekly)Runs the app in the development mode.\

- Certificates & cash scholarships (₹500-₹1000)Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- Discord communities

- Broken streak UI motivationThe page will reload if you make edits.\

You will also see any lint errors in the console.

### Teachers 👩‍🏫

- Course creation (YouTube playlists + quizzes)### `npm test`

- Qualification test (tab-switching detection)

- Dashboard with earnings tracking (30% platform commission)Launches the test runner in the interactive watch mode.\

- Student analyticsSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



## 🛠️ Tech Stack### `npm run build`



**Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion  Builds the app for production to the `build` folder.\

**Backend:** Firebase (Auth, Firestore, Storage)  It correctly bundles React in production mode and optimizes the build for the best performance.

**State:** Zustand  

**Routing:** React Router  The build is minified and the filenames include the hashes.\

**AI:** OpenAI API  Your app is ready to be deployed!

**Video:** YouTube IFrame API

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## 🚀 Quick Start

### `npm run eject`

```bash

# Install dependencies**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

npm install

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

# Setup environment

cp .env.example .envInstead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

# Edit .env with your Firebase & OpenAI credentials

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Start development server

npm start## Learn More

```

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

Open [http://localhost:3000](http://localhost:3000)

To learn React, check out the [React documentation](https://reactjs.org/).

## 📁 Structure

```
src/
├── components/    # UI components (Button, Card, StreakDisplay)
├── pages/         # Routes (Home, Dashboard, Course, etc.)
├── hooks/         # Custom hooks (tab detection)
├── store/         # Zustand stores
├── utils/         # Helpers
├── types/         # TypeScript types
├── config/        # Firebase & constants
└── services/      # API services
```

## 🎨 Design

**Duolingo-Inspired:**
- Colors: Green (#58CC02), Blue (#1CB0F6), Yellow (#FFC800)
- Animations & gamification
- Broken streak mode (grayscale UI)

## 💰 Monetization

- Courses: ₹499-₹999
- Platform fee: 30%
- Top ranker rewards: ₹500-₹1000

## 🔒 Security

- Tab-switching detection (zero tolerance)
- Academic integrity enforcement
- Teacher vetting

---

**Built for Hackathon | Made with ❤️**
