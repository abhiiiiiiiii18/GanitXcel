# 🔧 AI Chatbot Troubleshooting Guide

## Issue: AI Cannot Solve Questions Properly

I've enhanced the AI chatbot with better problem-solving capabilities and detailed error logging. Here's what to do:

---

## ✅ Updates Made

### 1. Enhanced System Instructions
The AI now has **specific instructions** for solving math problems:
- Step-by-step solutions with clear explanations
- Shows WHY each step is done, not just HOW
- Uses numbered steps format
- Marks final answers clearly
- Focuses on teaching the method, not just answers

### 2. Better Error Handling
Added detailed error messages for:
- Invalid API keys
- Quota/rate limit exceeded
- Network connection issues
- Generic errors with helpful guidance

### 3. Debug Logging
Console now shows:
- When messages are sent to Gemini
- API initialization status
- Full API responses
- Detailed error information

---

## 🧪 How to Test the Fixed Chatbot

### Step 1: Open Browser Console
1. Press **F12** in your browser
2. Click the **Console** tab
3. Keep it open while testing

### Step 2: Navigate to Lesson Page
Go to: `http://localhost:3000/lesson/algebra-basics/1`

### Step 3: Test with Math Problems

Try these questions to verify it's working:

#### Test 1: Simple Equation
```
Solve: 2x + 5 = 15
```

**Expected Response:**
```
Step 1: Subtract 5 from both sides
2x + 5 - 5 = 15 - 5
2x = 10

Step 2: Divide both sides by 2
2x ÷ 2 = 10 ÷ 2
x = 5

✓ Final Answer: x = 5
```

#### Test 2: Word Problem
```
Ram has 3 apples. He buys 5 more. How many apples does he have now?
```

**Expected Response:**
```
Step 1: Identify what we know
- Ram started with 3 apples
- He bought 5 more apples

Step 2: Determine the operation
We need to add: 3 + 5

Step 3: Calculate
3 + 5 = 8

✓ Final Answer: Ram has 8 apples
```

#### Test 3: Concept Explanation
```
What are variables in algebra?
```

**Expected Response:**
Educational explanation with examples

#### Test 4: Step-by-step Request
```
Explain how to solve: 3(x + 2) = 18
```

**Expected Response:**
Detailed step-by-step solution with distributive property explanation

---

## 🔍 Check Console for Errors

### What You Should See (Success):
```
🤖 Initializing Gemini with API key: AIzaSyCOqL...
🤖 Sending message to Gemini: Solve 2x + 5 = 15
🤖 Initializing Gemini chat...
🤖 Calling Gemini API...
🤖 Gemini response received: [full response]
```

### Possible Error Messages:

#### Error 1: API Key Invalid
```
❌ Error: Invalid API key
```

**Solution:**
1. Check your API key in `.env` file
2. Verify it starts with `AIza`
3. Go to https://ai.google.dev/ and regenerate if needed
4. Make sure there are no spaces or quotes around the key
5. Restart dev server after changing

#### Error 2: Quota Exceeded
```
❌ Error: quota exceeded / limit reached
```

**Solution:**
- Free tier: 60 requests/minute, 1,500/day
- Wait a few minutes and try again
- Check usage at: https://aistudio.google.com/
- Consider upgrading to paid tier if needed

#### Error 3: Network Error
```
❌ Error: network / fetch failed
```

**Solution:**
- Check your internet connection
- Try disabling VPN if using one
- Check firewall settings
- Try from a different network

#### Error 4: CORS or Blocked Request
```
❌ Error: CORS / blocked by policy
```

**Solution:**
- Gemini API should work from localhost
- If blocked, check browser extensions (ad blockers)
- Try disabling browser extensions temporarily
- Use Chrome/Edge for best compatibility

---

## 🔑 Verify API Key

### Check Your Key is Valid:

1. **Open `.env` file** - Should look like:
```env
REACT_APP_GEMINI_API_KEY=AIzaSyCOqLb1pNXt2ro-s99unyeqBj180Gyjs8I
```

