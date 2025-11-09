# 🎬 Quick Reference: Video Recording & Live Streaming

## 📹 Recording a Class

```
1. Click "Record" button ───────────► Camera preview opens
2. Review preview ──────────────────► Adjust position/lighting  
3. Click "🔴 Start Recording" ──────► Recording begins
4. Duration counter starts ─────────► 00:00, 00:01, 00:02...
5. Click "⏹️ Stop" ─────────────────► Video downloads automatically
6. Open .webm file ─────────────────► Watch your recorded class!
```

**File:** `class-recording-[timestamp].webm`  
**Quality:** 1080p, 2.5 Mbps  
**Format:** WebM (VP9/Opus)

---

## 🔴 Live Doubt Class

```
1. Click "Start Live Doubt Class" ──► Camera preview opens
2. Review preview ──────────────────► Check camera/mic
3. Click "🔴 Go Live" ──────────────► Stream starts
4. Purple indicator appears ────────► You're live!
5. Solve student doubts ────────────► Real-time interaction
6. Click "✅ End Class" ────────────► Stream stops
```

**Students:** Notified automatically  
**Duration:** 30-60 minutes recommended  
**Stream:** WebRTC-ready

---

## 🎯 Features at a Glance

| Feature | Recording | Live Class |
|---------|-----------|------------|
| Camera Preview | ✅ Yes | ✅ Yes |
| Video Quality | 1080p | 1080p |
| Audio | ✅ Yes | ✅ Yes |
| Duration Counter | ✅ Yes (MM:SS) | ❌ No |
| Stop Button | ✅ Yes | ✅ Yes (End Class) |
| Auto Download | ✅ Yes (.webm) | ❌ No |
| Indicator Color | 🔴 Red | 🟣 Purple |

---

## 🔧 Quick Troubleshooting

### No Camera Preview?
```
1. Check browser permissions
2. Reload page (Ctrl+R)
3. Close other camera apps
4. Try incognito mode
```

### Recording Not Downloading?
```
1. Check browser download settings
2. Disable popup blocker
3. Ensure sufficient disk space
4. Try different browser
```

### Poor Video Quality?
```
1. Improve lighting
2. Check internet connection
3. Close other bandwidth apps
4. Use external microphone
```

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Recording Modal | Click "Record" |
| Cancel Modal | Click "Cancel" or outside |
| Stop Recording | Click Stop button |
| End Live Class | Click End button |

---

## 📊 Technical Specs

### Recording Settings
```javascript
Video:
- Resolution: 1920x1080
- Codec: VP9
- Bitrate: 2.5 Mbps
- Frame Rate: 30 FPS

Audio:
- Codec: Opus
- Sample Rate: 44.1 kHz
- Echo Cancellation: On
- Noise Suppression: On
```

### Live Streaming Settings
```javascript
Video:
- Resolution: 1920x1080
- Camera: User-facing
- Low Latency: Enabled

Audio:
- Sample Rate: 44.1 kHz
- Echo Cancellation: On
- Noise Suppression: On
```

---

## 🎨 UI Elements

### Recording Modal
```
┌─────────────────────────────┐
│         🎥 (animated)        │
│   Start Recording Class?     │
│                              │
│  ┌────────────────────────┐ │
│  │  📹 Camera Preview     │ │
│  │  [Your video feed]     │ │
│  └────────────────────────┘ │
│                              │
│  📚 React Fundamentals       │
│  📅 Dec 10  ⏰ 10:00 AM      │
│                              │
│  ⚠️ Recording Tips           │
│                              │
│  [Cancel] [🔴 Start]         │
└─────────────────────────────┘
```

### Recording Indicator
```
┌─────────────────────────┐
│ ⚪ Recording in Progress │
│ React Fundamentals      │
│                         │
│ [05:42]  [⏹️ Stop]      │
└─────────────────────────┘
```

