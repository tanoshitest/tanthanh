import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  GraduationCap, 
  ArrowLeft, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Download, 
  Lock, 
  ChevronRight, 
  Shield, 
  Users, 
  BookOpen,
  Star,
  Zap,
  CheckCircle,
  Eye,
  MoreVertical,
  Clock
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Role } from "@/lib/types";

// ── Mock Documents Data ──────────────────────────────────────────────────
const DOCUMENTS = [
  { id: "d1", title: "Đề thi thử Văn THPT QG 2024 - Đợt 1", subject: "Văn", grade: 12, type: "PDF", isPublic: true, downloads: 4213, date: "2024-03-15", author: "Trần Thị Mai" },
  { id: "d2", title: "Bộ đề luyện tập Toán 9 - Tuyển tập 2023", subject: "Toán", grade: 9, type: "PDF", isPublic: true, downloads: 3890, date: "2023-10-20", author: "Lê Hoàng Nam" },
  { id: "d3", title: "Video bài giảng: Phân tích Lặng lẽ Sa Pa", subject: "Văn", grade: 9, type: "Video", isPublic: true, downloads: 2567, date: "2024-01-12", author: "Trần Thị Mai" },
  { id: "d4", title: "Công thức Vật lý 12 - Tóm tắt toàn bộ chương trình", subject: "Vật lý", grade: 12, type: "PDF", isPublic: true, downloads: 5102, date: "2024-02-05", author: "Ngô Thanh Hà" },
  { id: "d5", title: "Giải chi tiết đề minh họa Toán THPT 2024", subject: "Toán", grade: 12, type: "Video", isPublic: true, downloads: 3218, date: "2024-03-10", author: "Lê Hoàng Nam" },
  { id: "d6", title: "IELTS Writing Task 2 - 50 mẫu band 7.5+", subject: "Anh", grade: "Học sinh", type: "PDF", isPublic: true, downloads: 6044, date: "2023-12-18", author: "Phạm Minh Tú" },
  
  // Private Documents
  { id: "d7", title: "Đề thi thử Văn 9 chuyên biệt - Mẫu Độc Quyền", subject: "Văn", grade: 9, type: "PDF", isPublic: false, downloads: 120, date: "2024-04-01", author: "Trần Thị Mai" },
  { id: "d8", title: "Tài liệu chuyên sau: Hình học không gian 12", subject: "Toán", grade: 12, type: "PDF", isPublic: false, downloads: 85, date: "2024-03-25", author: "Lê Hoàng Nam" },
  { id: "d9", title: "Video nội bộ: Bí quyết bứt phá điểm 9 môn Anh", subject: "Anh", grade: "Lớp Chuyên", type: "Video", isPublic: false, downloads: 42, date: "2024-03-20", author: "Phạm Minh Tú" },
  { id: "d10", title: "Tài liệu nội bộ: Kỹ thuật viết NLXH chuyên sâu", subject: "Văn", grade: 9, type: "PDF", isPublic: false, downloads: 64, date: "2024-04-05", author: "Trần Thị Mai" },
  { id: "d11", title: "Bộ đề luyện thi đặc biệt: 10 đề then chốt Toán 9", subject: "Toán", grade: 9, type: "PDF", isPublic: false, downloads: 92, date: "2024-04-02", author: "Lê Hoàng Nam" },
  { id: "d12", title: "Cẩm nang ôn thi vào 10: Toàn bộ bí kíp Văn", subject: "Văn", grade: 9, type: "PDF", isPublic: false, downloads: 110, date: "2024-03-30", author: "Trần Thị Mai" },
];

