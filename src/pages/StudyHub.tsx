import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, FileText, Download, Search, BrainCircuit, Video, Play, Plus, Edit2, Trash2, UserCheck, X, Upload, Trophy, ExternalLink, ClipboardCheck, HelpCircle } from 'lucide-react';
import { DOCUMENTS, VIDEO_LECTURES, TIMETABLE, CLASS_MEMBERS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function StudyHub() {
  const { userRole, user, isAdminOrTeacher } = useAuth();
  const [activeSubject, setActiveSubject] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [headerTitle, setHeaderTitle] = useState('🎯 Trung Tâm Ôn Luyện Chiến Binh 6C');
  const [headerDesc, setHeaderDesc] = useState('Học hết mình, thi nhiệt tình - Chinh phục mọi đỉnh cao kiến thức!');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  
  // Local state for persistence simulation
  const [docs, setDocs] = useState(DOCUMENTS);
  const [videos, setVideos] = useState(VIDEO_LECTURES);
  const [timetable, setTimetable] = useState(TIMETABLE);
  const [quizzes, setQuizzes] = useState([
    {
      id: 'q1',
      title: 'Bài 1: Thử thách Toán học số 1',
      subject: 'Toán',
      description: 'Ôn tập về Tập hợp, Số tự nhiên và các phép tính lũy thừa.',
      time: '15 phút',
      note: 'Đọc kỹ đề bài, đừng để bị lừa ở các ký hiệu N và N* nhé!',
      type: 'direct',
      level: 'Trung bình'
    },
    {
      id: 'q2',
      title: 'Bài 2: English Challenge - Unit 7-9',
      subject: 'Tiếng Anh',
      description: 'Kiểm tra từ vựng về chủ đề School (Trường học) và Sports (Thể thao).',
      time: '20 phút',
      note: 'Cẩn thận với cách chia động từ ở thì Hiện tại đơn!',
      type: 'link',
      url: 'https://google.com',
      level: 'Dễ'
    },
    {
      id: 'q3',
      title: 'Bài 3: Kỹ năng số & An toàn mạng',
      subject: 'Kỹ năng sống',
      description: 'Cách đặt mật khẩu an toàn và nhận diện link lừa đảo trên Facebook/TikTok.',
      time: '10 phút',
      note: 'Kiến thức quan trọng để bảo vệ kênh YouTube của bạn đấy!',
      type: 'direct',
      level: 'Khó'
    }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { id: '1', name: 'Nguyễn Văn An', score: 10, note: 'Rất xuất sắc!' },
    { id: '2', name: 'Trần Thị Bình', score: 9, note: 'Có tiến bộ vượt bậc.' }
  ]);

  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState({ 
    title: '', 
    description: '', 
    subject: 'Toán', 
    level: 'Dễ', 
    time: '', 
    note: '', 
    type: 'link' as 'link' | 'direct',
    url: '',
    questions: [] as any[]
  });

  const [isEditingLeaderboard, setIsEditingLeaderboard] = useState(false);
  const [newScore, setNewScore] = useState({ studentId: '', score: '', note: '' });

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  
  const [docForm, setDocForm] = useState({ title: '', subject: 'Toán', type: 'Bài tập', url: '' });
  const [videoForm, setVideoForm] = useState({ topic: '', content: '', thumbnail: '', videoUrl: '', subject: 'Toán 6' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setDocForm({ ...docForm, url: objectUrl, title: docForm.title || file.name });
    }
  };

  const handleAddDoc = (e: FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: Date.now().toString(),
      ...docForm,
      date: new Date().toISOString().split('T')[0]
    };
    setDocs([newDoc as any, ...docs]);
    setIsAddingDoc(false);
    setDocForm({ title: '', subject: 'Toán', type: 'Bài tập', url: '' });
  };

  const handleAddVideo = (e: FormEvent) => {
    e.preventDefault();
    const newVideo = {
      id: Date.now().toString(),
      ...videoForm
    };
    setVideos([newVideo as any, ...videos]);
    setIsAddingVideo(false);
    setVideoForm({ topic: '', content: '', thumbnail: '', videoUrl: '', subject: 'Toán 6' });
  };

  const handleUpdateDoc = (e: FormEvent) => {
    e.preventDefault();
    if (!editingDocId) return;
    setDocs(docs.map(d => d.id === editingDocId ? { ...d, ...docForm } as any : d));
    setEditingDocId(null);
  };

  const handleUpdateVideo = (e: FormEvent) => {
    e.preventDefault();
    if (!editingVideoId) return;
    setVideos(videos.map(v => v.id === editingVideoId ? { ...v, ...videoForm } as any : v));
    setEditingVideoId(null);
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const subjects = ['Tất cả', 'Toán', 'Ngữ Văn', 'Tiếng Anh', 'Vật Lý', 'Lịch Sử', 'Tin học', 'Kỹ năng sống', 'Chung'];

  const filteredDocs = docs.filter(doc => {
    const matchesSubject = activeSubject === 'Tất cả' || doc.subject === activeSubject;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(query) || 
      doc.subject.toLowerCase().includes(query) || 
      doc.type.toLowerCase().includes(query);
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center max-w-3xl mx-auto space-y-4 relative group">
        {isEditingHeader && isAdminOrTeacher ? (
          <div className="space-y-4">
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="text-4xl font-bold text-center w-full bg-white border-2 border-blue-500 rounded-2xl p-2 focus:outline-none"
            />
            <textarea
              value={headerDesc}
              onChange={(e) => setHeaderDesc(e.target.value)}
              className="text-lg text-center w-full bg-white border-2 border-blue-500 rounded-2xl p-2 focus:outline-none resize-none"
            />
            <button
              onClick={() => setIsEditingHeader(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">{headerTitle}</h1>
            <p className="text-xl text-blue-600 font-medium italic">{headerDesc}</p>
            {userRole === 'teacher' && (
              <button
                onClick={() => setIsEditingHeader(true)}
                className="absolute -top-2 -right-2 p-2 bg-white shadow-md rounded-full text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                title="Chỉnh sửa tiêu đề"
              >
                <Edit2 size={16} />
              </button>
            )}
          </>
        )}
        {userRole && (
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mt-4">
            <div className={`p-1.5 rounded-lg ${userRole === 'teacher' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
              {userRole === 'teacher' ? <UserCheck size={16} /> : <BookOpen size={16} />}
            </div>
            <span className="text-sm font-bold text-gray-600">
              Chào {user?.fullName || (userRole === 'teacher' ? 'Giáo Viên' : 'Học Sinh')}
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Thời khóa biểu & Bảng Vàng */}
        <aside className="space-y-6">
          {/* Bảng Vàng Section */}
          <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Bảng Vàng
              </h2>
              {isAdminOrTeacher && (
                <button 
                  onClick={() => setIsEditingLeaderboard(!isEditingLeaderboard)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="text-center mb-4">
                <p className="text-sm font-bold text-gray-900">Vinh danh những chiến binh có điểm số cao nhất tuần!</p>
                <p className="text-[10px] text-gray-500 italic mt-1">"Phần thưởng sẽ là một tràng pháo tay của cả lớp hoặc một món quà nhỏ từ cô Sen!"</p>
              </div>

              {isEditingLeaderboard && isAdminOrTeacher && (
                <div className="p-4 bg-blue-50 rounded-2xl space-y-3 mb-4">
                  <select 
                    value={newScore.studentId}
                    onChange={(e) => setNewScore({ ...newScore, studentId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-blue-100 text-sm"
                  >
                    <option value="">Chọn học sinh...</option>
                    {CLASS_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Điểm số"
                    value={newScore.score}
                    onChange={(e) => setNewScore({ ...newScore, score: e.target.value })}
                    className="w-full p-2 rounded-xl border border-blue-100 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Lời khen/Ghi chú"
                    value={newScore.note}
                    onChange={(e) => setNewScore({ ...newScore, note: e.target.value })}
                    className="w-full p-2 rounded-xl border border-blue-100 text-sm"
                  />
                  <button 
                    onClick={() => {
                      const student = CLASS_MEMBERS.find(m => m.id === newScore.studentId);
                      if (student && newScore.score) {
                        setLeaderboard([...leaderboard, { id: Date.now().toString(), name: student.name, score: parseInt(newScore.score), note: newScore.note }]);
                        setNewScore({ studentId: '', score: '', note: '' });
                      }
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-xs"
                  >
                    Cập nhật
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-yellow-200 transition-all">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                      idx === 1 ? 'bg-gray-100 text-gray-600' :
                      idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 truncate text-sm">{entry.name}</div>
                      <div className="text-[10px] text-gray-500 italic truncate">{entry.note}</div>
                    </div>
                    <div className="text-lg font-black text-blue-600">{entry.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-blue-600" /> Thời Khóa Biểu
              </h2>
              {userRole === 'teacher' && (
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {timetable.map((entry) => (
                <div key={entry.day} className="group">
                  <div className="p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                    <div className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                      {entry.day}
                      <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Chi tiết</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.lessons.slice(0, 3).map((lesson, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-600 font-medium">
                          {lesson}
                        </span>
                      ))}
                      {entry.lessons.length > 3 && (
                        <span className="text-[10px] text-gray-400 font-bold">+{entry.lessons.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
            <BrainCircuit size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Sơ Đồ Tư Duy</h3>
              <p className="text-sm opacity-80 mb-6">Tóm tắt bài học ngắn gọn, dễ nhớ cho các tác phẩm Truyền thuyết.</p>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-xl font-bold transition-colors">
                Xem ngay
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-12">
          {/* Trung Tâm Ôn Luyện Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <ClipboardCheck className="text-blue-600" /> Bài Kiểm Tra & Ôn Luyện
              </h2>
              {isAdminOrTeacher && (
                <button 
                  onClick={() => {
                    setIsAddingQuiz(true);
                    setQuizForm({ title: '', description: '', subject: 'Toán', level: 'Dễ', time: '', note: '', type: 'link', url: '', questions: [] });
                  }}
                  className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Plus size={18} /> Thêm bài thi
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <motion.div 
                  key={quiz.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-100 transition-colors" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          quiz.level === 'Dễ' ? 'bg-green-50 text-green-600' :
                          quiz.level === 'Trung bình' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {quiz.level}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{quiz.subject}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                        <Calendar size={14} /> {quiz.time}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {quiz.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                      <p className="text-xs text-blue-700 italic flex items-start gap-2">
                        <HelpCircle size={14} className="flex-shrink-0 mt-0.5" />
                        "{quiz.note}"
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      {quiz.type === 'link' ? (
                        <a 
                          href={quiz.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
                        >
                          <ExternalLink size={16} /> BẮT ĐẦU QUA LINK
                        </a>
                      ) : (
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                          <Play size={16} fill="currentColor" /> LÀM BÀI TRỰC TIẾP
                        </button>
                      )}
                      
                      {isAdminOrTeacher && (
                        <button 
                          onClick={() => setQuizzes(quizzes.filter(q => q.id !== quiz.id))}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Kho Bài Giảng Video */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Video className="text-red-600" /> Kho Bài Giảng Video
              </h2>
              {userRole === 'teacher' && (
                <button 
                  onClick={() => {
                    setIsAddingVideo(true);
                    setVideoForm({ topic: '', content: '', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop', videoUrl: '', subject: 'Toán 6' });
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
                >
                  <Plus size={18} /> Thêm bài giảng
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <motion.div 
                  key={video.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={video.thumbnail} alt={video.topic} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/lms/${video.id}`} className="bg-white p-4 rounded-full text-red-600 shadow-xl">
                        <Play size={24} fill="currentColor" />
                      </Link>
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-900">
                      {video.subject}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {video.topic}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{video.content}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <Link to={`/lms/${video.id}`} className="text-sm font-bold text-red-600 hover:underline">
                        Bấm vào đây để vào học ngay
                      </Link>
                      {userRole === 'teacher' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingVideoId(video.id);
                              setVideoForm({ 
                                topic: video.topic, 
                                content: video.content, 
                                thumbnail: video.thumbnail,
                                videoUrl: video.videoUrl,
                                subject: video.subject
                              });
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tài liệu và Bài tập */}
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="text-orange-600" /> Tài Liệu & Bài Tập
              </h2>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm theo tên, môn học hoặc loại..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                  />
                </div>
                {userRole === 'teacher' && (
                  <button 
                    onClick={() => {
                      setIsAddingDoc(true);
                      setDocForm({ title: '', subject: 'Toán', type: 'Bài tập', url: '' });
                    }}
                    className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {subjects.map((s) => (
                <button 
                  key={s} 
                  onClick={() => setActiveSubject(s)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeSubject === s 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredDocs.map((doc) => (
                  <motion.div 
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex gap-6 items-start group hover:shadow-md transition-all"
                  >
                    <div className={`p-4 rounded-2xl transition-colors ${
                      doc.type === 'Bài tập' ? 'bg-orange-50 text-orange-600' :
                      doc.type === 'Đề cương' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <FileText size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.subject}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{doc.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                      <div className="flex items-center justify-between">
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                          <Download size={16} /> Xem / Tải xuống
                        </a>
                        {isAdminOrTeacher && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingDocId(doc.id);
                                setDocForm({ title: doc.title, subject: doc.subject, type: doc.type, url: doc.url });
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
          {/* Modals */}
          <AnimatePresence>
            {(editingDocId || isAddingDoc) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{isAddingDoc ? 'Thêm tài liệu' : 'Sửa tài liệu'}</h3>
                    <button onClick={() => { setEditingDocId(null); setIsAddingDoc(false); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={isAddingDoc ? handleAddDoc : handleUpdateDoc} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Tiêu đề</label>
                      <input type="text" required value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Môn học</label>
                        <select value={docForm.subject} onChange={(e) => setDocForm({ ...docForm, subject: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          {subjects.filter(s => s !== 'Tất cả').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Loại</label>
                        <select value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value as any })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <option value="Bài tập">Bài tập</option>
                          <option value="Đề cương">Đề cương</option>
                          <option value="Bài giảng">Bài giảng</option>
                          <option value="Tài liệu">Tài liệu</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Link tài liệu (URL) hoặc Tải lên file</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          value={docForm.url} 
                          onChange={(e) => setDocForm({ ...docForm, url: e.target.value })} 
                          className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100" 
                          placeholder="https://..." 
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
                          title="Tải lên file"
                        >
                          <Upload size={20} />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          className="hidden" 
                        />
                      </div>
                      {docForm.url.startsWith('blob:') && (
                        <p className="text-[10px] text-green-600 font-bold italic">✓ Đã chọn file từ máy tính</p>
                      )}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                      {isAddingDoc ? 'Thêm ngay' : 'Lưu thay đổi'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {(editingVideoId || isAddingVideo) && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{isAddingVideo ? 'Thêm bài giảng' : 'Sửa bài giảng'}</h3>
                    <button onClick={() => { setEditingVideoId(null); setIsAddingVideo(false); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={isAddingVideo ? handleAddVideo : handleUpdateVideo} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Chủ đề</label>
                      <input type="text" required value={videoForm.topic} onChange={(e) => setVideoForm({ ...videoForm, topic: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Môn học</label>
                      <input type="text" required value={videoForm.subject} onChange={(e) => setVideoForm({ ...videoForm, subject: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Nội dung</label>
                      <textarea value={videoForm.content} onChange={(e) => setVideoForm({ ...videoForm, content: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 resize-none" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Link Video (YouTube/URL)</label>
                      <input type="url" required value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Link ảnh bìa (Thumbnail)</label>
                      <input type="text" value={videoForm.thumbnail} onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                      {isAddingVideo ? 'Thêm ngay' : 'Lưu thay đổi'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {isAddingQuiz && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] p-8 w-full max-w-2xl shadow-2xl space-y-6 my-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Thêm Bài Kiểm Tra Mới</h3>
                    <button onClick={() => setIsAddingQuiz(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setQuizzes([{ id: Date.now().toString(), ...quizForm } as any, ...quizzes]);
                    setIsAddingQuiz(false);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Tên bài kiểm tra</label>
                        <input type="text" required placeholder="VD: Kiểm tra giữa kỳ II môn Ngữ Văn" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Chủ đề</label>
                        <select value={quizForm.subject} onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          {['Toán', 'Ngữ Văn', 'Tiếng Anh', 'Tin học', 'Kỹ năng sống'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Mô tả ngắn</label>
                      <textarea placeholder="VD: Ôn tập các văn bản về lòng yêu nước..." value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 resize-none" rows={2} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Cấp độ</label>
                        <select value={quizForm.level} onChange={(e) => setQuizForm({ ...quizForm, level: e.target.value as any })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <option value="Dễ">Dễ</option>
                          <option value="Trung bình">Trung bình</option>
                          <option value="Khó">Khó</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Thời gian</label>
                        <input type="text" placeholder="VD: 15 phút" value={quizForm.time} onChange={(e) => setQuizForm({ ...quizForm, time: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Hình thức</label>
                        <select value={quizForm.type} onChange={(e) => setQuizForm({ ...quizForm, type: e.target.value as any })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <option value="link">Dùng Link ngoài (Azota/Google Forms)</option>
                          <option value="direct">Làm trực tiếp trên web</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Lời nhắn nhủ / Ghi chú</label>
                      <input type="text" placeholder="VD: Các chiến binh 6C hãy bình tĩnh, tự tin..." value={quizForm.note} onChange={(e) => setQuizForm({ ...quizForm, note: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>

                    {quizForm.type === 'link' ? (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Dán Link đề thi</label>
                        <input type="url" required placeholder="https://..." value={quizForm.url} onChange={(e) => setQuizForm({ ...quizForm, url: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                      </div>
                    ) : (
                      <div className="p-6 bg-blue-50 rounded-[32px] space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-blue-900">Bộ câu hỏi trắc nghiệm</h4>
                          <button type="button" onClick={() => setQuizForm({ ...quizForm, questions: [...quizForm.questions, { q: '', a: '', b: '', c: '', d: '', correct: 'A', explanation: '' }] })} className="text-sm font-bold text-blue-600 hover:underline">+ Thêm câu hỏi</button>
                        </div>
                        {quizForm.questions.map((q, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl space-y-3 shadow-sm">
                            <input type="text" placeholder={`Câu hỏi ${idx + 1}: Ai là tác giả của bài thơ...?`} value={q.q} onChange={(e) => {
                              const newQs = [...quizForm.questions];
                              newQs[idx].q = e.target.value;
                              setQuizForm({ ...quizForm, questions: newQs });
                            }} className="w-full p-2 border-b border-gray-100 focus:outline-none font-bold" />
                            <div className="grid grid-cols-2 gap-2">
                              {['A', 'B', 'C', 'D'].map(opt => (
                                <input key={opt} type="text" placeholder={`Đáp án ${opt}`} value={q[opt.toLowerCase()]} onChange={(e) => {
                                  const newQs = [...quizForm.questions];
                                  newQs[idx][opt.toLowerCase()] = e.target.value;
                                  setQuizForm({ ...quizForm, questions: newQs });
                                }} className="p-2 bg-gray-50 rounded-xl text-xs" />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400">Đáp án đúng:</span>
                              <select value={q.correct} onChange={(e) => {
                                const newQs = [...quizForm.questions];
                                newQs[idx].correct = e.target.value;
                                setQuizForm({ ...quizForm, questions: newQs });
                              }} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                              </select>
                            </div>
                            <input type="text" placeholder="Giải thích (VD: Chúc mừng em! Tác giả...)" value={q.explanation} onChange={(e) => {
                              const newQs = [...quizForm.questions];
                              newQs[idx].explanation = e.target.value;
                              setQuizForm({ ...quizForm, questions: newQs });
                            }} className="w-full p-2 bg-green-50 rounded-xl text-xs italic" />
                          </div>
                        ))}
                      </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                      LƯU BÀI THI & ĐĂNG TẢI
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
