import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { classes, mainTeachers } from "@/lib/mock-data";
import { ClassCategory, Role } from "@/lib/types";
import { 
  GraduationCap, 
  ArrowLeft, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Shield, 
  Star,
  Zap,
  Target,
  FileText
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

// ── Category Mapping ────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<ClassCategory, { label: string; color: string; icon: any }> = {
  chuyen: { label: "Lớp Chuyên", color: "from-violet-500 to-indigo-600", icon: Target },
  "dai-tra": { label: "Lớp Đại trà", color: "from-blue-500 to-cyan-500", icon: Users },
  "luyen-thi": { label: "Lớp Luyện thi", color: "from-rose-500 to-pink-500", icon: Zap },
  kem: { label: "Lớp Kèm", color: "from-amber-500 to-orange-500", icon: Star },
  online: { label: "Lớp Online", color: "from-emerald-500 to-teal-500", icon: GraduationCap },
};

const ROLE_OPTIONS = [
  { role: "admin" as Role, label: "Admin", sub: "Quản lý hệ thống", icon: Shield, color: "from-indigo-500 to-violet-600" },
  { role: "teacher" as Role, label: "Giáo viên", sub: "Giảng dạy & chấm điểm", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
  { role: "parent" as Role, label: "Phụ huynh & Học sinh", sub: "Theo dõi học tập", icon: Users, color: "from-orange-500 to-amber-500" },
];

export default function PublicCoursesPage() {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ClassCategory | "all">("all");
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || cls.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = (role: Role) => {
    setRole(role);
    const paths: Record<Role, string> = { admin: "/admin", teacher: "/teacher/classes", parent: "/parent" };
    navigate(paths[role]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm shadow-black/5">
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

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Về chúng tôi</Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl">Khoá học</Link>
            <Link to="/library" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Tài liệu</Link>
            <Link to="/community" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Cộng đồng</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Liên hệ</Link>
          </nav>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
            >
              Đăng nhập <ChevronRight className={`h-4 w-4 transition-transform ${loginOpen ? "rotate-90" : ""}`} />
            </button>

            {loginOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLoginOpen(false)} />
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 pb-1">Chọn vai trò</p>
                  {ROLE_OPTIONS.map(r => (
                    <button key={r.role} onClick={() => handleLogin(r.role)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group text-left">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0`}>
                        <r.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{r.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{r.sub}</p>
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
      <section className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 mb-6 hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" /> Về trang chủ
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 text-center md:text-left">
              Hệ thống <span className="text-indigo-600">tất cả</span> lớp học
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 text-center md:text-left">
              Khám phá các khoá học đa dạng từ cơ bản đến chuyên sâu, phù hợp với mọi lộ trình học tập của học sinh.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTERING / LIST ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Bộ lọc khoá học
              </h3>
              
              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                  placeholder="Tìm theo tên/môn..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-black transition-all ${selectedCategory === "all" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"}`}
                >
                  Tất cả các lớp
                </button>
                {(Object.entries(CATEGORY_MAP) as [ClassCategory, any][]).map(([key, config]) => (
                  <button 
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-between group ${selectedCategory === key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"}`}
                  >
                    <span>{config.label}</span>
                    <config.icon className={`h-4 w-4 ${selectedCategory === key ? "text-white/60" : "text-slate-300 group-hover:text-indigo-400"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white text-center shadow-xl shadow-indigo-200">
              <div className="h-12 w-12 rounded-2xl bg-white/20 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="font-black text-lg mb-2">Bạn cần tư vấn?</h4>
              <p className="text-indigo-100 text-xs leading-relaxed mb-6">Liên hệ ngay để nhận lộ trình học tập cá nhân hoá hoàn toàn miễn phí.</p>
              <Link to="/#contact" className="block w-full py-3 bg-white text-indigo-700 font-black text-xs rounded-2xl hover:scale-105 transition-transform shadow-lg">
                Gửi yêu cầu ngay
              </Link>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800">
                Hiển thị <span className="text-indigo-600">{filteredClasses.length}</span> lớp phù hợp
              </h2>
              {selectedCategory !== "all" && (
                <button 
                  onClick={() => setSelectedCategory("all")}
                  className="text-xs font-black text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4"
                >
                  Xoá bộ lọc
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredClasses.map(cls => {
                const config = CATEGORY_MAP[cls.category];
                const teacher = mainTeachers.find(t => t.id === cls.teacherId);
                const isFull = cls.studentCount >= cls.maxStudents;

                return (
                  <div key={cls.id} className="group bg-white rounded-[32px] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all relative overflow-hidden flex flex-col">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${config.color}`} />
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <config.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                           {isFull && (
                            <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                              Hết chỗ
                            </span>
                          )}
                          <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${selectedCategory === cls.category ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{cls.name}</h3>
                      <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                        <span className="text-indigo-600">Lớp {cls.grade}</span> • Môn {cls.subject}
                      </p>

                      <div className="space-y-4 mb-8 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <Users className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none mb-1">Giảng viên</p>
                            <p className="text-sm font-bold text-slate-700">{teacher?.name || "Chưa phân công"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-medium">
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <Calendar className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none mb-1">Lịch học</p>
                            <div className="flex flex-wrap gap-x-3 text-xs text-slate-600">
                              {cls.schedule.map((s, si) => (
                                <span key={si}>{s.day} ({s.time})</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <Target className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider leading-none mb-1">Sĩ số</p>
                            <div className="w-40 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${config.color} transition-all duration-1000`} 
                                style={{ width: `${(cls.studentCount / cls.maxStudents) * 100}%` }}
                              />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">{cls.studentCount}/{cls.maxStudents} HS đã đăng ký</p>
                          </div>
                        </div>
                      </div>

                      <button className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${isFull ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-300"}`}>
                        {isFull ? <Shield className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {isFull ? "Chờ lớp mới" : "Đăng ký tư vấn"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredClasses.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-20 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Không tìm thấy lớp học nào</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Bạn có thể thử tìm kiếm theo tên khác hoặc liên hệ trung tâm để được hỗ trợ trực tiếp.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-8 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-indigo-200"
                >
                  Xoá tất cả bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center gap-2.5 justify-center mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Tanthanh Edu SYSTEM</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Hệ thống đào tạo toàn diện, đồng hành cùng thế hệ tương lai trên con đường chinh phục tri thức.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
            <Link to="/" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Trang chủ</Link>
            <Link to="/about" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Về chúng tôi</Link>
            <Link to="/courses" className="text-indigo-400 hover:text-indigo-300 text-xs font-black uppercase tracking-widest transition-colors">Khoá học</Link>
            <Link to="/library" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Tài liệu</Link>
            <Link to="/community" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Cộng đồng</Link>
            <Link to="/contact" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Liên hệ</Link>
          </div>
          <div className="border-t border-white/10 pt-8 text-xs text-slate-600 font-bold uppercase tracking-widest">
            © 2025 Tanthanh Edu. Powered by Premium Design System.
          </div>
        </div>
      </footer>
    </div>
  );
}
