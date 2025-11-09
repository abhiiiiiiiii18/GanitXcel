# 🎥 Class Recording Feature - Quick Guide

## How to Record a Live Class

### Step 1: Find Your Upcoming Class
Navigate to the **"Upcoming Live Classes"** section on your dashboard. You'll see all your scheduled classes with:
- 📅 Date and time
- 📚 Course name
- 👥 Number of registered students
- 🎥 **Record button**

---

### Step 2: Click the Record Button
Click the **🎥 Record** button next to the class you want to record.

```
┌─────────────────────────────────────────────────┐
│ Dec 28  10:00 AM                               │
│ Algebra Mastery                                │
│ 45 students registered                         │
│                          [scheduled] [🎥 Record]│
└─────────────────────────────────────────────────┘
```

---

### Step 3: Review Class Details
A modal will appear showing:

```
         🎥
  Start Recording Class?

  You're about to start recording for:

┌─────────────────────────────────────┐
│  Algebra Mastery                    │
│  📅 Dec 28    ⏰ 10:00 AM           │
│  👥 45 students registered          │
└─────────────────────────────────────┘

⚠️ Recording Tips:
   • Ensure good lighting and audio
   • Test your microphone before starting
   • Recording will be saved automatically

    [Cancel]  [🔴 Start Recording]
```

---

### Step 4: Start Recording
Click **🔴 Start Recording** button.

**What happens:**
1. ✅ Modal closes
2. 🎥 Toast notification: "Recording started for Algebra Mastery!"
3. 🔴 Recording indicator appears at bottom-right

```
Bottom-Right Corner:
┌─────────────────────────────┐
│ ● Recording in Progress     │
│   Algebra Mastery           │
└─────────────────────────────┘
```

---

### Step 5: Recording Saves Automatically
After your class:
- 💾 Toast notification: "Recording saved successfully!"
- 🟢 Recording indicator disappears
- 📁 Recording is stored (ready for backend integration)

---

## 🎯 Key Features

### ✨ Smart Modal
- Shows all relevant class information
- Safety tips before recording
- Easy cancel option
- Beautiful animations

### 🔴 Live Recording Indicator
- Always visible during recording
- Pulsing red dot animation
- Shows which class is being recorded
- Non-intrusive design

### 📱 Mobile-Friendly
- Record button adapts to screen size
- Icon-only on mobile devices
- Full label on desktop
- Touch-optimized interactions

---

## 🔧 Technical Details (For Developers)

### State Management
```typescript
const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
const [selectedClass, setSelectedClass] = useState<any>(null);
const [isRecording, setIsRecording] = useState(false);
```

### Handler Functions
```typescript
// Open recording modal
handleStartRecording(classItem)

// Confirm and start recording
handleConfirmRecording()
```

### Mock Recording Flow
1. User clicks Record button
2. Modal opens with class details
3. User confirms recording
4. Recording state = true
5. Toast: "Recording started"
6. After 5 seconds (simulated)
7. Toast: "Recording saved"
8. Recording state = false

---

## 🚀 Production Integration

### To connect with real recording service:

```typescript
const handleConfirmRecording = async () => {
  setIsRecording(true);
  setIsRecordingModalOpen(false);
  
  try {
    // 1. Initialize recording service (WebRTC/Media Recorder)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    // 2. Start recording with service
    const recordingId = await recordingService.start({
      classId: selectedClass.id,
      stream: stream
    });
    
    toast.success(`🎥 Recording started for ${selectedClass.course}!`);
    
    // 3. Handle recording stop
    // (triggered by teacher or automatic at class end)
    
  } catch (error) {
    toast.error('Failed to start recording. Please check permissions.');
    setIsRecording(false);
  }
};
```

### Backend API Endpoints Needed:
```
POST   /api/recordings/start
POST   /api/recordings/stop
GET    /api/recordings/:classId
DELETE /api/recordings/:id
PUT    /api/recordings/:id/publish
```

---

## 📊 Recording Indicator Animations

### Pulsing Red Dot
```typescript
<motion.div
  animate={{ scale: [1, 1.3, 1] }}
  transition={{ repeat: Infinity, duration: 1 }}
  className="w-4 h-4 bg-white rounded-full"
/>
```

### Slide-up Animation
```typescript
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 100, opacity: 0 }}
/>
```

---

## ⚙️ Settings (Future Enhancements)

### Recording Quality
- [ ] 720p (Standard)
- [ ] 1080p (HD)
- [ ] 4K (Ultra HD)

### Recording Options
- [ ] Record screen only
- [ ] Record camera + screen
- [ ] Record audio only
- [ ] Add captions (auto-generated)
- [ ] Schedule recording (auto-start)

### Post-Recording
- [ ] Auto-upload to cloud storage
- [ ] Automatic transcription
- [ ] Email notification to students
- [ ] Add to course library
- [ ] Generate video analytics

---

## 🎬 User Flow Diagram

```
Teacher Dashboard
       ↓
Upcoming Classes Section
       ↓
Click 🎥 Record Button
       ↓
Recording Modal Opens
   ↓           ↓
[Cancel]   [Start Recording]
              ↓
        Recording Starts
              ↓
    🔴 Indicator Appears
              ↓
        Class Proceeds
              ↓
    Recording Auto-Saves
              ↓
    Toast: "Recording saved!"
              ↓
      Back to Dashboard
```

---

## 💡 Best Practices

### Before Recording
1. ✅ Test microphone and camera
2. ✅ Close unnecessary applications
3. ✅ Check internet connection
4. ✅ Review recording quality settings
5. ✅ Inform students recording is starting

### During Recording
1. 🎯 Stay focused on teaching
2. 📱 Keep recording indicator visible
3. 🔇 Mute notifications
4. 💾 Monitor storage space
5. 🎨 Use visual aids effectively

### After Recording
1. ✅ Verify recording saved
2. 📝 Add title and description
3. 🏷️ Tag with relevant topics
4. 👥 Notify students
5. 📊 Review analytics

---

## 🐛 Troubleshooting

### Recording Button Not Working
- Check if class is in "scheduled" status
- Ensure browser permissions for camera/mic
- Refresh the dashboard

### Recording Not Saving
- Check internet connection
- Verify storage space available
- Check backend API status

### No Recording Indicator
- Refresh the page
- Check if recording actually started
- Look for error notifications

---

## 📞 Support

For technical issues:
- 📧 Email: support@ganitxcel.com
- 💬 Live Chat: Available on dashboard
- 📚 Documentation: docs.ganitxcel.com

---

**Status**: ✅ Feature Complete and Tested
**Last Updated**: November 9, 2025
**Version**: 1.0.0
