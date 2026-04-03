import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import KSteedAI from './components/KSteedAI';
import Home from './pages/Home';
import ClassMembers from './pages/ClassMembers';
import StudyHub from './pages/StudyHub';
import Gallery from './pages/Gallery';
import Forum from './pages/Forum';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import Support from './pages/Support';
import LMS from './pages/LMS';
import { Lock } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="bg-blue-50 p-6 rounded-full text-blue-600">
          <Lock size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Khu vực hạn chế</h2>
          <p className="text-gray-500 max-w-md">Vui lòng đăng nhập để truy cập tính năng này và tham gia cùng tập thể lớp 6C.</p>
        </div>
        <button 
          onClick={() => {
            // This is a bit tricky since Navbar handles the modal. 
            // I'll just suggest they use the login button in the navbar.
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <KSteedAI />
          <main className="max-w-7xl mx-auto px-6 pt-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/members" element={<ClassMembers />} />
              <Route path="/study" element={<ProtectedRoute><StudyHub /></ProtectedRoute>} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/community" element={<Community />} />
              <Route path="/support" element={<Support />} />
              <Route path="/lms/:lessonId" element={<ProtectedRoute><LMS /></ProtectedRoute>} />
            </Routes>
          </main>
          
          <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 text-white p-2 rounded-xl">
                  <span className="font-black">6C</span>
                </div>
                <span className="font-bold text-gray-500">© 2026 Tập thể lớp 6C. Mọi quyền được bảo lưu. <span className="text-blue-400/50 ml-2">by lamkstudy</span></span>
              </div>
              <div className="flex gap-8 text-sm font-bold text-gray-400">
                <Link to="/support" className="hover:text-blue-600 transition-colors">Hỗ trợ</Link>
                <a href="#" className="hover:text-blue-600 transition-colors">Nội quy lớp</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ GVCN</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Báo lỗi</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
