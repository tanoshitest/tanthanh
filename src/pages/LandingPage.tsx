import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import {
  Shield, GraduationCap, Users, BookOpen, Award, Star, Phone, Mail, MapPin,
  Clock, ChevronDown, Menu, X, ArrowRight, Play, Download, Heart, MessageCircle,
  ThumbsUp, FileText, Video, CheckCircle, Zap, Target, TrendingUp, Globe, Send,
  Facebook, Youtube, ChevronRight, Quote, Calendar
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "12+", label: "Năm kinh nghiệm" },
  { value: "2,400+", label: "Học sinh" },
  { value: "98%", label: "Hài lòng" },
  { value: "150+", label: "Giáo viên xuất sắc" },
];

const VALUES = [
  { icon: Heart, title: "Tâm huyết", desc: "Mỗi giáo viên đều đặt tâm huyết vào từng bài giảng, đồng hành từng bước cùng học sinh.", color: "from-rose-500 to-pink-500" },
  { icon: Award, title: "Chuyên nghiệp", desc: "Quy trình giảng dạy chuẩn hóa, giáo trình được thiết kế bởi các chuyên gia hàng đầu.", color: "from-admin to-violet-600" },
  { icon: TrendingUp, title: "Hiệu quả", desc: "98% học sinh đạt mục tiêu điểm số, 85% cải thiện đáng kể trong vòng 3 tháng.", color: "from-emerald-500 to-teal-500" },
];

const TIMELINE = [
  { year: "2012", title: "Thành lập", desc: "Ra đời với 3 lớp học và 45 học sinh đầu tiên tại Hà Nội." },
  { year: "2015", title: "Mở rộng", desc: "Khai trương cơ sở 2, đội ngũ lên đến 30 giáo viên, hơn 400 học sinh." },
  { year: "2018", title: "Số hóa", desc: "Ra mắt nền tảng học trực tuyến, tích hợp bài giảng video và bài tập tương tác." },
  { year: "2022", title: "Giải thưởng", desc: "Được vinh danh Top 10 trung tâm Anh ngữ & Văn – Toán uy tín nhất Việt Nam." },
  { year: "2025", title: "Bứt phá", desc: "Ra mắt hệ thống quản lý số Tanthanh Edu, phục vụ hơn 2,400 học sinh trên toàn quốc." },
];

const TEACHERS = [
  { name: "Trần Thị Mai", subject: "Ngữ Văn", exp: "10 năm", degree: "Thạc sĩ Văn học - ĐH Sư phạm HN", avatar: "M", color: "from-violet-500 to-admin", quote: "Yêu tiếng Việt là yêu cuộc sống." },
  { name: "Lê Hoàng Nam", subject: "Toán học", exp: "8 năm", degree: "Thạc sĩ Toán ứng dụng - ĐH Bách khoa", avatar: "N", color: "from-blue-500 to-cyan-500", quote: "Mọi bài toán đều có lời giải đẹp." },
  { name: "Phạm Minh Tú", subject: "Tiếng Anh", exp: "7 năm", degree: "IELTS 8.5 - Cử nhân ĐH Ngoại ngữ", avatar: "T", color: "from-emerald-500 to-teal-500", quote: "Ngôn ngữ mở ra cả thế giới." },
  { name: "Ngô Thanh Hà", subject: "Vật lý", exp: "6 năm", degree: "Cử nhân Vật lý - ĐH KHTN", avatar: "H", color: "from-orange-500 to-amber-500", quote: "Khoa học bắt đầu từ sự tò mò." },
];

