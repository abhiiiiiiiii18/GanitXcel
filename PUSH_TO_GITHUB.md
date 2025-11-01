# 📤 Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository name (e.g., "ganitxcel-lms")
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README
5. Click "Create repository"

## Step 2: Add Remote and Push

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name:

```bash
cd /e/lmsfinal

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: LMS platform with quizzes, live classes, and Firebase"

# Push to GitHub
git push -u origin master
```

## Step 3: Add .gitignore (Important!)

Before pushing, create a `.gitignore` file to exclude sensitive files:

```bash
# Run this command
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
server/node_modules/

# Environment variables (IMPORTANT - DO NOT COMMIT)
.env
.env.local
server/.env

# Build output
build/
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Backup files
*.backup
EOF

# Add and commit .gitignore
git add .gitignore
git commit -m "Add .gitignore"
```

## Alternative: Use GitHub CLI

If you have GitHub CLI installed:

```bash
cd /e/lmsfinal
gh repo create ganitxcel-lms --public --source=. --remote=origin --push
```

## ⚠️ IMPORTANT Security Notes:

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Add `.env` to `.gitignore`** before first commit
3. **If you already committed `.env`**, remove it:
   ```bash
   git rm --cached .env
   git rm --cached server/.env
   git commit -m "Remove sensitive files"
   ```

## After Pushing:

Your repository will be at: `https://github.com/YOUR_USERNAME/YOUR_REPO`

To update later:
```bash
git add .
git commit -m "Your commit message"
git push
```
