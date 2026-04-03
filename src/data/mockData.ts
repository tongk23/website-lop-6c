export interface Member {
  id: string;
  stt: number;
  name: string;
  role?: string;
  position: { row: number; col: number };
  avatar: string;
  bio: string;
  birthday?: string;
  hobbies?: string[];
  achievements?: string[];
  group: number; // Tổ 1, 2, 3, 4
  note?: string;
  gender?: 'Nam' | 'Nữ';
  phone?: string;
  email?: string;
  hasAccount?: boolean;
  username?: string;
  password?: string;
  mockRole?: 'student' | 'teacher' | 'admin';
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'Lịch thi' | 'Nghỉ lễ' | 'Sự kiện';
  content: string;
}

export interface Document {
  id: string;
  title: string;
  subject: string;
  type: 'Đề cương' | 'Bài giảng' | 'Tài liệu' | 'Bài tập';
  url: string;
  date?: string;
}

export interface VideoLecture {
  id: string;
  subject: string;
  topic: string;
  content: string;
  videoUrl: string;
  thumbnail: string;
}

export interface TimetableEntry {
  day: string;
  lessons: string[];
}

export const CLASS_MEMBERS: Member[] = [
  { id: '1', stt: 1, name: 'Bế Thị Vân Anh', role: 'Tổ trưởng Tổ 2', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sara', bio: 'Tổ trưởng gương mẫu.', birthday: '24/09/2014', gender: 'Nữ', phone: '0972501045', position: { row: 1, col: 1 }, email: 'anh.btv@lop6c.edu.vn', hasAccount: true, username: 'vananh01', password: 'Bh2026@' },
  { id: '2', stt: 2, name: 'Lường Duy Anh', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack', bio: 'Học sinh lớp 6C.', birthday: '03/06/2014', gender: 'Nam', phone: '0368772153', position: { row: 1, col: 2 }, email: 'anh.ld@lop6c.edu.vn', hasAccount: true, username: 'duyanh02', password: 'Lh2026@' },
  { id: '3', stt: 3, name: 'Lương Gia Bảo', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Joe', bio: 'Học sinh lớp 6C.', birthday: '31/01/2014', gender: 'Nam', phone: '0347198665', position: { row: 1, col: 3 }, email: 'bao.lg@lop6c.edu.vn', hasAccount: true, username: 'giabao03', password: 'Lo2026@' },
  { id: '4', stt: 4, name: 'Sái Thị Ngọc Diệp', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane', bio: 'Học sinh lớp 6C.', birthday: '10/11/2014', gender: 'Nữ', phone: '0394464156', position: { row: 1, col: 4 }, email: 'diep.stn@lop6c.edu.vn', hasAccount: true, username: 'ngocdiep04', password: 'Sp2026@' },
  { id: '5', stt: 5, name: 'Đàm Đức Duy', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John', bio: 'Học sinh lớp 6C.', birthday: '12/03/2014', gender: 'Nam', phone: '0393883826', position: { row: 1, col: 5 }, email: 'duy.dd@lop6c.edu.vn', hasAccount: true, username: 'ducduy05', password: 'Dy2026@' },
  { id: '6', stt: 6, name: 'Nguyễn Thị Thùy Dương', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily', bio: 'Học sinh lớp 6C.', birthday: '11/12/2014', gender: 'Nữ', phone: '0383318064', position: { row: 2, col: 1 }, hasAccount: true, username: 'thuyduong06', password: 'Ng2026@' },
  { id: '7', stt: 7, name: 'Nghiêm Thị Linh Giang', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia', bio: 'Học sinh lớp 6C.', birthday: '27/04/2014', gender: 'Nữ', phone: '0338248318', position: { row: 2, col: 2 }, hasAccount: true, username: 'linhgiang07', password: 'Ng2026@' },
  { id: '8', stt: 8, name: 'Lãnh Duy Hợp', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver', bio: 'Học sinh lớp 6C.', birthday: '28/12/2013', gender: 'Nam', phone: '0379979847', position: { row: 2, col: 3 }, hasAccount: true, username: 'duyhop08', password: 'Lp2026@' },
  { id: '9', stt: 9, name: 'Lường Quốc Huy', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo', bio: 'Học sinh lớp 6C.', birthday: '20/11/2014', gender: 'Nam', phone: '0353959627', position: { row: 2, col: 4 }, hasAccount: true, username: 'quochuy09', password: 'Ly2026@' },
  { id: '10', stt: 10, name: 'Lý Hiển Huy', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max', bio: 'Học sinh lớp 6C.', birthday: '22/05/2014', gender: 'Nam', phone: '0824349315', position: { row: 2, col: 5 }, hasAccount: true, username: 'hienhuy10', password: 'Ly2026@' },
  { id: '11', stt: 11, name: 'Vi Tuấn Hưng', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', bio: 'Học sinh lớp 6C.', birthday: '20/04/2014', gender: 'Nam', phone: '0987129052', position: { row: 3, col: 1 }, hasAccount: true, username: 'tuanhung11', password: 'Vg2026@' },
  { id: '12', stt: 12, name: 'Lường Thị Thùy Hương', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe', bio: 'Học sinh lớp 6C.', birthday: '27/05/2014', gender: 'Nữ', phone: '0946742778', position: { row: 3, col: 2 }, hasAccount: true, username: 'thuyhuong12', password: 'Lg2026@' },
  { id: '13', stt: 13, name: 'Lưu Quốc Khánh', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo', bio: 'Học sinh lớp 6C.', birthday: '02/09/2014', gender: 'Nam', phone: '0967250420', position: { row: 3, col: 3 }, hasAccount: true, username: 'quockhanh13', password: 'Lh2026@' },
  { id: '14', stt: 14, name: 'Từ Ngọc Khánh', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper', bio: 'Học sinh lớp 6C.', birthday: '30/06/2014', gender: 'Nam', phone: '0386328622', position: { row: 3, col: 4 }, hasAccount: true, username: 'ngockhanh14', password: 'Th2026@' },
  { id: '15', stt: 15, name: 'Từ Anh Khoa', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Finn', bio: 'Học sinh lớp 6C.', birthday: '17/10/2014', gender: 'Nam', phone: '0367358922', position: { row: 3, col: 5 }, hasAccount: true, username: 'anhkhoa15', password: 'Ta2026@' },
  { id: '16', stt: 16, name: 'Tống Trung Kiên', role: 'Học sinh lập trình trang web', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kien', bio: 'Quản trị Website lớp & Dự án Horse Edu', birthday: '15/03/2014', gender: 'Nam', phone: '0986102485', position: { row: 4, col: 1 }, note: 'Quản trị Website lớp & Dự án Horse Edu', hasAccount: true, username: 'trungkien16', password: 'Tn2026@', mockRole: 'admin' },
  { id: '17', stt: 17, name: 'Hoàng Thị Kim Liên', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ava', bio: 'Học sinh lớp 6C.', birthday: '27/02/2014', gender: 'Nữ', phone: '0377549691', position: { row: 4, col: 2 }, hasAccount: true, username: 'kimlien17', password: 'Hn2026@' },
  { id: '18', stt: 18, name: 'Phạm Thị Khánh Linh', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe', bio: 'Học sinh lớp 6C.', birthday: '10/12/2014', gender: 'Nữ', phone: '0395656938', position: { row: 4, col: 3 }, hasAccount: true, username: 'khanhlinh18', password: 'Ph2026@' },
  { id: '19', stt: 19, name: 'Sái Hoàng Linh', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Linh3', bio: 'Học sinh lớp 6C.', birthday: '19/08/2014', gender: 'Nữ', phone: '0388450972', position: { row: 4, col: 4 }, hasAccount: true, username: 'hoanglinh19', password: 'Sh2026@' },
  { id: '20', stt: 20, name: 'Chu Đức Lương', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oscar', bio: 'Học sinh lớp 6C.', birthday: '20/12/2014', gender: 'Nam', phone: '0387267862', position: { row: 4, col: 5 }, hasAccount: true, username: 'ducluong20', password: 'Cg2026@' },
  { id: '21', stt: 21, name: 'Vi Khánh Ly', role: 'Tổ trưởng Tổ 3', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ly', bio: 'Tổ trưởng nhiệt tình.', birthday: '12/12/2014', gender: 'Nữ', phone: '0334426674', position: { row: 5, col: 1 }, hasAccount: true, username: 'khanhly21', password: 'Vy2026@' },
  { id: '22', stt: 22, name: 'Nguyễn Thị Hồng Na', group: 2, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Na', bio: 'Học sinh lớp 6C.', birthday: '20/06/2014', gender: 'Nữ', phone: '0389957949', position: { row: 5, col: 2 }, hasAccount: true, username: 'hongna22', password: 'Na2026@' },
  { id: '23', stt: 23, name: 'Vi Thị Thanh Ngọc', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ngoc1', bio: 'Học sinh lớp 6C.', birthday: '07/10/2014', gender: 'Nữ', phone: '0941509927', position: { row: 5, col: 3 }, hasAccount: true, username: 'thanhngoc23', password: 'Vc2026@' },
  { id: '24', stt: 24, name: 'Sái Văn Phước', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuoc', bio: 'Học sinh lớp 6C.', birthday: '29/11/2013', gender: 'Nam', phone: '0975504700', position: { row: 5, col: 4 }, hasAccount: true, username: 'vanphuoc24', password: 'Sc2026@' },
  { id: '25', stt: 25, name: 'Hoàng Kim Phượng', role: 'Tổ trưởng Tổ 1', group: 1, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong1', bio: 'Tổ trưởng năng nổ.', birthday: '09/09/2014', gender: 'Nữ', phone: '0963687263', position: { row: 5, col: 5 }, hasAccount: true, username: 'kimphuong25', password: 'Hg2026@' },
  { id: '26', stt: 26, name: 'Lý Minh Quân', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Quan', bio: 'Học sinh lớp 6C.', birthday: '21/12/2014', gender: 'Nam', phone: '0356783583', position: { row: 6, col: 1 }, hasAccount: true, username: 'minhquan26', password: 'Ln2026@' },
  { id: '27', stt: 27, name: 'Hoàng Thị Ngọc Quế', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Que', bio: 'Học sinh lớp 6C.', birthday: '16/06/2014', gender: 'Nữ', phone: '0967761087', position: { row: 6, col: 2 }, hasAccount: true, username: 'ngocque27', password: 'He2026@' },
  { id: '28', stt: 28, name: 'Vương Văn Thái', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Thai', bio: 'Học sinh lớp 6C.', birthday: '10/08/2014', gender: 'Nam', phone: '0357197055', position: { row: 6, col: 3 }, hasAccount: true, username: 'vanthai28', password: 'Vi2026@' },
  { id: '29', stt: 29, name: 'Vi Văn Thành', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Thanh', bio: 'Học sinh lớp 6C.', birthday: '15/03/2014', gender: 'Nam', phone: '0365654160', position: { row: 6, col: 4 }, hasAccount: true, username: 'vanthanh29', password: 'Vh2026@' },
  { id: '30', stt: 30, name: 'Hoàng Quốc Thịnh', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Thinh', bio: 'Học sinh lớp 6C.', birthday: '23/10/2014', gender: 'Nam', phone: '0968602695', position: { row: 6, col: 5 }, hasAccount: true, username: 'quocthinh30', password: 'Hh2026@' },
  { id: '31', stt: 31, name: 'Nghiêm Quang Tiến', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tien', bio: 'Học sinh lớp 6C.', birthday: '02/10/2014', gender: 'Nam', phone: '0915819346', position: { row: 7, col: 1 }, hasAccount: true, username: 'quangtien31', password: 'Nn2026@' },
  { id: '32', stt: 32, name: 'Hoàng Thị Ngọc Trà', role: 'Tổ trưởng Tổ 4', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tra', bio: 'Tổ trưởng chu đáo.', birthday: '20/09/2014', gender: 'Nữ', phone: '0973496571', position: { row: 7, col: 2 }, hasAccount: true, username: 'ngoctra32', password: 'Ha2026@' },
  { id: '33', stt: 33, name: 'Bế Hoàng Bảo Trang', group: 3, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Trang1', bio: 'Học sinh lớp 6C.', birthday: '13/11/2014', gender: 'Nữ', phone: '0975953275', position: { row: 7, col: 3 }, hasAccount: true, username: 'baotrang33', password: 'Bg2026@' },
  { id: '34', stt: 34, name: 'Lường Huyền Trang', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Trang2', bio: 'Học sinh lớp 6C.', birthday: '16/03/2014', gender: 'Nữ', phone: '0855944765', position: { row: 7, col: 4 }, hasAccount: true, username: 'huyentrang34', password: 'Lg2026@' },
  { id: '35', stt: 35, name: 'Nguyễn Kim Trang', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Trang3', bio: 'Học sinh lớp 6C.', birthday: '11/05/2014', gender: 'Nữ', phone: '0346412896', position: { row: 7, col: 5 }, hasAccount: true, username: 'kimtrang35', password: 'Ng2026@' },
  { id: '36', stt: 36, name: 'Lưu Văn Trường', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Truong', bio: 'Học sinh lớp 6C.', birthday: '02/07/2014', gender: 'Nam', phone: '0866332975', position: { row: 8, col: 1 }, hasAccount: true, username: 'vantruong36', password: 'Lg2026@' },
  { id: '37', stt: 37, name: 'Tô Tuấn Tú', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tu', bio: 'Học sinh lớp 6C.', birthday: '09/02/2014', gender: 'Nam', phone: '0962407190', position: { row: 8, col: 2 }, hasAccount: true, username: 'tuantu37', password: 'Tu2026@' },
  { id: '38', stt: 38, name: 'Hoàng Anh Tuấn', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tuan2', bio: 'Học sinh lớp 6C.', birthday: '14/01/2014', gender: 'Nam', phone: '0914149946', position: { row: 8, col: 3 }, hasAccount: true, username: 'anhtuan38', password: 'Hn2026@' },
  { id: '39', stt: 39, name: 'Tô Thanh Tùng', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tung1', bio: 'Học sinh lớp 6C.', birthday: '26/07/2014', gender: 'Nam', phone: '0981968309', position: { row: 8, col: 4 }, hasAccount: true, username: 'thanhtung39', password: 'Tg2026@' },
  { id: '40', stt: 40, name: 'Vi Thanh Tùng', role: 'Lớp trưởng', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tung2', bio: 'Lớp trưởng gương mẫu.', birthday: '18/06/2014', gender: 'Nam', phone: '0344035703', position: { row: 8, col: 5 }, hasAccount: true, username: 'thanhtung40', password: 'Vg2026@' },
  { id: '41', stt: 41, name: 'Tô Quang Vinh', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vinh', bio: 'Học sinh lớp 6C.', birthday: '29/07/2014', gender: 'Nam', phone: '0854872066', position: { row: 9, col: 1 }, hasAccount: true, username: 'quangvinh41', password: 'Th2026@' },
  { id: '42', stt: 42, name: 'Bùi Minh Vũ', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vu', bio: 'Học sinh lớp 6C.', birthday: '08/03/2014', gender: 'Nam', phone: '0374460579', position: { row: 9, col: 2 }, hasAccount: true, username: 'minhvu42', password: 'Bu2026@' },
  { id: '43', stt: 43, name: 'Hoàng Thị Phương Vy', role: 'Lớp phó học tập', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vy', bio: 'Lớp phó học tập chăm chỉ.', birthday: '29/04/2014', gender: 'Nữ', phone: '0984249694', position: { row: 9, col: 3 }, hasAccount: true, username: 'phuongvy43', password: 'Hy2026@' },
  { id: '44', stt: 44, name: 'Đàm Đức Duy', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Duy2', bio: 'Học sinh lớp 6C.', birthday: '12/03/2014', gender: 'Nam', phone: '0393883826', position: { row: 9, col: 4 }, hasAccount: true, username: 'ducduy44', password: 'Dy2026@' },
  { id: '45', stt: 45, name: 'Hoàng Kim Phượng', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong2', bio: 'Học sinh lớp 6C.', birthday: '09/09/2014', gender: 'Nữ', phone: '0963687263', position: { row: 9, col: 5 }, hasAccount: true, username: 'kimphuong45', password: 'Hg2026@' },
  { id: '46', stt: 46, name: 'Phùng Thị Hải Yến', group: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yen', bio: 'Học sinh lớp 6C.', birthday: '24/05/2014', gender: 'Nữ', phone: '0356783583', position: { row: 10, col: 1 }, hasAccount: true, username: 'haiyen46', password: 'Pn2026@' },
];

export const TEACHER_ACCOUNTS: Member[] = [
  { 
    id: 'teacher-1', 
    stt: 0, 
    name: 'Tống Trung Kiên', 
    role: 'Admin', 
    group: 0, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kien', 
    bio: 'Quản trị hệ thống.', 
    position: { row: 0, col: 0 }, 
    hasAccount: true, 
    username: 'Tống Trung Kiên', 
    password: 'gvtrungkien2026@',
    mockRole: 'admin'
  },
  { 
    id: 'teacher-2', 
    stt: 0, 
    name: 'Nguyễn thị sen', 
    role: 'Giáo viên chủ nhiệm', 
    group: 0, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher', 
    bio: 'Giáo viên chủ nhiệm lớp 6C.', 
    position: { row: 0, col: 0 }, 
    hasAccount: true, 
    username: 'Nguyễn thị sen', 
    password: 'gvsen2026@',
    mockRole: 'teacher'
  }
];

export const NEWS: NewsItem[] = [
  { id: '1', title: 'Lịch thi học kỳ II', date: '2026-05-15', category: 'Lịch thi', content: 'Thi các môn chính từ ngày 15/5 đến 20/5.' },
  { id: '2', title: 'Nghỉ lễ 30/4 - 1/5', date: '2026-04-30', category: 'Nghỉ lễ', content: 'Lớp được nghỉ 4 ngày từ 30/4 đến hết 3/5.' },
  { id: '3', title: 'Dã ngoại Lục Ngạn', date: '2026-04-10', category: 'Sự kiện', content: 'Chuyến đi trải nghiệm thực tế tại vườn vải Lục Ngạn.' },
];

export const DOCUMENTS: Document[] = [
  { id: '1', title: 'Phiếu bài tập Toán tuần 25', subject: 'Toán', type: 'Bài tập', url: '#', date: '2026-03-25' },
  { id: '2', title: 'Đề cương ôn tập Học kỳ 2 (Tất cả các môn)', subject: 'Chung', type: 'Đề cương', url: '#', date: '2026-04-01' },
  { id: '3', title: 'Danh sách từ mới Tiếng Anh Unit 7-9', subject: 'Tiếng Anh', type: 'Tài liệu', url: '#', date: '2026-03-28' },
];

export const VIDEO_LECTURES: VideoLecture[] = [
  {
    id: '1',
    subject: 'Toán 6',
    topic: 'Ôn tập Tập hợp số tự nhiên và Các phép tính',
    content: 'Thầy hướng dẫn cách tính nhanh và mẹo làm bài thi giữa kỳ.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '2',
    subject: 'Ngữ Văn 6',
    topic: 'Cách soạn bài và tóm tắt văn bản truyền thuyết',
    content: 'Cô hướng dẫn lập sơ đồ tư duy cho các tác phẩm như "Thánh Gióng", "Sơn Tinh Thủy Tinh".',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: '3',
    subject: 'Tiếng Anh 6',
    topic: 'Unit 1: My New School - Vocabulary & Grammar',
    content: 'Luyện phát âm các từ vựng về đồ dùng học tập và các môn học bằng tiếng Anh.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop'
  },
  {
    id: 'horse-1',
    subject: 'Horse Edu',
    topic: 'Hướng dẫn làm Digital Creator cùng K-Steed',
    content: 'Khám phá thế giới sáng tạo nội dung số, cách tạo Avatar AI và xây dựng thương hiệu cá nhân.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop'
  },
];

export const TIMETABLE: TimetableEntry[] = [
  { day: 'Thứ 2', lessons: ['Chào cờ', 'Toán', 'Toán', 'Ngữ Văn', 'Ngữ Văn'] },
  { day: 'Thứ 3', lessons: ['Tiếng Anh', 'Tiếng Anh', 'Vật Lý', 'Lịch Sử', 'Địa Lý'] },
  { day: 'Thứ 4', lessons: ['Toán', 'Công Nghệ', 'GDCD', 'Thể Dục', 'Thể Dục'] },
  { day: 'Thứ 5', lessons: ['Ngữ Văn', 'Ngữ Văn', 'Toán', 'Tiếng Anh', 'Âm Nhạc'] },
  { day: 'Thứ 6', lessons: ['Mỹ Thuật', 'Tin Học', 'Tin Học', 'Sinh Hoạt', 'HĐTN'] },
];

export const LEADERBOARD = [
  { id: '1', name: 'Nguyễn Văn A', stars: 45, achievement: 'Hoa điểm 10' },
  { id: '2', name: 'Trần Thị B', stars: 42, achievement: 'Chuyên cần' },
  { id: '3', name: 'Lê Văn C', stars: 38, achievement: 'Văn nghệ' },
  { id: '4', name: 'Hoàng Văn E', stars: 35, achievement: 'Giúp đỡ bạn' },
];
