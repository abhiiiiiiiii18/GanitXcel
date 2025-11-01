import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import AIBot from '../components/AIBot';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, addComment, getComments, markLessonComplete } from '../services/firebase';
import { useAuthStore } from '../store';

// Course type definition
interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
  notesUrl: string;
}

interface Course {
  id: string;
  title: string;
  teacherId: string;
  description: string;
  lessons: Lesson[];
}

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [videoWatchedPercentage, setVideoWatchedPercentage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch course data from Firebase
  const { data: course, isLoading: courseLoading, error: courseError } = useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId!) as Promise<Course>,
    enabled: !!courseId,
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 DEBUG - CourseId:', courseId);
    console.log('🔍 DEBUG - LessonId:', lessonId);
    console.log('🔍 DEBUG - Course Data:', course);
    console.log('🔍 DEBUG - Course Error:', courseError);
    console.log('🔍 DEBUG - Loading:', courseLoading);
  }, [course, courseId, lessonId, courseError, courseLoading]);

  // Find the specific lesson
  const lesson = course?.lessons?.find((l) => l.id === lessonId) || {
    id: lessonId,
    title: lessonId === 'l2' 
      ? 'Linear Equations in One Variable' 
      : lessonId === 'l3'
        ? 'Linear Equations in Two Variables'
        : lessonId === 'l4'
          ? 'Quadratic Equations - Part 1'
          : lessonId === 'l5'
            ? 'Quadratic Equations - Part 2'
            : 'Introduction to Variables',
    description: lessonId === 'l2' 
      ? 'Learn about solving linear equations with one variable' 
      : lessonId === 'l3'
        ? 'Master linear equations with two variables'
        : lessonId === 'l4'
          ? 'Introduction to quadratic equations and solving methods'
          : lessonId === 'l5'
            ? 'Advanced quadratic equations and applications'
            : 'Learn about variables in algebra',
    videoUrl: lessonId === 'l2' 
      ? 'https://www.youtube.com/watch?v=kkGeOWYOFoA'
      : lessonId === 'l3'
        ? 'https://www.youtube.com/watch?v=Ft2_QtXAnh8'
        : lessonId === 'l4'
          ? 'https://www.youtube.com/watch?v=qeByhTF8WEw'
          : lessonId === 'l5'
            ? 'https://www.youtube.com/watch?v=nQ2sQwOPUZA'
            : 'https://www.youtube.com/watch?v=NybHckSEQBI',
    duration: 0,
    notesUrl: 'https://example.com/notes/lesson1.pdf',
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return 'NybHckSEQBI'; // Default: Introduction to Variables
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : 'NybHckSEQBI';
  };

  const youtubeVideoId = getYouTubeVideoId(lesson.videoUrl);
  
  // Debug video ID
  useEffect(() => {
    console.log('🎬 DEBUG - Lesson:', lesson);
    console.log('🎬 DEBUG - Video URL:', lesson.videoUrl);
    console.log('🎬 DEBUG - YouTube Video ID:', youtubeVideoId);
  }, [lesson, youtubeVideoId]);

  // Fetch comments
  useEffect(() => {
    if (courseId && lessonId) {
      getComments(courseId, lessonId)
        .then(setComments)
        .catch(err => console.error('Error fetching comments:', err));
    }
  }, [courseId, lessonId]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !courseId || !lessonId) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      await addComment(courseId, lessonId, user.id, user.name, newComment);
      setNewComment('');
      // Refresh comments
      const updated = await getComments(courseId, lessonId);
      setComments(updated);
      toast.success('Comment added! 💬');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  // Download notes handler
  const handleDownloadNotes = () => {
    if (lesson.notesUrl) {
      window.open(lesson.notesUrl, '_blank');
      toast.success('Opening notes... 📄');
    } else {
      toast.error('Notes not available for this lesson');
    }
  };

  // AI Summarization handler
  const handleGenerateSummary = async () => {
    if (aiSummary) {
      // If summary already exists, just show it
      setShowSummary(true);
      return;
    }

    setIsGeneratingSummary(true);
    toast.loading('🤖 AI is generating summary...', { id: 'ai-summary' });

    try {
      // Initialize Gemini API
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      // Prepare the lesson content for summarization
      const lessonContent = `
Lesson Title: ${lesson.title}
Description: ${lesson.description || 'Math lesson'}
Duration: ${lesson.duration} minutes

Please provide a comprehensive summary of this math lesson. Include:
1. Main concepts covered
2. Key formulas or theorems (if applicable)
3. Important points to remember
4. How this connects to real-world applications
      `.trim();

      // Generate summary
      const result = await model.generateContent(lessonContent);
      const response = result.response;
      const summary = response.text();

      setAiSummary(summary);
      setShowSummary(true);
      toast.success('✨ Summary generated!', { id: 'ai-summary' });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.', { id: 'ai-summary' });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      disablekb: 1, // Disable keyboard controls
      fs: 0, // Disable fullscreen
      modestbranding: 1, // Minimal YouTube branding
      rel: 0, // Don't show related videos
      showinfo: 0,
      iv_load_policy: 3, // Hide annotations
    },
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <div className="text-xl font-semibold">Loading lesson...</div>
        </div>
      </div>
    );
  }

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    
    // Monitor playback to track progress
    intervalRef.current = setInterval(() => {
      if (event.target && event.target.getCurrentTime) {
        const current = event.target.getCurrentTime();
        const total = event.target.getDuration();
        setCurrentTime(current);
        
        // Calculate watch percentage
        if (total > 0) {
          const percentage = (current / total) * 100;
          setVideoWatchedPercentage(percentage);
          
          // Auto-complete when 90% watched
          if (percentage >= 90 && !lessonCompleted && user && courseId && lessonId) {
            handleLessonComplete();
          }
        }
      }
    }, 1000);
  };

  const handleLessonComplete = async () => {
    if (!user || !courseId || !lessonId || lessonCompleted) return;
    
    try {
      setLessonCompleted(true);
      toast.loading('Marking lesson as complete...', { id: 'lesson-complete' });
      
      const result = await markLessonComplete(user.id, courseId, lessonId);
      
      if (result.alreadyCompleted) {
        toast.success('✅ Already completed!', { id: 'lesson-complete' });
      } else {
        toast.success('🎉 Lesson completed! Next lesson unlocked!', { id: 'lesson-complete' });
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Failed to mark complete', { id: 'lesson-complete' });
      setLessonCompleted(false);
    }
  };

  const onPlay = () => {
    setIsPlaying(true);
    toast.success('Lesson started! 📚');
  };

  const onPause = () => {
    setIsPlaying(false);
  };

  const onEnd = () => {
    setIsPlaying(false);
    
    // Mark as complete if not already done
    if (!lessonCompleted && user && courseId && lessonId) {
      handleLessonComplete();
    }
    
    // Show completion message without auto-navigating
    toast.success('🎉 Video completed! Go back to see the next lesson unlocked.', {
      duration: 4000,
      icon: '✅'
    });
  };

  const togglePictureInPicture = async () => {
    if (player && player.getIframe) {
      const iframe = player.getIframe();
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          toast.success('Exited mini player');
        } else {
          await (iframe as any).requestPictureInPicture();
          toast.success('Mini player activated! 📺');
        }
      } catch (error) {
        toast.error('Picture-in-Picture not supported');
      }
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              icon="←"
              onClick={() => navigate(`/course/${courseId}`)}
            >
              Back to Course
            </Button>
            <h1 className="text-lg font-bold text-gray-900 flex-1 mx-4 truncate">
              {lesson.title}
            </h1>
            {videoWatchedPercentage > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">
                  {Math.round(videoWatchedPercentage)}% watched
                </span>
                {lessonCompleted && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ✓ Completed
                  </span>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon="🤖"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
              >
                {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="📺"
                onClick={togglePictureInPicture}
              >
                Mini Player
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar progress={progress} color="primary" size="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-black rounded-2xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: '16/9' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <YouTube
                videoId={youtubeVideoId}
                opts={opts}
                onReady={onReady}
                onPlay={onPlay}
                onPause={onPause}
                onEnd={onEnd}
                className="w-full h-full"
              />
            </motion.div>

            {/* Lesson Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-3">{lesson.title}</h2>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              
              {/* Completion Message */}
              {lessonCompleted && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 mb-1">
                        Lesson Completed!
                      </p>
                      <p className="text-sm text-green-700 mb-3">
                        Great job! Test your knowledge with a quiz or continue to the next lesson.
                      </p>
                      <div className="flex gap-3">
                        {lessonId && ['l2', 'l3', 'l4', 'l5'].includes(lessonId) && (
                          <Button
                            onClick={() => navigate(`/quiz/${lessonId}?courseId=${courseId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            📝 Take Quiz
                          </Button>
                        )}
                        <Button
                          onClick={() => navigate(`/course/${courseId}`)}
                          variant="outline"
                        >
                          📚 Back to Course
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  {lesson.duration} minutes
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xl">�</span>
                  Sequential learning
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  AI help available
                </span>
              </div>
            </div>

            {/* Tabs for Notes/Discussion/Comments */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setShowNotes(true)}
                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                      showNotes ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    📝 Notes
                  </button>
                  <button
                    onClick={() => setShowNotes(false)}
                    className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                      !showNotes ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    💬 Comments
                  </button>
                </div>
              </div>

              <div className="p-6">
                {showNotes ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Lesson Notes</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="📄"
                        onClick={handleDownloadNotes}
                      >
                        Download PDF
                      </Button>
                    </div>
                    <div className="prose max-w-none">
                      <div className="text-gray-700 leading-relaxed">
                        <p className="text-sm text-gray-500">
                          {lesson.notesUrl ? 'Click "Download PDF" to access detailed notes.' : 'Notes will be available soon.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
                    
                    {/* Add Comment Form */}
                    <div className="mb-6 bg-gray-50 rounded-xl p-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or ask a question..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <span className="text-4xl mb-2 block">💬</span>
                          <p>No comments yet. Be the first to comment!</p>
                        </div>
                      ) : (
                        comments.map((comment: any) => (
                          <div key={comment.id} className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Chatbot Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24"
              style={{ maxHeight: 'calc(100vh - 8rem)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AIBot 
                lessonTitle={lesson.title || 'Mathematics'}
                lessonContext={`${course?.title || 'Mathematics'} - ${lesson.description || ''}`}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>🤖</span>
                    AI Lesson Summary
                  </h2>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="text-white hover:text-gray-200 transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/90 mt-2">{lesson.title}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                {aiSummary ? (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-4">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {aiSummary}
                      </div>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <p className="text-sm text-yellow-800">
                        💡 <strong>Tip:</strong> This summary was generated by AI. Make sure to watch the full video and take your own notes for best results!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-gray-600">Generating summary...</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSummary(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  icon="🔄"
                >
                  Regenerate
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPage;
