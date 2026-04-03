import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Medal, Target, CheckCircle2, TrendingUp, Edit2, X, Save, Plus, Trash2, Camera } from 'lucide-react';
import { LEADERBOARD } from '../data/mockData';
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { userRole } = useAuth();
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD);
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Đọc 2 cuốn sách/tháng', progress: 85, icon: 'Star' },
    { id: 2, title: 'Tập thể dục mỗi sáng', progress: 60, icon: 'Target' },
    { id: 3, title: 'Giúp đỡ 3 bạn học tập', progress: 100, icon: 'CheckCircle2' },
  ]);
  const [headerTitle, setHeaderTitle] = useState('Bảng Xếp Hạng & Thi Đua');
  const [headerDesc, setHeaderDesc] = useState('Cùng nhau cố gắng để trở thành những ngôi sao sáng nhất của lớp 6C.');
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<number | null>(null);

  // Edit item state
  const [itemForm, setItemForm] = useState({ name: '', stars: 0, achievement: '', avatar: '' });
  const [challengeForm, setChallengeForm] = useState({ title: '', progress: 0 });

  const handleUpdateItem = (e: FormEvent) => {
    e.preventDefault();
    if (!editingItemId) return;
    if (editingItemId === 'new') {
      const newItem = { ...itemForm, id: Date.now().toString() };
      setLeaderboard([...leaderboard, newItem].sort((a, b) => b.stars - a.stars));
    } else {
      setLeaderboard(leaderboard.map(item => item.id === editingItemId ? { ...item, ...itemForm } : item).sort((a, b) => b.stars - a.stars));
    }
    setEditingItemId(null);
  };

  const handleUpdateChallenge = (e: FormEvent) => {
    e.preventDefault();
    if (!editingChallengeId) return;
    setChallenges(challenges.map(c => c.id === editingChallengeId ? { ...c, ...challengeForm } : c));
    setEditingChallengeId(null);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Star': return <Star className="text-yellow-500" />;
      case 'Target': return <Target className="text-red-500" />;
      case 'CheckCircle2': return <CheckCircle2 className="text-green-500" />;
      default: return <Star className="text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center max-w-2xl mx-auto space-y-4 relative group">
        {isEditingHeader && userRole === 'teacher' ? (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Bảng xếp hạng Sao Chiến Công */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="text-yellow-500" /> Sao Chiến Công
            </h2>
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setEditingItemId('new');
                  setItemForm({ name: '', stars: 0, achievement: '', avatar: '' });
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
              >
                <Plus size={16} /> Thêm mới
              </button>
            )}
          </div>
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 space-y-6">
              {leaderboard.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 rounded-3xl hover:bg-gray-50 transition-colors group relative"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-500' :
                    index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="relative">
                    <img src={item.avatar || `https://i.pravatar.cc/150?u=${item.id}`} className="w-16 h-16 rounded-2xl shadow-sm object-cover" alt={item.name} />
                    {userRole === 'teacher' && (
                      <button 
                        onClick={() => {
                          setEditingItemId(item.id);
                          setItemForm({ name: item.name, stars: item.stars, achievement: item.achievement, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` });
                        }}
                        className="absolute -bottom-2 -right-2 p-1.5 bg-white shadow-md text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Camera size={12} />
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Medal size={14} className="text-blue-500" /> {item.achievement}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="text-2xl font-black text-blue-600 flex items-center gap-2 justify-end">
                        {item.stars} <Star size={24} fill="currentColor" className="text-yellow-400" />
                      </div>
                    </div>
                    {userRole === 'teacher' && (
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => {
                            setEditingItemId(item.id);
                            setItemForm({ name: item.name, stars: item.stars, achievement: item.achievement, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` });
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setLeaderboard(leaderboard.filter(l => l.id !== item.id));
                          }}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 text-center">
              <button className="text-blue-600 font-bold hover:underline">Xem bảng xếp hạng đầy đủ</button>
            </div>
          </div>
        </section>

        {/* Thử thách tháng */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-red-600" /> Thử Thách Tháng 4
          </h2>
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 relative group">
                {userRole === 'teacher' && (
                  <button 
                    onClick={() => {
                      setEditingChallengeId(challenge.id);
                      setChallengeForm({ title: challenge.title, progress: challenge.progress });
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    {getIcon(challenge.icon)}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight">{challenge.title}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Tiến độ lớp</span>
                    <span className="text-blue-600">{challenge.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${
                        challenge.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                      }`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {challenge.progress === 100 ? '🎉 Đã hoàn thành thử thách!' : 'Cố lên cả lớp ơi!'}
                </p>
              </div>
            ))}
          </div>

          {/* Modals */}
          <AnimatePresence>
            {editingItemId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Sửa thành tích</h3>
                    <button onClick={() => setEditingItemId(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleUpdateItem} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Họ và tên</label>
                      <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Số Sao</label>
                      <input 
                        type="number" 
                        value={itemForm.stars} 
                        onChange={(e) => setItemForm({ ...itemForm, stars: parseInt(e.target.value) || 0 })} 
                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Danh hiệu</label>
                      <input type="text" value={itemForm.achievement} onChange={(e) => setItemForm({ ...itemForm, achievement: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Link ảnh đại diện</label>
                      <input type="text" value={itemForm.avatar} onChange={(e) => setItemForm({ ...itemForm, avatar: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">Lưu thay đổi</button>
                  </form>
                </motion.div>
              </div>
            )}

            {editingChallengeId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Sửa thử thách</h3>
                    <button onClick={() => setEditingChallengeId(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleUpdateChallenge} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Tiêu đề thử thách</label>
                      <input type="text" value={challengeForm.title} onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500">Tiến độ (%)</label>
                      <input type="range" min="0" max="100" value={challengeForm.progress} onChange={(e) => setChallengeForm({ ...challengeForm, progress: parseInt(e.target.value) })} className="w-full" />
                      <div className="text-center font-bold text-blue-600">{challengeForm.progress}%</div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">Lưu thay đổi</button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Phần Thưởng Tháng</h3>
              <p className="text-sm opacity-80 mb-6">Tổ hoàn thành xuất sắc nhất sẽ nhận được một bữa tiệc trà sữa!</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
                Xem chi tiết
              </button>
            </div>
            <Trophy size={120} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
          </div>
        </section>
      </div>
    </div>
  );
}
