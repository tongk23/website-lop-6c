import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, Play, Maximize2, Plus, X, Upload, Film, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Album {
  id: number;
  title: string;
  count: number;
  image: string;
}

interface MemoryVideo {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  author: string;
}

export default function Gallery() {
  const { userRole, user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([
    { id: 1, title: 'Lễ Khai Giảng', count: 24, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'Hội Khỏe Phù Đổng', count: 18, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop' },
    { id: 3, title: 'Dã Ngoại Lục Ngạn', count: 42, image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070&auto=format&fit=crop' },
  ]);

  const [videos, setVideos] = useState<MemoryVideo[]>([
    { id: 1, title: 'Clip vui nhộn giờ ra chơi', duration: '0:45', thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop', author: 'Ban truyền thông lớp' },
    { id: 2, title: 'Tập văn nghệ 20/11', duration: '1:20', thumbnail: 'https://images.unsplash.com/photo-1514525253344-485683fb13d4?q=80&w=2066&auto=format&fit=crop', author: 'Ban truyền thông lớp' },
  ]);

  const [playingVideo, setPlayingVideo] = useState<MemoryVideo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [newTitle, setNewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('Tệp quá lớn. Vui lòng chọn tệp dưới 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.onerror = () => {
      setUploadError('Không thể đọc tệp. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !previewUrl) {
      setUploadError('Vui lòng nhập tiêu đề và chọn tệp.');
      return;
    }

    try {
      if (uploadType === 'image') {
        const newAlbum: Album = {
          id: Date.now(),
          title: newTitle,
          count: 1,
          image: previewUrl
        };
        setAlbums([newAlbum, ...albums]);
      } else {
        const newVideo: MemoryVideo = {
          id: Date.now(),
          title: newTitle,
          duration: '0:00',
          thumbnail: previewUrl,
          author: user?.fullName || 'Thành viên lớp'
        };
        setVideos([newVideo, ...videos]);
      }

      // Reset
      setShowUploadModal(false);
      setNewTitle('');
      setPreviewUrl(null);
      setUploadError(null);
    } catch (err) {
      setUploadError('Đã xảy ra lỗi khi tải lên. Vui lòng thử lại.');
    }
  };

  const handleShare = (video: MemoryVideo) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Xem video kỷ niệm: ${video.title} của lớp 6C`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Thư Viện Ảnh & Video</h1>
        <p className="text-gray-600 text-lg">Lưu giữ những khoảnh khắc đáng nhớ nhất của tập thể 6C.</p>
        
        {userRole && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Đăng kỷ niệm mới
          </button>
        )}
      </header>

      {/* Album Ảnh */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ImageIcon className="text-pink-600" /> Album Sự Kiện
        </h2>
        
        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {albums.map((album) => (
              <motion.div 
                key={album.id}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-lg mb-4">
                  <img 
                    src={album.image} 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-bold shadow-sm">
                    {album.count} ảnh
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 px-2">{album.title}</h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[40px] p-12 text-center border-2 border-dashed border-gray-200">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Chưa có album ảnh nào được đăng tải.</p>
          </div>
        )}
      </section>

      {/* Video Ngắn */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Video className="text-red-600" /> Video Kỷ Niệm
        </h2>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <motion.div 
                key={video.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPlayingVideo(video)}
                className="bg-white p-4 rounded-[40px] shadow-sm border border-gray-100 group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[32px] overflow-hidden mb-4">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-full text-red-600 shadow-xl transform transition-transform group-hover:scale-110">
                      <Play size={28} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold">
                    {video.duration}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(video);
                    }}
                    className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
                <div className="flex items-start justify-between px-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-gray-500 text-sm">Đăng bởi: {video.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[40px] p-12 text-center border-2 border-dashed border-gray-200">
            <Video size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Chưa có video kỷ niệm nào được đăng tải.</p>
          </div>
        )}
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlayingVideo(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setPlayingVideo(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md"
              >
                <X size={24} />
              </button>
              
              <div className="aspect-video bg-black">
                <video 
                  src={playingVideo.thumbnail} 
                  controls 
                  autoPlay 
                  className="w-full h-full"
                />
              </div>
              
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{playingVideo.title}</h2>
                  <p className="text-gray-500">Đăng bởi: {playingVideo.author}</p>
                </div>
                <button 
                  onClick={() => handleShare(playingVideo)}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
                >
                  <Share2 size={20} /> Chia sẻ video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Đăng kỷ niệm mới</h2>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-2xl">
                  <button 
                    onClick={() => setUploadType('image')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ImageIcon size={18} /> Ảnh / Album
                  </button>
                  <button 
                    onClick={() => setUploadType('video')}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      uploadType === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Film size={18} /> Video
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {uploadError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium"
                    >
                      {uploadError}
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Tiêu đề kỷ niệm</label>
                    <input 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ví dụ: Dã ngoại cuối học kỳ..."
                      className="w-full p-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Tệp đính kèm</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden relative"
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="text-gray-300 mb-2" size={32} />
                          <p className="text-sm text-gray-400">Bấm để chọn {uploadType === 'image' ? 'ảnh' : 'video'}</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!newTitle || !previewUrl}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                  >
                    Đăng ngay
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
