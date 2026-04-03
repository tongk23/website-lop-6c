import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Bell, ArrowRight, Edit2, Save, X, Phone, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { NEWS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { userRole } = useAuth();
  const [news, setNews] = useState(NEWS);
  const [isEditingNews, setIsEditingNews] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: '' });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState('2026-04-10T08:00:00');
  const [countdownTitle, setCountdownTitle] = useState('Dã ngoại Lục Ngạn');
  const [isEditingCountdown, setIsEditingCountdown] = useState(false);

  const [rules, setRules] = useState([
    'Đi học đúng giờ, chuyên cần.',
    'Lễ phép với thầy cô, hòa nhã với bạn bè.',
    'Giữ gìn vệ sinh chung của lớp và trường.',
    'Tích cực tham gia các hoạt động tập thể.'
  ]);
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [newRule, setNewRule] = useState('');

  const [contacts, setContacts] = useState([
    { name: 'Cô Chủ Nhiệm', phone: '0912.345.678' },
    { name: 'Lớp Trưởng', phone: '0987.654.321' }
  ]);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [isEditingCharacter, setIsEditingCharacter] = useState(false);
  const [characterData, setCharacterData] = useState({
    name: 'Nguyễn Văn A',
    achievement: 'Đạt 3 điểm 10 môn Toán',
    avatar: 'https://i.pravatar.cc/150?u=1'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleUpdateNews = (id: string) => {
    setNews(news.map(item => item.id === id ? { ...item, ...newsForm } : item));
    setIsEditingNews(null);
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Banner - Recreated from user image */}
      <section className="relative h-[500px] rounded-[40px] overflow-hidden bg-[#9ca38f] flex flex-col items-center justify-center text-center p-12 shadow-2xl border-8 border-white/20">
        <div className="space-y-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-[#4f73e2] px-12 py-4 rounded-[32px] shadow-lg"
          >
            <h1 className="text-5xl font-black text-black tracking-tight">Trang web</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-7xl font-light text-black tracking-tighter">Lớp 6C</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-12"
          >
            <p className="text-2xl font-medium text-black leading-relaxed max-w-xl mx-auto">
              46 trái tim - 1 nhịp đập - 1 gia đình 6C
            </p>
          </motion.div>
        </div>
        
        {/* Subtle texture/gradient overlay to make it look premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng tin nhanh */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="text-yellow-500" /> Bảng Tin Nhanh
            </h2>
          </div>
          <div className="grid gap-4">
            {news.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-6 items-start relative group"
              >
                {userRole === 'teacher' && (
                  <button 
                    onClick={() => {
                      setIsEditingNews(item.id);
                      setNewsForm({ title: item.title, content: item.content, category: item.category });
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                  <Calendar size={24} />
                </div>
                <div className="flex-1">
                  {isEditingNews === item.id ? (
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={newsForm.title} 
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full p-2 border rounded-lg font-bold"
                      />
                      <textarea 
                        value={newsForm.content} 
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        className="w-full p-2 border rounded-lg text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateNews(item.id)} className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-bold">Lưu</button>
                        <button onClick={() => setIsEditingNews(null)} className="bg-gray-200 text-gray-600 px-4 py-1 rounded-lg text-sm font-bold">Hủy</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.category}</span>
                        <span className="text-sm text-gray-400">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.content}</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nội quy lớp học */}
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <ShieldAlert className="text-red-600" /> Nội Quy Lớp Học
              </h2>
              {userRole === 'teacher' && (
                <button 
                  onClick={() => setIsEditingRules(!isEditingRules)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {isEditingRules ? <CheckCircle2 size={20} className="text-green-600" /> : <Edit2 size={20} />}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-4 group/rule">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 flex-1">{rule}</p>
                  {isEditingRules && (
                    <button onClick={() => handleRemoveRule(i)} className="text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isEditingRules && (
                <div className="flex gap-2 pt-2">
                  <input 
                    type="text" 
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    placeholder="Thêm nội quy mới..."
                    className="flex-1 p-2 border rounded-xl text-sm"
                  />
                  <button onClick={handleAddRule} className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">Thêm</button>
                </div>
              )}
            </div>
          </section>
        </section>

        {/* Cột phải */}
        <section className="space-y-6">
          {/* Đồng hồ đếm ngược */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Clock className="text-blue-500" /> Đếm Ngược
              </h2>
              {userRole === 'teacher' && (
                <button onClick={() => setIsEditingCountdown(!isEditingCountdown)} className="text-gray-400 hover:text-blue-600">
                  <Edit2 size={18} />
                </button>
              )}
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative group">
              {isEditingCountdown ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={countdownTitle} 
                    onChange={(e) => setCountdownTitle(e.target.value)}
                    className="w-full bg-white/20 p-2 rounded-lg text-white placeholder-white/50 border-none focus:ring-0"
                    placeholder="Tên sự kiện..."
                  />
                  <input 
                    type="datetime-local" 
                    value={targetDate.slice(0, 16)} 
                    onChange={(e) => setTargetDate(e.target.value + ':00')}
                    className="w-full bg-white/20 p-2 rounded-lg text-white border-none focus:ring-0"
                  />
                  <button onClick={() => setIsEditingCountdown(false)} className="w-full bg-white text-blue-600 py-2 rounded-xl font-bold">Xong</button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-6 opacity-90">Sắp tới: {countdownTitle}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Ngày', value: timeLeft.days },
                      { label: 'Giờ', value: timeLeft.hours },
                      { label: 'Phút', value: timeLeft.minutes },
                      { label: 'Giây', value: timeLeft.seconds },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-center">
                        <div className="text-3xl font-bold mb-1">{item.value.toString().padStart(2, '0')}</div>
                        <div className="text-xs uppercase tracking-wider opacity-70">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Liên hệ giáo viên */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Phone className="text-green-600" size={20} /> Liên Hệ Giáo Viên
              </h3>
              {userRole === 'teacher' && (
                <button onClick={() => setIsEditingContacts(!isEditingContacts)} className="text-gray-400 hover:text-blue-600">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {contacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  {isEditingContacts ? (
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        value={contact.name} 
                        onChange={(e) => {
                          const newContacts = [...contacts];
                          newContacts[i].name = e.target.value;
                          setContacts(newContacts);
                        }}
                        className="flex-1 p-1 text-xs border rounded-lg"
                      />
                      <input 
                        type="text" 
                        value={contact.phone} 
                        onChange={(e) => {
                          const newContacts = [...contacts];
                          newContacts[i].phone = e.target.value;
                          setContacts(newContacts);
                        }}
                        className="flex-1 p-1 text-xs border rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{contact.name}</div>
                        <div className="text-xs text-blue-600 font-medium">{contact.phone}</div>
                      </div>
                      <a href={`tel:${contact.phone}`} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                        <Phone size={14} />
                      </a>
                    </>
                  )}
                </div>
              ))}
              {isEditingContacts && (
                <button 
                  onClick={() => setContacts([...contacts, { name: 'Tên mới', phone: '0123...' }])}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-blue-200 hover:text-blue-400 transition-all"
                >
                  + Thêm liên hệ
                </button>
              )}
            </div>
            <Link 
              to="/support"
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              <AlertTriangle size={16} /> Báo lỗi / Góp ý / Hỗ trợ
            </Link>
          </section>

          {/* Nhân vật của tuần */}
          <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 relative group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                🌟 Nhân vật của tuần
              </h3>
              {userRole === 'teacher' && (
                <button onClick={() => setIsEditingCharacter(!isEditingCharacter)} className="text-gray-400 hover:text-yellow-600 transition-colors">
                  {isEditingCharacter ? <CheckCircle2 size={18} className="text-green-600" /> : <Edit2 size={18} />}
                </button>
              )}
            </div>
            {isEditingCharacter ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={characterData.name} 
                  onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                  className="w-full p-2 text-sm border rounded-xl"
                  placeholder="Tên học sinh..."
                />
                <input 
                  type="text" 
                  value={characterData.achievement} 
                  onChange={(e) => setCharacterData({...characterData, achievement: e.target.value})}
                  className="w-full p-2 text-sm border rounded-xl"
                  placeholder="Thành tích..."
                />
                <input 
                  type="text" 
                  value={characterData.avatar} 
                  onChange={(e) => setCharacterData({...characterData, avatar: e.target.value})}
                  className="w-full p-2 text-sm border rounded-xl"
                  placeholder="Link ảnh đại diện..."
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img src={characterData.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-sm" alt="Avatar" />
                <div>
                  <div className="font-bold text-gray-900 text-sm">{characterData.name}</div>
                  <div className="text-xs text-yellow-700">{characterData.achievement}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
