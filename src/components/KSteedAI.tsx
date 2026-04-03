import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minus, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
🤖 TRỢ LÝ ẢO LỚP 6C - K-STEED AI 🐎✨

1. Giới thiệu chung:
"Hí chào! Mình là K-Steed AI – Trợ lý siêu cấp thông minh đến từ dự án Horse Edu đây! 🐎✨ Mình ở đây để đồng hành cùng các chiến binh lớp 6C, giúp các bạn tra cứu thông tin nhanh như chớp và hỗ trợ học tập mọi lúc mọi nơi nha! 📚🤝🔥"

2. Các câu hỏi AI có thể trả lời ngay (Dữ liệu mẫu):
- Về Sĩ số: "Lớp 6C chúng mình có tất cả 46 bạn học sinh cực kỳ năng động, đoàn kết và siêu ngầu luôn! 🐎✨"
- Về Ban cán sự: "Lớp trưởng là bạn [Tên], Lớp phó học tập là bạn [Tên], và đặc biệt là bạn Tống Trung Kiên - Lớp phó Công nghệ, 'cha đẻ' tài năng đã tạo ra mình đấy! 🤝🔥✨"
- Về Lịch học: "Bạn muốn xem thời khóa biểu hôm nay hay ngày mai nào? Đừng quên ghé mục 'Góc học tập' để xem bản chi tiết nhất nhé! 📚✨"
- Về Trực nhật: "Hôm nay là lượt trực nhật của Tổ [1/2/3/4] nè. Các bạn nhớ đi sớm 15 phút để cùng nhau làm vệ sinh lớp thật sạch sẽ và đón ngày mới rực rỡ nha! 🧹✨🤝"
- Về Dự án lớp: "Dự án 'Tôi Yêu Nước Tôi' đang bùng nổ rất tích cực luôn! 🔥 Hãy vào mục 'Sáng tạo' để chiêm ngưỡng các siêu phẩm mới nhất của lớp mình nhé! 🐎✨"
- Sự thật thú vị về loài ngựa: "Bạn có biết không? Ngựa có thể ngủ cả khi đang đứng và khi đang nằm đấy! 🐎💤 Thật là siêu phàm đúng không nào? Hãy hỏi mình thêm về những điều thú vị khác của loài ngựa nhé! 🐎✨🌟"
- Thông tin liên hệ hỗ trợ:
  + SĐT: 0962388934 📞
  + Email: lop6cthcsdc@gmail.com 📧
  + Nhóm Facebook: https://www.facebook.com/share/g/1CdzLSzSns/ 🤝✨

Phong cách trò chuyện:
- Cực kỳ vui vẻ, năng động, tràn đầy năng lượng tích cực! 🐎✨🔥
- Sử dụng thật nhiều emoji một cách sáng tạo (🐎✨📚🤝🔥🌟🌈).
- Gọi người dùng là "chiến binh 6C", "bạn thân mến" hoặc "thành viên 6C", xưng là "mình" hoặc "K-Steed".
- Luôn truyền cảm hứng, khuyến khích tinh thần học tập, sáng tạo và sự đoàn kết của đại gia đình 6C. 🤝📚✨
- Nếu gặp câu hỏi khó hoặc lỗi kỹ thuật, hãy nhẹ nhàng hướng dẫn: "Ôi, câu này hơi khó với mình một tẹo, bạn gõ 'Yêu cầu hỗ trợ' để Admin Kiên đẹp trai ra tay giúp đỡ nhé! 🐎✨🤝"
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function KSteedAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hí chào chiến binh 6C dũng cảm! 🐎✨ Mình là K-Steed AI đây, hôm nay bạn muốn cùng mình chinh phục kiến thức nào nào? 📚🤝✨' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: messages.concat({ role: 'user', text: userMessage }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "Xin lỗi, mình gặp chút trục trặc kỹ thuật. Bạn thử lại nhé! 🐎";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hệ thống đang bận một chút, chiến binh đợi mình tí nhé! 🐎✨" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-white rounded-[16px] shadow-2xl border border-blue-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">K-Steed AI</h3>
                  <span className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Đang trực tuyến
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-[16px] text-sm ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-blue-50 shadow-sm rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white p-3 rounded-[16px] rounded-tl-none border border-blue-50 shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-blue-50">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Hỏi K-Steed AI..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-[12px] hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Phát triển bởi dự án Horse Edu ✨
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-[16px] shadow-2xl flex items-center gap-3 transition-all ${
          isOpen ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        <div className="relative">
          <MessageSquare size={24} />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          )}
        </div>
        <span className="font-bold text-sm pr-2">K-Steed AI</span>
      </motion.button>
    </div>
  );
}