const COURSES = [
  { id: 1, name: "Chuyên sâu Ngữ Văn 9", subject: "Văn", level: "Chuyên sâu", sessions: 2, price: "800,000₫", students: 35, tag: null, color: "from-violet-500 to-admin", desc: "Luyện kỹ năng viết NLVH, NLXH. Ôn tập toàn bộ tác phẩm thi vào 10." },
  { id: 2, name: "Luyện thi THPT Toán", subject: "Toán", level: "Nâng cao", sessions: 3, price: "1,200,000₫", students: 28, tag: "HOT", color: "from-blue-500 to-cyan-500", desc: "Hệ thống toàn bộ kiến thức Toán THPT, giải đề thực chiến." },
  { id: 3, name: "Đại trà Ngữ Văn 7", subject: "Văn", level: "Cơ bản", sessions: 2, price: "650,000₫", students: 30, tag: null, color: "from-pink-500 to-rose-500", desc: "Xây dựng nền tảng đọc hiểu và kỹ năng viết bài văn hoàn chỉnh." },
  { id: 4, name: "Online IELTS Preparation", subject: "Anh", level: "Nâng cao", sessions: 3, price: "1,500,000₫", students: 20, tag: "MỚI", color: "from-emerald-500 to-teal-500", desc: "Lộ trình 3 tháng đạt IELTS 6.5+. Luyện 4 kỹ năng Reading, Listening, Writing, Speaking." },
  { id: 5, name: "Kèm riêng 1-1 Toán", subject: "Toán", level: "Kèm riêng", sessions: 3, price: "3,000,000₫", students: 1, tag: null, color: "from-amber-500 to-orange-500", desc: "Giáo viên lên lộ trình cá nhân hóa 100%, linh hoạt giờ học theo nhu cầu." },
  { id: 6, name: "Chuyên sâu Toán 9", subject: "Toán", level: "Chuyên sâu", sessions: 2, price: "900,000₫", students: 32, tag: null, color: "from-indigo-500 to-blue-600", desc: "Hệ phương trình, hình học không gian, bất phương trình. Chinh phục đề thi vào 10." },
];

const LIBRARY_DOCS = [
  { icon: FileText, name: "Đề thi thử Văn THPT QG 2024", subject: "Văn", downloads: "4,213", type: "PDF" },
  { icon: FileText, name: "Bộ đề luyện tập Toán 9 - Trọn bộ", subject: "Toán", downloads: "3,890", type: "PDF" },
  { icon: Video, name: "Video bài giảng: Phân tích Lặng lẽ Sa Pa", subject: "Văn", downloads: "2,567", type: "Video" },
  { icon: FileText, name: "Công thức Vật lý 12 - Tóm tắt", subject: "Vật lý", downloads: "5,102", type: "PDF" },
  { icon: Video, name: "Giải chi tiết đề Toán THPT 2023", subject: "Toán", downloads: "3,218", type: "Video" },
  { icon: FileText, name: "IELTS Writing Task 2 - 50 mẫu band 7+", subject: "Anh", downloads: "6,044", type: "PDF" },
];

const POSTS = [
  { author: "Trần Thị Mai", role: "Giáo viên Văn", time: "2 giờ trước", content: "Chia sẻ bộ đề đọc hiểu Văn 9 hay nhất cho các em ôn thi vào 10. Có đáp án và hướng dẫn chi tiết. Chúc các em ôn tập hiệu quả! 📚", likes: 142, comments: 38, avatar: "M", color: "bg-violet-500" },
  { author: "Nguyễn Minh Khôi", role: "Học sinh lớp 9", time: "5 giờ trước", content: "Em vừa đạt 9.5 môn Văn kỳ thi giữa kỳ! Cảm ơn cô Mai và trung tâm Tanthanh Edu rất nhiều ạ. Phương pháp phân tích NLVH của cô thực sự rất hiệu quả! 🎉", likes: 215, comments: 54, avatar: "K", color: "bg-emerald-500" },
  { author: "Lê Hoàng Nam", role: "Giáo viên Toán", time: "1 ngày trước", content: "Phương pháp giải bài toán hình học phẳng dành cho học sinh lớp 9 chuẩn bị thi vào 10. Xem ngay video trong phần Tài liệu nhé! 📐", likes: 98, comments: 27, avatar: "N", color: "bg-blue-500" },
];

const COURSE_FILTERS = ["Tất cả", "Văn", "Toán", "Anh", "Luyện thi"];

