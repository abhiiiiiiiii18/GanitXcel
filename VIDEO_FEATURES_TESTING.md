# 🧪 Video Features Testing Guide

## Quick Test Checklist

### 📹 Test Recording Feature

#### 1. Start Recording
- [ ] Navigate to Teacher Dashboard
- [ ] Find "Upcoming Classes" section
- [ ] Click **"Record"** button on any class
- [ ] Modal opens with animated 🎥 emoji

#### 2. Camera Preview
- [ ] Camera preview appears in modal
- [ ] Can see yourself in preview window
- [ ] Video is smooth (not laggy)
- [ ] "📹 Camera Preview" label visible

#### 3. Start Recording
- [ ] Click **"🔴 Start Recording"** button
- [ ] Modal closes
- [ ] Red indicator appears bottom-right
- [ ] Pulsing red circle visible
- [ ] Duration counter starts at 0:00

#### 4. During Recording
- [ ] Counter updates every second (0:01, 0:02, etc.)
- [ ] Class name displayed correctly
- [ ] Stop button visible and clickable
- [ ] Recording continues smoothly

#### 5. Stop Recording
- [ ] Click **"⏹️ Stop"** button
- [ ] Indicator disappears
- [ ] Video file downloads automatically
- [ ] File name format: `class-recording-[timestamp].webm`
- [ ] Success toast appears

#### 6. Check Downloaded Video
- [ ] Open downloaded .webm file
- [ ] Video plays correctly
- [ ] Audio is clear
- [ ] Duration matches recorded time
- [ ] Video quality is good (1080p)

---

### 🔴 Test Live Doubt Class Feature

#### 1. Start Live Class
- [ ] Click **"Start Live Doubt Class"** button
- [ ] Modal opens with animated 🔴 emoji
- [ ] Pending doubts count shown
- [ ] Recommended duration shown
- [ ] Student notification info shown

#### 2. Camera Preview
- [ ] Camera preview appears in modal
- [ ] Can see yourself in preview
- [ ] "📹 Camera Preview - Ready to Go Live" label visible
- [ ] Preview is smooth

#### 3. Go Live
- [ ] Click **"🔴 Go Live"** button
- [ ] Modal closes
- [ ] Purple indicator appears bottom-right
- [ ] Pulsing white circle visible
- [ ] "Live Doubt Class" text visible
- [ ] "Students can join now" text visible

#### 4. During Live Class
- [ ] Indicator remains visible
- [ ] End Class button clickable
- [ ] Purple background color correct
- [ ] No lag or freezing

#### 5. End Live Class
- [ ] Click **"✅ End Class"** button
- [ ] Indicator disappears
- [ ] Success toast appears
- [ ] Stream stops properly

---

### 🎬 Test Cancel Actions

#### Recording Cancel
- [ ] Click "Record" button
- [ ] Camera preview appears
- [ ] Click **"Cancel"** button
- [ ] Modal closes
- [ ] Camera preview stops (no green light)
- [ ] No recording starts

#### Live Class Cancel
- [ ] Click "Start Live Doubt Class"
- [ ] Camera preview appears
- [ ] Click **"Cancel"** button
- [ ] Modal closes
- [ ] Camera preview stops
- [ ] No live class starts

---

### 🔧 Test Error Scenarios

#### Permission Denied
**Test:** Deny camera/microphone permissions

Recording:
- [ ] Click "Record"
- [ ] Deny permission
- [ ] Error toast appears
- [ ] User-friendly message shown
- [ ] Modal closes gracefully

Live Class:
- [ ] Click "Start Live Doubt Class"
- [ ] Deny permission
- [ ] Error toast appears
- [ ] User-friendly message shown
- [ ] Modal closes gracefully

#### No Camera/Microphone
**Test:** Disconnect camera (if possible)

- [ ] Click "Record" or "Go Live"
- [ ] Error message appears
- [ ] Toast notification shown
- [ ] Graceful failure

#### Browser Not Supported
**Test:** Try in older browser (if available)

- [ ] Feature should show error
- [ ] Or fallback message
- [ ] No crashes

---

### 🧹 Test Memory Cleanup

#### 1. Recording Cleanup
- [ ] Start recording
- [ ] Navigate away from dashboard
- [ ] Camera light turns off (no green indicator)
- [ ] No memory leaks

#### 2. Live Class Cleanup
- [ ] Start live class
- [ ] Navigate away from dashboard
- [ ] Camera light turns off
- [ ] No memory leaks

#### 3. Preview Cleanup
- [ ] Open recording modal (preview active)
- [ ] Click "Cancel"
- [ ] Camera light turns off immediately
- [ ] No lingering streams

