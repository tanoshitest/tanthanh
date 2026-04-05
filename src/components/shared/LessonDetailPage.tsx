import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { lessons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, CheckCircle, Play, Circle, FileText, Download, 
  Plus, Settings, Video as VideoIcon, HelpCircle, FilePlus, GraduationCap,
  List, Clock
} from "lucide-react";
import { toast } from "sonner";
import type { Quiz, Video } from "@/lib/types";
import { useAuthStore } from "@/lib/store";

const LessonDetailPage = () => {
  const { lid } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useAuthStore();
  
  const isAdmin = role === "admin" || pathname.startsWith("/admin");
  const isTeacher = role === "teacher" || pathname.startsWith("/teacher");
  const isParent = role === "parent" || pathname.startsWith("/parent");

  const lesson = lessons.find((l) => l.id === lid);

  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [quizOverlay, setQuizOverlay] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);

  const currentVideo: Video | undefined = lesson?.videos[currentVideoIdx];

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !currentVideo) return;
    const time = Math.floor(videoRef.current.currentTime);
    
    // Handle Quiz
    if (!quizOverlay && time !== lastTimeRef.current) {
      const quiz = currentVideo.quizzes.find((q) => q.timestamp === time && !answeredQuizzes.has(q.id));
      if (quiz) {
        videoRef.current.pause();
        setQuizOverlay(quiz);
        setSelectedAnswer(null);
        setAttempts(0);
      }
    }

    // Handle Active Segment
    if (currentVideo.segments) {
      const currentSegment = currentVideo.segments
        .filter(s => s.timestamp <= time)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      
      if (currentSegment && currentSegment.id !== activeSegmentId) {
        setActiveSegmentId(currentSegment.id);
      }
    }

    lastTimeRef.current = time;
  }, [currentVideo, quizOverlay, answeredQuizzes, activeSegmentId]);

  useEffect(() => {
    lastTimeRef.current = 0;
    setActiveSegmentId(null);
  }, [currentVideoIdx]);

  if (!lesson) return <p>Không tìm thấy bài giảng</p>;

  const handleAnswer = () => {
    if (selectedAnswer === null || !quizOverlay) return;
    if (selectedAnswer === quizOverlay.correctAnswer) {
      toast.success("Chính xác! 🎉");
      setAnsweredQuizzes((prev) => new Set(prev).add(quizOverlay.id));
      setQuizOverlay(null);
      videoRef.current?.play();
    } else {
      setAttempts((a) => a + 1);
      toast.error(`Sai rồi, thử lại! (Lần ${attempts + 1})`);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      toast.info(`Chuyển đến mốc thời gian: ${Math.floor(seconds / 60)} phút`);
    }
  };

  const allQuizzes = lesson.videos.flatMap((v) => v.quizzes);
  const answeredCount = answeredQuizzes.size;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />Quay lại
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-admin text-admin hover:bg-admin/5" onClick={() => toast.info("Tính năng chỉnh sửa bài giảng (demo)")}>
              <Settings className="mr-2 h-4 w-4" /> Chỉnh sửa bài giảng
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        {isAdmin && (
          <Badge variant="secondary" className="bg-admin/10 text-admin font-bold border-none">Chế độ Quản trị</Badge>
        )}
        {isTeacher && (
           <Badge variant="secondary" className="bg-teacher/10 text-teacher font-bold border-none">Chế độ Giảng viên</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {currentVideo ? (
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl ring-1 ring-white/10">
              <video
                ref={videoRef}
                src={currentVideo.url}
                controls
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
              />
              {quizOverlay && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-10">
                  <Card className="w-full max-w-md border-none shadow-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" /> Câu hỏi giữa video
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="font-medium text-sm leading-relaxed">{quizOverlay.question}</p>
                      <div className="space-y-2">
                        {quizOverlay.options.map((opt, i) => (
                          <label key={i} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${selectedAnswer === i ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50 border-muted-foreground/10"}`}>
                            <input type="radio" name="quiz" checked={selectedAnswer === i} onChange={() => setSelectedAnswer(i)} className="accent-primary h-4 w-4" />
                            <span className="text-sm font-medium">{String.fromCharCode(65 + i)}. {opt}</span>
                          </label>
                        ))}
                      </div>
                      <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="w-full bg-primary h-11 font-bold">Gửi câu trả lời</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentVideo.quizzes.length > 0 && (
                <div className="bg-muted/10 p-3 flex items-center gap-2 text-xs border-t border-white/5">
                  <span className="text-muted-foreground font-medium ml-2">Điểm dừng câu hỏi:</span>
                  <div className="flex gap-1.5">
                    {currentVideo.quizzes.map((q) => (
                      <div key={q.id} className={`w-2.5 h-2.5 rounded-full ${answeredQuizzes.has(q.id) ? "bg-status-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-white/20"}`} title={`@${q.timestamp}s`} />
                    ))}
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" className="h-6 ml-auto text-[10px] text-admin hover:text-admin hover:bg-admin/10" onClick={() => toast.info("Mở trình chỉnh sửa điểm dừng video")}>
                      <Plus className="h-3 w-3 mr-1" /> Thêm điểm dừng
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted/20 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <VideoIcon className="h-12 w-12 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground font-medium">Chưa có video cho bài học này</p>
              {isAdmin && (
                <Button variant="outline" className="mt-4 border-admin text-admin" onClick={() => toast.info("Upload video mới")}>Tải lên video</Button>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/10 pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Tài liệu đính kèm</span>
                  {isAdmin && <Button variant="ghost" size="icon" className="h-6 w-6 text-admin" onClick={() => toast.info("Thêm tài liệu")}><Plus className="h-4 w-4" /></Button>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/50">
                  {lesson.attachments.length > 0 ? lesson.attachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-4 text-sm group hover:bg-muted/5">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                          <p className="font-medium">{att.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{att.size}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border border-muted-foreground/10" onClick={() => toast.info("Tải xuống tài liệu")}><Download className="h-4 w-4" /></Button>
                    </div>
                  )) : (
                    <p className="italic text-muted-foreground text-center py-8 text-xs">Không có tài liệu</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {lesson.summaryQuiz && (
              <Card className="border-none shadow-sm">
                <CardHeader className="bg-muted/10 pb-3">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Câu hỏi tổng hợp</span>
                    {isAdmin && <Button variant="ghost" size="icon" className="h-6 w-6 text-admin" onClick={() => toast.info("Thêm câu hỏi")}><Plus className="h-4 w-4" /></Button>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {lesson.summaryQuiz.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <p className="font-bold text-xs">{q.question}</p>
                      {!isTeacher && (
                        <textarea className="w-full rounded-xl border border-muted-foreground/20 p-3 text-sm min-h-[80px] bg-white focus-visible:ring-primary shadow-sm" placeholder="Nhập câu trả lời..." />
                      )}
                    </div>
                  ))}
                  {!isTeacher && (
                    <Button className="w-full h-9 text-xs font-bold bg-primary shadow-lg shadow-primary/20">Hoàn thành tổng hợp</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {lesson.writingExercise && (
            <Card className="border-none shadow-sm overflow-hidden bg-primary/5 border border-primary/20">
              <CardHeader className="bg-primary/10 py-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between text-primary">
                  <span>✍️ {lesson.writingExercise.title}</span>
                  {isAdmin && <Settings className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100" onClick={() => toast.info("Cấu hình bài tập viết")} />}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm italic font-medium text-muted-foreground mb-4 leading-relaxed">"{lesson.writingExercise.prompt}"</p>
                {!isTeacher && (
                  <>
                    {lesson.writingExercise.type === "online_text" ? (
                      <textarea className="w-full rounded-xl border border-muted-foreground/20 p-4 text-sm min-h-[150px] bg-white shadow-inner focus-visible:ring-primary" placeholder="Bắt đầu viết bài của bạn tại đây..." />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border border-dashed border-primary/30">
                         <FilePlus className="h-8 w-8 text-primary/40 mb-3" />
                         <Button variant="outline" className="bg-white border-primary text-primary hover:bg-primary/5 rounded-full px-8" onClick={() => toast.info("Upload ảnh bài làm (demo)")}>📷 Tải ảnh bài làm lên</Button>
                         <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-widest">Hỗ trợ JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                    {!isAdmin && (
                       <Button className="mt-4 w-full bg-primary font-bold shadow-lg shadow-primary/20">Nộp bài tập viết</Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden ring-1 ring-muted/50">
            <CardHeader className="bg-muted/5 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold">Danh sách video</CardTitle>
              {isAdmin && <Button size="icon" variant="ghost" className="h-6 w-6 text-admin"><Plus className="h-4 w-4" /></Button>}
            </CardHeader>
            <CardContent className="p-1">
              <div className="space-y-1">
                {lesson.videos.map((v, i) => (
                  <button key={v.id} onClick={() => setCurrentVideoIdx(i)} className={`w-full flex items-center gap-3 rounded-lg p-3 text-left text-sm transition-all group ${i === currentVideoIdx ? "bg-primary/10 text-primary font-bold shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`}>
                    <div className="shrink-0 flex items-center justify-center">
                      {answeredQuizzes.size > 0 && v.quizzes.every((q) => answeredQuizzes.has(q.id)) && v.quizzes.length > 0 ? (
                        <div className="h-6 w-6 rounded-full bg-status-success/10 flex items-center justify-center"><CheckCircle className="h-4 w-4 text-status-success" /></div>
                      ) : i === currentVideoIdx ? (
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse"><Play className="h-3 w-3 fill-current" /></div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted/20 flex items-center justify-center text-[10px] font-bold group-hover:bg-muted/30">{i + 1}</div>
                      )}
                    </div>
                    <span className="flex-1 line-clamp-2 leading-tight">{v.title}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentVideo?.segments && currentVideo.segments.length > 0 && (
            <Card className="border-none shadow-sm overflow-hidden ring-1 ring-muted/50">
              <CardHeader className="bg-muted/5 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2"><List className="h-4 w-4 text-primary" /> Nội dung bài giảng</CardTitle>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" /> 50:00
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-muted/30">
                  {currentVideo.segments.map((seg) => (
                    <button
                      key={seg.id}
                      onClick={() => handleSeek(seg.timestamp)}
                      className={`w-full text-left p-4 transition-all hover:bg-muted/30 group relative ${activeSegmentId === seg.id ? "bg-primary/5" : ""}`}
                    >
                      {activeSegmentId === seg.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      )}
                      <div className="flex flex-col gap-1">
                        <span className={`text-[11px] font-mono font-bold tracking-tighter ${activeSegmentId === seg.id ? "text-primary" : "text-muted-foreground"}`}>
                          {seg.label.split(" - ")[0]}
                        </span>
                        <span className={`text-xs leading-relaxed transition-colors ${activeSegmentId === seg.id ? "font-bold text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                          {seg.label.split(" - ")[1]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {isAdmin && (
            <Card className="border-admin/20 bg-admin/5">
              <CardHeader className="py-3 px-4 border-b border-admin/10">
                <CardTitle className="text-sm font-bold text-admin flex items-center gap-2"><Settings className="h-4 w-4" /> Cấu hình bài giảng</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-[10px] text-muted-foreground leading-relaxed">Là Admin, bạn có quyền thay đổi thứ tự video, chỉnh sửa bộ câu hỏi tracking và thiết lập bài tập viết cho bài giảng này.</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" className="w-full text-[11px] h-8 justify-start bg-white border-admin/20 text-admin hover:bg-admin/5" onClick={() => toast.info("Thiết lập chu trình học")}>⚙️ Chu trình học (Linear/Free)</Button>
                  <Button variant="outline" size="sm" className="w-full text-[11px] h-8 justify-start bg-white border-admin/20 text-admin hover:bg-admin/5" onClick={() => toast.info("Xuất bản cấu hình")}>✅ Xuất bản cấu hình mới</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!isTeacher && !isAdmin && (
            <div className="p-6 bg-gradient-to-br from-parent/10 to-transparent rounded-2xl border border-parent/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-parent font-bold text-sm mb-1 uppercase tracking-wider">Hỗ trợ học tập</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">Nếu bạn gặp khó khăn khi xem video hoặc làm bài, hãy liên hệ ngay với giáo viên.</p>
                <Button size="sm" className="w-full bg-parent h-8 text-[11px] font-bold">Nhắn tin cho giáo viên</Button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <HelpCircle className="h-24 w-24" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
