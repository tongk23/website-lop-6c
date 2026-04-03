import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cake, Palette, Trophy, Coffee, ShieldCheck, Heart, 
  Zap, Video, Map, Plus, Edit2, Trash2, MessageCircle, 
  Music, Book, Smile, ExternalLink, Camera, MapPin, 
  ChevronRight, Sparkles, Send, Users, Play, Phone, Search, X,
  Calendar, Info, UserPlus, Star, Flag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CLASS_MEMBERS, Member } from '../data/mockData';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
}

const SECTIONS: Section[] = [
  { id: 'birthday', title: 'Góc Sinh Nhật', icon: <Cake size={20} />, color: 'pink', desc: 'Chúc mừng những thiên thần nhỏ của lớp 6C' },
  { id: 'talent', title: 'Triển Lãm Tài Năng', icon: <Palette size={20} />, color: 'purple', desc: 'Nơi tỏa sáng của những tài năng nhí' },
  { id: 'sports', title: 'Thể Thao & Ngoại Khóa', icon: <Trophy size={20} />, color: 'orange', desc: 'Sức khỏe dẻo dai - Tinh thần sảng khoái - Gắn kết đồng đội' },
  { id: 'chill', title: 'Chill Zone', icon: <Coffee size={20} />, color: 'blue', desc: 'Thư giãn sau những giờ học căng thẳng' },
  { id: 'skills', title: 'Cẩm Nang Kỹ Năng', icon: <ShieldCheck size={20} />, color: 'green', desc: 'Kiến thức bổ ích cho hành trang tương lai' },
  { id: 'kindness', title: 'Việc Tử Tế', icon: <Heart size={20} />, color: 'red', desc: 'Lan tỏa yêu thương và lòng biết ơn' },
  { id: 'horse', title: 'Horse Edu & K-Steed', icon: <Zap size={20} />, color: 'indigo', desc: 'Học tập sáng tạo cùng K-Steed' },
  { id: 'digital', title: 'Digital Creator', icon: <Video size={20} />, color: 'cyan', desc: 'Sáng tạo nội dung số đỉnh cao' },
  { id: 'discovery', title: 'Bản Đồ Khám Phá', icon: <Map size={20} />, color: 'emerald', desc: 'Khám phá những vùng đất mới' },
];