const CATEGORIES = ["Tất cả", "Sách giáo trình", "Đề thi thử", "Bài giảng Video", "Tài liệu chuyên sâu"];
const GRADES = ["Mọi khối lớp", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 12"];

const ROLE_OPTIONS = [
  { role: "admin" as Role, label: "Admin", sub: "Quản lý hệ thống", icon: Shield, color: "from-indigo-500 to-violet-600" },
  { role: "teacher" as Role, label: "Giáo viên", sub: "Giảng dạy & chấm điểm", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
  { role: "parent" as Role, label: "Phụ huynh & Học sinh", sub: "Theo dõi học tập", icon: Users, color: "from-orange-500 to-amber-500" },
];

export default function PublicLibraryPage() {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedGrade, setSelectedGrade] = useState("Mọi khối lớp");
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "Mọi khối lớp" || doc.grade.toString() === selectedGrade.replace("Lớp ", "");
    // Simplistic category filter
    const matchesCategory = selectedCategory === "Tất cả" || 
                            (selectedCategory === "Đề thi thử" && doc.title.includes("Đề thi")) ||
                            (selectedCategory === "Bài giảng Video" && doc.type === "Video") ||
                            (selectedCategory === "Tài liệu chuyên sâu" && !doc.isPublic);
    
    return matchesSearch && matchesGrade && matchesCategory;
  });

  const handleLogin = (role: Role) => {
    setRole(role);
    const paths: Record<Role, string> = { admin: "/admin", teacher: "/teacher/classes", parent: "/parent" };
    navigate(paths[role]);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-sm shadow-black/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block leading-none">Trung tâm</span>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">Tanthanh Edu</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Về chúng tôi</Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Khoá học</Link>
            <Link to="/library" className="px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl">Tài liệu</Link>
            <Link to="/community" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Cộng đồng</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Liên hệ</Link>
          </nav>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
            >
              Đăng nhập <ChevronRight className={`h-4 w-4 transition-transform ${loginOpen ? "rotate-90" : ""}`} />
            </button>

            {loginOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLoginOpen(false)} />
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-4 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 pb-1 text-center">Đăng nhập tài khoản</p>
                  {ROLE_OPTIONS.map(r => (
                    <button key={r.role} onClick={() => handleLogin(r.role)} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group text-left border border-transparent hover:border-slate-100">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0 shadow-sm`}>
                        <r.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{r.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{r.sub}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-indigo-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO / TITLE ──────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4" /> Về trang chủ
            </Link>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Kho tài liệu <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">miễn phí</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              Hơn <strong>500+</strong> đề thi, bài giảng và video hướng dẫn được cập nhật từ các giáo viên giàu kinh nghiệm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input 
                  className="w-full pl-12 pr-4 h-14 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-slate-600"
                  placeholder="Tìm kiếm tài liệu học tập..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="h-14 px-8 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all w-full sm:w-auto">
                Khám phá ngay
              </button>
            </div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-8 sticky top-24">
             {/* Grade Filter */}
             <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Khối lớp</h3>
              <div className="flex flex-wrap gap-2">
                {GRADES.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setSelectedGrade(g)}
                    className={`px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all ${selectedGrade === g ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 text-slate-600 border border-slate-100 hover:border-indigo-100"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Danh mục</h3>
              <div className="space-y-2">
                {CATEGORIES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-between group ${selectedCategory === c ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:border-indigo-100"}`}
                  >
                    {c}
                    <ChevronRight className={`h-4 w-4 ${selectedCategory === c ? "text-white/60" : "text-slate-300 group-hover:text-indigo-400"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-slate-900 rounded-[32px] p-6 text-white text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-6 border border-white/5">
                <Star className="h-3 w-3 fill-indigo-300" /> Thành tựu
              </div>
              <p className="text-3xl font-black mb-1">50k+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Lượt tải về hàng tháng</p>
              <div className="w-full h-px bg-white/10 mb-6" />
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Bạn có tài liệu muốn chia sẻ? <br /><button className="text-indigo-400 hover:text-indigo-300">Gửi ngay cho chúng tôi</button></p>
            </div>
          </aside>

          {/* Main List */}
          <main className="flex-1">
            <div className="mb-8 flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900">
                Tìm thấy <span className="text-indigo-600">{filteredDocs.length}</span> tài liệu
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Sắp xếp:</span>
                <select className="bg-transparent text-xs font-black text-slate-700 focus:outline-none">
                  <option>Mới nhất</option>
                  <option>Tải nhiều nhất</option>
                  <option>Tên A-Z</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocs.map(doc => {
                 const isVideo = doc.type === "Video";
                 const Icon = isVideo ? Video : FileText;

                 return (
                   <div key={doc.id} className="bg-white rounded-[32px] border border-slate-100 p-6 hover:shadow-2xl hover:border-indigo-100 transition-all flex flex-col group relative overflow-hidden">
                     {/* Overlay for Private */}
                     {!doc.isPublic && (
                       <div className="absolute right-4 top-4 z-10">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <Lock className="h-3 w-3" /> Thành viên
                        </span>
                       </div>
                     )}

                     <div className="flex items-start gap-4 mb-6">
                        <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-lg ${doc.isPublic ? (isVideo ? "bg-rose-50 text-rose-500 shadow-rose-100" : "bg-indigo-50 text-indigo-600 shadow-indigo-100") : "bg-slate-100 text-slate-400 shadow-slate-100"} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">{doc.title}</h3>
                          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1 text-indigo-600">{doc.subject}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">Lớp {doc.grade}</span>
                            <span>•</span>
                            <span>{doc.type}</span>
                          </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between gap-4 mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><Download className="h-3.5 w-3.5" />{doc.downloads.toLocaleString()}</span>
                           <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{doc.date}</span>
                        </div>
                        
                        {doc.isPublic ? (
                          <button className="h-10 px-6 bg-indigo-50 text-indigo-700 font-black text-xs rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100">
                             Tải về ngay
                          </button>
                        ) : (
                          <button onClick={() => setLoginOpen(true)} className="h-10 px-6 bg-slate-900 text-white font-black text-xs rounded-2xl hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2">
                             Đăng nhập để tải
                          </button>
                        )}
                     </div>
                   </div>
                 );
              })}
            </div>

            {filteredDocs.length === 0 && (
              <div className="bg-slate-50 rounded-[40px] border border-dashed border-slate-200 py-24 text-center">
                 <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <BookOpen className="h-10 w-10 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-black text-slate-800 mb-2">Không có tài liệu nào phù hợp</h3>
                 <p className="text-slate-500 max-w-sm mx-auto">Vui lòng thử điều chỉnh bộ lọc hoặc từ khoá tìm kiếm khác.</p>
                 <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("Tất cả"); setSelectedGrade("Mọi khối lớp"); }}
                  className="mt-8 px-10 py-3.5 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
                >
                  Xoá tất cả bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[48px] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
               <Shield className="h-16 w-16 text-indigo-300 mx-auto mb-8" />
               <h2 className="text-3xl md:text-5xl font-black mb-6 max-w-2xl mx-auto leading-tight">Mở khoá toàn bộ tài liệu chuyên sâu ngay hôm nay</h2>
               <p className="text-indigo-100 text-lg font-medium mb-12 max-w-lg mx-auto">Trở thành thành viên để được nâng cấp không giới hạn các học liệu độc quyền và nhận lộ trình học tập tối ưu.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => setLoginOpen(true)} className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-700 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform">
                    Đăng nhập tài khoản
                  </button>
                  <Link to="/#contact" className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
                    Tìm hiểu thêm
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
           <div className="space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight">Tanthanh Edu SYSTEM</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">Sứ mệnh của chúng tôi là mang đến môi trường giáo dục chuyên nghiệp, đẳng cấp và giàu cảm hứng cho thế hệ trẻ.</p>
           </div>
           
           <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4">
                {["Home", "Khoá học", "Cộng đồng", "Tài liệu", "Liên hệ"].map(l => (
                   <li key={l}><Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-slate-400 hover:text-white text-sm font-bold transition-all">{l}</Link></li>
                ))}
              </ul>
           </div>

           <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Liên hệ</h4>
              <div className="space-y-4 text-slate-400">
                <p className="text-sm font-bold">123 Phố Giáo Dục, Hà Nội</p>
                <p className="text-sm font-bold">0901 234 567</p>
                <p className="text-sm font-bold">info@tanthanhedu.vn</p>
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Hỗ trợ 24/7</h4>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-lg">
                <MessageCircle className="h-5 w-5" /> Nhắn tin qua Zalo
              </button>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center">
           <p className="text-slate-600 text-xs font-black uppercase tracking-widest">© 2025 Tanthanh Edu. Thiết kế bởi Premium Agent.</p>
        </div>
      </footer>

    </div>
  );
}

function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
