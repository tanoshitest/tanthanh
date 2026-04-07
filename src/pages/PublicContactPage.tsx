import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, Mail, Phone, MapPin, Globe, Send, MessageCircle, 
  Clock, Facebook, Youtube, ChevronRight, ArrowLeft, CheckCircle, 
  Zap, ShieldCheck, Heart, Users 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CONTACT_INFO = [
  { icon: MapPin, label: "Trụ sở chính", value: "123 Phố Giáo Dục, Đống Đa, Hà Nội", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: MapPin, label: "Cơ sở 2", value: "456 Đường Học Tập, Cầu Giấy, Hà Nội", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Phone, label: "Hotline", value: "0901 234 567 — 0912 345 678", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Mail, label: "Email phản hồi", value: "giaovu@tanthanhedu.vn", color: "text-rose-500", bg: "bg-rose-50" },
];

const WORKING_HOURS = [
  { days: "Thứ 2 – Thứ 6", time: "08:00 – 21:00", active: true },
  { days: "Thứ 7", time: "08:00 – 17:00", active: true },
  { days: "Chủ nhật", time: "08:30 – 12:00", active: false },
];

export default function PublicContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ tư vấn trong 24 giờ tới.");
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar placeholder */}
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
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Về chúng tôi</Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Khoá học</Link>
            <Link to="/library" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Tài liệu</Link>
            <Link to="/community" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Cộng đồng</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl transition-all">Liên hệ</Link>
          </nav>
          <Link to="/login" className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">
              Liên hệ tư vấn
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Chúng tôi luôn lắng nghe <span className="text-indigo-400">bạn</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">Bất kể thắc mắc về lộ trình học hay tư vấn khóa học, đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn.</p>
         </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 space-y-8">
               <div className="p-8 md:p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Đăng ký tư vấn miễn phí</h3>
                  <p className="text-slate-500 text-sm mb-10 font-medium">Hoàn thành form bên dưới và chúng tôi sẽ chủ động liên hệ lại.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Họ và tên *</label>
                        <input 
                          className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Số điện thoại *</label>
                        <input 
                          className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          placeholder="09xx xxx xxx"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Email</label>
                      <input 
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="email@vidu.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Môn học quan tâm</label>
                      <select 
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                      >
                         <option value="">Chọn một môn học...</option>
                         <option value="Toán">Toán học (Thi chuyển cấp/THPT)</option>
                         <option value="Văn">Ngữ Văn (Chuyên sâu/Đại trà)</option>
                         <option value="Anh">Tiếng Anh (IELTS/Giao tiếp)</option>
                         <option value="Lý">Vật lý (Lớp 10-11-12)</option>
                         <option value="Khác">Tư vấn lộ trình bứt phá</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Lời nhắn của bạn</label>
                      <textarea 
                        className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] resize-none"
                        placeholder="Bạn muốn hỏi thêm thông tin gì về Tanthanh Edu?..."
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <button 
                       disabled={isSubmitting}
                       className="w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>Đang gửi... <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></>
                      ) : (
                        <><Send className="h-5 w-5" /> Gửi thông tin tư vấn</>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chúng tôi bảo mật 100% thông tin cá nhân của bạn</p>
                  </form>
               </div>
            </div>

            {/* Right: Contact details */}
            <div className="lg:col-span-5 space-y-8">
               <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[3rem] p-10 text-white shadow-2xl space-y-10">
                  <h3 className="text-2xl font-black">Thông tin trực tiếp</h3>
                  
                  <div className="space-y-6">
                    {CONTACT_INFO.map((item, i) => (
                      <div key={i} className="flex gap-5 group cursor-default">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white transition-all">
                          <item.icon className={`h-5 w-5 text-white group-hover:${item.color} transition-all`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{item.label}</p>
                          <p className="text-sm font-bold mt-1 text-white/90">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">Theo dõi qua mạng xã hội</h4>
                    <div className="flex gap-4">
                      {[{ Icon: Facebook, color: "bg-[#1877F2]" }, { Icon: Youtube, color: "bg-[#FF0000]" }, { Icon: MessageCircle, color: "bg-[#0068FF]" }].map((s, i) => (
                         <button key={i} className={`h-11 w-11 ${s.color} rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-white/10 shadow-lg`}>
                            <s.Icon className="h-5 w-5 text-white" />
                         </button>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">Giờ làm việc</h4>
                      <p className="text-xs text-slate-500 font-medium">Hỗ trợ tư vấn & Tuyển sinh</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {WORKING_HOURS.map((h, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-50">
                        <span className="text-sm font-bold text-slate-600 leading-none">{h.days}</span>
                        <span className={`text-xs font-black ${h.active ? "text-indigo-600" : "text-slate-400"}`}>{h.time}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <Zap className="h-6 w-6 text-indigo-400 mx-auto mb-3" />
                  <h4 className="text-sm font-black mb-1">Cài đặt app Tanthanh Edu Connect</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">Để nhận thông báo tức thì từ trung tâm</p>
                  <Button variant="outline" className="h-10 bg-white/5 border-white/10 rounded-xl text-white hover:bg-white hover:text-slate-900 font-black text-[10px] uppercase tracking-widest w-full">Tải ngay (Coming Soon)</Button>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map area mockup */}
      <section className="h-[400px] bg-slate-100 relative group">
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center group-hover:scale-105 transition-transform duration-700">
               <MapPin className="h-10 w-10 text-rose-500 mx-auto mb-2 animate-bounce" />
               <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Bản đồ định vị cơ sở</p>
            </div>
         </div>
         <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply opacity-50" />
      </section>

      {/* Footer Partial */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6 mb-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black">Tanthanh Edu</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md font-medium">Đồng hành cùng học sinh bứt phá điểm số và vươn tới tương lai rạng ngời.</p>
          </div>
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
             {["Về chúng tôi", "Khoá học", "Tài liệu", "Cộng đồng", "Chính sách", "Liên hệ"].map(l => (
               <Link key={l} to="#" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">{l}</Link>
             ))}
          </div>
          <div className="text-xs text-slate-600 font-black uppercase tracking-[0.2em]">© 2025 Tanthanh Edu Educational Platform. Excellence in teaching.</div>
        </div>
      </footer>
    </div>
  );
}
