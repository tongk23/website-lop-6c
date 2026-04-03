import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, CheckCircle, MessageCircle, Send, ChevronLeft, 
  BarChart2, Users, Bell, Clock, BookOpen, AlertCircle,
  MoreVertical, Reply, Trash2, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CLASS_MEMBERS, VIDEO_LECTURES } from '../data/mockData';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, orderBy, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';

interface LessonProgress {
  percent: number;
  lastPosition: number;
  completed: boolean;
  completedAt?: any;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: any;
  replies?: Comment[];
}

export default function LMS() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, userRole, isAdminOrTeacher } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState<LessonProgress>({ percent: 0, lastPosition: 0, completed: false });
  const [showContent, setShowContent] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isTeacherView, setIsTeacherView] = useState(false);
  const [studentProgressList, setStudentProgressList] = useState<any[]>([]);

  // Find lesson data
  useEffect(() => {
    const foundLesson = VIDEO_LECTURES.find(v => v.id === lessonId);
    if (foundLesson) {
      setLesson(foundLesson);
    } else {
      // Fallback or error
      navigate('/study');
    }
  }, [lessonId, navigate]);

  // Load user progress
  useEffect(() => {
    if (!user || !lessonId) return;

    const progressRef = doc(db, `users/${user.uid}/lessons`, lessonId);
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as LessonProgress;
        setProgress(data);
        if (data.completed) setShowContent(true);
      }
    });

    return () => unsubscribe();
  }, [user, lessonId]);

  // Load comments
  useEffect(() => {
    if (!lessonId) return;

    const commentsRef = collection(db, `lessons/${lessonId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [lessonId]);

  // Load all students progress for teacher
  useEffect(() => {
    if (!isAdminOrTeacher || !lessonId) return;

    const fetchAllProgress = async () => {
      const list = [];
      for (const member of CLASS_MEMBERS) {
        // In a real app, we'd query a collection of all progress for this lesson
        // For this demo, we'll try to fetch each or mock it if not found
        const pRef = doc(db, `users/mock-${member.id}/lessons`, lessonId);
        const pDoc = await getDoc(pRef);
        
        list.push({
          id: member.id,
          name: member.name,
          stt: member.stt,
          progress: pDoc.exists() ? pDoc.data() : { percent: 0, lastPosition: 0, completed: false }
        });
      }
      setStudentProgressList(list);
    };

    fetchAllProgress();
  }, [isAdminOrTeacher, lessonId]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !user || !lessonId) return;
    
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    const percent = Math.floor((currentTime / duration) * 100);
    
    // Only update if percent increased or significantly changed
    if (percent > progress.percent) {
      const progressRef = doc(db, `users/${user.uid}/lessons`, lessonId);
      setDoc(progressRef, {
        percent,
        lastPosition: currentTime,
        completed: progress.completed || percent >= 95
      }, { merge: true });
    }

    if (percent >= 90) {
      setShowContent(true);
    }
  };

  const handleSeek = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (!videoRef.current) return;
    
    // Prevent fast-forwarding beyond current progress
    const duration = videoRef.current.duration;
    const maxAllowedTime = (progress.percent / 100) * duration;
    
    if (videoRef.current.currentTime > maxAllowedTime + 5) { // Allow 5s buffer
      videoRef.current.currentTime = maxAllowedTime;
      // alert('Vui lòng không tua nhanh bài giảng!'); // Using toast or UI instead of alert
    }
  };

  const handleComplete = async () => {
    if (!user || !lessonId) return;
    const progressRef = doc(db, `users/${user.uid}/lessons`, lessonId);
    await updateDoc(progressRef, {
      completed: true,
      completedAt: serverTimestamp()
    });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !lessonId) return;

    const commentsRef = collection(db, `lessons/${lessonId}/comments`);
    await addDoc(commentsRef, {
      userId: user.uid,
      userName: user.fullName,
      userAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`,
      text: newComment,
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  if (!lesson) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/study')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại Study Hub
        </button>
        
        {isAdminOrTeacher && (
          <button 
            onClick={() => setIsTeacherView(!isTeacherView)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
              isTeacherView ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-600 border border-purple-100 shadow-sm'
            }`}
          >
            {isTeacherView ? <BookOpen size={18} /> : <BarChart2 size={18} />}
            {isTeacherView ? 'Xem bài giảng' : 'Bảng quản lý tiến độ'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isTeacherView ? (
          <motion.div 
            key="teacher"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Quản Lý Tiến Độ Lớp 6C</h2>
                  <p className="text-gray-500 font-medium">Bài giảng: {lesson.topic}</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 px-6 py-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-blue-600">
                      {studentProgressList.filter(s => s.progress.completed).length}/{studentProgressList.length}
                    </div>
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Hoàn thành</div>
                  </div>
                  <div className="bg-purple-50 px-6 py-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-purple-600">
                      {Math.round(studentProgressList.reduce((acc, s) => acc + (s.progress.percent || 0), 0) / studentProgressList.length)}%
                    </div>
                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Trung bình</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-widest">STT</th>
                      <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-widest">Họ và tên</th>
                      <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-widest">Tiến độ Video</th>
                      <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-widest">Trạng thái</th>
                      <th className="pb-4 font-bold text-gray-400 text-sm uppercase tracking-widest">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {studentProgressList.map((student) => (
                      <tr key={student.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold text-gray-400">{student.stt}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-8 h-8 rounded-full bg-gray-100" alt="" />
                            <span className="font-bold text-gray-900">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3 w-48">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-500" 
                                style={{ width: `${student.progress.percent}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-blue-600">{student.progress.percent}%</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-1">
                            Dừng tại: {Math.floor(student.progress.lastPosition / 60)}:{(student.progress.lastPosition % 60).toFixed(0).padStart(2, '0')}
                          </div>
                        </td>
                        <td className="py-4">
                          {student.progress.completed ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle size={10} /> Đã xong
                            </span>
                          ) : student.progress.percent > 0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                              <Clock size={10} /> Đang học
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                              <AlertCircle size={10} /> Chưa xem
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <button 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Gửi nhắc nhở"
                          >
                            <Bell size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="student"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Video & Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
                <div className="relative aspect-video bg-black group">
                  {lesson.videoUrl.includes('youtube.com') ? (
                    <iframe 
                      src={`${lesson.videoUrl.replace('watch?v=', 'embed/')}?enablejsapi=1&rel=0`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      ref={videoRef}
                      src={lesson.videoUrl}
                      className="w-full h-full"
                      onTimeUpdate={handleTimeUpdate}
                      onSeeking={handleSeek}
                      controls
                      controlsList="nodownload"
                    />
                  )}
                  
                  {/* Custom Progress Overlay for Student */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300" 
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">{lesson.topic}</h1>
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl">
                      <div className="text-xs font-black text-blue-600">{progress.percent}%</div>
                      <div className="w-24 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${progress.percent}%` }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{lesson.content}</p>
                </div>
              </div>

              {/* Summary Content - Visible after video progress */}
              <AnimatePresence>
                {showContent && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-6"
                  >
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                      <Shield size={24} />
                      <h2 className="text-2xl font-bold">Tóm tắt & Hướng dẫn</h2>
                    </div>
                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                      <p>Chúc mừng bạn đã xem xong bài giảng! Dưới đây là những điểm chính cần ghi nhớ:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Nắm vững các khái niệm cơ bản đã nêu trong video.</li>
                        <li>Ghi chép lại các công thức và ví dụ minh họa.</li>
                        <li>Chuẩn bị các câu hỏi thảo luận cho tiết học tới.</li>
                      </ul>
                      <p className="mt-4 font-medium">Hãy nhấn nút hoàn thành bên dưới để ghi nhận kết quả học tập nhé!</p>
                    </div>
                    
                    <button 
                      onClick={handleComplete}
                      disabled={progress.completed}
                      className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                        progress.completed 
                        ? 'bg-green-100 text-green-600 cursor-default' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                      }`}
                    >
                      {progress.completed ? (
                        <><CheckCircle size={24} /> ĐÃ HOÀN THÀNH</>
                      ) : (
                        'TÔI ĐÃ HOÀN THÀNH BÀI HỌC'
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Discussion */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full flex flex-col min-h-[600px]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Góc Thảo Luận</h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 scrollbar-hide">
                  {comments.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <MessageCircle size={32} />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">Chưa có thảo luận nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="space-y-3">
                        <div className="flex gap-3">
                          <img src={comment.userAvatar} className="w-10 h-10 rounded-2xl bg-gray-100 flex-shrink-0" alt="" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-gray-900">{comment.userName}</span>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {comment.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-600 leading-relaxed">
                              {comment.text}
                            </div>
                            <div className="flex items-center gap-4 px-2">
                              <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                <Reply size={12} /> Trả lời
                              </button>
                              {isAdminOrTeacher && (
                                <button 
                                  onClick={() => deleteDoc(doc(db, `lessons/${lessonId}/comments`, comment.id))}
                                  className="text-[10px] font-bold text-red-400 hover:underline flex items-center gap-1"
                                >
                                  <Trash2 size={12} /> Xóa
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePostComment} className="relative">
                  <input 
                    type="text" 
                    placeholder="Đặt câu hỏi cho cô Sen..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full pl-6 pr-14 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 focus:outline-none transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
