import { useState } from "react";
import { communityPosts } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Pin, Send } from "lucide-react";
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
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Cộng đồng</h1>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
            <Textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Bạn đang nghĩ gì?" className="min-h-[60px]" />
          </div>
          <div className="flex justify-end">
            <Button disabled={!newPost.trim()} onClick={handlePost}>Đăng bài</Button>
          </div>
        </CardContent>
      </Card>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9"><AvatarFallback>{post.authorName[0]}</AvatarFallback></Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{post.authorName}</span>
                    <Badge className={`text-xs ${roleBadgeClass[post.authorRole] || ""}`}>{post.authorRole}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                </div>
              </div>
              {post.isPinned && <Pin className="h-4 w-4 text-muted-foreground" />}
            </div>
            <p className="text-sm">{post.content}</p>
            <div className="flex items-center gap-4 pt-2 border-t">
              <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-sm hover:opacity-70">
                <Heart className={`h-4 w-4 ${post.liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                <span>{post.likes}</span>
              </button>
              <button onClick={() => setPosts(posts.map((p) => p.id === post.id ? { ...p, showComments: !p.showComments } : p))} className="flex items-center gap-1 text-sm text-muted-foreground hover:opacity-70">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments.length}</span>
              </button>
            </div>
            {post.showComments && (
              <div className="space-y-2 pl-4 border-l-2">
                {post.comments.map((c, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{c.authorName}</span>
                    <Badge className={`text-xs ml-1 ${roleBadgeClass[c.authorRole] || ""}`}>{c.authorRole}</Badge>
                    <p className="text-muted-foreground">{c.content}</p>
                  </div>
                ))}
                <CommentInput onSubmit={(txt) => addComment(post.id, txt)} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
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
