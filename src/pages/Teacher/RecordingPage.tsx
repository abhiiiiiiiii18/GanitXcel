import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/Button';

interface RecordingPageProps {}

const RecordingPage: React.FC<RecordingPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classData = location.state?.classData;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();

    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      console.log('🎥 Initializing camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      console.log('✅ Camera initialized successfully');
      setStream(mediaStream);

      // Set video preview
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsInitializing(false);
      toast.success('🎥 Camera ready! Click Start Recording when ready.');
    } catch (error) {
      console.error('❌ Error initializing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
      setIsInitializing(false);
    }
  };

  const startRecording = () => {
    if (!stream) {
      toast.error('Camera not ready. Please wait...');
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('🎬 Recording stopped, processing video...');
        const blob = new Blob(chunks, { type: 'video/webm' });
        downloadRecording(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedChunks(chunks);

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      toast.success('🔴 Recording started!');
      console.log('🔴 Recording started');
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      toast.success('⏸️ Recording paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      
      // Resume duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('▶️ Recording resumed');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      
      toast.success('⏹️ Recording stopped');
    }
  };

  const downloadRecording = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classData?.course || 'recording'}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('📥 Recording downloaded!');
    console.log('📥 Recording downloaded');
    
    // Reset and ask if they want to record again
    setTimeout(() => {
      if (window.confirm('Recording saved! Do you want to record another session?')) {
        setRecordingDuration(0);
        setRecordedChunks([]);
      } else {
        handleExit();
      }
    }, 1000);
  };

  const handleExit = () => {
    if (isRecording) {
      const confirmExit = window.confirm('Recording is in progress. Are you sure you want to exit?');
      if (!confirmExit) return;
      
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    }
    
    // Clean up
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    
    navigate('/teacher/dashboard');
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* Main Video Area - Full Screen */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="relative w-full h-full">
          {/* Full Screen Video Preview */}
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror effect for natural view
            />
            
            {/* Loading Overlay */}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-white mx-auto mb-6"></div>
                  <p className="text-white text-2xl font-bold mb-2">Initializing camera...</p>
                  <p className="text-gray-400 text-lg">Please allow camera and microphone access</p>
                </div>
              </div>
            )}

            {/* Recording Indicator Overlay - Top Left */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-8 left-8"
              >
                <div className="bg-red-600 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-4 h-4 bg-white rounded-full"
                  />
                  <span className="text-white font-bold text-lg">
                    {isPaused ? '⏸️ PAUSED' : 'REC'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Duration Display on Video - Top Right */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-8 right-8"
              >
                <div className="bg-black bg-opacity-80 px-6 py-3 rounded-xl border-2 border-red-600">
                  <span className="text-white font-mono text-3xl font-bold">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Class Info Overlay - Top Center */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-black bg-opacity-70 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-700">
                <h2 className="text-white text-2xl font-bold text-center mb-1">
                  {classData?.course || 'Class Recording'}
                </h2>
                <p className="text-gray-300 text-sm text-center">
                  {classData?.date} • {classData?.time}
                </p>
              </div>
            </motion.div>

            {/* Ready to Record Overlay - Center */}
            {!isRecording && !isInitializing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-8xl mb-6"
                  >
                    🎥
                  </motion.div>
                  <h2 className="text-white text-4xl font-bold mb-4">Ready to Record</h2>
                  <p className="text-gray-300 text-xl">Click "Start Recording" below to begin</p>
                </div>
              </motion.div>
            )}

            {/* Recording in Progress Overlay - Bottom Center */}
            {isRecording && !isPaused && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
              >
                <div className="bg-black bg-opacity-70 backdrop-blur-sm px-8 py-4 rounded-2xl">
                  <p className="text-white text-lg font-semibold text-center flex items-center gap-3">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🔴
                    </motion.span>
                    Recording in Progress...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Control Panel - Floating at Bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6">
            {!isRecording ? (
              // Start Recording Button
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                disabled={isInitializing}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-16 py-6 text-xl font-bold rounded-full shadow-2xl transform transition-all flex items-center gap-4"
              >
                <span className="text-3xl">🔴</span>
                <span>Start Recording</span>
              </motion.button>
            ) : (
              // Recording Controls
              <div className="flex items-center gap-6">
                {isPaused ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resumeRecording}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 text-lg font-bold rounded-full shadow-2xl flex items-center gap-3"
                  >
                    <span className="text-2xl">▶️</span>
                    <span>Resume</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pauseRecording}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-10 py-5 text-lg font-bold rounded-full shadow-2xl flex items-center gap-3"
                  >
                    <span className="text-2xl">⏸️</span>
                    <span>Pause</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="bg-red-700 hover:bg-red-800 text-white px-10 py-5 text-lg font-bold rounded-full shadow-2xl flex items-center gap-3"
                >
                  <span className="text-2xl">⏹️</span>
                  <span>Stop & Save</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Exit Button - Small, in corner */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExit}
            className="absolute bottom-8 left-8 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold"
          >
            <span>← Exit</span>
          </motion.button>

          {/* Additional Info */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 text-sm">
                💾 Recording in progress... Don't close this window
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecordingPage;
