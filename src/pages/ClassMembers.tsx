import { motion, AnimatePresence } from 'motion/react';
import { Users, ShieldCheck, Star, Map, Plus, Edit2, Trash2, X, CheckCircle, Save, UserPlus, Camera, FileUp, Cake, Key, Mail, Loader2, Phone, Sparkles, Wand2 } from 'lucide-react';
import { CLASS_MEMBERS, Member } from '../data/mockData';
import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function ClassMembers() {
  const { userRole, isAdminOrTeacher } = useAuth();
  const [members, setMembers] = useState<Member[]>(CLASS_MEMBERS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMember, setSelectedMember] = useState(members[0]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [directEditingBioId, setDirectEditingBioId] = useState<string | null>(null);
  const [headerTitle, setHeaderTitle] = useState('Thành Viên Lớp 6C');
  const [activeGroup, setActiveGroup] = useState(1);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [accountCreationMember, setAccountCreationMember] = useState<Member | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [creationError, setCreationError] = useState('');
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<string | null>(null);

  const handleGenerateAIAvatar = async (member: Member) => {
    try {
      setIsGeneratingAvatar(member.id);
      
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Proceeding after key selection
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `A high-quality 3D cartoon avatar of a cheerful Vietnamese ${member.gender === 'Nam' ? 'schoolboy' : 'schoolgirl'} named ${member.name}, wearing a white shirt and red scarf, friendly smile, vibrant colors, soft lighting, white background, Pixar style, 3D render, high detail`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const updatedMembers = members.map(m => m.id === member.id ? { ...m, avatar: imageUrl } : m);
        setMembers(updatedMembers);
        if (selectedMember?.id === member.id) {
          setSelectedMember({ ...selectedMember, avatar: imageUrl });
        }
        toast.success(`Đã tạo avatar AI cho ${member.name}!`);
      } else {
        throw new Error('Không nhận được dữ liệu ảnh từ AI');
      }
    } catch (error) {
      console.error('Lỗi tạo avatar AI:', error);
      toast.error('Không thể tạo avatar AI. Vui lòng thử lại sau.');
    } finally {
      setIsGeneratingAvatar(null);
    }
  };

  const filteredMembers = members.filter(m => m.group === activeGroup);

  const handleUpdateNote = (id: string, newNote: string) => {
    const updatedMembers = members.map(m => m.id === id ? { ...m, note: newNote } : m);
    setMembers(updatedMembers);
    setEditingNoteId(null);
    
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, note: newNote });
    }
  };

  const handleUpdateGroup = (id: string, newGroup: number) => {
    const updatedMembers = members.map(m => m.id === id ? { ...m, group: newGroup } : m);
    setMembers(updatedMembers);
    
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, group: newGroup });
    }
  };

  const handleUpdateRole = (id: string, newRole: string) => {
    const updatedMembers = members.map(m => m.id === id ? { ...m, role: newRole } : m);
    setMembers(updatedMembers);
    setEditingRoleId(null);

    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, role: newRole });
    }
  };
  const [headerDesc, setHeaderDesc] = useState('Gặp gỡ những người bạn tuyệt vời trong gia đình 6C của chúng mình.');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState({
    name: 'Cô Nguyễn Thị Sen',
    role: 'Giáo viên chủ nhiệm',
    bio: 'Chào mừng các em đến với lớp 6C. Cô hy vọng chúng ta sẽ có một năm học thật ý nghĩa và nhiều niềm vui!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&mouth=smile&eyebrows=default&eyes=default&top=longHair&hairColor=black',
    phone: ''
  });
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);

  // Form state for new/editing member
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    role: '',
    bio: '',
    note: '',
    phone: '',
    gender: 'Nam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    position: { row: 1, col: 1 }
  });

  const officers = members.filter(m => m.role && m.role !== 'Thành viên');

  const handleAddMember = (e: FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: Date.now().toString(),
      stt: members.length + 1,
      name: formData.name || 'Thành viên mới',
      role: formData.role,
      bio: formData.bio || 'Chưa có tiểu sử.',
      gender: formData.gender as 'Nam' | 'Nữ',
      avatar: formData.avatar || (formData.gender === 'Nam' 
        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' 
        : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara'),
      position: formData.position || { row: 1, col: 1 },
      group: activeGroup,
      note: formData.note,
      phone: formData.phone
    };
    setMembers([...members, newMember]);
    setIsAddingMember(false);
    setFormData({ name: '', role: '', bio: '', avatar: '', position: { row: 1, col: 1 }, note: '', phone: '' });
  };

  const handleUpdateMember = (e: FormEvent) => {
    e.preventDefault();
    if (!editingMemberId) return;
    const updatedMembers = members.map(m => m.id === editingMemberId ? { ...m, ...formData } as Member : m);
    setMembers(updatedMembers);
    setEditingMemberId(null);
    setFormData({ name: '', role: '', bio: '', avatar: '', position: { row: 1, col: 1 }, note: '', phone: '' });
    
    // Update selected member if it was the one being edited
    const updatedSelected = updatedMembers.find(m => m.id === selectedMember.id);
    if (updatedSelected) setSelectedMember(updatedSelected);
  };

  const handleDirectBioUpdate = (id: string, newBio: string) => {
    const updatedMembers = members.map(m => m.id === id ? { ...m, bio: newBio } : m);
    setMembers(updatedMembers);
    setDirectEditingBioId(null);
    
    const updatedSelected = updatedMembers.find(m => m.id === selectedMember.id);
    if (updatedSelected) setSelectedMember(updatedSelected);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      setMembers(members.filter(m => m.id !== id));
      if (selectedMember.id === id) setSelectedMember(members[0]);
    }
  };

  const startEditing = (member: Member) => {
    setEditingMemberId(member.id);
    setFormData(member);
  };

  const handleImportList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate reading file and adding 50 members
      const simulatedMembers: Member[] = Array.from({ length: 50 }, (_, i) => ({
        id: `imported-${i}`,
        stt: members.length + i + 1,
        name: `Học sinh ${i + 1}`,
        bio: 'Học sinh lớp 6C.',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + Date.now()}`,
        position: { row: Math.floor(i / 5) + 1, col: (i % 5) + 1 },
        group: Math.floor(i / 12) + 1,
        note: '',
        email: `hocsinh${members.length + i + 1}@lop6c.edu.vn`,
        hasAccount: false
      }));
      setMembers([...members, ...simulatedMembers]);
      alert('Đã nhập danh sách 50 học sinh thành công!');
    }
  };

  const startAccountCreation = (member: Member) => {
    const suggestedEmail = member.email || `${member.name.toLowerCase().split(' ').pop()}${member.stt}@lop6c.edu.vn`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9@.]/g, "");
    setAccountCreationMember({ ...member, email: suggestedEmail });
    setTempPassword(`Lop6C@${member.stt}${new Date().getFullYear()}`);
    setCreationError('');
    setCreationSuccess(false);
  };

  const handleCreateAccount = async () => {
    if (!accountCreationMember) return;
    setIsCreatingAccount(true);
    setCreationError('');

    try {
      // Initialize a secondary app to create user without logging out current teacher
      const secondaryApp = getApps().find(app => app.name === 'Secondary') || initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth, 
        accountCreationMember.email!, 
        tempPassword
      );

      // Create profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: accountCreationMember.email,
        fullName: accountCreationMember.name,
        role: 'student',
        grade: '6'
      });

      // Update local state
      setMembers(members.map(m => m.id === accountCreationMember.id ? { ...m, hasAccount: true, email: accountCreationMember.email } : m));
      setCreationSuccess(true);
      
      // Sign out from secondary app to clean up
      await signOut(secondaryAuth);
    } catch (err: any) {
      setCreationError(err.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center max-w-2xl mx-auto space-y-4 relative group">
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
            <h1 className="text-5xl font-bold tracking-tight">{headerTitle}</h1>
            <p className="text-gray-600 text-lg">{headerDesc}</p>
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
      
      {/* Teacher Profile Section */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img 
                src={teacherInfo.avatar} 
                alt={teacherInfo.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-white/20 shadow-xl object-cover"
              />
              {userRole === 'teacher' && (
                <button 
                  onClick={() => setIsEditingTeacher(true)}
                  className="absolute -bottom-2 -right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-lg hover:scale-110 transition-all"
                >
                  <Edit2 size={18} />
                </button>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              {isEditingTeacher ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={teacherInfo.name} 
                    onChange={(e) => setTeacherInfo({...teacherInfo, name: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white placeholder:text-white/50 focus:outline-none"
                    placeholder="Tên giáo viên"
                  />
                  <input 
                    type="text" 
                    value={teacherInfo.role} 
                    onChange={(e) => setTeacherInfo({...teacherInfo, role: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white placeholder:text-white/50 focus:outline-none"
                    placeholder="Chức vụ"
                  />
                  <textarea 
                    value={teacherInfo.bio} 
                    onChange={(e) => setTeacherInfo({...teacherInfo, bio: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white placeholder:text-white/50 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Tiểu sử"
                  />
                  <input 
                    type="text" 
                    value={teacherInfo.phone} 
                    onChange={(e) => setTeacherInfo({...teacherInfo, phone: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-white placeholder:text-white/50 focus:outline-none"
                    placeholder="Số điện thoại"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingTeacher(false)} className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-sm">Lưu</button>
                    <button onClick={() => setIsEditingTeacher(false)} className="bg-white/20 text-white px-4 py-2 rounded-xl font-bold text-sm">Hủy</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{teacherInfo.name}</h2>
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">{teacherInfo.role}</p>
                  </div>
                  <p className="text-lg text-blue-50 italic leading-relaxed">
                    "{teacherInfo.bio}"
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                      <Mail size={16} className="text-blue-200" />
                      <span className="text-sm font-medium">gvcn@lop6c.edu.vn</span>
                    </div>
                    {teacherInfo.phone && (
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm">
                        <Phone size={16} className="text-blue-200" />
                        <span className="text-sm font-medium">{teacherInfo.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Controls */}
      {isAdminOrTeacher && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsAddingMember(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <UserPlus size={20} /> Thêm thành viên mới
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            <FileUp size={20} /> Nhập danh sách lớp
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportList} 
            className="hidden" 
            accept=".csv,.xlsx,.txt"
          />
        </div>
      )}

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {(isAddingMember || editingMemberId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">{isAddingMember ? 'Thêm thành viên' : 'Sửa thành viên'}</h3>
                <button onClick={() => { setIsAddingMember(false); setEditingMemberId(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={isAddingMember ? handleAddMember : handleUpdateMember} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">Chức vụ (nếu có)</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">Tiểu sử</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Giới tính</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          const newAvatar = formData.avatar?.includes('api.dicebear.com') 
                            ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' 
                            : formData.avatar;
                          setFormData({ ...formData, gender: 'Nam', avatar: newAvatar });
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.gender === 'Nam' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                      >
                        Nam
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newAvatar = formData.avatar?.includes('api.dicebear.com') 
                            ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' 
                            : formData.avatar;
                          setFormData({ ...formData, gender: 'Nữ', avatar: newAvatar });
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.gender === 'Nữ' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
                      >
                        Nữ
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500">Link ảnh đại diện</label>
                  <div className="flex gap-4 items-center">
                    <img src={formData.avatar} className="w-16 h-16 rounded-2xl border-2 border-blue-100" alt="Preview" />
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                    {(formData.gender === 'Nam' ? ['Jack', 'Joe', 'John', 'Oliver', 'Leo'] : ['Sara', 'Jane', 'Lily', 'Mia', 'Zoe']).map(seed => (
                      <button 
                        key={seed}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` })}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 overflow-hidden ${formData.avatar?.includes(`seed=${seed}`) ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
                      >
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="Preset" />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  {isAddingMember ? 'Thêm ngay' : 'Lưu thay đổi'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Danh sách thành viên theo Tổ */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-600" /> Danh Sách Thành Viên
          </h2>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            {[1, 2, 3, 4].map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  activeGroup === group 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tổ {group}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-16">STT</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Họ và Tên</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Chức vụ</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Tổ</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Ghi chú / Nhiệm vụ</th>
                  {(userRole === 'teacher' || userRole === 'admin') && (
                    <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider w-32">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-400">{member.stt}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedMember(member)}
                        className="flex items-center gap-3 hover:text-blue-600 transition-colors text-left"
                      >
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full bg-gray-100" />
                          {member.hasAccount && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-3 h-3 rounded-full" title="Đã có tài khoản" />
                          )}
                        </div>
                        <span className="font-bold text-gray-900">{member.name}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {editingRoleId === member.id ? (
                        <select
                          autoFocus
                          defaultValue={member.role || 'Thành viên'}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                          onBlur={(e) => handleUpdateRole(member.id, e.target.value)}
                          className="w-full p-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Thành viên">Thành viên</option>
                          <option value="Lớp trưởng">Lớp trưởng</option>
                          <option value="Lớp phó học tập">Lớp phó học tập</option>
                          <option value="Lớp phó văn thể">Lớp phó văn thể</option>
                          <option value="Lớp phó Công nghệ">Lớp phó Công nghệ</option>
                          <option value="Học sinh lập trình trang web">Học sinh lập trình trang web</option>
                          <option value="Thủ quỹ">Thủ quỹ</option>
                          <option value="Tổ trưởng">Tổ trưởng</option>
                          <option value="Tổ phó">Tổ phó</option>
                        </select>
                      ) : (
                        <span 
                          onClick={() => isAdminOrTeacher && setEditingRoleId(member.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            member.role ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                          } ${isAdminOrTeacher ? 'cursor-pointer hover:bg-blue-600 hover:text-white' : ''}`}
                        >
                          {member.role || 'Thành viên'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isAdminOrTeacher ? (
                        <select
                          value={member.group}
                          onChange={(e) => handleUpdateGroup(member.id, parseInt(e.target.value))}
                          className="p-1 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[1, 2, 3, 4].map(g => (
                            <option key={g} value={g}>Tổ {g}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm font-bold text-gray-500">Tổ {member.group}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{member.phone || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {editingNoteId === member.id ? (
                        <input
                          autoFocus
                          type="text"
                          defaultValue={member.note || ''}
                          onBlur={(e) => handleUpdateNote(member.id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateNote(member.id, e.currentTarget.value)}
                          className="w-full p-2 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập ghi chú..."
                        />
                      ) : (
                        <span className="text-gray-600 text-sm italic">
                          {member.note || '---'}
                        </span>
                      )}
                    </td>
                    {isAdminOrTeacher && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {isAdminOrTeacher && (
                            <>
                              <button
                                onClick={() => setEditingRoleId(member.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                title="Sửa chức vụ"
                              >
                                <ShieldCheck size={16} />
                              </button>
                              {!member.hasAccount && (
                                <button
                                  onClick={() => startAccountCreation(member)}
                                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                  title="Tạo tài khoản"
                                >
                                  <Key size={16} />
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => setEditingNoteId(member.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            title="Sửa ghi chú"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Create Account Modal */}
      <AnimatePresence>
        {accountCreationMember && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl space-y-8 relative overflow-hidden"
            >
              {creationSuccess ? (
                <div className="text-center space-y-6 py-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">Tạo tài khoản thành công!</h3>
                    <p className="text-gray-500">Tài khoản cho <b>{accountCreationMember.name}</b> đã sẵn sàng.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 text-left border border-gray-100">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email đăng nhập</label>
                      <div className="font-mono text-blue-600 font-bold">{accountCreationMember.email}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mật khẩu tạm thời</label>
                      <div className="font-mono text-gray-900 font-bold">{tempPassword}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAccountCreationMember(null)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                  >
                    Đóng lại
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight">Cấp tài khoản mới</h3>
                    <p className="text-gray-500">Thiết lập thông tin đăng nhập cho học sinh <b>{accountCreationMember.name}</b>.</p>
                  </div>

                  {creationError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                      {creationError}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                        <Mail size={14} /> Email đề xuất
                      </label>
                      <input
                        type="email"
                        value={accountCreationMember.email}
                        onChange={(e) => setAccountCreationMember({ ...accountCreationMember, email: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                        <Lock size={14} /> Mật khẩu tạm thời
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={tempPassword}
                          readOnly
                          className="w-full p-4 rounded-2xl bg-gray-100 border border-gray-100 focus:outline-none font-mono text-sm text-gray-500"
                        />
                        <button 
                          onClick={() => setTempPassword(`Lop6C@${Math.random().toString(36).substring(2, 8).toUpperCase()}`)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 text-xs font-bold hover:underline"
                        >
                          Đổi mã
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setAccountCreationMember(null)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleCreateAccount}
                      disabled={isCreatingAccount}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCreatingAccount ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Đang tạo...
                        </>
                      ) : (
                        'Xác nhận cấp'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <section className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-blue-600" /> Ban Cán Sự Lớp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officers.map((officer) => (
            <motion.div 
              key={officer.id}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 relative group"
            >
              {userRole === 'teacher' && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => startEditing(officer)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteMember(officer.id)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              <div className="relative inline-block">
                <img src={officer.avatar} className="w-24 h-24 rounded-full mx-auto border-4 border-blue-50" alt={officer.name} />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Star size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">{officer.name}</h3>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{officer.role}</p>
                {officer.phone && (
                  <p className="text-xs text-green-600 font-bold flex items-center justify-center gap-1 mt-1">
                    <Phone size={12} /> {officer.phone}
                  </p>
                )}
              </div>
              {directEditingBioId === officer.id ? (
                <div className="space-y-2">
                  <textarea
                    autoFocus
                    defaultValue={officer.bio}
                    onBlur={(e) => handleDirectBioUpdate(officer.id, e.target.value)}
                    className="w-full p-2 text-sm bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <p className="text-[10px] text-gray-400 italic">Nhấn ra ngoài để lưu</p>
                </div>
              ) : (
                <p 
                  className={`text-gray-500 text-sm italic cursor-pointer ${isAdminOrTeacher ? 'hover:text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-all' : ''}`}
                  onClick={() => isAdminOrTeacher && setDirectEditingBioId(officer.id)}
                >
                  "{officer.bio}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sơ đồ lớp tương tác */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Map className="text-green-600" /> Sơ Đồ Lớp
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 bg-gray-50 p-8 rounded-[40px] border-8 border-white shadow-inner">
            <div className="text-center mb-8">
              <div className="inline-block bg-gray-200 px-12 py-4 rounded-xl font-bold text-gray-500 uppercase tracking-[0.2em]">Bàn Giáo Viên</div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMember(member)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMember(member);
                    }
                  }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all relative group cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 ${
                    selectedMember.id === member.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 ring-4 ring-blue-100' 
                    : 'bg-white text-gray-600 shadow-sm hover:shadow-md border border-gray-100'
                  }`}
                >
                  {userRole === 'teacher' && (
                    <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(member); }} 
                        className="p-1 bg-white shadow-md text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Edit2 size={8} />
                      </button>
                    </div>
                  )}
                  <div className="text-[8px] font-bold mb-0.5">Hàng {member.position.row}</div>
                  <div className="font-bold truncate w-full text-center text-[10px]">{member.name.split(' ').pop()}</div>
                </motion.div>
              ))}
              {/* Fill remaining seats up to 50 */}
              {members.length < 50 && [...Array(50 - members.length)].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-xl bg-gray-100/50 border-2 border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-300 font-bold">
                  {members.length + i + 1}
                </div>
              ))}
            </div>
          </div>

          <motion.div 
            key={selectedMember.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 sticky top-24 space-y-6"
          >
            <div className="relative group/avatar">
              <img src={selectedMember.avatar} className="w-32 h-32 rounded-3xl mx-auto shadow-lg object-cover" alt={selectedMember.name} />
              {isAdminOrTeacher && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all bg-black/20 rounded-3xl">
                  <button
                    onClick={() => handleGenerateAIAvatar(selectedMember)}
                    disabled={isGeneratingAvatar === selectedMember.id}
                    className="p-3 bg-white text-blue-600 rounded-2xl shadow-xl hover:scale-110 transition-all disabled:opacity-50"
                    title="Tạo Avatar AI"
                  >
                    {isGeneratingAvatar === selectedMember.id ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Wand2 size={24} />
                    )}
                  </button>
                </div>
              )}
              {isAdminOrTeacher && (
                <button 
                  onClick={() => startEditing(selectedMember)}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-all"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
              {userRole === 'teacher' ? (
                <select
                  value={selectedMember.role || 'Thành viên'}
                  onChange={(e) => handleUpdateRole(selectedMember.id, e.target.value)}
                  className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold border-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-blue-100 transition-all"
                >
                  <option value="Thành viên">Thành viên</option>
                  <option value="Lớp trưởng">Lớp trưởng</option>
                  <option value="Lớp phó học tập">Lớp phó học tập</option>
                  <option value="Lớp phó văn thể">Lớp phó văn thể</option>
                  <option value="Lớp phó Công nghệ">Lớp phó Công nghệ</option>
                  <option value="Học sinh lập trình trang web">Học sinh lập trình trang web</option>
                  <option value="Thủ quỹ">Thủ quỹ</option>
                  <option value="Tổ trưởng">Tổ trưởng</option>
                  <option value="Tổ phó">Tổ phó</option>
                </select>
              ) : (
                selectedMember.role && (
                  <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                    {selectedMember.role}
                  </span>
                )
              )}
              
              {selectedMember.birthday && (
                <p className="text-sm font-bold text-pink-500 flex items-center justify-center gap-1">
                  <Cake size={14} /> Sinh nhật: {selectedMember.birthday}
                </p>
              )}

              {selectedMember.phone && (
                <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-1">
                  <Phone size={14} /> SĐT: {selectedMember.phone}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-gray-600 leading-relaxed relative group/bio">
                <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wider">Về mình:</p>
                {directEditingBioId === selectedMember.id ? (
                  <textarea
                    autoFocus
                    defaultValue={selectedMember.bio}
                    onBlur={(e) => handleDirectBioUpdate(selectedMember.id, e.target.value)}
                    className="w-full p-3 text-sm bg-gray-50 border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                ) : (
                  <div 
                    className={`relative text-sm italic ${isAdminOrTeacher ? 'cursor-pointer hover:bg-blue-50 p-2 rounded-xl transition-all' : ''}`}
                    onClick={() => isAdminOrTeacher && setDirectEditingBioId(selectedMember.id)}
                  >
                    "{selectedMember.bio}"
                    {userRole === 'teacher' && (
                      <Edit2 size={12} className="absolute top-0 -right-4 opacity-0 group-hover/bio:opacity-100 text-blue-400" />
                    )}
                  </div>
                )}
              </div>

              {selectedMember.hobbies && selectedMember.hobbies.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">Sở thích:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.hobbies.map((hobby, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">Thành tích:</p>
                  <div className="space-y-1">
                    {selectedMember.achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                        <Star size={12} fill="currentColor" />
                        {ach}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tổ</div>
                <div className="text-xl font-black text-gray-800">{selectedMember.group.toString().padStart(2, '0')}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Vị trí</div>
                <div className="text-xl font-black text-gray-800">{selectedMember.position.row}-{selectedMember.position.col}</div>
              </div>
            </div>

            {userRole === 'admin' && selectedMember.hasAccount && (
              <div className="pt-4 space-y-3 border-t border-gray-100">
                <p className="font-bold text-red-600 text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={12} /> Thông tin tài khoản (Chỉ Admin)
                </p>
                <div className="bg-red-50 p-4 rounded-2xl space-y-2 border border-red-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Tài khoản:</span>
                    <span className="text-sm font-mono font-bold text-red-700">{selectedMember.username || '---'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Mật khẩu:</span>
                    <span className="text-sm font-mono font-bold text-red-700">{selectedMember.password || '---'}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
