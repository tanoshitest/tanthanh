import { useState } from "react";
import { communityPosts } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Pin, Send, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const roleBadgeClass: Record<string, string> = {
  admin: "bg-admin text-admin-foreground",
  teacher: "bg-teacher text-teacher-foreground",
  parent: "bg-parent text-parent-foreground",
  student: "bg-teacher-light role-teacher",
};

const CommunityPage = () => {
  const { userName, role } = useAuthStore();
  const [posts, setPosts] = useState(communityPosts.map((p) => ({ ...p, liked: false, showComments: false, comments: [...p.comments] })));
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([{
      id: `post-${Date.now()}`, authorName: userName, authorRole: role || "parent",
      content: newPost, likes: 0, liked: false, showComments: false,
      comments: [], createdAt: new Date().toISOString(), isPinned: false
    }, ...posts]);
    setNewPost("");
    toast.success("Đã đăng bài!");
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    setPosts(posts.map((p) => p.id === postId ? {
      ...p, comments: [...p.comments, { authorName: userName, authorRole: role || "parent", content, createdAt: new Date().toISOString() }]
    } : p));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Left Sidebar - Announcements */}
      <aside className="hidden lg:block w-[300px] sticky top-6 space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-muted/20 shadow-sm overflow-hidden group">
          <div className="p-5 border-b border-muted/10 bg-muted/5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">Thông báo hệ thống</span>
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded-[1.5rem] overflow-hidden border border-muted/10 shadow-sm relative group/banner">
              <img 
                src="/images/banners/announcement_banner_awards.png" 
                alt="Awards Banner" 
                className="w-full h-[160px] object-cover transition-transform group-hover/banner:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-3">
                <span className="text-white text-[10px] font-black uppercase tracking-wider self-end">Giải thưởng tháng 1</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { title: "Lịch nghỉ lễ Giỗ tổ", date: "10/04/2025", urgent: true },
                { title: "Thi thử Starters đợt 1", date: "15/04/2025", urgent: false },
                { title: "Cập nhật Thư viện hè", date: "20/04/2025", urgent: false }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-2xl bg-muted/5 border border-muted/10 hover:bg-muted/10 transition-colors cursor-pointer group/item">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1", item.urgent ? "bg-rose-500" : "bg-blue-500")} />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-snug group-hover/item:text-admin transition-colors">{item.title}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mt-1 opacity-60 italic">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-admin/5 rounded-[2.5rem] border border-admin/10 p-6 flex flex-col items-center text-center space-y-4 shadow-sm border-dashed">
          <div className="w-12 h-12 rounded-full bg-admin/10 flex items-center justify-center text-admin">
            <Send className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-admin tracking-wider">Hỗ trợ 24/7</h3>
            <p className="text-[10px] text-muted-foreground font-medium">Mọi thắc mắc kỹ thuật vui lòng liên hệ admin cấp cao</p>
          </div>
          <Button variant="outline" className="w-full h-9 rounded-full border-admin/20 text-admin font-black text-[9px] uppercase tracking-widest hover:bg-admin hover:text-white transition-all">Liên hệ ngay</Button>
        </div>
      </aside>

      {/* Main Column - Feed */}
      <div className="flex-1 space-y-6 max-w-2xl mx-auto lg:mx-0">
        <div className="flex items-center justify-between px-2 mb-2">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
              <MessageCircle className="h-6 w-6 text-admin" /> Quản lý cộng đồng 
            </h1>
            <p className="text-[11px] text-muted-foreground font-bold italic uppercase tracking-tighter mt-1 drop-shadow-sm">Tương tác trực tiếp với phụ huynh & đội ngũ</p>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-muted/20 shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-11 w-11 shadow-sm ring-2 ring-muted/5">
                <AvatarFallback className="bg-slate-50 text-slate-600 font-bold">{userName[0]}</AvatarFallback>
              </Avatar>
              <Textarea 
                value={newPost} 
                onChange={(e) => setNewPost(e.target.value)} 
                placeholder="Chia sẻ thông tin mới đến cộng đồng..." 
                className="min-h-[100px] rounded-[1.5rem] border-muted/20 bg-muted/5 focus-visible:ring-admin resize-none font-medium text-sm p-4 ring-offset-0" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                disabled={!newPost.trim()} 
                onClick={handlePost} 
                className="rounded-full px-8 bg-admin hover:bg-admin/90 font-black text-[11px] uppercase tracking-widest h-10 shadow-lg shadow-admin/20 transition-all active:scale-95"
              >
                Đăng bài ngay <Send className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="rounded-[2.5rem] border-muted/20 shadow-sm group transition-all hover:shadow-md overflow-hidden bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-muted/5 shadow-sm">
                      <AvatarFallback className="font-bold bg-slate-50">{post.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-800 text-[13px] uppercase tracking-tight">{post.authorName}</span>
                        <Badge className={`text-[9px] font-black uppercase h-5 px-2 tracking-widest shadow-none border-none ${roleBadgeClass[post.authorRole] || ""}`}>{post.authorRole}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter italic opacity-60 mt-0.5">{post.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  {post.isPinned && (
                    <div className="bg-amber-50 p-1.5 rounded-full ring-1 ring-amber-200">
                      <Pin className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-slate-700 leading-relaxed font-medium pl-1">{post.content}</p>
                
                <div className="flex items-center gap-6 pt-4 border-t border-muted/10">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:opacity-70 transition-all group/btn">
                    <div className={cn("p-1.5 rounded-full transition-colors", post.liked ? "bg-rose-50" : "bg-muted/5 group-hover/btn:bg-rose-50")}>
                      <Heart className={`h-4 w-4 ${post.liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                    </div>
                    <span className={post.liked ? "text-rose-600" : "text-muted-foreground"}>{post.likes} Yêu thích</span>
                  </button>
                  <button onClick={() => setPosts(posts.map((p) => p.id === post.id ? { ...p, showComments: !p.showComments } : p))} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-admin transition-all group/btn">
                    <div className="p-1.5 rounded-full bg-muted/5 group-hover/btn:bg-admin/5 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <span>{post.comments.length} Bình luận</span>
                  </button>
                </div>

                {post.showComments && (
                  <div className="space-y-4 pt-4 pl-4 border-l-2 border-muted/10 mt-2 bg-slate-50/50 p-4 rounded-[1.5rem]">
                    {post.comments.map((c, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{c.authorName}</span>
                          <Badge className={`text-[8px] font-black px-1.5 h-4 tracking-tighter uppercase ${roleBadgeClass[c.authorRole] || ""}`}>{c.authorRole}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.content}</p>
                      </div>
                    ))}
                    <div className="pt-2">
                      <CommentInput onSubmit={(txt) => addComment(post.id, txt)} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Ad Banners */}
      <aside className="hidden xl:block w-[300px] sticky top-6 space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-muted/20 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-muted/10 bg-muted/5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">Ưu đãi & Sự kiện</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded-[1.5rem] overflow-hidden border border-muted/10 shadow-sm relative group/promo">
              <img 
                src="/images/banners/ad_banner_summer_course.png" 
                alt="Summer Course Banner" 
                className="w-full h-[180px] object-cover transition-transform duration-500 group-hover/promo:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-[12px] font-black uppercase leading-tight">Khóa học tiếng Anh hè 2025</p>
                <p className="text-white/70 text-[9px] font-bold mt-1">Giảm ngay 20% khi đăng ký sớm</p>
              </div>
            </div>

            <div className="p-4 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 space-y-3 relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 opacity-10">
                <Trophy className="h-20 w-20" />
              </div>
              <h4 className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">Top Students Tuần</h4>
              <div className="space-y-2">
                {[
                  { name: "Minh Khôi", score: 980, color: "text-amber-600" },
                  { name: "Hạ Vy", score: 965, color: "text-slate-500" },
                  { name: "Thanh Tâm", score: 940, color: "text-orange-600" }
                ].map((std, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-400">#{i + 1}</span>
                      <span className="text-[11px] font-bold text-slate-700">{std.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600">{std.score} XP</span>
                  </div>
                ))}
              </div>
              <Button size="sm" className="w-full h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest mt-2">Xem bảng xếp hạng</Button>
            </div>
            
            <div className="p-4 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[12px] font-black text-emerald-800 leading-none">1.2k</p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">Thành viên online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};


const CommentInput = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Viết bình luận..." className="flex-1 rounded border px-3 py-1.5 text-sm bg-background" onKeyDown={(e) => { if (e.key === "Enter") { onSubmit(text); setText(""); } }} />
      <Button size="sm" variant="ghost" onClick={() => { onSubmit(text); setText(""); }}><Send className="h-3 w-3" /></Button>
    </div>
  );
};

export default CommunityPage;