2. **Test at Google AI Studio:**
- Go to: https://aistudio.google.com/app/prompts/new_chat
- Use your API key there
- Ask: "What is 2+2?"
- If it responds, key is valid

3. **Regenerate if Needed:**
- Visit: https://ai.google.dev/
- Go to "Get API Key"
- Create a new key
- Replace in `.env` file
- **Restart dev server** (important!)

---

## 🚀 If Still Not Working

### Step 1: Clear Cache & Restart
```bash
# Stop dev server (Ctrl+C)
# Then run:
npm start
```

### Step 2: Check Environment Variable Loading
Add this to `AIBot.tsx` temporarily (line 40):
```typescript
console.log('ENV CHECK:', process.env.REACT_APP_GEMINI_API_KEY);
```
- Should show your API key
- If undefined, .env file not loaded properly

### Step 3: Test with Simple Model
Change model in `AIBot.tsx` (line 47):
```typescript
model: 'gemini-pro',  // Try this instead of gemini-1.5-flash
```

### Step 4: Check React App Running
- Dev server should show: "webpack compiled successfully"
- Open browser: http://localhost:3000
- No red errors on page

---

## 📊 Expected Behavior Now

### Before (Old Chatbot):
❌ Generic random responses  
❌ No actual problem solving  
❌ Fake AI simulation  

### After (New Gemini Chatbot):
✅ Real AI-powered responses  
✅ Step-by-step math solutions  
✅ Detailed explanations  
✅ Context-aware tutoring  
✅ Proper error messages  

---

## 💡 Best Practices for Using the Chatbot

### Good Questions:
✅ "Solve: 3x + 7 = 22"  
✅ "Explain the distributive property"  
✅ "Give me 3 practice problems about variables"  
✅ "Check my work: x = 5 for equation 2x + 3 = 13"  
✅ "What's the formula for area of a circle?"  

### Avoid:
❌ "help" (too vague)  
❌ "solve it" (no problem given)  
❌ Very long questions (break into parts)  
❌ Non-math questions (will politely redirect)  

---

## 🎯 Quick Test Commands

Copy-paste these into chatbot to test:

1. `Solve: x + 5 = 12`
2. `What is 15% of 80?`
3. `Explain: (a + b)² = a² + 2ab + b²`
4. `Find x: 2x - 3 = 7`
5. `If y = 2x + 1 and x = 3, what is y?`

All should get proper step-by-step solutions!

---

## 📞 Still Having Issues?

### Collect This Info:

1. **Browser Console Output** (F12 → Console tab)
   - Copy all 🤖 and ❌ messages
   
2. **Error Message** (exact text from chatbot)
   
3. **Question Asked** (what you typed)
   
4. **Expected vs Actual** (what should happen vs what did)

5. **API Key Status** (first 10 chars: `AIzaSyCOqL...`)

6. **Network Tab** (F12 → Network → filter "generativelanguage")
   - Check if API calls are being made
   - Check response status (should be 200 OK)

---

## 🎉 Success Indicators

Your chatbot is working properly when:

✅ Console shows: `🤖 Gemini response received`  
✅ Responses take 2-5 seconds (not instant)  
✅ Answers are unique each time (not repeated)  
✅ Math solutions show actual steps  
✅ Can handle follow-up questions  
✅ Remembers conversation context  

---

## 🔄 Restart Checklist

After making ANY changes to `.env`:

1. ✅ Stop dev server (Ctrl+C in terminal)
2. ✅ Wait for terminal to fully stop
3. ✅ Run: `npm start`
4. ✅ Wait for "webpack compiled successfully"
5. ✅ Hard refresh browser (Ctrl+Shift+R)
6. ✅ Clear browser cache if needed
7. ✅ Test chatbot again

---

**The chatbot is now significantly improved! Try it with the test questions above and check the console for detailed logging.** 🚀

If you see specific error messages in the console, let me know exactly what they say and I can help further!