// ── Component ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = (role: Role) => {
    setRole(role);
    const paths: Record<Role, string> = { admin: "/admin", teacher: "/teacher/classes", parent: "/parent" };
    navigate(paths[role]);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
    setLoginOpen(false);
  };

  const filteredCourses = activeFilter === "Tất cả" ? COURSES : COURSES.filter(c => c.subject === activeFilter || c.level === activeFilter);

  const navLinks = [
    { label: "Home", id: "home", href: "/" },
    { label: "Về chúng tôi", id: "about", href: "/about" },
    { label: "Khoá học", id: "courses", href: "/courses" },
    { label: "Tài liệu", id: "library", href: "/library" },
    { label: "Cộng đồng", id: "community", href: "/community" },
    { label: "Liên hệ", id: "contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          {/* Logo */}
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none">Hệ thống giáo dục</span>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">Tanthanh Edu</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(ln => (
              <Link key={ln.id} to={ln.href || "/"} className={cn(
                "px-4 py-2 text-sm font-bold rounded-xl transition-all",
                ln.href && !ln.href.startsWith("#") ? "text-indigo-600 hover:bg-indigo-50" : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
              )}>{ln.label}</Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="hidden lg:flex items-center gap-3 relative">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all"
            >
              Đăng nhập
              <ChevronDown className={`h-4 w-4 transition-transform ${loginOpen ? "rotate-180" : ""}`} />
            </button>

            {loginOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setLoginOpen(false)} />
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl shadow-black/10 border border-slate-100 p-4 space-y-2 z-50">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 pb-1">Chọn vai trò để đăng nhập</p>
                  {[
                    { role: "admin" as Role, label: "Admin", sub: "Quản lý toàn bộ hệ thống", icon: Shield, color: "from-indigo-500 to-violet-600" },
                    { role: "teacher" as Role, label: "Giáo viên", sub: "Giảng dạy & chấm điểm", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
                    { role: "parent" as Role, label: "Phụ huynh & Học sinh", sub: "Theo dõi kết quả học tập", icon: Users, color: "from-orange-500 to-amber-500" },
                  ].map(r => (
                    <button key={r.role} onClick={() => handleLogin(r.role)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group text-left">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-sm shrink-0`}>
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

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-1 shadow-xl">
            {navLinks.map(ln => (
              ln.href
                ? <Link key={ln.id} to={ln.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">{ln.label}</Link>
                : <button key={ln.id} onClick={() => scrollTo(ln.id)} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">{ln.label}</button>
            ))}
            <div className="pt-3 space-y-2">
              {[
                { role: "admin" as Role, label: "Admin", icon: Shield },
                { role: "teacher" as Role, label: "Giáo viên", icon: GraduationCap },
                { role: "parent" as Role, label: "Phụ huynh", icon: Users },
              ].map(r => (
                <button key={r.role} onClick={() => handleLogin(r.role)} className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl text-sm font-black transition-all">
                  <r.icon className="h-4 w-4" /> Đăng nhập với {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950">
        {/* bg decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-500/5 to-violet-500/5 blur-2xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-xs font-black text-white/80 uppercase tracking-widest mb-8 border border-white/10">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              Top 10 Trung tâm uy tín nhất VN 2024
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Vươn tới<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                đỉnh cao
              </span>
              <br />tri thức
            </h1>

            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10 max-w-2xl">
              Nơi ươm mầm tài năng, đồng hành cùng học sinh trên con đường chinh phục tri thức.
              Hơn <strong className="text-white">2,400 học sinh</strong> đã tin tưởng và thành công cùng chúng tôi.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <button onClick={() => scrollTo("courses")} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all">
                Xem khoá học <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setLoginOpen(true)} className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-black rounded-2xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur">
                Đăng nhập hệ thống
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cuộn xuống</span>
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </div>
      </section>

      {/* ── VỀ CHÚNG TÔI ───────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">Về chúng tôi</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-4">Hành trình <span className="text-indigo-600">13 năm</span> đồng hành</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">Từ 3 lớp học nhỏ đến nền tảng giáo dục số hiện đại, chúng tôi không ngừng cải tiến để mang đến trải nghiệm học tập tốt nhất.</p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {VALUES.map((v, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <v.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <h3 className="text-2xl font-black text-slate-900 text-center mb-10">Mốc lịch sử phát triển</h3>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-violet-200 hidden md:block" />
              <div className="space-y-8">
                {TIMELINE.map((t, i) => (
                  <div key={i} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className={`inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl border border-indigo-100 max-w-sm ${i % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                        <p className="text-sm font-bold text-slate-500 mb-1">{t.title}</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{t.desc}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 z-10">
                      {t.year.slice(2)}
                    </div>
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div>
            <h3 className="text-2xl font-black text-slate-900 text-center mb-10">Đội ngũ giáo viên xuất sắc</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEACHERS.map((t, i) => (
                <div key={i} className="group text-center p-6 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all">
                  <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {t.avatar}
                  </div>
                  <h4 className="font-black text-slate-800 mb-0.5">{t.name}</h4>
                  <p className="text-xs font-bold text-indigo-600 mb-2">{t.subject} • {t.exp}</p>
                  <p className="text-[10px] text-slate-400 leading-snug mb-4">{t.degree}</p>
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <Quote className="h-3 w-3 text-indigo-400 mx-auto mb-1" />
                    <p className="text-[11px] text-slate-500 italic">"{t.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KHOÁ HỌC ───────────────────────────────────────────────────── */}
      <section id="courses" className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">Khoá học</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-4">Chương trình <span className="text-indigo-600">đa dạng</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto">Từ cơ bản đến nâng cao, từ offline đến online — chúng tôi có khoá học phù hợp với mọi học sinh.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {COURSE_FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeFilter === f ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600"}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Course Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(c => (
              <div key={c.id} className="group bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 transition-all overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    {c.tag && (
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full ${c.tag === "HOT" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {c.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{c.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-bold mb-5 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.sessions} buổi/tuần</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.students} HS</span>
                    <span className="ml-auto font-black text-slate-700">{c.price}/tháng</span>
                  </div>
                  <button onClick={() => scrollTo("contact")} className="w-full py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-black text-sm rounded-2xl transition-all border border-slate-100 hover:border-indigo-200">
                    Đăng ký tư vấn
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-200 text-indigo-600 font-black rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
              Xem tất cả khoá học <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TÀI LIỆU ───────────────────────────────────────────────────── */}
      <section id="library" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">Tài liệu</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-4">Kho tài liệu <span className="text-indigo-600">miễn phí</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto">Hơn 500+ đề thi, bài giảng và video hướng dẫn được cập nhật thường xuyên. Đăng nhập để tải về miễn phí.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {LIBRARY_DOCS.map((doc, i) => (
              <div key={i} className="group flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors">
                  <doc.icon className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{doc.subject} • {doc.type} • {doc.downloads} lượt tải</p>
                </div>
                <Download className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 shrink-0 transition-colors" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 text-center text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-white/60" />
            <h3 className="text-2xl font-black mb-3">Tải tài liệu miễn phí</h3>
            <p className="text-indigo-200 mb-6 text-sm">Đăng nhập để truy cập toàn bộ kho tài liệu và nhận thông báo khi có nội dung mới.</p>
            <Link to="/library" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg">
              Khám phá kho tài liệu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CỘNG ĐỒNG ──────────────────────────────────────────────────── */}
      <section id="community" className="py-24 bg-gradient-to-br from-slate-50 to-violet-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">Cộng đồng</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-4">Học cùng <span className="text-indigo-600">cộng đồng</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto">Kết nối với hàng nghìn học sinh, phụ huynh và giáo viên — chia sẻ, học hỏi, cùng tiến bộ.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[["1,240+", "Thành viên"], ["3,500+", "Bài đăng"], ["120+", "Tài liệu chia sẻ"]].map(([v, l], i) => (
              <div key={i} className="text-center bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <p className="text-3xl font-black text-indigo-600">{v}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{l}</p>
              </div>
            ))}
          </div>

          {/* Posts */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {POSTS.map((p, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-full ${p.color} flex items-center justify-center text-white font-black text-sm shadow-md`}>{p.avatar}</div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{p.author}</p>
                    <p className="text-[10px] text-slate-400">{p.role} • {p.time}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{p.content}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold"><ThumbsUp className="h-3.5 w-3.5" />{p.likes}</span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold"><MessageCircle className="h-3.5 w-3.5" />{p.comments}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div>
              <h3 className="text-2xl font-black mb-2">Tham gia cộng đồng học tập Tanthanh Edu</h3>
              <p className="text-violet-200 text-sm">Hơn 1,240 thành viên đang chia sẻ và học hỏi mỗi ngày.</p>
            </div>
            <Link to="/community" className="shrink-0 px-8 py-3.5 bg-white text-indigo-700 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg inline-flex items-center gap-2">
              Tham gia ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIÊN HỆ ────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">Liên hệ</span>
            <h2 className="text-4xl font-black text-slate-900 mt-4 mb-4">Kết nối <span className="text-indigo-600">cùng chúng tôi</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto">Hãy để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6">Đăng ký tư vấn miễn phí</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Họ và tên *</label>
                    <input className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="Nguyễn Văn A" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Số điện thoại *</label>
                    <input className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="0901234567" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Email</label>
                  <input type="email" className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" placeholder="email@gmail.com" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Môn học quan tâm</label>
                  <select className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" value={contactForm.subject} onChange={e => setContactForm({...contactForm, subject: e.target.value})}>
                    <option value="">Chọn môn học...</option>
                    <option>Ngữ Văn</option>
                    <option>Toán học</option>
                    <option>Tiếng Anh (IELTS)</option>
                    <option>Vật lý</option>
                    <option>Kèm riêng</option>
                    <option>Luyện thi THPT</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Nhắn tin</label>
                  <textarea className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none h-28" placeholder="Nhập câu hỏi hoặc yêu cầu của bạn..." value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                </div>
                <button onClick={() => { if(contactForm.name && contactForm.phone) { alert("✅ Đã nhận thông tin! Chúng tôi sẽ liên hệ trong 24 giờ."); setContactForm({name:"",phone:"",email:"",subject:"",message:""}); } else { alert("Vui lòng điền Họ tên và Số điện thoại."); } }} className="w-full h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" /> Gửi thông tin tư vấn
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-black mb-6">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Địa chỉ", value: "123 Phố Giáo Dục, Đống Đa, Hà Nội" },
                    { icon: Phone, label: "Điện thoại", value: "0901 234 567 — 0912 345 678" },
                    { icon: Mail, label: "Email", value: "info@trungtamabc.vn" },
                    { icon: Globe, label: "Zalo OA", value: "Tanthanh Edu" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">{item.label}</p>
                        <p className="text-sm font-bold mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Giờ làm việc</h3>
                <div className="space-y-3">
                  {[["Thứ 2 – Thứ 6", "08:00 – 21:00"], ["Thứ 7 – Chủ nhật", "08:00 – 17:00"]].map(([day, time]) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-slate-600 font-medium"><Clock className="h-3.5 w-3.5 text-indigo-400" />{day}</span>
                      <span className="text-sm font-black text-indigo-600">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Theo dõi chúng tôi</p>
                <div className="flex gap-3">
                  {[{ icon: Facebook, label: "Facebook", color: "bg-blue-600" }, { icon: Youtube, label: "YouTube", color: "bg-red-600" }, { icon: MessageCircle, label: "Zalo", color: "bg-sky-500" }].map(s => (
                    <button key={s.label} className={`h-10 w-10 ${s.color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg`}>
                      <s.icon className="h-4 w-4 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Tanthanh Edu</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Nơi ươm mầm tài năng, đồng hành cùng học sinh trên con đường chinh phục tri thức.</p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Khoá học</h4>
              <ul className="space-y-2.5">
                {["Chuyên sâu Văn 9", "Luyện thi THPT Toán", "IELTS Preparation", "Kèm riêng 1-1", "Đại trà Văn 7"].map(c => (
                  <li key={c}><button onClick={() => scrollTo("courses")} className="text-slate-400 hover:text-white text-sm transition-colors">{c}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Liên kết</h4>
              <ul className="space-y-2.5">
                {navLinks.map(l => (
                  <li key={l.id}><button onClick={() => scrollTo(l.id)} className="text-slate-400 hover:text-white text-sm transition-colors">{l.label}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Liên hệ</h4>
              <div className="space-y-3 text-sm text-slate-400">
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-indigo-400" />123 Phố Giáo Dục, Đống Đa, Hà Nội</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-indigo-400" />0901 234 567</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-indigo-400" />info@trungtamabc.vn</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2025 Tanthanh Edu. Bảo lưu mọi quyền.</p>
            <button onClick={() => setLoginOpen(true)} className="text-xs text-slate-500 hover:text-white font-bold flex items-center gap-1.5 transition-colors">
              <Shield className="h-3.5 w-3.5" /> Đăng nhập hệ thống
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
