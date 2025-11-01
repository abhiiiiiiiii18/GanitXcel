# ⚡ Quick Setup Guide

## 🎯 Get Started in 5 Minutes!

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Setup (Optional for now)
```bash
cp .env.example .env
```

**Note:** The app will work with dummy data even without real Firebase/OpenAI keys!

### Step 3: Start Development Server
```bash
npm start
```

The app will open at: **http://localhost:3000**

---

## 🎮 Test the Application

### 1. **Landing Page**
- Visit http://localhost:3000
- See the Duolingo-inspired design
- Click "I'm a Student" or "I'm a Teacher"

### 2. **Register as Student**
- Fill in the registration form
- Select "Student" role
- Choose your grade (8-12)
- Create account

### 3. **Student Dashboard**
- See your daily streak (starts at 0)
- View gamification stats
- Browse popular courses
- Check friends' streaks
- Notice the bright, encouraging UI

### 4. **Test Broken Streak Mode**
To test this unique feature:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Find 'streak-storage'
4. Modify `lastActiveDate` to 3 days ago
5. Refresh the page
6. **UI becomes grayscale with motivational message!**

### 5. **Login Flow**
- Logout and try logging in
- Switch between Student/Teacher roles
- Notice the role-based routing

---

## 🎨 What to Notice

### Duolingo-Inspired Elements:
1. **Colors**: Bright green (#58CC02), blue (#1CB0F6), yellow (#FFC800)
2. **Animations**: Smooth transitions, bounce effects, celebrations
3. **Gamification**: Streaks 🔥, points ⭐, badges 🏆
4. **Encouraging UI**: Positive feedback everywhere
5. **Social Proof**: Friends' streaks comparison
6. **Broken Streak Mode**: UI becomes sad/grayscale when you miss a day

### Components to Explore:
- ✅ Animated buttons with hover effects
- ✅ Streak display with fire emoji animation
- ✅ Friends' streak cards with rankings
- ✅ Stats cards with icons
- ✅ Badge system (Math Beginner → Math Legend)
- ✅ Progress bars with smooth animations

---

## 🐛 Troubleshooting

### If you see compilation errors:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### If Tailwind CSS doesn't work:
```bash
# Ensure you have Tailwind v3
npm install -D tailwindcss@^3 postcss@^8 autoprefixer@^10
npm start
```

### ESLint Warnings (Safe to Ignore):
The app compiles successfully with warnings. These are just code quality suggestions and don't affect functionality.

---

## 📱 Mobile Testing

The app is responsive! Test on different screen sizes:
- Desktop: Full experience
- Tablet: Grid layouts adjust
- Mobile: Single column, optimized touch targets

---

## 🚀 Next Steps

After seeing the working dashboard:

1. **Implement Course Page** - Show course details
2. **Build Video Player** - YouTube embed with restrictions
3. **Create Quiz Interface** - With LaTeX math rendering
4. **Teacher Dashboard** - Earnings and analytics

---

## 💡 Pro Tips

1. **Mock Data**: Currently using placeholder data. Real Firebase integration pending.
2. **Authentication**: Login works but uses mock data. Firebase auth pending.
3. **Dummy Content**: Course images use placeholders. Replace with real thumbnails.
4. **Performance**: Built with React 18 features for optimal performance.

---

## 📚 Key Files to Understand

```
src/
├── components/          # Reusable UI (Button, Card, StreakDisplay)
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── LoginPage.tsx    # Auth flow
│   └── Student/
│       └── Dashboard.tsx # Main student interface
├── store/index.ts       # Zustand stores (auth, streak, UI)
├── utils/helpers.ts     # Utility functions
├── config/constants.ts  # App configuration
└── types/index.ts       # TypeScript definitions
```

---

## 🎉 You're All Set!

The app should now be running at http://localhost:3000

**Enjoy exploring the Duolingo-inspired math learning platform!** 📐🚀

---

## 📧 Questions?

Check out:
- `README.md` - Full documentation
- `PROJECT_STATUS.md` - Detailed feature list
- Code comments - Inline explanations
