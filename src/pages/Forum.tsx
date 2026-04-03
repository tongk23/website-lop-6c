import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Heart, ShieldAlert, User, Trash2, Paperclip, Image as ImageIcon, X, FileText, Bell, Flag, AlertTriangle, CheckCircle, Edit2, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc, 
  increment,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Attachment {
  type: 'image' | 'file' | 'video';
  url: string;
  name: string;
}

interface Comment {
  id: string;
  author: string;
  authorUid: string;
  role: 'student' | 'teacher';
  content: string;
  timestamp: any; // Firestore Timestamp
  likes: number;
  attachments?: Attachment[];
  isMemory?: boolean;
  isReported?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
}

export default function Forum() {
  const { userRole, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isMemory, setIsMemory] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [showSecretSuccess, setShowSecretSuccess] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showModeration, setShowModeration] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [forumTitle, setForumTitle] = useState('Diễn Đàn Lớp 6C');
  const [forumDesc, setForumDesc] = useState('Nơi trao đổi, thảo luận và chia sẻ những điều thầm kín.');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [rules, setRules] = useState([
    'Tôn trọng lẫn nhau, không dùng từ ngữ thô tục.',
    'Không đăng tin giả hoặc nội dung gây chia rẽ.',
    'Hòm thư bí mật là nơi góp ý chân thành.'
  ]);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [editRuleText, setEditRuleText] = useState('');
  const [secretTitle, setSecretTitle] = useState('Hòm thư bí mật');
  const [secretDesc, setSecretDesc] = useState('Gửi những tâm tư, nguyện vọng hoặc góp ý ẩn danh đến Ban cán sự lớp.');
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const [memoriesTitle, setMemoriesTitle] = useState('Khoảnh khắc kỷ niệm');
  const [isEditingMemoriesTitle, setIsEditingMemoriesTitle] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('Thảo luận chung');
  const [isEditingDiscussionTitle, setIsEditingDiscussionTitle] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(postsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'posts');
    });

    return () => unsubscribe();
  }, []);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAttachment: Attachment = {
        type,
        url: event.target?.result as string,
        name: file.name
      };
      setAttachments([...attachments, newAttachment]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && attachments.length === 0) return;

    const postData = {
      author: user?.fullName || (userRole === 'teacher' ? 'Giáo Viên' : 'Học Sinh'),
      authorUid: auth.currentUser?.uid || '',
      role: userRole || 'student',
      content: newComment,
      timestamp: serverTimestamp(),
      likes: 0,
      attachments: attachments.length > 0 ? attachments : [],
      isMemory: isMemory,
      isReported: false
    };

    try {
      await addDoc(collection(db, 'posts'), postData);
      setNewComment('');
      setAttachments([]);
      setIsMemory(false);
      addNotification('Đã đăng bài thành công.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      addNotification('Đã xóa bình luận thành công.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${id}`);
    }
  };

  const handleReport = async (id: string) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        isReported: true
      });
      addNotification('Bình luận đã được báo cáo cho giáo viên.', 'warning');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${id}`);
    }
  };

  const handleShare = async (comment: Comment) => {
    const shareData = {
      title: 'Kỷ niệm từ Diễn Đàn Lớp 6C',
      text: `${comment.author} đã chia sẻ: "${comment.content}"`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        addNotification('Đã mở cửa sổ chia sẻ.', 'success');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        addNotification('Đã sao chép liên kết vào bộ nhớ tạm.', 'success');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        addNotification('Không thể chia sẻ nội dung.', 'warning');
      }
    }
  };

  const handleUpdateComment = async (id: string) => {
    if (!editContent.trim()) return;
    try {
      await updateDoc(doc(db, 'posts', id), {
        content: editContent
      });
      setEditingId(null);
      addNotification('Đã cập nhật bình luận.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${id}`);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateRule = (index: number) => {
    if (!editRuleText.trim()) return;
    const newRules = [...rules];
    newRules[index] = editRuleText;
    setRules(newRules);
    setEditingRuleIndex(null);
    addNotification('Đã cập nhật nội quy.', 'success');
  };

  const handleSendSecret = (e: FormEvent) => {
    e.preventDefault();
    if (!secretMessage.trim()) return;
    
    setSecretMessage('');
    setShowSecretSuccess(true);
    setTimeout(() => setShowSecretSuccess(false), 3000);
    addNotification('Tin nhắn bí mật đã được gửi đi.', 'success');
  };

  const memories = comments.filter(c => c.isMemory);
  const filteredComments = showModeration ? comments.filter(c => c.isReported) : comments;

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '...';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '...';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 relative">
      {/* Notification Toast Area */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center gap-3 min-w-[300px] backdrop-blur-md ${
                notif.type === 'success' ? 'bg-green-50/90 border-green-100 text-green-800' :
                notif.type === 'warning' ? 'bg-amber-50/90 border-amber-100 text-amber-800' :
                'bg-blue-50/90 border-blue-100 text-blue-800'
              }`}
            >
              {notif.type === 'success' ? <CheckCircle size={20} /> :
               notif.type === 'warning' ? <AlertTriangle size={20} /> :
               <Bell size={20} />}
              <p className="text-sm font-bold">{notif.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="text-center space-y-4 relative group">
        {isEditingHeader && userRole === 'teacher' ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={forumTitle}
              onChange={(e) => setForumTitle(e.target.value)}
              className="text-4xl font-bold text-center w-full bg-white border-2 border-blue-500 rounded-2xl p-2 focus:outline-none"
            />
            <textarea
              value={forumDesc}
              onChange={(e) => setForumDesc(e.target.value)}
              className="text-lg text-center w-full bg-white border-2 border-blue-500 rounded-2xl p-2 focus:outline-none resize-none"
            />
            <button
              onClick={() => {
                setIsEditingHeader(false);
                addNotification('Đã cập nhật tiêu đề diễn đàn.', 'success');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">{forumTitle}</h1>
            <p className="text-xl text-gray-500">{forumDesc}</p>
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
      </header>

      {/* Memories Section - Only visible if there are memories */}
      <AnimatePresence>
        {memories.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between group">
              {isEditingMemoriesTitle && userRole === 'teacher' ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={memoriesTitle}
                    onChange={(e) => setMemoriesTitle(e.target.value)}
                    className="text-2xl font-bold bg-white border-b-2 border-pink-500 focus:outline-none text-pink-600"
                    autoFocus
                  />
                  <button onClick={() => setIsEditingMemoriesTitle(false)} className="text-green-600"><CheckCircle size={20} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-600">
                    <ImageIcon size={24} /> {memoriesTitle}
                  </h2>
                  {userRole === 'teacher' && (
                    <button
                      onClick={() => setIsEditingMemoriesTitle(true)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-pink-600 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {memories.slice(0, 4).map(memory => (
                <motion.div 
                  key={memory.id} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex gap-5 items-center group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {memory.attachments && memory.attachments.length > 0 && (
                    <div className="relative shrink-0">
                      {memory.attachments?.[0]?.type === 'image' ? (
                        <img src={memory.attachments[0].url} className="w-24 h-24 rounded-[24px] object-cover shadow-inner" />
                      ) : memory.attachments?.[0]?.type === 'video' ? (
                        <div className="w-24 h-24 bg-pink-50 rounded-[24px] flex items-center justify-center text-pink-600 shadow-inner">
                          <div className="relative">
                            <ImageIcon size={32} className="opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Send size={16} className="rotate-90 fill-pink-600" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 shadow-inner group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                          {memory.attachments?.[0]?.type === 'file' ? <FileText size={32} /> : <Heart size={32} className="fill-current opacity-20" />}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-1.5 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
                        <Heart size={12} className="fill-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-full">Kỷ niệm</span>
                      <span className="text-[10px] text-gray-400">{formatDate(memory.timestamp)}</span>
                    </div>
                    <p className="font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors leading-tight">
                      {memory.content || 'Một khoảnh khắc đáng nhớ...'}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <User size={10} className="text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 font-medium truncate">Đăng bởi: {memory.author}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(memory);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                        title="Chia sẻ kỷ niệm"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Discussion Area */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between group">
              {isEditingDiscussionTitle && userRole === 'teacher' ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={discussionTitle}
                    onChange={(e) => setDiscussionTitle(e.target.value)}
                    className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => setIsEditingDiscussionTitle(false)} className="text-green-600"><CheckCircle size={20} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="text-blue-600" /> {discussionTitle}
                  </h2>
                  {userRole === 'teacher' && (
                    <button
                      onClick={() => setIsEditingDiscussionTitle(true)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
              {userRole === 'teacher' && (
                <button
                  onClick={() => setShowModeration(!showModeration)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    showModeration ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-600 border border-transparent'
                  }`}
                >
                  <Flag size={14} /> {showModeration ? 'Đang xem báo cáo' : 'Chế độ kiểm duyệt'}
                </button>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {/* Post Box */}
              {!userRole ? (
                <div className="bg-blue-50 p-6 rounded-2xl text-center space-y-3">
                  <p className="text-blue-900 font-bold">Bạn muốn tham gia thảo luận?</p>
                  <p className="text-blue-700 text-sm">Vui lòng đăng nhập để đăng bài, đính kèm tệp và chia sẻ kỷ niệm cùng lớp.</p>
                </div>
              ) : (
                <form onSubmit={handlePostComment} className="space-y-4">
                  <div className="space-y-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Bạn đang nghĩ gì?"
                      className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] transition-all resize-none bg-gray-50"
                    />
                    
                    {/* Attachments Preview */}
                    <AnimatePresence>
                      {attachments.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 pt-2"
                        >
                          {attachments.map((att, index) => (
                            <div key={index} className="relative group">
                              {att.type === 'image' ? (
                                <img src={att.url} alt="preview" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                              ) : (
                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex flex-col items-center justify-center p-2 text-center">
                                  <FileText size={20} className="text-gray-400" />
                                  <span className="text-[8px] text-gray-500 truncate w-full">{att.name}</span>
                                </div>
                              )}
                              <button 
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        ref={imageInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'image')}
                      />
                      <input 
                        type="file" 
                        ref={videoInputRef} 
                        className="hidden" 
                        accept="video/*" 
                        onChange={(e) => handleFileChange(e, 'video')}
                      />
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, 'file')}
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Đính kèm ảnh"
                      >
                        <ImageIcon size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Đính kèm video"
                      >
                        <Send size={20} className="rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Đính kèm tệp"
                      >
                        <Paperclip size={20} />
                      </button>

                      {userRole && (
                        <button
                          type="button"
                          onClick={() => setIsMemory(!isMemory)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                            isMemory ? 'bg-pink-50 border-pink-200 text-pink-600' : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <Heart size={14} className={isMemory ? 'fill-pink-600' : ''} />
                          Lưu làm kỷ niệm
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!newComment.trim() && attachments.length === 0}
                      className={`px-8 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                        (!newComment.trim() && attachments.length === 0)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      <Send size={20} className={(!newComment.trim() && attachments.length === 0) ? '' : 'animate-pulse'} />
                      <span>Gửi bài viết</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-6 pt-6">
                <AnimatePresence initial={false}>
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 group p-4 rounded-3xl transition-all ${
                          comment.isReported ? 'bg-red-50/50 border border-red-100' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          comment.role === 'teacher' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {comment.role === 'teacher' ? <ShieldAlert size={20} /> : <User size={20} />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{comment.author}</span>
                              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">
                                {comment.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatTime(comment.timestamp)}
                              </span>
                              {comment.isReported && (
                                <span className="flex items-center gap-1 text-[10px] bg-red-100 px-2 py-0.5 rounded text-red-600 font-bold uppercase">
                                  <AlertTriangle size={10} /> Bị báo cáo
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {editingId === comment.id ? (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleUpdateComment(comment.id)}
                                    className="text-green-600 hover:text-green-700 p-1"
                                    title="Lưu"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button 
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    title="Hủy"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {(userRole === 'teacher' || user?.fullName === comment.author) && (
                                    <button 
                                      onClick={() => startEditing(comment)}
                                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all p-1"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                  )}
                                  {userRole === 'teacher' && (
                                    <button 
                                      onClick={() => handleDelete(comment.id)}
                                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1"
                                      title="Xóa bình luận"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                  {userRole && !comment.isReported && (
                                    <button 
                                      onClick={() => handleReport(comment.id)}
                                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-amber-600 transition-all p-1"
                                      title="Báo cáo vi phạm"
                                    >
                                      <Flag size={16} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {editingId === comment.id ? (
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full p-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none text-gray-700 resize-none"
                              rows={3}
                            />
                          ) : (
                            comment.content && <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                          )}
                          
                          {/* Render Attachments */}
                          {comment.attachments && (
                            <div className="flex flex-wrap gap-3 pt-2">
                              {comment.attachments.map((att, idx) => (
                                <div key={idx} className="max-w-[240px] w-full">
                                  {att.type === 'image' ? (
                                    <img 
                                      src={att.url} 
                                      alt="attachment" 
                                      className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full h-auto"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : att.type === 'video' ? (
                                    <div className="relative group/video rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                      <video src={att.url} className="w-full aspect-video object-cover" />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover/video:bg-black/40 transition-colors">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                                          <Send size={24} className="rotate-90 fill-blue-600" />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <a 
                                      href={att.url} 
                                      download={att.name}
                                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors group/file w-full"
                                    >
                                      <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm group-hover/file:scale-110 transition-transform">
                                        <FileText size={20} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{att.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Tài liệu</p>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleLike(comment.id)}
                              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-pink-600 transition-colors"
                            >
                              <Heart size={14} className={comment.likes > 0 ? "fill-pink-600 text-pink-600" : ""} />
                              {comment.likes}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                      <p>{showModeration ? 'Không có bình luận nào bị báo cáo.' : 'Chưa có thảo luận nào.'}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Secret Mailbox */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-6 text-white shadow-xl relative group">
            {isEditingSecret && userRole === 'teacher' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={secretTitle}
                  onChange={(e) => setSecretTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white focus:outline-none font-bold"
                />
                <textarea
                  value={secretDesc}
                  onChange={(e) => setSecretDesc(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white focus:outline-none text-sm resize-none"
                  rows={2}
                />
                <button
                  onClick={() => {
                    setIsEditingSecret(false);
                    addNotification('Đã cập nhật hòm thư bí mật.', 'success');
                  }}
                  className="w-full bg-white text-indigo-600 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShieldAlert /> {secretTitle}
                </h3>
                <p className="text-indigo-100 text-sm mb-6">{secretDesc}</p>
                {userRole === 'teacher' && (
                  <button
                    onClick={() => setIsEditingSecret(true)}
                    className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </>
            )}
            <form onSubmit={handleSendSecret} className="space-y-4">
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Nhập lời nhắn của bạn..."
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:bg-white/20 focus:outline-none min-h-[120px] placeholder:text-white/40 text-sm transition-all resize-none"
              />
              <button
                type="submit"
                disabled={!secretMessage.trim()}
                className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                Gửi ẩn danh
              </button>
            </form>
            <AnimatePresence>
              {showSecretSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs mt-4 text-green-300 font-bold"
                >
                  Đã gửi thành công! Cảm ơn bạn.
                </motion.p>
              )}
            </AnimatePresence>
          </section>

          {/* Rules */}
          <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Nội quy diễn đàn</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex gap-2 group relative">
                  <span className="text-blue-600 font-bold">{String(idx + 1).padStart(2, '0')}.</span>
                  {editingRuleIndex === idx ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editRuleText}
                        onChange={(e) => setEditRuleText(e.target.value)}
                        className="flex-1 bg-gray-50 border-b border-blue-500 focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleUpdateRule(idx)} className="text-green-600"><CheckCircle size={14} /></button>
                      <button onClick={() => setEditingRuleIndex(null)} className="text-gray-400"><X size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{rule}</span>
                      {userRole === 'teacher' && (
                        <button
                          onClick={() => {
                            setEditingRuleIndex(idx);
                            setEditRuleText(rule);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