### Live Class Modal
```
┌─────────────────────────────┐
│         🔴 (animated)        │
│ Start Live Doubt Class?      │
│                              │
│  ┌────────────────────────┐ │
│  │  📹 Camera Preview     │ │
│  │  [Your video feed]     │ │
│  └────────────────────────┘ │
│                              │
│  👥 7 pending doubts         │
│  ⏰ 30-60 minutes rec.       │
│  📢 All students notified    │
│                              │
│  💡 Live Class Tips          │
│                              │
│  [Cancel]  [🔴 Go Live]      │
└─────────────────────────────┘
```

### Live Class Indicator
```
┌─────────────────────────┐
│ ⚪ Live Doubt Class     │
│ Students can join now   │
│                         │
│    [✅ End Class]       │
└─────────────────────────┘
```

---

## ✅ Pre-Flight Checklist

### Before Recording
- [ ] Camera working
- [ ] Microphone working
- [ ] Good lighting
- [ ] Clean background
- [ ] Browser permissions granted
- [ ] Sufficient disk space

### Before Going Live
- [ ] Camera working
- [ ] Microphone working
- [ ] Good lighting
- [ ] Materials prepared
- [ ] Internet stable
- [ ] Students notified

---

## 🌐 Browser Requirements

### Minimum Versions
- Chrome 79+
- Edge 79+
- Firefox 76+
- Opera 66+

### Required Permissions
- ✅ Camera access
- ✅ Microphone access
- ✅ HTTPS connection (production)

---

## 📁 File Locations

### Downloaded Recordings
```
Windows: C:\Users\[username]\Downloads\
Mac: /Users/[username]/Downloads/
Linux: /home/[username]/Downloads/

Filename: class-recording-1699999999.webm
```

### Component File
```
src/pages/Teacher/Dashboard.tsx
```

### Documentation
```
VIDEO_RECORDING_COMPLETE_GUIDE.md
VIDEO_FEATURES_TESTING.md
VIDEO_IMPLEMENTATION_SUMMARY.md
```

---

## 💾 State Variables

```typescript
// Recording
mediaRecorder: MediaRecorder | null
recordedChunks: Blob[]
recordingDuration: number
isRecording: boolean

// Live Streaming
stream: MediaStream | null
isLiveDoubtActive: boolean
isLiveStreaming: boolean

// Preview
previewStream: MediaStream | null
videoPreviewRef: useRef<HTMLVideoElement>
```

---

## 🎯 Handler Functions

```typescript
handleStartRecording()      // Shows recording modal with preview
handleConfirmRecording()    // Starts actual recording
handleStopRecording()       // Stops and downloads video
handleCancelRecording()     // Closes modal, cleans up

handleStartLiveDoubtClass() // Shows live modal with preview
handleConfirmLiveDoubtClass() // Goes live
handleEndLiveDoubtClass()   // Ends live session
handleCancelLiveClass()     // Closes modal, cleans up
```

---

## 🎊 Success Indicators

### Recording Started Successfully
- ✅ Red indicator visible bottom-right
- ✅ Duration counter at 0:00
- ✅ Pulsing animation
- ✅ Stop button clickable
- ✅ Success toast appears

### Live Class Started Successfully
- ✅ Purple indicator visible
- ✅ "Live Doubt Class" text shown
- ✅ Pulsing animation
- ✅ End Class button clickable
- ✅ Success toast appears

---

## 🚀 Quick Commands (for testing)

### Chrome DevTools Console
```javascript
// Check if getUserMedia is supported
navigator.mediaDevices.getUserMedia ? "✅ Supported" : "❌ Not Supported"

// Check available devices
navigator.mediaDevices.enumerateDevices()

// Check permissions
navigator.permissions.query({name: 'camera'})
navigator.permissions.query({name: 'microphone'})
```

---

## 📞 Support Commands

### If Something Goes Wrong
```bash
# Clear browser cache
Ctrl+Shift+Del (Windows/Linux)
Cmd+Shift+Del (Mac)

# Hard reload
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Open DevTools
F12 or Ctrl+Shift+I
```

---

## 🎉 That's It!

**Everything you need to know on one page!**

**Go ahead and try it:**
1. Open Teacher Dashboard
2. Click "Record" or "Start Live Doubt Class"
3. Grant permissions
4. Start teaching!

**Happy Recording! 📹🔴**
