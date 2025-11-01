# Google Gemini API Setup Guide

## Overview
This guide walks you through setting up the Google Gemini API for the AI Video Summarization feature in your LMS.

---

## Step 1: Get Your API Key

### Option A: Google AI Studio (Recommended for Development)

1. **Visit Google AI Studio**:
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign In**:
   - Use your Google account
   - Accept the terms of service

3. **Create API Key**:
   - Click "Create API Key"
   - Choose "Create API key in new project" (for new users)
   - Or select an existing Google Cloud project

4. **Copy Your Key**:
   - Click the copy icon
   - Save it securely (you won't be able to see it again!)

### Option B: Google Cloud Console (For Production)

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**:
   - Click project dropdown at top
   - Create new project or select existing

3. **Enable Generative AI API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Generative Language API"
   - Click "Enable"

4. **Create Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your new API key

5. **Restrict API Key** (Recommended):
   - Click on your API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Generative Language API"
   - Under "Application restrictions", add your domain
   - Save changes

---

## Step 2: Add API Key to Your Project

### Create/Update `.env` File

In your project root (`e:\lmsfinal`), create or update the `.env` file:

```env
# Firebase Configuration (existing)
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini API Key (NEW)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important Notes**:
- ⚠️ Use `VITE_` prefix for Vite to expose the variable to client
- ⚠️ Never commit `.env` file to Git
- ⚠️ Keep your API key secret

### Update `.gitignore`

Ensure `.env` is in your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

---

## Step 3: Restart Development Server

After adding the API key, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 4: Verify Installation

### Check Environment Variable

Create a test file or add to an existing component:

```typescript
// Test in browser console or component
console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY);
// Should output: "AIza..." (first few characters)
```

### Test API Connection

The AI Summary feature will automatically test the connection when you click the button.

**Success Indicators**:
- ✅ "Generating AI summary..." toast appears
- ✅ Summary modal opens with content
- ✅ No error messages in console

**Error Indicators**:
- ❌ "Failed to generate summary" toast
- ❌ Console error: "API key not valid"
- ❌ Console error: "Quota exceeded"

---

## Step 5: Understanding API Usage

### Free Tier Limits (Google AI Studio)

- **Requests per minute**: 60 RPM
- **Requests per day**: 1,500 RPD
- **Cost**: FREE for development
- **Model**: `gemini-2.0-flash-exp` (experimental, free)

### Paid Tier (Google Cloud)

For production with higher limits:

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Gemini 1.5 Flash | $0.075 | $0.30 |
| Gemini 1.5 Pro | $1.25 | $5.00 |
| Gemini 2.0 Flash | FREE (experimental) | FREE (experimental) |

**Token Estimation**:
- Average lesson summary request: ~500 tokens input
- Average response: ~800 tokens output
- 1,000 summaries ≈ 1.3M tokens total
- **Cost**: ~$0.40 per 1,000 summaries (Flash model)

---

## Step 6: API Security Best Practices

### Development Environment

✅ **DO**:
- Use `.env` file for local development
- Keep API keys out of Git
- Use `VITE_` prefix for client-side variables

❌ **DON'T**:
- Commit API keys to repositories
- Share keys in Discord/Slack
- Use production keys in development

### Production Environment

For production deployment, use one of these approaches:

#### Option 1: Backend Proxy (Most Secure)

Create a backend endpoint that calls Gemini:

```typescript
// backend/api/summarize.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // ... rest of logic
}
```

Benefits:
- ✅ API key never exposed to client
- ✅ Can add rate limiting
- ✅ Can log usage

#### Option 2: Environment Variables (Netlify/Vercel)

Use platform-specific environment variables:

**Netlify**:
```bash
# netlify.toml
[build.environment]
  VITE_GEMINI_API_KEY = "your_key_here"
```

**Vercel**:
```bash
# Project Settings > Environment Variables
VITE_GEMINI_API_KEY = your_key_here
```

#### Option 3: API Key Restrictions (Google Cloud)

Restrict your API key to specific domains:

1. Go to Google Cloud Console
2. Select your API key
3. Under "Application restrictions":
   - Choose "HTTP referrers (web sites)"
   - Add your domain: `https://yourdomain.com/*`
4. Save

---

## Step 7: Monitoring Usage

### View Usage Statistics

1. **Google AI Studio**:
   - Go to: https://aistudio.google.com/
   - Check "Usage" tab for request counts

2. **Google Cloud Console**:
   - Go to: https://console.cloud.google.com/
   - Navigate to "APIs & Services" > "Dashboard"
   - View detailed metrics and quotas

### Set Up Billing Alerts

For paid usage:

1. Go to "Billing" in Google Cloud Console
2. Click "Budgets & alerts"
3. Create new budget
4. Set threshold (e.g., $10/month)
5. Add email notification

---

## Troubleshooting

### Error: "API key not valid"

**Cause**: Invalid or expired API key

**Solutions**:
```bash
1. Check .env file has correct key
2. Verify VITE_ prefix is present
3. Restart dev server: npm run dev
4. Try regenerating API key in Google AI Studio
```

