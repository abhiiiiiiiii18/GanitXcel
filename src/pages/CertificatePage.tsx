import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { useAuthStore } from '../store';
import { formatDate } from '../utils/helpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const CertificatePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const certificateRef = useRef<HTMLDivElement>(null);

  // Mock certificate data
  const certificate = {
    id: `CERT-${Date.now()}`,
    studentName: user?.name || 'Student Name',
    courseName: 'Algebraic Expressions - Grade 8',
    teacherName: 'Dr. Rajesh Kumar',
    completionDate: new Date(),
    issueDate: new Date(),
    grade: 'A+',
    score: 95,
    duration: '6 weeks',
    totalHours: 24,
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      toast.loading('Generating certificate...');

      // Capture the certificate as canvas
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`GanitXcel_Certificate_${certificate.id}.pdf`);

      toast.dismiss();
      toast.success('Certificate downloaded successfully! 🎉');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download certificate. Please try again.');
      console.error('Certificate download error:', error);
    }
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;

    try {
      toast.loading('Generating image...');

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `GanitXcel_Certificate_${certificate.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.dismiss();
        toast.success('Certificate image downloaded! 🎉');
      });
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download image. Please try again.');
      console.error('Image download error:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GanitXcel Certificate',
          text: `I just completed "${certificate.courseName}" on GanitXcel with a score of ${certificate.score}%! 🎉`,
          url: window.location.href,
        });
        toast.success('Certificate shared successfully!');
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">🎓 Certificate of Completion</h1>
          <p className="text-gray-600">
            Congratulations on completing the course! Download and share your achievement.
          </p>
        </motion.div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            ref={certificateRef}
            className="bg-white rounded-2xl shadow-2xl p-16 relative overflow-hidden"
            style={{
              aspectRatio: '1.414',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-primary rounded-xl pointer-events-none">
              <div className="absolute inset-2 border-2 border-primary-300 rounded-lg"></div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-8 left-8 text-6xl opacity-20">🎓</div>
            <div className="absolute top-8 right-8 text-6xl opacity-20">⭐</div>
            <div className="absolute bottom-8 left-8 text-6xl opacity-20">📚</div>
            <div className="absolute bottom-8 right-8 text-6xl opacity-20">🏆</div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Logo/Header */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-primary mb-2">
                  GanitXcel
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  Mathematics Learning Platform
                </div>
              </div>

              {/* Certificate Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Certificate of Completion
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
              </div>

              {/* Recipient */}
              <div className="mb-8">
                <p className="text-gray-600 text-lg mb-3">This is to certify that</p>
                <h3 className="text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'cursive' }}>
                  {certificate.studentName}
                </h3>
                <p className="text-gray-600 text-lg">has successfully completed</p>
              </div>

              {/* Course Name */}
              <div className="mb-8">
                <h4 className="text-3xl font-bold text-primary mb-4">
                  {certificate.courseName}
                </h4>
                <div className="flex items-center justify-center gap-8 text-gray-700">
                  <div>
                    <span className="font-semibold">Grade:</span> {certificate.grade}
                  </div>
                  <div>
                    <span className="font-semibold">Score:</span> {certificate.score}%
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {certificate.duration}
                  </div>
                </div>
              </div>

              {/* Date and Signatures */}
              <div className="flex justify-between items-end mt-12">
                <div className="text-left">
                  <div className="text-sm text-gray-600 mb-1">Completion Date</div>
                  <div className="font-bold text-gray-800">
                    {formatDate(certificate.completionDate)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                  <div className="text-sm font-semibold text-gray-800">
                    {certificate.teacherName}
                  </div>
                  <div className="text-xs text-gray-600">Course Instructor</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Certificate ID</div>
                  <div className="font-mono text-xs text-gray-800">
                    {certificate.id}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500">
                  Verify this certificate at ganitxcel.com/verify/{certificate.id}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            icon="📄"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon="🖼️"
            onClick={handleDownloadImage}
          >
            Download Image
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon="🔗"
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/student/dashboard')}
          >
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">🏆 Your Achievement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-primary">{certificate.score}%</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-secondary">{certificate.totalHours}h</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-accent-orange">{certificate.grade}</div>
              <div className="text-sm text-gray-600">Grade Achieved</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-accent-purple">{certificate.duration}</div>
              <div className="text-sm text-gray-600">Course Duration</div>
            </div>
          </div>

          {/* Social Share Prompt */}
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
            <p className="text-lg font-semibold mb-3">Share your achievement! 🎉</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const text = `I just completed "${certificate.courseName}" on GanitXcel with ${certificate.score}%! 🎓`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                  window.open(url, '_blank');
                }}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => {
                  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                LinkedIn
              </button>
              <button
                onClick={() => {
                  const text = `I just completed "${certificate.courseName}" on GanitXcel with ${certificate.score}%! 🎓`;
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
                  window.open(url, '_blank');
                }}
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Facebook
              </button>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6">🚀 What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer">
              <div className="text-4xl mb-3">📖</div>
              <h4 className="font-bold text-lg mb-2">Explore More Courses</h4>
              <p className="text-sm text-gray-600">
                Continue your learning journey with advanced courses
              </p>
            </div>
            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer">
              <div className="text-4xl mb-3">🏅</div>
              <h4 className="font-bold text-lg mb-2">Earn More Badges</h4>
              <p className="text-sm text-gray-600">
                Complete challenges and earn exclusive badges
              </p>
            </div>
            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors cursor-pointer">
              <div className="text-4xl mb-3">👥</div>
              <h4 className="font-bold text-lg mb-2">Join Community</h4>
              <p className="text-sm text-gray-600">
                Connect with other learners and share knowledge
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificatePage;