---

### 📱 Test Different Scenarios

#### Multiple Recordings
- [ ] Record first class
- [ ] Stop recording
- [ ] Download completes
- [ ] Start second recording
- [ ] Both work independently

#### Recording + Live Class
- [ ] Start recording
- [ ] Recording indicator shows
- [ ] Start live doubt class
- [ ] Both indicators visible
- [ ] Live indicator above recording
- [ ] Both work simultaneously

#### Long Duration
- [ ] Start recording
- [ ] Let it run for 2-3 minutes
- [ ] Counter updates correctly
- [ ] Stop recording
- [ ] File size reasonable

---

### 🎨 UI/UX Testing

#### Recording Modal
- [ ] Modal centered on screen
- [ ] Background blur/overlay
- [ ] Click outside closes modal
- [ ] Animations smooth
- [ ] All text readable
- [ ] Buttons clearly labeled
- [ ] Tips section visible

#### Live Class Modal
- [ ] Modal centered on screen
- [ ] Background blur/overlay
- [ ] Click outside closes modal
- [ ] Animations smooth
- [ ] All info clearly displayed
- [ ] Icons/emojis visible

#### Recording Indicator
- [ ] Fixed position (bottom-right)
- [ ] Always on top (z-index)
- [ ] Red color visible
- [ ] Pulsing animation smooth
- [ ] Duration readable
- [ ] Stop button accessible

#### Live Class Indicator
- [ ] Fixed position (above recording)
- [ ] Purple color visible
- [ ] Pulsing animation smooth
- [ ] Text clearly readable
- [ ] End button accessible

---

### 🌐 Browser Compatibility Testing

#### Chrome/Edge
- [ ] Recording works
- [ ] Live class works
- [ ] Preview works
- [ ] Download works
- [ ] All UI elements render correctly

#### Firefox
- [ ] Recording works
- [ ] Live class works
- [ ] Preview works
- [ ] Download works
- [ ] All UI elements render correctly

#### Safari (if available)
- [ ] Recording works (or shows not supported)
- [ ] Live class works (or shows not supported)
- [ ] Graceful fallback

---

## 🐛 Common Issues & Solutions

### Issue: No camera preview
**Solution:**
1. Check browser permissions
2. Reload page
3. Try in incognito mode
4. Check if camera is used by another app

### Issue: Recording not downloading
**Solution:**
1. Check browser download settings
2. Disable popup blocker
3. Try manual download
4. Check disk space

### Issue: Poor video quality
**Solution:**
1. Check internet connection
2. Ensure good lighting
3. Close other apps
4. Try lower resolution (if option available)

### Issue: Audio not recording
**Solution:**
1. Check microphone permissions
2. Test microphone in browser settings
3. Ensure microphone is not muted
4. Try external microphone

---

## ✅ Success Criteria

### All Features Working ✓
- ✅ Recording starts and stops correctly
- ✅ Live class starts and ends correctly
- ✅ Camera previews show in both modals
- ✅ Duration counter updates every second
- ✅ Video downloads automatically
- ✅ Error handling works properly
- ✅ Memory cleanup prevents leaks
- ✅ Cancel actions stop camera
- ✅ UI animations are smooth
- ✅ Toast notifications appear
- ✅ Browser permissions requested correctly

### Performance Benchmarks
- Camera preview appears within: **< 2 seconds**
- Recording starts within: **< 1 second**
- Stop button responds within: **< 500ms**
- Video download begins within: **< 3 seconds**
- Memory cleanup completes within: **< 1 second**

---

## 📊 Test Results Template

```
Date: ___________
Browser: ___________
OS: ___________

Recording Feature:
[ ] Camera Preview: ___________
[ ] Start Recording: ___________
[ ] Duration Counter: ___________
[ ] Stop Recording: ___________
[ ] Video Download: ___________
[ ] Video Playback: ___________

Live Class Feature:
[ ] Camera Preview: ___________
[ ] Go Live: ___________
[ ] Live Indicator: ___________
[ ] End Class: ___________

Error Handling:
[ ] Permission Denied: ___________
[ ] Cancel Actions: ___________
[ ] Memory Cleanup: ___________

UI/UX:
[ ] Modal Appearance: ___________
[ ] Animations: ___________
[ ] Indicators: ___________
[ ] Toast Messages: ___________

Overall Status: ___________
Issues Found: ___________
Notes: ___________
```

---

## 🚀 Ready to Test!

Follow this checklist to thoroughly test all video recording and live streaming features. Report any issues found with:
- Browser version
- OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/recordings if possible

**Happy Testing! 🎉**
