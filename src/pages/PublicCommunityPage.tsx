import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import {
  GraduationCap, Lock, Globe, Users, ThumbsUp, MessageCircle,
  ChevronRight, Shield, Heart, Share2, Image, Smile,
  TrendingUp, Star, BookOpen, Bell, Search, ArrowLeft,
  CheckCircle, Crown, Facebook, Youtube
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────────────
const COMMUNITIES = [
  {
    id: "pub-1",
    isPrivate: false,
    name: "Góc học thuật Tanthanh Edu",
    desc: "Nơi chia sẻ tài liệu, đề thi và mẹo học tập dành cho tất cả học sinh. Ai cũng được tham gia và đóng góp!",
    members: 1240,
    posts: 3580,
    tags: ["Tài liệu", "Học thuật", "Mọi cấp độ"],
    cover: "from-indigo-500 to-violet-600",
    avatar: "🎓",
    featured: true,
    posts_list: [
      {
        id: "p1", author: "Trần Thị Mai", role: "Giáo viên Văn", avatar: "M", color: "bg-violet-500",
        time: "2 giờ trước", content: "📚 Chia sẻ bộ đề đọc hiểu Văn 9 hay nhất cho các em ôn thi vào 10. Bộ đề gồm 25 câu hỏi tổng hợp từ các đề thi thật trong 5 năm qua. Có đáp án và hướng dẫn chấm chi tiết. Chúc các em ôn tập hiệu quả! 💪",
        likes: 142, comments: 38, shares: 21, image: true
      },
      {
        id: "p2", author: "Nguyễn Minh Khôi", role: "Học sinh lớp 9", avatar: "K", color: "bg-emerald-500",
        time: "5 giờ trước", content: "🎉 Em vừa đạt 9.5 môn Văn kỳ thi giữa kỳ! Cảm ơn cô Mai và trung tâm Tanthanh Edu rất nhiều ạ. Phương pháp phân tích NLVH của cô thực sự rất hiệu quả! Các bạn đang học Văn nhất định phải thử nhé!",
        likes: 215, comments: 54, shares: 8, image: false
      },
      {
        id: "p3", author: "Lê Hoàng Nam", role: "Giáo viên Toán", avatar: "N", color: "bg-blue-500",
        time: "1 ngày trước", content: "📐 Hôm nay chia sẻ phương pháp giải bài toán hình học phẳng SIÊU NHANH dành cho học sinh lớp 9. Áp dụng tốt bảo đảm được 8-9 điểm phần hình học trong kỳ thi vào 10. Tải video bài giảng tại mục Tài liệu nhé!",
        likes: 98, comments: 27, shares: 44, image: false
      },
      {
        id: "p4", author: "Phạm Thị Lan", role: "Phụ huynh", avatar: "L", color: "bg-pink-500",
        time: "2 ngày trước", content: "Con tôi học ở đây được 6 tháng rồi, điểm từ 6 lên 8.5 môn Văn. Các thầy cô rất nhiệt tình và có tâm. Cách giải thích dễ hiểu, con rất thích đến lớp. Cảm ơn trung tâm Tanthanh Edu! 🙏",
        likes: 178, comments: 32, shares: 5, image: false
      },
    ]
  },
  {
    id: "priv-1",
    isPrivate: true,
    name: "Chuyên sâu Văn 9 — Luyện thi vào 10",
    desc: "Nhóm kín dành riêng cho học sinh lớp Chuyên sâu Văn 9. Chia sẻ tài liệu độc quyền, đề thi thử và nhận phản hồi trực tiếp từ giáo viên.",
    members: 35,
    posts: 412,
    tags: ["Văn học", "Chuyên sâu", "Lớp 9"],
    cover: "from-violet-600 to-purple-700",
    avatar: "✍️",
    featured: false,
  },
  {
    id: "priv-2",
    isPrivate: true,
    name: "Team Toán Luyện thi THPT 2025",
    desc: "Nhóm học tập dành cho học sinh luyện thi THPT Quốc gia môn Toán. Giải đề hàng tuần, phân tích sai lầm phổ biến và chiến thuật làm bài hiệu quả.",
    members: 28,
    posts: 287,
    tags: ["Toán học", "THPT", "Kỳ thi"],
    cover: "from-blue-600 to-cyan-600",
    avatar: "📐",
    featured: false,
  },
  {
    id: "priv-3",
    isPrivate: true,
    name: "IELTS Preparation — Band 6.5+",
    desc: "Cộng đồng học viên cùng chinh phục IELTS. Luyện Speaking, Writing với bạn học, nhận chữa bài từ giáo viên và chia sẻ kinh nghiệm thi thật.",
    members: 20,
    posts: 193,
    tags: ["Tiếng Anh", "IELTS", "Online"],
    cover: "from-emerald-600 to-teal-600",
    avatar: "🌍",
    featured: false,
  },
  {
    id: "priv-4",
    isPrivate: true,
    name: "Hội Phụ huynh & Giáo viên Tanthanh Edu",
    desc: "Diễn đàn riêng tư kết nối phụ huynh và giáo viên. Trao đổi về tiến độ học tập, nắm bắt thông tin lớp học và phối hợp hỗ trợ các em.",
    members: 156,
    posts: 834,
    tags: ["Phụ huynh", "Giáo viên", "Phối hợp"],
    cover: "from-amber-500 to-orange-600",
    avatar: "🤝",
    featured: false,
  },
];

const ROLE_OPTIONS = [
  { role: "admin" as Role, label: "Admin", sub: "Quản lý hệ thống", icon: Shield, color: "from-indigo-500 to-violet-600" },
  { role: "teacher" as Role, label: "Giáo viên", sub: "Giảng dạy & chấm điểm", icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
  { role: "parent" as Role, label: "Phụ huynh & Học sinh", sub: "Theo dõi học tập", icon: Users, color: "from-orange-500 to-amber-500" },
];

// ── PostCard ───────────────────────────────────────────────────────────────
function PostCard({ post, likedPosts, onLike }: { post: any; likedPosts: Set<string>; onLike: (id: string) => void }) {
  const liked = likedPosts.has(post.id);
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg hover:border-indigo-100 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-11 w-11 rounded-full ${post.color} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-800">{post.author}</p>
          <p className="text-[11px] text-slate-400 font-medium">{post.role} · {post.time}</p>
        </div>
        <button className="h-8 px-3 rounded-full text-[10px] font-black border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors">
          + Theo dõi
        </button>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.content}</p>

      {post.image && (
        <div className="w-full h-40 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 flex items-center justify-center mb-4">
          <div className="text-center">
            <Image className="h-8 w-8 text-indigo-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">Tài liệu đính kèm • 25 trang</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 pt-4 border-t border-slate-100">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${liked ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? "fill-indigo-600" : ""}`} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">
          <MessageCircle className="h-4 w-4" /> {post.comments}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">
          <Share2 className="h-4 w-4" /> {post.shares}
        </button>
      </div>
    </div>
  );
}

// ── PrivateOverlay ─────────────────────────────────────────────────────────
function PrivateOverlay({ community, onLoginClick }: { community: any; onLoginClick: () => void }) {
  return (
    <div className="relative">
      {/* Blurred ghost posts */}
      <div className="space-y-4 mb-0 pointer-events-none select-none">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 blur-sm opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded-full w-32" />
                <div className="h-2 bg-slate-100 rounded-full w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded-full" />
              <div className="h-3 bg-slate-100 rounded-full w-4/5" />
              <div className="h-3 bg-slate-100 rounded-full w-3/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Lock gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white rounded-3xl pt-8">
        <div className="text-center px-8 py-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-black/5 max-w-xs mx-4">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${community.cover} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
            <Lock className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Cộng đồng riêng tư</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Đăng nhập để tham gia <strong>{community.name}</strong> và xem toàn bộ nội dung.
          </p>
          <button
            onClick={onLoginClick}
            className={`w-full py-3 bg-gradient-to-r ${community.cover} text-white font-black text-sm rounded-2xl hover:scale-105 transition-transform shadow-lg`}
          >
            Đăng nhập để tham gia
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function PublicCommunityPage() {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);

  const [selectedId, setSelectedId] = useState<string>("pub-1");
  const [loginOpen, setLoginOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchQ, setSearchQ] = useState("");

  const selected = COMMUNITIES.find(c => c.id === selectedId)!;

  const handleLogin = (role: Role) => {
    setRole(role);
    const paths: Record<Role, string> = { admin: "/admin", teacher: "/teacher/classes", parent: "/parent" };
    navigate(paths[role]);
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block leading-none">Hệ thống</span>
               <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none">Tanthanh Edu</span>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Home</Link>
            <Link to="/about" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Về chúng tôi</Link>
            <Link to="/courses" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Khoá học</Link>
            <Link to="/library" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Tài liệu</Link>
            <Link to="/community" className="px-4 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl">Cộng đồng</Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">Liên hệ</Link>
          </nav>

          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 h-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              placeholder="Tìm kiếm cộng đồng..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
          </div>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
            >
              Đăng nhập <ChevronRight className="h-4 w-4" />
            </button>

            {loginOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLoginOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 space-y-2 z-50">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 pb-1">Chọn vai trò</p>
                  {ROLE_OPTIONS.map(r => (
                    <button key={r.role} onClick={() => handleLogin(r.role)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group text-left">
                      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0`}>
                        <r.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600">{r.label}</p>
                        <p className="text-[10px] text-slate-400">{r.sub}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-indigo-400" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back + Title */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Về trang chủ
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Cộng đồng học tập <span className="text-indigo-600">Tanthanh Edu</span></h1>
          <p className="text-slate-500 mt-2">Kết nối, chia sẻ và phát triển cùng hơn <strong>1,240+</strong> học sinh, phụ huynh và giáo viên.</p>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">

          {/* ── Sidebar: Community List ────────────────────────────────── */}
          <aside className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest px-1">Danh sách cộng đồng</h2>

            {COMMUNITIES.filter(c => !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase())).map(community => (
              <button
                key={community.id}
                onClick={() => setSelectedId(community.id)}
                className={`w-full text-left rounded-3xl border transition-all p-4 group ${selectedId === community.id ? "border-indigo-200 bg-indigo-50 shadow-md shadow-indigo-50" : "border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${community.cover} flex items-center justify-center text-2xl shrink-0 shadow-md`}>
                    {community.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-black truncate ${selectedId === community.id ? "text-indigo-700" : "text-slate-800 group-hover:text-indigo-600"} transition-colors`}>
                        {community.name}
                      </p>
                      {community.isPrivate ? (
                        <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <Globe className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{community.members.toLocaleString()} thành viên</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{community.posts.toLocaleString()} bài</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {community.tags.map(tag => (
                        <span key={tag} className={`text-[9px] font-black px-2 py-0.5 rounded-full ${community.isPrivate ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Info card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white">
              <Crown className="h-6 w-6 text-yellow-300 mb-3" />
              <h3 className="font-black text-sm mb-2">Tham gia cùng chúng tôi</h3>
              <p className="text-indigo-200 text-xs leading-relaxed mb-4">Đăng nhập để truy cập tất cả cộng đồng và nhận thông báo bài mới.</p>
              <button onClick={() => setLoginOpen(true)} className="w-full py-2.5 bg-white text-indigo-700 font-black text-xs rounded-2xl hover:scale-105 transition-transform">
                Đăng nhập ngay
              </button>
            </div>
          </aside>

          {/* ── Main Content ───────────────────────────────────────────── */}
          <main className="space-y-6">

            {/* Community Header */}
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${selected.cover} p-8 text-white shadow-lg`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl border border-white/30">
                      {selected.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-black">{selected.name}</h2>
                        {selected.isPrivate
                          ? <span className="flex items-center gap-1 text-[10px] font-black bg-white/20 px-2.5 py-1 rounded-full border border-white/30"><Lock className="h-3 w-3" /> Riêng tư</span>
                          : <span className="flex items-center gap-1 text-[10px] font-black bg-white/20 px-2.5 py-1 rounded-full border border-white/30"><Globe className="h-3 w-3" /> Công khai</span>
                        }
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed max-w-lg">{selected.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-2xl font-black">{selected.members.toLocaleString()}</p>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Thành viên</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-2xl font-black">{selected.posts.toLocaleString()}</p>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Bài đăng</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center">
                    <p className="text-2xl font-black">{selected.tags.length}</p>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Chủ đề</p>
                  </div>
                  {!selected.isPrivate && (
                    <button className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg">
                      <Bell className="h-4 w-4" /> Theo dõi
                    </button>
                  )}
                  {selected.isPrivate && (
                    <button onClick={() => setLoginOpen(true)} className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg">
                      <Lock className="h-4 w-4" /> Tham gia
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Public: full post feed */}
            {!selected.isPrivate && (
              <>
                {/* Write post box — teaser only */}
                <div className="bg-white rounded-3xl border border-slate-100 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-slate-300" />
                  </div>
                  <button onClick={() => setLoginOpen(true)} className="flex-1 text-left h-11 px-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-400 font-medium hover:border-indigo-200 hover:text-slate-600 transition-all">
                    Đăng nhập để chia sẻ bài viết...
                  </button>
                  <button onClick={() => setLoginOpen(true)} className="h-11 px-4 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                    <Image className="h-4 w-4" />
                  </button>
                </div>

                {/* Posts */}
                {selected.posts_list?.map(post => (
                  <PostCard key={post.id} post={post} likedPosts={likedPosts} onLike={handleLike} />
                ))}
              </>
            )}

            {/* Private: blur + lock overlay */}
            {selected.isPrivate && (
              <PrivateOverlay community={selected} onLoginClick={() => setLoginOpen(true)} />
            )}
          </main>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white border-t border-white/5 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
           <div className="space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-black tracking-tight">Tanthanh Edu SYSTEM</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">Kết nối tri thức, sẻ chia kinh nghiệm và cùng nhau bứt phá vươn xa.</p>
           </div>
           
           <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Khám phá</h4>
              <ul className="space-y-4">
                {["Home", "Về chúng tôi", "Khoá học", "Tài liệu", "Cộng đồng", "Liên hệ"].map(l => (
                   <li key={l}><Link to={l === "Home" ? "/" : l === "Về chúng tôi" ? "/about" : l === "Liên hệ" ? "/contact" : `/${l.toLowerCase()}`} className="text-slate-400 hover:text-white text-sm font-bold transition-all">{l}</Link></li>
                ))}
              </ul>
           </div>

           <div>
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Liên hệ</h4>
              <div className="space-y-4 text-slate-400 font-bold">
                <p className="text-sm">123 Phố Giáo Dục, Hà Nội</p>
                <p className="text-sm">0901 234 567</p>
                <p className="text-sm">info@tanthanhedu.vn</p>
              </div>
           </div>

           <div className="space-y-6">
              <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-6">Social</h4>
              <div className="flex justify-center md:justify-start gap-4">
                 {[Globe, Facebook, Youtube].map((Icon, i) => (
                    <button key={i} className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                       <Icon className="h-5 w-5 text-slate-300" />
                    </button>
                 ))}
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 text-center">
           <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© 2025 Tanthanh Edu. Community Platform Powered by Premium Design.</p>
        </div>
      </footer>
    </div>
  );
}
