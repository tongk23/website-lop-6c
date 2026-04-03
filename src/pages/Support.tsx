import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Làm thế nào để đăng ký tài khoản?",
    answer: "Bạn có thể tự đăng ký bằng cách nhấn nút 'Đăng Nhập' trên thanh menu, sau đó chọn 'Đăng ký ngay'. Ngoài ra, giáo viên chủ nhiệm cũng có thể cấp tài khoản trực tiếp cho bạn."
  },
  {
    question: "Tôi quên mật khẩu thì phải làm sao?",
    answer: "Hiện tại hệ thống chưa có tính năng tự khôi phục mật khẩu. Bạn vui lòng liên hệ trực tiếp với Lớp phó Công nghệ hoặc Giáo viên chủ nhiệm để được cấp lại mật khẩu mới."
  },
  {
    question: "Làm sao để đăng bài viết lên Diễn đàn?",
    answer: "Bạn cần đăng nhập vào tài khoản học sinh của mình. Sau đó vào mục 'Diễn Đàn' và nhấn nút 'Viết bài mới' để chia sẻ ý kiến hoặc câu hỏi của mình."
  },
  {
    question: "Tại sao tôi không xem được tài liệu trong mục Học Tập?",
    answer: "Mục Học Tập là khu vực hạn chế, chỉ dành riêng cho thành viên lớp 6C đã đăng nhập. Nếu bạn đã đăng nhập mà vẫn không xem được, hãy báo lỗi cho quản trị viên."
  },
  {
    question: "Làm thế nào để thay đổi thông tin cá nhân?",
    answer: "Bạn có thể liên hệ với Lớp phó Công nghệ để cập nhật họ tên, ảnh đại diện hoặc các thông tin cá nhân khác trên trang Thành viên."
  }
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'technical',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: 'technical', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4"
        >
          <HelpCircle size={48} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight text-gray-900">Trung Tâm Hỗ Trợ</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Chào mừng bạn đến với trang hỗ trợ của lớp 6C. Chúng mình luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Cards */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-lg">Điện thoại</h3>
          <p className="text-sm text-gray-500">Liên hệ trực tiếp với GVCN hoặc Ban cán sự lớp.</p>
          <p className="font-bold text-blue-600">0962388934</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-lg">Email</h3>
          <p className="text-sm text-gray-500">Gửi phản hồi chi tiết qua hòm thư điện tử của lớp.</p>
          <p className="font-bold text-blue-600">lop6cthcsdc@gmail.com</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <MessageCircle size={24} />
          </div>
          <h3 className="font-bold text-lg">Trực tuyến</h3>
          <p className="text-sm text-gray-500">Tham gia trao đổi tại nhóm Facebook của lớp.</p>
          <a 
            href="https://www.facebook.com/share/g/1CdzLSzSns/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:underline block"
          >
            Nhóm FB Lớp 6C
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-3xl font-bold">Câu hỏi thường gặp</h2>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900">{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-6 bg-blue-50 rounded-3xl flex items-start gap-4">
            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-sm text-blue-800 leading-relaxed">
              Nếu bạn không tìm thấy câu trả lời cho thắc mắc của mình, vui lòng gửi yêu cầu hỗ trợ qua biểu mẫu bên cạnh hoặc liên hệ trực tiếp với chúng mình.
            </p>
          </div>
        </section>

        {/* Support Form */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Send size={24} />
            </div>
            <h2 className="text-3xl font-bold">Gửi yêu cầu hỗ trợ</h2>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-500/5">
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Đã gửi thành công!</h3>
                <p className="text-gray-500">Cảm ơn bạn đã gửi phản hồi. Chúng mình sẽ phản hồi lại sớm nhất có thể.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="text-blue-600 font-bold hover:underline pt-4"
                >
                  Gửi thêm yêu cầu khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Họ và tên</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nhập tên của bạn..."
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 ml-1">Email liên hệ</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Vấn đề cần hỗ trợ</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="technical">Lỗi kỹ thuật / Website</option>
                    <option value="account">Vấn đề tài khoản / Mật khẩu</option>
                    <option value="study">Thắc mắc về học tập</option>
                    <option value="other">Góp ý / Vấn đề khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Nội dung chi tiết</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                  />
                </div>

                <button 
                  disabled={formStatus === 'submitting'}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                >
                  {formStatus === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} /> Gửi yêu cầu
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Tutorial Section */}
      <section className="bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
              <BookOpen size={16} /> Hướng dẫn sử dụng
            </div>
            <h2 className="text-4xl font-bold">Bạn mới tham gia lớp học trực tuyến?</h2>
            <p className="text-gray-400 text-lg">
              Đừng lo lắng, chúng mình đã chuẩn bị sẵn các bộ tài liệu và video hướng dẫn chi tiết để bạn có thể làm quen với website nhanh nhất.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all">
                Xem hướng dẫn
              </button>
              <button className="bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-700 transition-all border border-gray-700">
                Video giới thiệu
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                <div className="text-blue-500 font-bold mb-1">01</div>
                <div className="font-bold">Đăng nhập tài khoản</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                <div className="text-blue-500 font-bold mb-1">02</div>
                <div className="font-bold">Xem thời khóa biểu</div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                <div className="text-blue-500 font-bold mb-1">03</div>
                <div className="font-bold">Nộp bài tập online</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700">
                <div className="text-blue-500 font-bold mb-1">04</div>
                <div className="font-bold">Tham gia diễn đàn</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>
    </div>
  );
}
