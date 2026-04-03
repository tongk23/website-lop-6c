import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Image, MessageSquare, Trophy, Menu, X, LogIn, UserCheck, LogOut, User, Lock, Mail, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    grade: '6'
  });
  const [error, setError] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const { userRole, user, login, register, loginWithGoogle, loginWithFacebook, logout, updateUserRole } = useAuth();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const navItems = [
    { path: '/', label: 'Trang Chủ', icon: Home },
    { path: '/members', label: 'Thành Viên', icon: Users },
    { path: '/study', label: 'Học Tập', icon: BookOpen },
    { path: '/gallery', label: 'Kỷ Niệm', icon: Image },
    { path: '/forum', label: 'Diễn Đàn', icon: MessageSquare },
    { path: '/leaderboard', label: 'Thi Đua', icon: Trophy },
    { path: '/community', label: 'Cộng Đồng', icon: Sparkles },
    { path: '/support', label: 'Hỗ Trợ', icon: HelpCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.role, formData.fullName, formData.role === 'student' ? formData.grade : undefined);
      } else {
        await login(formData.email, formData.password);
      }
      setShowLoginModal(false);
      setFormData({ email: '', password: '', fullName: '', role: 'student', grade: '6' });
    } catch (err: any) {
      let message = err.message;
      switch (err.code) {
        case 'auth/email-already-in-use':
          message = 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.';
          break;
        case 'auth/invalid-email':
          message = 'Địa chỉ email không hợp lệ.';
          break;
        case 'auth/weak-password':
          message = 'Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Email hoặc mật khẩu không chính xác.';
          break;
        case 'auth/too-many-requests':
          message = 'Quá nhiều yêu cầu thất bại. Vui lòng thử lại sau ít phút.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Phương thức đăng ký bằng Email/Mật khẩu chưa được kích hoạt trong Firebase Console. Vui lòng liên hệ quản trị viên hoặc sử dụng Đăng nhập bằng Google.';
          break;
        case 'auth/network-request-failed':
          message = 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.';
          break;
      }
      setError(message);
    }
  };

  return (
    <nav className="sticky top-6 z-50 px-6">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/5 rounded-[32px] px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 text-white p-2 rounded-2xl group-hover:rotate-12 transition-transform">
              <Trophy size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">LỚP 6C</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            
            <div className="w-px h-8 bg-gray-200 mx-2" />

            {userRole ? (
              <div className="flex items-center gap-3 pl-2 relative">
                <button 
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    userRole === 'admin' ? 'bg-red-100 text-red-600' :
                    userRole === 'teacher' ? 'bg-purple-100 text-purple-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}
                  title="Đổi vai trò"
                >
                  {userRole === 'admin' ? <ShieldCheck size={18} /> :
                   userRole === 'teacher' ? <UserCheck size={18} /> : 
                   <BookOpen size={18} />}
                </button>

                <AnimatePresence>
                  {showRoleSwitcher && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden"
                    >
                      <div className="text-[10px] text-gray-400 font-bold uppercase px-3 py-2">Chọn vai trò</div>
                      {[
                        { id: 'student', label: 'Học Sinh', icon: BookOpen, color: 'text-blue-600', bg: 'hover:bg-blue-50' },
                        { id: 'teacher', label: 'Giáo Viên', icon: UserCheck, color: 'text-purple-600', bg: 'hover:bg-purple-50' },
                        { id: 'admin', label: 'Quản Trị Viên', icon: ShieldCheck, color: 'text-red-600', bg: 'hover:bg-red-50' }
                      ].map((role) => (
                        <button
                          key={role.id}
                          onClick={async () => {
                            await updateUserRole(role.id as any);
                            setShowRoleSwitcher(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${role.bg} ${
                            userRole === role.id ? role.color : 'text-gray-500'
                          }`}
                        >
                          <role.icon size={16} />
                          {role.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="hidden xl:block">
                  <div className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-0.5">
                    {userRole === 'admin' ? 'Quản trị viên' : userRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                  </div>
                  <div className="text-sm font-bold text-gray-900 leading-none">{user?.fullName || 'Người dùng'}</div>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
              >
                <LogIn size={18} /> Đăng Nhập
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {userRole && (
              <button 
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className={`p-2 rounded-xl ${
                  userRole === 'admin' ? 'bg-red-100 text-red-600' :
                  userRole === 'teacher' ? 'bg-purple-100 text-purple-600' : 
                  'bg-blue-100 text-blue-600'
                }`}
              >
                {userRole === 'admin' ? <ShieldCheck size={20} /> :
                 userRole === 'teacher' ? <UserCheck size={20} /> : 
                 <BookOpen size={20} />}
              </button>
            )}
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 bg-white rounded-[32px] shadow-2xl border border-gray-100 p-6 lg:hidden"
          >
            {userRole && (
              <div className="mb-6 space-y-2">
                <div className="text-[10px] text-gray-400 font-bold uppercase px-3 mb-1">Đổi vai trò</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Học Sinh', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { id: 'teacher', label: 'Giáo Viên', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={async () => {
                        await updateUserRole(role.id as any);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-[10px] font-bold transition-all ${
                        userRole === role.id ? `${role.bg} ${role.color}` : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <role.icon size={18} />
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-bold transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </Link>
              ))}
            </div>
            {userRole ? (
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={20} /> Đăng Xuất
              </button>
            ) : (
              <button 
                onClick={() => { setShowLoginModal(true); setIsOpen(false); }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
              >
                <LogIn size={20} /> Đăng Nhập
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold tracking-tight">{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</h2>
                <p className="text-gray-400 font-medium">
                  {isRegister ? 'Tạo tài khoản mới để tham gia lớp học' : 'chào mừng bạn đăng nhập'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                  <>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Họ và tên"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          formData.role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Học Sinh
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'teacher' })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          formData.role === 'teacher' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Giáo Viên
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          formData.role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Admin
                      </button>
                    </div>

                    {formData.role === 'student' && (
                      <div className="flex items-center gap-3 px-2">
                        <span className="text-lg font-bold text-gray-400 italic">Lớp</span>
                        <div className="flex gap-2 flex-1 justify-between">
                          {['6', '7', '8', '9'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setFormData({ ...formData, grade: g })}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                formData.grade === g 
                                  ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Email hoặc Tài khoản"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                >
                  {isRegister ? 'Đăng Ký Ngay' : 'Đăng Nhập'}
                </button>
              </form>

              {!isRegister && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-6">
                    <button 
                      disabled={isSocialLoading}
                      onClick={async () => {
                        try {
                          setIsSocialLoading(true);
                          setError('');
                          await loginWithGoogle();
                          setShowLoginModal(false);
                        } catch (err: any) {
                          if (err.code === 'auth/cancelled-popup-request') {
                            setError('Yêu cầu đăng nhập đã bị hủy hoặc đang có một cửa sổ khác đang mở. Vui lòng thử lại.');
                          } else if (err.code === 'auth/popup-closed-by-user') {
                            setError('Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.');
                          } else {
                            setError(err.message);
                          }
                        } finally {
                          setIsSocialLoading(false);
                        }
                      }}
                      className={`p-3 rounded-full border border-gray-100 transition-all hover:scale-110 ${isSocialLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-8 h-8" />
                    </button>
                    <button 
                      disabled={isSocialLoading}
                      onClick={async () => {
                        try {
                          setIsSocialLoading(true);
                          setError('');
                          await loginWithFacebook();
                          setShowLoginModal(false);
                        } catch (err: any) {
                          if (err.code === 'auth/cancelled-popup-request') {
                            setError('Yêu cầu đăng nhập đã bị hủy hoặc đang có một cửa sổ khác đang mở. Vui lòng thử lại.');
                          } else if (err.code === 'auth/popup-closed-by-user') {
                            setError('Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.');
                          } else {
                            setError(err.message);
                          }
                        } finally {
                          setIsSocialLoading(false);
                        }
                      }}
                      className={`p-3 rounded-full border border-gray-100 transition-all hover:scale-110 ${isSocialLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="w-8 h-8" />
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setIsRegister(true)}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      Chưa có tài khoản? Đăng ký ngay
                    </button>
                  </div>
                </div>
              )}

              {isRegister && (
                <div className="text-center">
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    Đã có tài khoản? Đăng nhập
                  </button>
                </div>
              )}

              <div className="text-center">
                <button 
                  onClick={() => { setShowLoginModal(false); setIsRegister(false); setError(''); }}
                  className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
