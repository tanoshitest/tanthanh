import { Link } from "react-router-dom";
import { 
  GraduationCap, Award, Heart, TrendingUp, Users, BookOpen, Quote, 
  ArrowLeft, ChevronRight, Star, Globe, ShieldCheck, Mail, MapPin, 
  Phone, Facebook, Youtube, MessageCircle 
} from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Tâm huyết", desc: "Mỗi giáo viên đều đặt tâm huyết vào từng bài giảng, đồng hành từng bước cùng học sinh trên con đường chinh phục tri thức.", color: "from-rose-500 to-pink-500" },
  { icon: Award, title: "Chuyên nghiệp", desc: "Quy trình giảng dạy chuẩn hóa, giáo trình được thiết kế bởi các chuyên gia hàng đầu, cập nhật xu hướng quốc tế.", color: "from-indigo-500 to-violet-600" },
  { icon: TrendingUp, title: "Hiệu quả", desc: "98% học sinh đạt mục tiêu điểm số, 85% cải thiện đáng kể trong vòng 3 tháng đầu tiên tham gia học tập.", color: "from-emerald-500 to-teal-500" },
  { icon: ShieldCheck, title: "Trách nhiệm", desc: "Chúng tôi cam kết đồng hành cùng phụ huynh, báo cáo tiến độ định kỳ và hỗ trợ học sinh 24/7.", color: "from-amber-500 to-orange-500" },
];

const TIMELINE = [
  { year: "2012", title: "Thành lập", desc: "Ra đời với 3 lớp học và 45 học sinh đầu tiên tại Hà Nội, tập trung vào bồi dưỡng Ngữ Văn." },
  { year: "2015", title: "Mở rộng quy mô", desc: "Khai trương cơ sở 2, đội ngũ lên đến 30 giáo viên, giảng dạy đa môn: Toán, Anh, Lý, Văn." },
  { year: "2018", title: "Số hóa giáo dục", desc: "Ra mắt nền tảng học trực tuyến, tích hợp bài giảng video chất lượng cao và bài tập tương tác." },
  { year: "2022", title: "Giải thưởng uy tín", desc: "Vinh danh Top 10 trung tâm giáo dục uy tín nhất Việt Nam theo bình chọn của hiệp hội giáo dục." },
  { year: "2025", title: "Bứt phá công nghệ", desc: "Ra mắt hệ thống quản lý số Tanthanh Edu, phục vụ hơn 2,400 học sinh trên toàn quốc." },
];

const TEACHERS = [
  { name: "Trần Thị Mai", subject: "Ngữ Văn", exp: "12 năm", degree: "Thạc sĩ Ngôn ngữ học - ĐH Sư phạm HN", avatar: "M", color: "from-violet-500 to-indigo-600", quote: "Yêu tiếng Việt là yêu cội nguồn và văn hóa Việt." },
  { name: "Lê Hoàng Nam", subject: "Toán học", exp: "10 năm", degree: "Thạc sĩ Toán ứng dụng - ĐH Bách khoa", avatar: "N", color: "from-blue-500 to-cyan-500", quote: "Logic là chìa khóa mở cánh cửa tương lai." },
  { name: "Phạm Minh Tú", subject: "Tiếng Anh", exp: "8 năm", degree: "IELTS 8.5 - Cử nhân ĐH Ngoại ngữ", avatar: "T", color: "from-emerald-500 to-teal-500", quote: "Ngôn ngữ là cầu nối để vươn ra thế giới." },
  { name: "Ngô Thanh Hà", subject: "Vật lý", exp: "7 năm", degree: "Cử nhân Sư phạm Vật lý - ĐH KHTN", avatar: "H", color: "from-orange-500 to-amber-500", quote: "Mọi hiện tượng xung quanh đều có lời giải khoa học." },
];