### Error: "Quota exceeded"

**Cause**: Free tier limits reached

**Solutions**:
```bash
1. Wait for quota reset (resets daily at midnight PT)
2. Upgrade to paid tier in Google Cloud
3. Implement request caching to reduce API calls
```

### Error: "Model not found"

**Cause**: Using unavailable model name

**Solutions**:
```typescript
// Use one of these models:
"gemini-2.0-flash-exp"  // Experimental, fastest, free
"gemini-1.5-flash"      // Stable, fast, affordable
"gemini-1.5-pro"        // Most capable, slower
```

### Error: "Request blocked by CORS"

**Cause**: API key not configured for your domain

**Solutions**:
1. Add HTTP referrer restriction in Google Cloud
2. Use backend proxy instead of direct client calls

---

## Advanced Configuration

### Custom Model Settings

Modify `LessonPage.tsx` to customize AI behavior:

```typescript
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,        // Creativity (0-1)
    topP: 0.8,              // Diversity
    topK: 40,               // Vocabulary size
    maxOutputTokens: 1024,  // Max response length
  },
});
```

### Prompt Engineering

Improve summary quality by enhancing the prompt:

```typescript
const prompt = `You are an expert educational content summarizer.

Lesson Details:
- Title: ${lesson.title}
- Description: ${lesson.description}
- Duration: ${lesson.duration}

Create a comprehensive, student-friendly summary including:

1. **Overview** (2-3 sentences)
   - What is this lesson about?
   - Why is it important?

2. **Key Concepts** (3-5 bullet points)
   - Main ideas covered
   - Technical terms explained

3. **Learning Objectives** (3-4 items)
   - What students will be able to do after this lesson

4. **Important Takeaways** (2-3 items)
   - Critical points to remember
   - Practical applications

Use clear, concise language. Format with markdown for readability.`;
```

---

## Cost Optimization Tips

### 1. Cache Summaries

Store generated summaries in Firebase:

```typescript
// After generating summary
await setDoc(doc(db, 'lesson-summaries', lesson.id), {
  summary: aiSummary,
  generatedAt: new Date(),
  lessonId: lesson.id
});

// Before generating, check cache
const cachedSummary = await getDoc(doc(db, 'lesson-summaries', lesson.id));
if (cachedSummary.exists()) {
  setAiSummary(cachedSummary.data().summary);
  return;
}
```

### 2. Rate Limiting

Prevent abuse by limiting requests:

```typescript
const [lastRequestTime, setLastRequestTime] = useState(0);

const handleGenerateSummary = async () => {
  const now = Date.now();
  if (now - lastRequestTime < 5000) { // 5 second cooldown
    toast.error('Please wait before requesting another summary');
    return;
  }
  setLastRequestTime(now);
  // ... rest of function
};
```

### 3. Batch Processing

Generate summaries for all lessons at once (admin feature):

```typescript
// Admin tool to pre-generate all summaries
const generateAllSummaries = async () => {
  const lessons = await getDocs(collection(db, 'lessons'));
  for (const lesson of lessons.docs) {
    const summary = await generateSummary(lesson.data());
    await saveSummaryToFirebase(lesson.id, summary);
  }
};
```

---

## Testing Checklist

- [ ] API key added to `.env` file
- [ ] `.env` file in `.gitignore`
- [ ] Dev server restarted
- [ ] Environment variable accessible in browser
- [ ] AI Summary button appears on lesson page
- [ ] Click button shows loading toast
- [ ] Summary modal appears with content
- [ ] Regenerate button works
- [ ] Close button and backdrop click work
- [ ] Error handling works (test with invalid key)
- [ ] Usage tracked in Google AI Studio
- [ ] No API key visible in browser DevTools

---

## Resources

### Official Documentation
- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://aistudio.google.com/
- **Pricing**: https://ai.google.dev/pricing
- **API Reference**: https://ai.google.dev/api

### Example Code
- **Quickstart**: https://ai.google.dev/tutorials/web_quickstart
- **Node.js SDK**: https://github.com/google/generative-ai-js
- **Best Practices**: https://ai.google.dev/docs/best_practices

### Community
- **GitHub Issues**: https://github.com/google/generative-ai-js/issues
- **Stack Overflow**: Tag `google-gemini-api`
- **Discord**: Google Cloud Community

---

## Support

If you encounter issues:

1. **Check Console**: Look for error messages in browser DevTools
2. **Verify API Key**: Test in Google AI Studio playground
3. **Check Quotas**: View usage in Google Cloud Console
4. **Review Logs**: Check Firebase logs for backend errors

For API-specific issues, contact Google Cloud Support: https://cloud.google.com/support

---

## Conclusion

Your Gemini API is now configured! The AI Summary feature should work seamlessly in your LMS.

**Quick Test**:
1. Navigate to any lesson
2. Click "AI Summary"
3. Wait 2-5 seconds
4. View your AI-generated summary!

Enjoy your AI-powered learning assistant! 🚀