export default function Community() {
  const { userRole } = useAuth();
  const [activeSection, setActiveSection] = useState('birthday');
  
  // Section Data States
  const [birthdays, setBirthdays] = useState([
    { id: '1', name: 'Bạn Nam', date: '05/04', image: '', link: '' },
    { id: '2', name: 'Bạn Linh', date: '12/04', image: '', link: '' },
    { id: '3', name: 'Bạn Tuấn', date: '20/04', image: '', link: '' },
  ]);
  
  const [talents, setTalents] = useState([
    { id: '1', title: 'Góc Hội Họa', desc: 'Tranh manga, phong cảnh của các họa sĩ nhí.', icon: 'Palette', color: 'purple', items: [
      { id: 't1', title: 'Phong cảnh quê hương', author: 'Nam', image: 'https://picsum.photos/seed/art1/800/600', link: '' },
      { id: 't2', title: 'Nhân vật Manga', author: 'Linh', image: 'https://picsum.photos/seed/art2/800/600', link: '' }
    ]},
    { id: '2', title: 'Góc Văn Chương', desc: 'Những bài thơ, tản văn hay được thầy cô khen.', icon: 'Book', color: 'blue', items: [] },
    { id: '3', title: 'Góc Video Tài Năng', desc: 'Clip đánh đàn, nhảy hiện đại, ảo thuật.', icon: 'Video', color: 'red', items: [] },
    { id: '4', title: 'Góc Sáng Tạo', desc: 'Sản phẩm tái chế, mô hình khoa học.', icon: 'Sparkles', color: 'yellow', items: [] },
  ]);

  const [sports, setSports] = useState({
    teams: [
      { 
        id: '1', 
        name: 'Đội bóng đá Nam', 
        emoji: '⚽', 
        captainId: '40', 
        members: ['40', '16', '13', '14', '15', '20', '24', '26', '28', '29'],
        details: 'Đội hình mạnh nhất khối 6',
        image: '',
        link: ''
      },
      { 
        id: '2', 
        name: 'Đội cầu lông Nữ', 
        emoji: '🏸', 
        captainId: '21', 
        members: ['21', '1', '4', '6', '7', '12'],
        details: 'Tập luyện chiều thứ 4 & 6',
        image: '',
        link: ''
      }
    ],
    results: [
      { id: '1', teamA: 'Lớp 6C', scoreA: 2, teamB: 'Lớp 6A', scoreB: 1, date: '15/03/2026', desc: 'Chung kết giải bóng đá trường - Chiến thắng nghẹt thở!', image: '', link: '' },
      { id: '2', teamA: 'Lớp 6C', scoreA: 3, teamB: 'Lớp 6B', scoreB: 0, date: '10/03/2026', desc: 'Vòng loại cầu lông - Áp đảo hoàn toàn', image: '', link: '' }
    ],
    schedule: [
      { id: '1', event: 'Đại hội Điền kinh', time: '08:00 - 15/04/2026', location: 'Sân vận động huyện Lục Ngạn', image: '', link: '' },
      { id: '2', event: 'Giao lưu bóng đá 6C vs 7A', time: '16:30 - 20/04/2026', location: 'Sân cỏ nhân tạo cổng trường', image: '', link: '' }
    ]
  });

  const [chill, setChill] = useState({
    songs: [
      { id: '1', title: 'Hành khúc Đội TNTP', url: '', image: '' },
      { id: '2', title: 'Lớp chúng mình', url: '', image: '' },
      { id: '3', title: 'Bụi phấn', url: '', image: '' }
    ],
    meme: { emoji: '🤣', text: '"Khi bạn nhận ra bài kiểm tra có 2 mặt nhưng bạn chỉ làm mặt trước..."', sub: 'Meme của tuần', image: '', link: '' }
  });

  const [skills, setSkills] = useState([
    { id: '1', title: 'An toàn mạng', desc: 'Cách đặt mật khẩu mạnh, nhận biết lừa đảo TikTok.', icon: 'ShieldCheck', image: '', link: '' },
    { id: '2', title: 'Kỹ năng tự học', desc: 'Mẹo nhớ từ vựng Anh, sơ đồ tư duy Mindmap.', icon: 'Book', image: '', link: '' },
    { id: '3', title: 'Phòng chống bạo lực', desc: 'Số điện thoại hỗ trợ và cách xử lý tình huống.', icon: 'Phone', image: '', link: '' },
    { id: '4', title: 'Sức khỏe học đường', desc: 'Bảo vệ mắt, tư duy tích cực mỗi ngày.', icon: 'Heart', image: '', link: '' },
  ]);

  const [kindness, setKindness] = useState({
    thanks: [
      { id: '1', text: '"Cảm ơn bạn A đã cho mình mượn bút trong giờ kiểm tra!"', image: '', link: '' },
      { id: '2', text: '"Cảm ơn tổ 3 đã trực nhật giúp mình hôm qua nhé."', image: '', link: '' }
    ],
    lostItems: [] as any[]
  });

  const [horse, setHorse] = useState({
    comic: { title: 'Truyện Tranh Lớp: "Tôi Yêu Nước Tôi"', desc: 'Hành trình khám phá lịch sử cùng hai nhân vật K-Steed và Bé Sen.', status: 'Bản vẽ phác thảo', image: '', link: '' },
    lesson: { title: 'Học Tiếng Anh cùng K-Steed', quote: '"Never give up!"', sub: 'Đừng bao giờ bỏ cuộc - Bài học từ K-Steed', image: '', link: '' }
  });

  const [digital, setDigital] = useState({
    links: [
      { id: '1', title: 'Máy in Brother', url: '#', image: '' }
    ],
    video: { title: 'Video Xu Hướng', sub: 'Tổng hợp clip nhảy & hài hước của lớp', image: '', link: '' }
  });

  const [discovery, setDiscovery] = useState({
    trips: [
      { id: '1', title: 'Dã ngoại Lục Ngạn', desc: 'Chuyến đi đầy kỷ niệm tại vườn vải thiều.', image: 'https://picsum.photos/seed/trip/400/225', link: '' }
    ],
    locations: [
      { id: '1', name: 'Chùa Am Vãi - Di tích lịch sử', image: '', link: '' },
      { id: '2', name: 'Quán ăn vặt cổng trường', image: '', link: '' }
    ]
  });

  const [classIntroVideos, setClassIntroVideos] = useState([
    { id: '1', title: 'Giới thiệu lớp 6C', desc: 'Video giới thiệu về tập thể lớp 6C thân yêu.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
  ]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAddingTalentItem, setIsAddingTalentItem] = useState(false);
  const [newTalentItem, setNewTalentItem] = useState({ title: '', author: '', image: '', link: '' });

  const [editingTalentItemId, setEditingTalentItemId] = useState<string | null>(null);

  const handleAddTalentItem = () => {
    if (newTalentItem.title && newTalentItem.author && selectedItem) {
      let updatedTalents;
      if (editingTalentItemId) {
        updatedTalents = talents.map(t => {
          if (t.id === selectedItem.id) {
            return {
              ...t,
              items: t.items.map((i: any) => i.id === editingTalentItemId ? { ...newTalentItem, id: i.id } : i)
            };
          }
          return t;
        });
      } else {
        updatedTalents = talents.map(t => {
          if (t.id === selectedItem.id) {
            return {
              ...t,
              items: [...t.items, { ...newTalentItem, id: Date.now().toString() }]
            };
          }
          return t;
        });
      }
      setTalents(updatedTalents);
      
      // Update selected item to show the new list
      const updatedSelected = updatedTalents.find(t => t.id === selectedItem.id);
      setSelectedItem(updatedSelected);
      
      setNewTalentItem({ title: '', author: '', image: '', link: '' });
      setIsAddingTalentItem(false);
      setEditingTalentItemId(null);
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case 'birthday': return <BirthdaySection data={birthdays} setData={setBirthdays} userRole={userRole} />;
      case 'talent': return <TalentSection data={talents} setData={setTalents} userRole={userRole} onSelect={setSelectedItem} />;
      case 'sports': return <SportsSection data={sports} setData={setSports} userRole={userRole} />;
      case 'chill': return <ChillSection data={chill} setData={setChill} userRole={userRole} />;
      case 'skills': return <SkillsSection data={skills} setData={setSkills} userRole={userRole} />;
      case 'kindness': return <KindnessSection data={kindness} setData={setKindness} userRole={userRole} />;
      case 'horse': return <HorseSection data={horse} setData={setHorse} userRole={userRole} />;
      case 'digital': return <DigitalSection data={digital} setData={setDigital} userRole={userRole} />;
      case 'discovery': return <DiscoverySection data={discovery} setData={setDiscovery} userRole={userRole} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">Cộng Đồng 6C</h1>
        <p className="text-xl text-blue-600 font-medium italic">"Nơi kết nối đam mê và lan tỏa yêu thương"</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          {userRole === 'teacher' && (
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Info size={16} />
                <span className="font-bold text-xs">Lưu ý cho Cô</span>
              </div>
              <p className="text-[10px] text-blue-500 leading-relaxed">
                Cô chỉ cần tập trung vào mục <b>Sinh Nhật</b>, <b>Cẩm Nang</b> và <b>Việc Tử Tế</b> nhé! Các mục khác Admin Kiên sẽ hỗ trợ ạ. ❤️
              </p>
            </div>
          )}
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                activeSection === section.id
                  ? `bg-${section.color}-600 text-white shadow-xl shadow-${section.color}-200 scale-[1.02] -translate-x-1`
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                activeSection === section.id ? 'bg-white/20' : `bg-${section.color}-50 text-${section.color}-600`
              }`}>
                {section.icon}
              </div>
              <span>{section.title}</span>
              {activeSection === section.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 h-full"
            >
              {/* Dynamic Section Header */}
              <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-50">
                <div className={`p-5 rounded-[24px] bg-${currentSection?.color}-100 text-${currentSection?.color}-600 shadow-sm`}>
                  {React.cloneElement(currentSection?.icon as React.ReactElement, { size: 32 })}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{currentSection?.title}</h2>
                  <p className="text-gray-500 font-medium">{currentSection?.desc}</p>
                </div>
              </div>
              
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Video Giới Thiệu Lớp 6C */}
      <ClassIntroSection data={classIntroVideos} setData={setClassIntroVideos} userRole={userRole} />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {selectedItem.items ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedItem.items.map((item: any) => (
                      <div key={item.id} className="group space-y-4">
                        <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 relative">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-sm shadow-xl">Xem ảnh lớn</button>
                          </div>
                          {userRole === 'teacher' && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => {
                                  setEditingTalentItemId(item.id);
                                  setNewTalentItem({ title: item.title, author: item.author, image: item.image, link: item.link || '' });
                                  setIsAddingTalentItem(true);
                                }}
                                className="p-2 bg-blue-600 text-white rounded-xl"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={() => {
                                  const updatedTalents = talents.map(t => {
                                    if (t.id === selectedItem.id) {
                                      return { ...t, items: t.items.filter((i: any) => i.id !== item.id) };
                                    }
                                    return t;
                                  });
                                  setTalents(updatedTalents);
                                  setSelectedItem(updatedTalents.find(t => t.id === selectedItem.id));
                                }}
                                className="p-2 bg-red-600 text-white rounded-xl"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                            <p className="text-gray-500 font-medium">Tác giả: <span className="text-blue-600">{item.author}</span></p>
                          </div>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isAddingTalentItem ? (
                      <div className="aspect-video rounded-3xl border-2 border-blue-200 p-6 space-y-4 bg-blue-50/30">
                        <input 
                          type="text" 
                          placeholder="Tên tác phẩm..." 
                          value={newTalentItem.title}
                          onChange={(e) => setNewTalentItem({ ...newTalentItem, title: e.target.value })}
                          className="w-full p-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                          type="text" 
                          placeholder="Tác giả..." 
                          value={newTalentItem.author}
                          onChange={(e) => setNewTalentItem({ ...newTalentItem, author: e.target.value })}
                          className="w-full p-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                          type="text" 
                          placeholder="Link ảnh (https://...)" 
                          value={newTalentItem.image}
                          onChange={(e) => setNewTalentItem({ ...newTalentItem, image: e.target.value })}
                          className="w-full p-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                          type="text" 
                          placeholder="Link chi tiết/video (tùy chọn)..." 
                          value={newTalentItem.link}
                          onChange={(e) => setNewTalentItem({ ...newTalentItem, link: e.target.value })}
                          className="w-full p-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <button onClick={handleAddTalentItem} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
                          <button onClick={() => setIsAddingTalentItem(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                        </div>
                      </div>
                    ) : (
                      userRole === 'teacher' && (
                        <button 
                          onClick={() => setIsAddingTalentItem(true)}
                          className="aspect-video rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all"
                        >
                          <Plus size={40} />
                          <span className="font-bold">Thêm tác phẩm mới</span>
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400 font-medium italic">Chưa có nội dung chi tiết cho mục này.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClassIntroSection({ data, setData, userRole }: { data: any[], setData: any, userRole: string | null }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', desc: '', url: '' });

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const handleAdd = () => {
    if (newVideo.title && newVideo.url) {
      setData([...data, { ...newVideo, id: Date.now().toString(), url: getEmbedUrl(newVideo.url) }]);
      setNewVideo({ title: '', desc: '', url: '' });
      setIsAdding(false);
    }
  };

  return (
    <section className="mt-16 pt-16 border-t border-gray-100">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-3xl">
            <Video size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Video Giới Thiệu Lớp 6C</h2>
            <p className="text-gray-500 font-medium">Những thước phim ghi lại hành trình tuyệt vời của chúng mình</p>
          </div>
        </div>
        {userRole === 'teacher' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Thêm video
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {data.map((video) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group relative"
          >
            <div className="aspect-video bg-gray-100">
              <iframe 
                src={video.url} 
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h3>
              <p className="text-gray-500 leading-relaxed">{video.desc}</p>
            </div>
            {userRole === 'teacher' && (
              <button 
                onClick={() => setData(data.filter(v => v.id !== video.id))}
                className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}
          </motion.div>
        ))}

        {isAdding && (
          <div className="bg-blue-50/50 rounded-[40px] p-8 border-2 border-dashed border-blue-200 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">Tiêu đề video</label>
              <input 
                type="text" 
                placeholder="VD: Phóng sự lớp 6C..." 
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">Mô tả</label>
              <textarea 
                placeholder="Mô tả ngắn về video..." 
                value={newVideo.desc}
                onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 bg-white h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-2">Link YouTube</label>
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Lưu video</button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-white text-gray-500 py-4 rounded-2xl font-bold border border-gray-200">Hủy</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function BirthdaySection({ data, setData, userRole }: { data: any[], setData: any, userRole: string | null }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newLink, setNewLink] = useState('');
  const [cardImage, setCardImage] = useState('https://picsum.photos/seed/birthday/800/450');
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [tempImage, setTempImage] = useState(cardImage);

  const handleAdd = () => {
    if (newName && newDate) {
      setData([...data, { id: Date.now().toString(), name: newName, date: newDate, image: newImage, link: newLink }]);
      setNewName('');
      setNewDate('');
      setNewImage('');
      setNewLink('');
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {userRole === 'teacher' && (
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-pink-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Thêm bạn
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-pink-50 p-8 rounded-[32px] border border-pink-100">
          <h3 className="text-xl font-bold text-pink-800 mb-6 flex items-center gap-2">
            <Sparkles size={20} /> Sinh nhật tháng 4
          </h3>
          <ul className="space-y-4">
            {data.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm group">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <span className="font-bold">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-600 font-bold">{item.date}</span>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {userRole === 'teacher' && (
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </li>
            ))}
            {isAdding && (
              <li className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border-2 border-pink-200">
                <input 
                  type="text" 
                  placeholder="Tên bạn..." 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-pink-500"
                />
                <input 
                  type="text" 
                  placeholder="Ngày (VD: 05/04)..." 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-pink-500"
                />
                <input 
                  type="text" 
                  placeholder="Link ảnh đại diện (tùy chọn)..." 
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-pink-500"
                />
                <input 
                  type="text" 
                  placeholder="Link quà tặng/lời chúc (tùy chọn)..." 
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-pink-500"
                />
                <div className="flex gap-2">
                  <button onClick={handleAdd} className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-bold text-sm">Lưu</button>
                  <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-lg font-bold text-sm">Hủy</button>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="aspect-video bg-gray-100 rounded-[32px] overflow-hidden relative group">
            <img 
              src={cardImage} 
              alt="Birthday Card" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="font-black text-2xl uppercase italic tracking-tighter">Happy Birthday!</div>
                <p className="text-sm opacity-80">Chúc các bạn luôn mạnh khỏe, học giỏi và vâng lời thầy cô.</p>
              </div>
            </div>
            {userRole === 'teacher' && (
              <button 
                onClick={() => setIsEditingCard(true)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              >
                <Camera size={18} />
              </button>
            )}
          </div>

          {isEditingCard && (
            <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-3">
              <input 
                type="text" 
                value={tempImage} 
                onChange={(e) => setTempImage(e.target.value)}
                placeholder="Link ảnh thiệp..."
                className="w-full p-2 bg-gray-50 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <button onClick={() => { setCardImage(tempImage); setIsEditingCard(false); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm">Lưu ảnh</button>
                <button onClick={() => setIsEditingCard(false)} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-lg font-bold text-sm">Hủy</button>
              </div>
            </div>
          )}
          
          <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-500" /> Lời chúc từ các bạn
            </h4>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              <div className="text-sm bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-blue-600">Minh:</span> Chúc Nam sinh nhật vui vẻ nha!
              </div>
              <div className="text-sm bg-gray-50 p-3 rounded-xl">
                <span className="font-bold text-blue-600">Hoa:</span> Chúc Linh ngày càng xinh đẹp và học giỏi!
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Viết lời chúc..." className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500" />
              <button className="bg-pink-600 text-white p-2 rounded-xl"><Send size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TalentSection({ data, setData, userRole, onSelect }: { data: any[], setData: any, userRole: string | null, onSelect: any }) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Palette': return <Palette />;
      case 'Book': return <Book />;
      case 'Video': return <Video />;
      case 'Sparkles': return <Sparkles />;
      default: return <Palette />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
          >
            {userRole === 'teacher' && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl"><Edit2 size={14} /></button>
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
              {getIcon(item.icon)}
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => onSelect(item)}
                className="text-sm font-bold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all"
              >
                Xem triển lãm <ChevronRight size={14} />
              </button>
              <span className="text-[10px] font-bold text-gray-300 uppercase">{item.items.length} tác phẩm</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SportsSection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeam, setNewTeam] = useState({ name: '', emoji: '⚽', details: '', members: [] as string[], captainId: '', image: '', link: '' });
  
  const [isAddingResult, setIsAddingResult] = useState(false);
  const [newResult, setNewResult] = useState({ teamA: 'Lớp 6C', scoreA: 0, teamB: '', scoreB: 0, desc: '', date: new Date().toLocaleDateString('vi-VN'), image: '', link: '' });

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ event: '', time: '', location: '', image: '', link: '' });

  const [showMemberManager, setShowMemberManager] = useState<string | null>(null);

  const handleAddTeam = () => {
    if (newTeam.name) {
      if (editingTeamId) {
        setData({
          ...data,
          teams: data.teams.map((t: any) => t.id === editingTeamId ? { ...t, ...newTeam } : t)
        });
      } else {
        setData({
          ...data,
          teams: [...data.teams, { id: Date.now().toString(), ...newTeam }]
        });
      }
      setNewTeam({ name: '', emoji: '⚽', details: '', members: [], captainId: '', image: '', link: '' });
      setIsAddingTeam(false);
      setEditingTeamId(null);
    }
  };

  const handleAddResult = () => {
    if (newResult.teamB) {
      setData({
        ...data,
        results: [{ id: Date.now().toString(), ...newResult }, ...data.results]
      });
      setNewResult({ teamA: 'Lớp 6C', scoreA: 0, teamB: '', scoreB: 0, desc: '', date: new Date().toLocaleDateString('vi-VN'), image: '', link: '' });
      setIsAddingResult(false);
    }
  };

  const handleAddSchedule = () => {
    if (newSchedule.event) {
      setData({
        ...data,
        schedule: [...data.schedule, { id: Date.now().toString(), ...newSchedule }]
      });
      setNewSchedule({ event: '', time: '', location: '', image: '', link: '' });
      setIsAddingSchedule(false);
    }
  };

  const toggleMember = (teamId: string, memberId: string) => {
    setData({
      ...data,
      teams: data.teams.map((t: any) => {
        if (t.id === teamId) {
          const members = t.members.includes(memberId)
            ? t.members.filter((id: string) => id !== memberId)
            : [...t.members, memberId];
          return { ...t, members };
        }
        return t;
      })
    });
  };

  const setCaptain = (teamId: string, memberId: string) => {
    setData({
      ...data,
      teams: data.teams.map((t: any) => 
        t.id === teamId ? { ...t, captainId: memberId } : t
      )
    });
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Đội Tuyển */}
        <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-sm relative group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Users size={24} className="text-orange-600" /> Đội Tuyển Lớp
            </h3>
            {userRole === 'teacher' && (
              <button 
                onClick={() => {
                  setNewTeam({ name: '', emoji: '⚽', details: '', members: [], captainId: '' });
                  setEditingTeamId(null);
                  setIsAddingTeam(true);
                }} 
                className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white p-3 rounded-2xl transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {data.teams.map((team: any) => (
              <div key={team.id} className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-6 transition-all hover:shadow-md group/team">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                    {team.image ? (
                      <img src={team.image} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      team.emoji
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <h4 className="text-xl font-bold text-gray-900 truncate">{team.name}</h4>
                        {team.link && (
                          <a href={team.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      {userRole === 'teacher' && (
                        <div className="flex gap-2 opacity-0 group-team:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setNewTeam(team);
                              setEditingTeamId(team.id);
                              setIsAddingTeam(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => setData({ ...data, teams: data.teams.filter((t: any) => t.id !== team.id) })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{team.details}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {team.members.map((mId: string) => {
                        const member = CLASS_MEMBERS.find(m => m.id === mId);
                        const isCaptain = team.captainId === mId;
                        return (
                          <div 
                            key={mId} 
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                              isCaptain 
                              ? 'bg-orange-100 text-orange-700 border-orange-200' 
                              : 'bg-white text-gray-600 border-gray-200'
                            }`}
                          >
                            {isCaptain && <Star size={10} fill="currentColor" />}
                            {member?.name}
                          </div>
                        );
                      })}
                      {userRole === 'teacher' && (
                        <button 
                          onClick={() => setShowMemberManager(team.id)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <UserPlus size={10} /> Quản lý
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Manager Inline */}
                <AnimatePresence>
                  {showMemberManager === team.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold text-sm text-gray-700">Chọn thành viên & Đội trưởng:</h5>
                        <button onClick={() => setShowMemberManager(null)} className="text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                        {CLASS_MEMBERS.map(m => (
                          <div 
                            key={m.id}
                            className={`flex items-center justify-between p-2 rounded-xl border text-[10px] transition-all ${
                              team.members.includes(m.id) 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-white border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <button 
                              onClick={() => toggleMember(team.id, m.id)}
                              className="flex-1 text-left font-bold truncate"
                            >
                              {m.name}
                            </button>
                            {team.members.includes(m.id) && (
                              <button 
                                onClick={() => setCaptain(team.id, m.id)}
                                className={`p-1 rounded-md transition-all ${team.captainId === m.id ? 'text-orange-600 bg-orange-100' : 'text-gray-300 hover:text-orange-400'}`}
                                title="Đặt làm đội trưởng"
                              >
                                <Flag size={12} fill={team.captainId === m.id ? 'currentColor' : 'none'} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {isAddingTeam && (
              <div className="bg-orange-50/50 border-2 border-orange-200 rounded-[32px] p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Emoji</label>
                    <input 
                      type="text" 
                      value={newTeam.emoji} 
                      onChange={(e) => setNewTeam({...newTeam, emoji: e.target.value})} 
                      className="w-16 p-3 rounded-2xl bg-white border border-orange-100 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tên Đội</label>
                    <input 
                      type="text" 
                      placeholder="VD: Đội bóng đá Nam..." 
                      value={newTeam.name} 
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} 
                      className="w-full p-3 rounded-2xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Link ảnh đại diện</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={newTeam.image} 
                      onChange={(e) => setNewTeam({...newTeam, image: e.target.value})} 
                      className="w-full p-3 rounded-2xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Link chi tiết</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={newTeam.link} 
                      onChange={(e) => setNewTeam({...newTeam, link: e.target.value})} 
                      className="w-full p-3 rounded-2xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Mô tả ngắn</label>
                  <input 
                    type="text" 
                    placeholder="VD: Tập luyện chiều thứ 2 hàng tuần..." 
                    value={newTeam.details} 
                    onChange={(e) => setNewTeam({...newTeam, details: e.target.value})} 
                    className="w-full p-3 rounded-2xl bg-white border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddTeam} className="flex-1 bg-orange-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-orange-100">
                    {editingTeamId ? 'Cập nhật' : 'Thêm đội'}
                  </button>
                  <button onClick={() => { setIsAddingTeam(false); setEditingTeamId(null); }} className="flex-1 bg-white text-gray-500 py-3 rounded-2xl font-bold border border-gray-200">
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kết Quả & Lịch Thi Đấu */}
        <div className="space-y-8">
          {/* Kết Quả */}
          <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Trophy size={24} className="text-yellow-400" /> Kết Quả Thi Đấu
                </h3>
                {userRole === 'teacher' && (
                  <button onClick={() => setIsAddingResult(true)} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all">
                    <Plus size={20} />
                  </button>
                )}
              </div>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {data.results.map((res: any) => (
                  <div key={res.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group/res hover:bg-white/10 transition-all">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{res.date}</div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <div className="text-sm font-bold text-white/80 mb-1">{res.teamA}</div>
                        <div className="text-4xl font-black text-white">{res.scoreA}</div>
                      </div>
                      <div className="px-4 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[10px] font-black">VS</div>
                      <div className="text-center flex-1">
                        <div className="text-sm font-bold text-white/80 mb-1">{res.teamB}</div>
                        <div className="text-4xl font-black text-white">{res.scoreB}</div>
                      </div>
                    </div>
                    {res.image && (
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
                        <img src={res.image} alt="Match result" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-white/60 italic text-center leading-relaxed flex-1">{res.desc}</p>
                      {res.link && (
                        <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    {userRole === 'teacher' && (
                      <button 
                        onClick={() => setData({ ...data, results: data.results.filter((r: any) => r.id !== res.id) })}
                        className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-res:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {isAddingResult && (
                  <div className="bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Đội A</label>
                        <input type="text" value={newResult.teamA} onChange={(e) => setNewResult({...newResult, teamA: e.target.value})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Đội B</label>
                        <input type="text" placeholder="Đối thủ..." value={newResult.teamB} onChange={(e) => setNewResult({...newResult, teamB: e.target.value})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Tỉ số A</label>
                        <input type="number" value={newResult.scoreA} onChange={(e) => setNewResult({...newResult, scoreA: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Tỉ số B</label>
                        <input type="number" value={newResult.scoreB} onChange={(e) => setNewResult({...newResult, scoreB: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase">Mô tả & Ngày tháng</label>
                      <input type="text" placeholder="VD: 15/03 - Chiến thắng nghẹt thở..." value={newResult.desc} onChange={(e) => setNewResult({...newResult, desc: e.target.value})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Link ảnh highlight</label>
                        <input type="text" placeholder="https://..." value={newResult.image} onChange={(e) => setNewResult({...newResult, image: e.target.value})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Link video/chi tiết</label>
                        <input type="text" placeholder="https://..." value={newResult.link} onChange={(e) => setNewResult({...newResult, link: e.target.value})} className="w-full bg-white/5 border-none rounded-xl p-3 text-sm text-white" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddResult} className="flex-1 bg-white text-black py-3 rounded-2xl font-bold text-sm transition-all hover:bg-gray-100">Lưu</button>
                      <button onClick={() => setIsAddingResult(false)} className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-bold text-sm transition-all hover:bg-white/20">Hủy</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-5">
              <Trophy size={200} />
            </div>
          </div>

          {/* Lịch Thi Đấu */}
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[40px] shadow-sm relative group">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-orange-900">
                <Calendar size={24} className="text-orange-600" /> Lịch Thi Đấu & Sự Kiện
              </h3>
              {userRole === 'teacher' && (
                <button onClick={() => setIsAddingSchedule(true)} className="bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white p-3 rounded-2xl transition-all shadow-sm">
                  <Plus size={20} />
                </button>
              )}
            </div>
            <div className="space-y-4">
              {data.schedule.map((item: any) => (
                <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-orange-100 relative group/sch hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {item.image && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-orange-100">
                          <img src={item.image} alt={item.event} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-gray-900 text-lg">{item.event}</div>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div className="text-xs text-orange-600 font-bold flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
                            <Calendar size={14} /> {item.time}
                          </div>
                          <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <MapPin size={14} /> {item.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    {userRole === 'teacher' && (
                      <button 
                        onClick={() => setData({ ...data, schedule: data.schedule.filter((s: any) => s.id !== item.id) })}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-sch:opacity-100 transition-all p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isAddingSchedule && (
                <div className="bg-white p-6 rounded-[32px] border-2 border-orange-200 space-y-4 shadow-xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tên sự kiện</label>
                    <input type="text" placeholder="VD: Đại hội Điền kinh..." value={newSchedule.event} onChange={(e) => setNewSchedule({...newSchedule, event: e.target.value})} className="w-full p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Thời gian</label>
                      <input type="text" placeholder="VD: 08:00 - 15/04..." value={newSchedule.time} onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})} className="w-full p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Địa điểm</label>
                      <input type="text" placeholder="VD: Sân vận động..." value={newSchedule.location} onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})} className="w-full p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Link ảnh sự kiện</label>
                      <input type="text" placeholder="https://..." value={newSchedule.image} onChange={(e) => setNewSchedule({...newSchedule, image: e.target.value})} className="w-full p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Link chi tiết</label>
                      <input type="text" placeholder="https://..." value={newSchedule.link} onChange={(e) => setNewSchedule({...newSchedule, link: e.target.value})} className="w-full p-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleAddSchedule} className="flex-1 bg-orange-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-orange-100">Lưu lịch</button>
                    <button onClick={() => setIsAddingSchedule(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-2xl font-bold">Hủy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChillSection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', url: '', image: '' });
  const [isEditingMeme, setIsEditingMeme] = useState(false);
  const [tempMeme, setTempMeme] = useState(data.meme);

  const handleAddSong = () => {
    if (newSong.title) {
      setData({ ...data, songs: [...data.songs, { ...newSong, id: Date.now().toString() }] });
      setNewSong({ title: '', url: '', image: '' });
      setIsAddingSong(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[32px] text-white shadow-xl relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Music size={20} /> Playlist của lớp
            </h3>
            {userRole === 'teacher' && (
              <button onClick={() => setIsAddingSong(true)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                <Plus size={18} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-white/60 mb-4 italic">Nhập ID từ YouTube hoặc Spotify để cập nhật nhạc mới.</p>
          <div className="space-y-3">
            {data.songs.map((song: any, i: number) => (
              <div key={song.id || i} className="flex items-center justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer group/song">
                <div className="flex items-center gap-3">
                  {song.image ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                      <img src={song.image} alt={song.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                  <span className="text-sm font-medium">{song.title || song}</span>
                </div>
                <div className="flex items-center gap-2">
                  {song.url && (
                    <a href={song.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {userRole === 'teacher' && (
                    <button 
                      onClick={() => setData({ ...data, songs: data.songs.filter((_: any, index: number) => index !== i) })}
                      className="text-white/40 hover:text-white opacity-0 group-hover/song:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isAddingSong && (
              <div className="space-y-2 bg-white/10 p-4 rounded-xl">
                <input 
                  type="text" 
                  value={newSong.title} 
                  onChange={(e) => setNewSong({...newSong, title: e.target.value})} 
                  placeholder="Tên bài hát..."
                  className="w-full bg-white/20 border-none rounded-xl px-3 py-2 text-sm placeholder:text-white/50 focus:ring-1 focus:ring-white"
                />
                <input 
                  type="text" 
                  value={newSong.url} 
                  onChange={(e) => setNewSong({...newSong, url: e.target.value})} 
                  placeholder="Link bài hát (YouTube/Spotify)..."
                  className="w-full bg-white/20 border-none rounded-xl px-3 py-2 text-sm placeholder:text-white/50 focus:ring-1 focus:ring-white"
                />
                <input 
                  type="text" 
                  value={newSong.image} 
                  onChange={(e) => setNewSong({...newSong, image: e.target.value})} 
                  placeholder="Link ảnh bìa (tùy chọn)..."
                  className="w-full bg-white/20 border-none rounded-xl px-3 py-2 text-sm placeholder:text-white/50 focus:ring-1 focus:ring-white"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddSong} className="bg-white text-blue-600 px-3 py-2 rounded-xl text-xs font-bold">Lưu</button>
                  <button onClick={() => setIsAddingSong(false)} className="text-white/70 text-xs font-bold">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Smile size={20} className="text-yellow-500" /> Góc Xả Stress
            </h3>
            {userRole === 'teacher' && (
              <button onClick={() => setIsEditingMeme(true)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
                <Edit2 size={18} />
              </button>
            )}
          </div>
          <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-center p-6">
            {isEditingMeme ? (
              <div className="space-y-3 w-full">
                <input type="text" value={tempMeme.emoji} onChange={(e) => setTempMeme({...tempMeme, emoji: e.target.value})} className="w-full p-2 rounded-xl text-center text-2xl" placeholder="Emoji..." />
                <textarea value={tempMeme.text} onChange={(e) => setTempMeme({...tempMeme, text: e.target.value})} className="w-full p-2 rounded-xl text-sm h-20" placeholder="Nội dung meme..." />
                <input type="text" value={tempMeme.sub} onChange={(e) => setTempMeme({...tempMeme, sub: e.target.value})} className="w-full p-2 rounded-xl text-[10px] uppercase" placeholder="Tiêu đề phụ..." />
                <input type="text" value={tempMeme.image} onChange={(e) => setTempMeme({...tempMeme, image: e.target.value})} className="w-full p-2 rounded-xl text-xs" placeholder="Link ảnh meme (tùy chọn)..." />
                <input type="text" value={tempMeme.link} onChange={(e) => setTempMeme({...tempMeme, link: e.target.value})} className="w-full p-2 rounded-xl text-xs" placeholder="Link chi tiết (tùy chọn)..." />
                <div className="flex gap-2">
                  <button onClick={() => { setData({...data, meme: tempMeme}); setIsEditingMeme(false); }} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
                  <button onClick={() => setIsEditingMeme(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {data.meme.image ? (
                  <div className="aspect-video rounded-xl overflow-hidden mb-2">
                    <img src={data.meme.image} alt="Meme" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="text-4xl">{data.meme.emoji}</div>
                )}
                <p className="text-sm text-gray-600 italic">{data.meme.text}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.meme.sub}</div>
                  {data.meme.link && (
                    <a href={data.meme.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsSection({ data, setData, userRole }: { data: any[], setData: any, userRole: string | null }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ title: '', desc: '', icon: 'ShieldCheck', image: '', link: '' });

  const handleAdd = () => {
    if (newSkill.title) {
      setData([...data, { ...newSkill, id: Date.now().toString() }]);
      setNewSkill({ title: '', desc: '', icon: 'ShieldCheck', image: '', link: '' });
      setIsAdding(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck />;
      case 'Book': return <Book />;
      case 'Phone': return <Phone />;
      case 'Heart': return <Heart />;
      default: return <ShieldCheck />;
    }
  };

  return (
    <div className="space-y-8">
      {userRole === 'teacher' && (
        <div className="flex justify-end mb-6">
          <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> Thêm kỹ năng
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((skill, i) => (
          <div key={skill.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex gap-4 items-start group relative">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl shrink-0">
              {skill.image ? (
                <div className="w-6 h-6 rounded overflow-hidden">
                  <img src={skill.image} alt={skill.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                getIcon(skill.icon)
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{skill.title}</h3>
                {skill.link && (
                  <a href={skill.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-500">{skill.desc}</p>
            </div>
            {userRole === 'teacher' && (
              <button 
                onClick={() => setData(data.filter(s => s.id !== skill.id))}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        {isAdding && (
          <div className="bg-green-50 p-6 rounded-[32px] border-2 border-green-200 space-y-4">
            <input type="text" placeholder="Tiêu đề..." value={newSkill.title} onChange={(e) => setNewSkill({...newSkill, title: e.target.value})} className="w-full p-2 rounded-xl text-sm" />
            <textarea placeholder="Mô tả..." value={newSkill.desc} onChange={(e) => setNewSkill({...newSkill, desc: e.target.value})} className="w-full p-2 rounded-xl text-sm h-20" />
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Link ảnh (tùy chọn)..." value={newSkill.image} onChange={(e) => setNewSkill({...newSkill, image: e.target.value})} className="w-full p-2 rounded-xl text-sm" />
              <input type="text" placeholder="Link chi tiết (tùy chọn)..." value={newSkill.link} onChange={(e) => setNewSkill({...newSkill, link: e.target.value})} className="w-full p-2 rounded-xl text-sm" />
            </div>
            <select value={newSkill.icon} onChange={(e) => setNewSkill({...newSkill, icon: e.target.value})} className="w-full p-2 rounded-xl text-sm">
              <option value="ShieldCheck">Bảo mật</option>
              <option value="Book">Học tập</option>
              <option value="Phone">Liên hệ</option>
              <option value="Heart">Sức khỏe</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KindnessSection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isAddingThanks, setIsAddingThanks] = useState(false);
  const [newThanks, setNewThanks] = useState({ text: '', image: '', link: '' });
  const [isAddingLost, setIsAddingLost] = useState(false);
  const [newLost, setNewLost] = useState({ text: '', image: '', link: '' });

  const handleAddThanks = () => {
    if (newThanks.text) {
      setData({ ...data, thanks: [...data.thanks, { id: Date.now().toString(), ...newThanks, text: `"${newThanks.text}"` }] });
      setNewThanks({ text: '', image: '', link: '' });
      setIsAddingThanks(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm relative group">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Smile size={20} className="text-red-600" /> Lời Cảm Ơn
              </h3>
              <button onClick={() => setIsAddingThanks(true)} className="p-2 hover:bg-red-50 rounded-xl text-red-600">
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {data.thanks.map((item: any) => (
                <div key={item.id} className="p-4 bg-red-50 rounded-2xl text-sm italic relative group/item">
                  {item.image && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-2">
                      <img src={item.image} alt="Thanks" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1">{item.text}</span>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-red-600">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {userRole === 'teacher' && (
                    <button 
                      onClick={() => setData({ ...data, thanks: data.thanks.filter((t: any) => t.id !== item.id) })}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
              {isAddingThanks && (
                <div className="space-y-2">
                  <textarea value={newThanks.text} onChange={(e) => setNewThanks({...newThanks, text: e.target.value})} placeholder="Viết lời cảm ơn..." className="w-full p-3 bg-gray-50 rounded-xl text-sm h-20" />
                  <input type="text" value={newThanks.image} onChange={(e) => setNewThanks({...newThanks, image: e.target.value})} placeholder="Link ảnh (tùy chọn)..." className="w-full p-2 bg-gray-50 rounded-xl text-xs" />
                  <input type="text" value={newThanks.link} onChange={(e) => setNewThanks({...newThanks, link: e.target.value})} placeholder="Link chi tiết (tùy chọn)..." className="w-full p-2 bg-gray-50 rounded-xl text-xs" />
                  <div className="flex gap-2">
                    <button onClick={handleAddThanks} className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold text-sm">Gửi</button>
                    <button onClick={() => setIsAddingThanks(false)} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-[32px] border border-dashed border-gray-300 relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Search size={20} className="text-gray-500" /> Nhặt Được Của Rơi
            </h3>
            {userRole === 'teacher' && (
              <button onClick={() => setIsAddingLost(true)} className="p-2 hover:bg-gray-200 rounded-xl text-gray-500">
                <Plus size={18} />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {data.lostItems.length > 0 ? (
              data.lostItems.map((item: any) => (
                <div key={item.id} className="p-4 bg-white rounded-2xl text-sm border border-gray-100 space-y-2 group/item">
                  {item.image && (
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <img src={item.image} alt="Lost item" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{item.text}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    {userRole === 'teacher' && (
                      <button onClick={() => setData({ ...data, lostItems: data.lostItems.filter((l: any) => l.id !== item.id) })} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !isAddingLost && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-sm text-gray-500">Hiện không có thông báo mới.</p>
                </div>
              )
            )}
            {isAddingLost && (
              <div className="space-y-2">
                <input type="text" value={newLost.text} onChange={(e) => setNewLost({...newLost, text: e.target.value})} placeholder="Thông báo nhặt được..." className="w-full p-3 bg-white rounded-xl text-sm" />
                <input type="text" value={newLost.image} onChange={(e) => setNewLost({...newLost, image: e.target.value})} placeholder="Link ảnh vật phẩm (tùy chọn)..." className="w-full p-2 bg-white rounded-xl text-xs" />
                <input type="text" value={newLost.link} onChange={(e) => setNewLost({...newLost, link: e.target.value})} placeholder="Link liên hệ/chi tiết (tùy chọn)..." className="w-full p-2 bg-white rounded-xl text-xs" />
                <div className="flex gap-2">
                  <button onClick={() => { if(newLost.text) { setData({...data, lostItems: [...data.lostItems, {id: Date.now().toString(), ...newLost}]}); setNewLost({text: '', image: '', link: ''}); setIsAddingLost(false); } }} className="flex-1 bg-gray-900 text-white py-2 rounded-xl font-bold text-sm">Đăng</button>
                  <button onClick={() => setIsAddingLost(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HorseSection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isEditingComic, setIsEditingComic] = useState(false);
  const [tempComic, setTempComic] = useState(data.comic);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [tempLesson, setTempLesson] = useState(data.lesson);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-indigo-600 text-white p-8 rounded-[32px] shadow-xl relative group">
          {userRole === 'teacher' && (
            <button onClick={() => setIsEditingComic(true)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <Edit2 size={18} />
            </button>
          )}
          {isEditingComic ? (
            <div className="space-y-4">
              <input type="text" value={tempComic.title} onChange={(e) => setTempComic({...tempComic, title: e.target.value})} className="w-full p-2 rounded-xl bg-white/20 text-white placeholder:text-white/50" />
              <textarea value={tempComic.desc} onChange={(e) => setTempComic({...tempComic, desc: e.target.value})} className="w-full p-2 rounded-xl bg-white/20 text-white h-20" />
              <input type="text" value={tempComic.status} onChange={(e) => setTempComic({...tempComic, status: e.target.value})} className="w-full p-2 rounded-xl bg-white/20 text-white" />
              <input type="text" value={tempComic.image} onChange={(e) => setTempComic({...tempComic, image: e.target.value})} className="w-full p-2 rounded-xl bg-white/20 text-white placeholder:text-white/50" placeholder="Link ảnh bìa truyện..." />
              <input type="text" value={tempComic.link} onChange={(e) => setTempComic({...tempComic, link: e.target.value})} className="w-full p-2 rounded-xl bg-white/20 text-white placeholder:text-white/50" placeholder="Link đọc truyện..." />
              <div className="flex gap-2">
                <button onClick={() => { setData({...data, comic: tempComic}); setIsEditingComic(false); }} className="flex-1 bg-white text-indigo-600 py-2 rounded-xl font-bold text-sm">Lưu</button>
                <button onClick={() => setIsEditingComic(false)} className="flex-1 bg-indigo-500 text-white py-2 rounded-xl font-bold text-sm">Hủy</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{data.comic.title}</h3>
                {data.comic.link && (
                  <a href={data.comic.link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-200">
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
              <p className="text-sm opacity-80 mb-6">{data.comic.desc}</p>
              <div className="aspect-[3/4] bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                {data.comic.image ? (
                  <img src={data.comic.image} alt={data.comic.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-bold opacity-50">{data.comic.status}</span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm relative group">
            {userRole === 'teacher' && (
              <button onClick={() => setIsEditingLesson(true)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                <Edit2 size={18} />
              </button>
            )}
            {isEditingLesson ? (
              <div className="space-y-4">
                <input type="text" value={tempLesson.title} onChange={(e) => setTempLesson({...tempLesson, title: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50" />
                <input type="text" value={tempLesson.quote} onChange={(e) => setTempLesson({...tempLesson, quote: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50" />
                <input type="text" value={tempLesson.sub} onChange={(e) => setTempLesson({...tempLesson, sub: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50" />
                <input type="text" value={tempLesson.image} onChange={(e) => setTempLesson({...tempLesson, image: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50" placeholder="Link ảnh bài học..." />
                <input type="text" value={tempLesson.link} onChange={(e) => setTempLesson({...tempLesson, link: e.target.value})} className="w-full p-2 rounded-xl bg-gray-50" placeholder="Link chi tiết bài học..." />
                <div className="flex gap-2">
                  <button onClick={() => { setData({...data, lesson: tempLesson}); setIsEditingLesson(false); }} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
                  <button onClick={() => setIsEditingLesson(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{data.lesson.title}</h3>
                  {data.lesson.link && (
                    <a href={data.lesson.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                <div className="p-6 bg-indigo-50 rounded-2xl text-center space-y-4">
                  {data.lesson.image && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-2">
                      <img src={data.lesson.image} alt="Lesson" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="text-2xl font-black text-indigo-600 mb-2">{data.lesson.quote}</div>
                  <p className="text-sm text-gray-500">{data.lesson.sub}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DigitalSection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '#', image: '' });
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [tempVideo, setTempVideo] = useState(data.video);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ExternalLink size={20} className="text-cyan-600" /> Link Chém Giá (Affiliate)
            </h3>
            {userRole === 'teacher' && (
              <button onClick={() => setIsAddingLink(true)} className="p-2 hover:bg-cyan-50 rounded-xl text-cyan-600">
                <Plus size={18} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">Hỗ trợ lớp mua đồ dùng học tập giá rẻ qua các link sản phẩm.</p>
          <div className="space-y-3">
            {data.links.map((link: any) => (
              <div key={link.id} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 group/item">
                {link.image && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                    <img src={link.image} alt={link.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex-1 font-bold">{link.title}</div>
                <div className="flex items-center gap-3">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 font-bold text-sm">Xem ngay</a>
                  {userRole === 'teacher' && (
                    <button onClick={() => setData({...data, links: data.links.filter((l: any) => l.id !== link.id)})} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isAddingLink && (
              <div className="space-y-2 p-4 bg-cyan-50 rounded-2xl">
                <input type="text" value={newLink.title} onChange={(e) => setNewLink({...newLink, title: e.target.value})} placeholder="Tên sản phẩm..." className="w-full p-2 rounded-xl text-sm" />
                <input type="text" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} placeholder="Link sản phẩm..." className="w-full p-2 rounded-xl text-sm" />
                <input type="text" value={newLink.image} onChange={(e) => setNewLink({...newLink, image: e.target.value})} placeholder="Link ảnh sản phẩm (tùy chọn)..." className="w-full p-2 rounded-xl text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => { if(newLink.title) { setData({...data, links: [...data.links, {id: Date.now().toString(), ...newLink}]}); setNewLink({title: '', url: '#', image: ''}); setIsAddingLink(false); } }} className="flex-1 bg-cyan-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
                  <button onClick={() => setIsAddingLink(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-[32px] shadow-xl relative group">
          {userRole === 'teacher' && (
            <button onClick={() => setIsEditingVideo(true)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <Edit2 size={18} />
            </button>
          )}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Video size={20} className="text-red-600" /> {data.video.title}
            </h3>
            <p className="text-[10px] text-gray-500 italic">Dán ID video YouTube mới nhất vào đây.</p>
          </div>
          {isEditingVideo ? (
            <div className="space-y-4">
              <input type="text" value={tempVideo.title} onChange={(e) => setTempVideo({...tempVideo, title: e.target.value})} className="w-full p-2 rounded-xl bg-white/10 text-white" />
              <input type="text" value={tempVideo.sub} onChange={(e) => setTempVideo({...tempVideo, sub: e.target.value})} className="w-full p-2 rounded-xl bg-white/10 text-white" />
              <input type="text" value={tempVideo.image} onChange={(e) => setTempVideo({...tempVideo, image: e.target.value})} className="w-full p-2 rounded-xl bg-white/10 text-white" placeholder="Link ảnh thumbnail (tùy chọn)..." />
              <input type="text" value={tempVideo.link} onChange={(e) => setTempVideo({...tempVideo, link: e.target.value})} className="w-full p-2 rounded-xl bg-white/10 text-white" placeholder="Link chi tiết/kênh (tùy chọn)..." />
              <div className="flex gap-2">
                <button onClick={() => { setData({...data, video: tempVideo}); setIsEditingVideo(false); }} className="flex-1 bg-white text-black py-2 rounded-xl font-bold text-sm">Lưu</button>
                <button onClick={() => setIsEditingVideo(false)} className="flex-1 bg-gray-800 text-white py-2 rounded-xl font-bold text-sm">Hủy</button>
              </div>
            </div>
          ) : (
            <>
              <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative group/v">
                {data.video.image ? (
                  <img src={data.video.image} alt={data.video.title} className="w-full h-full object-cover opacity-50 group-hover/v:opacity-70 transition-all" referrerPolicy="no-referrer" />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={32} fill="currentColor" />
                </div>
                {data.video.link && (
                  <a href={data.video.link} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/40 transition-all">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p className="mt-4 text-center text-xs text-gray-400">{data.video.sub}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DiscoverySection({ data, setData, userRole }: { data: any, setData: any, userRole: string | null }) {
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', desc: '', image: '', link: '' });
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [isAddingLoc, setIsAddingLoc] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', image: '', link: '' });

  const handleAddTrip = () => {
    if (newTrip.title) {
      if (editingTripId) {
        setData({ ...data, trips: data.trips.map((t: any) => t.id === editingTripId ? { ...newTrip, id: t.id } : t) });
      } else {
        setData({ ...data, trips: [...data.trips, { ...newTrip, id: Date.now().toString() }] });
      }
      setNewTrip({ title: '', desc: '', image: '', link: '' });
      setIsAddingTrip(false);
      setEditingTripId(null);
    }
  };

  const handleAddLoc = () => {
    if (newLoc.name) {
      setData({ ...data, locations: [...data.locations, { id: Date.now().toString(), ...newLoc }] });
      setNewLoc({ name: '', image: '', link: '' });
      setIsAddingLoc(false);
    }
  };

  return (
    <div className="space-y-8">
      {userRole === 'teacher' && (
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsAddingTrip(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={18} /> Thêm chuyến đi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Camera size={20} className="text-emerald-600" /> Nhật Ký Trải Nghiệm
          </h3>
          <div className="space-y-6">
            {data.trips.map((trip: any) => (
              <div key={trip.id} className="group relative cursor-pointer">
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-2 relative group/trip">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  {trip.link && (
                    <a href={trip.link} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-lg text-emerald-600 opacity-0 group-hover/trip:opacity-100 transition-all">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <div className="font-bold">{trip.title}</div>
                <p className="text-xs text-gray-500">{trip.desc}</p>
                
                {userRole === 'teacher' && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => {
                        setEditingTripId(trip.id);
                        setNewTrip({ title: trip.title, desc: trip.desc, image: trip.image, link: trip.link || '' });
                        setIsAddingTrip(true);
                      }}
                      className="p-2 bg-white/80 backdrop-blur-sm text-blue-600 rounded-xl"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => setData({ ...data, trips: data.trips.filter((t: any) => t.id !== trip.id) })}
                      className="p-2 bg-white/80 backdrop-blur-sm text-red-600 rounded-xl"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isAddingTrip && (
              <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 space-y-4">
                <input 
                  type="text" 
                  placeholder="Tên chuyến đi..." 
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                  className="w-full p-2 rounded-xl text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Mô tả..." 
                  value={newTrip.desc}
                  onChange={(e) => setNewTrip({ ...newTrip, desc: e.target.value })}
                  className="w-full p-2 rounded-xl text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Link ảnh..." 
                    value={newTrip.image}
                    onChange={(e) => setNewTrip({ ...newTrip, image: e.target.value })}
                    className="w-full p-2 rounded-xl text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Link chi tiết..." 
                    value={newTrip.link}
                    onChange={(e) => setNewTrip({ ...newTrip, link: e.target.value })}
                    className="w-full p-2 rounded-xl text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddTrip} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold text-sm">
                    {editingTripId ? 'Cập nhật' : 'Lưu'}
                  </button>
                  <button onClick={() => { setIsAddingTrip(false); setEditingTripId(null); }} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin size={20} className="text-emerald-600" /> Địa điểm yêu thích tại Bắc Ninh
            </h3>
            {userRole === 'teacher' && (
              <button onClick={() => setIsAddingLoc(true)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-xl transition-all">
                <Plus size={18} />
              </button>
            )}
          </div>
          <div className="space-y-4">
            {data.locations.map((loc: any) => (
              <div key={loc.id} className="p-4 bg-white rounded-2xl shadow-sm border border-emerald-50 group/loc space-y-2">
                {loc.image && (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{loc.name}</span>
                    {loc.link && (
                      <a href={loc.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {userRole === 'teacher' && (
                    <button onClick={() => setData({ ...data, locations: data.locations.filter((l: any) => l.id !== loc.id) })} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/loc:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isAddingLoc && (
              <div className="p-4 bg-white rounded-2xl border-2 border-emerald-200 space-y-3">
                <input type="text" value={newLoc.name} onChange={(e) => setNewLoc({...newLoc, name: e.target.value})} placeholder="Tên địa điểm..." className="w-full p-2 bg-gray-50 rounded-xl text-sm" />
                <input type="text" value={newLoc.image} onChange={(e) => setNewLoc({...newLoc, image: e.target.value})} placeholder="Link ảnh (tùy chọn)..." className="w-full p-2 bg-gray-50 rounded-xl text-xs" />
                <input type="text" value={newLoc.link} onChange={(e) => setNewLoc({...newLoc, link: e.target.value})} placeholder="Link chi tiết (tùy chọn)..." className="w-full p-2 bg-gray-50 rounded-xl text-xs" />
                <div className="flex gap-2">
                  <button onClick={handleAddLoc} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold text-sm">Lưu</button>
                  <button onClick={() => setIsAddingLoc(false)} className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl font-bold text-sm">Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