export default function PublicAboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar Placeholder - Simplified for secondary pages */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block leading-none">Trung tâm</span>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">Tanthanh Edu</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl transition-all">Về chúng tôi</Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Khoá học</Link>
            <Link to="/library" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Tài liệu</Link>
            <Link to="/community" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Cộng đồng</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Liên hệ</Link>
          </nav>
          <Link to="/login" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 to-indigo-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 hover:text-indigo-300 transition-colors">
              <ArrowLeft className="h-3 w-3" /> Trở về trang chủ
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Kiến tạo <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">giá trị</span> bền vững cho tri thức Việt
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              Tanthanh Edu không chỉ là một trung tâm dạy học, chúng tôi là mái nhà chung nơi mọi tiềm năng được khơi dậy và phát triển mạnh mẽ nhất.
            </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <v.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Evolution */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-xs font-black text-indigo-600 uppercase tracking-widest">
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Hơn một thập kỷ <span className="text-indigo-600">tâm huyết</span> với giáo dục</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Tất cả bắt đầu từ mong muốn mang đến một phương pháp học tập mới mẻ, hiện đại mà vẫn giữ vững được giá trị cốt lõi của tri thức. Qua 13 năm, Tanthanh Edu đã trở thành điểm đến tin cậy của hàng nghìn phụ huynh và học sinh.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <p className="text-3xl font-black text-indigo-600 mb-1">13+</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Năm kinh nghiệm</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                   <p className="text-3xl font-black text-violet-600 mb-1">2.4k+</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Học sinh theo học</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-200/50 rounded-full blur-3xl opacity-50" />
              <div className="relative space-y-4">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-indigo-500 border-4 border-white shadow group-hover:scale-125 transition-transform" />
                      {i !== TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-indigo-100 my-1" />}
                    </div>
                    <div className="pb-8">
                       <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{t.year}</span>
                       <h4 className="text-sm font-black text-slate-800 mt-1">{t.title}</h4>
                       <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers / Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Đội ngũ <span className="text-indigo-600">giáo viên</span> ưu tú</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Họ không chỉ là những thầy cô giỏi chuyên môn, mà còn là những người truyền cảm hứng mạnh mẽ cho từng học sinh.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEACHERS.map((t, i) => (
              <div key={i} className="group text-center">
                <div className="relative inline-block mb-6">
                  <div className={`h-32 w-32 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-3xl mx-auto shadow-2xl relative z-10 group-hover:scale-105 group-hover:rotate-6 transition-all duration-500`}>
                    {t.avatar}
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-1">{t.name}</h4>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{t.subject} • {t.exp}</p>
                <div className="px-4">
                  <p className="text-[11px] text-slate-400 font-medium mb-4 h-8 overflow-hidden">{t.degree}</p>
                  <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Quote className="h-4 w-4 text-indigo-300 absolute -top-2 -left-2 rotate-12" />
                    <p className="text-[13px] text-slate-600 italic font-medium">"{t.quote}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative z-10 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-black leading-tight max-w-3xl mx-auto">Sẵn sàng để bắt đầu hành trình chinh phục tri thức?</h2>
                    <p className="text-indigo-100 text-lg max-w-2xl mx-auto font-medium">Chúng tôi luôn ở đây để lắng nghe và đồng hành cùng bạn.</p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Link to="/courses" className="px-10 py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-all">Xem các khoá học</Link>
                        <Link to="/contact" className="px-10 py-4 border-2 border-white/30 text-white font-black rounded-2xl hover:bg-white/10 transition-all">Liên hệ tư vấn ngay</Link>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer Partial (Synced with Landing) */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-black">Tanthanh Edu</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Bồi dưỡng kiến thức, ươm mầm tài năng vì một Việt Nam vươn xa.</p>
              <div className="flex gap-3">
                {[Facebook, Youtube, MessageCircle].map((Icon, i) => (
                  <button key={i} className="h-9 w-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 transition-all">
                    <Icon className="h-4 w-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-sans">Liên kết nhanh</h4>
              <ul className="space-y-3">
                {["Trang chủ", "Về chúng tôi", "Khoá học", "Tài liệu", "Cộng đồng", "Liên hệ"].map(l => (
                   <li key={l}><Link to="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"><ChevronRight className="h-3 w-3 text-indigo-500" /> {l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-sans">Văn phòng chính</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                 <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-indigo-500 mt-0.5" /> 123 Phố Giáo Dục, Đống Đa, Hà Nội</li>
                 <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-500" /> 0901 234 567</li>
                 <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-500" /> info@tanthanhedu.vn</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-sans">Zalo OA</h4>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                 <div className="h-20 w-20 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center opacity-80 backdrop-blur-sm p-2 shadow-inner shadow-black">
                    <div className="grid grid-cols-4 gap-1 opacity-20">
                      {[...Array(16)].map((_, i) => <div key={i} className="h-2 w-2 bg-black rounded-[0.5px]" />)}
                    </div>
                 </div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Quét để nhắn tin</p>
              </div>
            </div>
          </div>
          <div className="text-center text-slate-500 text-[11px] font-black uppercase tracking-widest">
            © 2025 Tanthanh Edu. All rights reserved. Professional Educational System.
          </div>
        </div>
      </footer>
    </div>
  );
}
