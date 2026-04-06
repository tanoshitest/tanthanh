import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { lessons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, CheckCircle, Play, Circle, FileText, Download, 
  Plus, Settings, Video as VideoIcon, HelpCircle, FilePlus, GraduationCap,
  List, Clock, Trash2, Edit2, Save, X, ClipboardList, Pencil
} from "lucide-react";
import { toast } from "sonner";
import type { Quiz, Video, VideoSegment } from "@/lib/types";
import { useAuthStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

const LessonDetailPage = () => {
  const { lid } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useAuthStore();
  
  const isAdmin = role === "admin" || pathname.startsWith("/admin");
  const isTeacher = role === "teacher" || pathname.startsWith("/teacher");
  const isParent = role === "parent" || pathname.startsWith("/parent");

  const [currentLesson, setCurrentLesson] = useState(lessons.find((l) => l.id === lid));
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [quizOverlay, setQuizOverlay] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  
  // Teacher Management State
  const [isAddingSegment, setIsAddingSegment] = useState(false);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [newSegment, setNewSegment] = useState({ label: "", startTime: 0, endTime: 0 });
  const [newQuiz, setNewQuiz] = useState({ timestamp: 0, question: "", options: ["", "", "", ""], correctAnswer: 0, passScore: 1 });

  // CRUD Edit States
  const [isEditingSummaryQuiz, setIsEditingSummaryQuiz] = useState(false);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");

  const [isEditingWritingPrompt, setIsEditingWritingPrompt] = useState(false);
  const [editingPromptText, setEditingPromptText] = useState("");

  const [isManagingAttachment, setIsManagingAttachment] = useState(false);
  const [editingAttachmentId, setEditingAttachmentId] = useState<string | null>(null);
  const [attachmentData, setAttachmentData] = useState({ name: "", size: "" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const segmentsListRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState<number>(0);
  const lastTimeRef = useRef(0);

  // Sync tracking height with video height
  useEffect(() => {
    if (!videoContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setVideoHeight(entry.contentRect.height);
      }
    });
    observer.observe(videoContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currentVideo: Video | undefined = currentLesson?.videos[currentVideoIdx];

  // CRUD Helpers
  const handleEditQuestion = (index: number) => {
    if (!currentLesson?.summaryQuiz) return;
    setEditingQuestionIdx(index);
    setEditingQuestionText(currentLesson.summaryQuiz.questions[index].question);
    setIsEditingSummaryQuiz(true);
  };

  const saveEditedQuestion = () => {
    if (currentLesson?.summaryQuiz && editingQuestionIdx !== null) {
      const updatedLesson = { ...currentLesson };
      updatedLesson.summaryQuiz.questions[editingQuestionIdx].question = editingQuestionText;
      setCurrentLesson(updatedLesson);
      setIsEditingSummaryQuiz(false);
      toast.success("Đã cập nhật câu hỏi!");
    }
  };

  const deleteQuestion = (index: number) => {
    if (currentLesson?.summaryQuiz) {
      const updatedLesson = { ...currentLesson };
      updatedLesson.summaryQuiz.questions.splice(index, 1);
      setCurrentLesson(updatedLesson);
      toast.success("Đã xoá câu hỏi!");
    }
  };

  const handleEditPrompt = () => {
    if (!currentLesson?.writingExercise) return;
    setEditingPromptText(currentLesson.writingExercise.prompt);
    setIsEditingWritingPrompt(true);
  };

  const saveEditedPrompt = () => {
    if (currentLesson?.writingExercise) {
      const updatedLesson = { ...currentLesson };
      updatedLesson.writingExercise.prompt = editingPromptText;
      setCurrentLesson(updatedLesson);
      setIsEditingWritingPrompt(false);
      toast.success("Đã cập nhật chủ đề!");
    }
  };

  const openAttachmentManager = (id?: string) => {
    if (id) {
      const att = currentLesson?.attachments.find(a => a.id === id);
      if (att) {
        setEditingAttachmentId(id);
        setAttachmentData({ name: att.name, size: att.size });
      }
    } else {
      setEditingAttachmentId(null);
      setAttachmentData({ name: "", size: "" });
    }
    setIsManagingAttachment(true);
  };

  const saveAttachment = () => {
    if (!currentLesson) return;
    const updatedLesson = { ...currentLesson };
    if (editingAttachmentId) {
      const idx = updatedLesson.attachments.findIndex(a => a.id === editingAttachmentId);
      if (idx !== -1) {
        updatedLesson.attachments[idx] = { ...updatedLesson.attachments[idx], ...attachmentData };
      }
    } else {
      updatedLesson.attachments.push({
        id: Math.random().toString(36).substr(2, 9),
        ...attachmentData,
        type: "document", // Default type to satisfy types.ts
      });
    }
    setCurrentLesson(updatedLesson);
    setIsManagingAttachment(false);
    toast.success("Đã lưu tài liệu!");
  };

  const deleteAttachment = (id: string) => {
    if (!currentLesson) return;
    const updatedLesson = { ...currentLesson };
    updatedLesson.attachments = updatedLesson.attachments.filter(a => a.id !== id);
    setCurrentLesson(updatedLesson);
    toast.success("Đã xoá tài liệu!");
  };

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
        .find(s => time >= s.startTime && time < s.endTime);
      
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

  // Handle auto-scroll for segments
  useEffect(() => {
    if (activeSegmentId && segmentsListRef.current) {
      const activeElement = segmentsListRef.current.querySelector(`[data-segment-id="${activeSegmentId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeSegmentId]);

  if (!currentLesson) return <p>Không tìm thấy bài giảng</p>;

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
      toast.info(`Chuyển đến mốc thời gian: ${formatTime(seconds)}`);
    }
  };

  return (
    <>
      <div className="space-y-8 pb-20 max-w-[1600px] mx-auto px-4">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại bài học
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">{currentLesson.title}</h1>
            <div className="flex gap-2">
              {isAdmin && <Badge className="bg-admin/10 text-admin border-admin/20">Quản trị viên</Badge>}
              {(isTeacher || pathname.includes("/teacher")) && <Badge className="bg-teacher/10 text-teacher border-teacher/20">Giảng viên</Badge>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Card className="border-none bg-muted/30 px-4 py-2 hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-black mb-0.5">Tiến độ bài học</p>
            <p className="text-sm font-bold">{answeredQuizzes.size}/{currentVideo?.quizzes.length || 0} Thử thách đã hoàn thành</p>
          </Card>
          {isAdmin && (
            <Button size="sm" variant="outline" className="border-admin text-admin hover:bg-admin/5 shadow-sm" onClick={() => toast.info("Tính năng chỉnh sửa bài giảng (demo)")}>
              <Settings className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Side-by-Side Video & Tracking */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        
        {/* Left: Video Player */}
        <div ref={videoContainerRef} className="relative group overflow-hidden rounded-[2rem] bg-black shadow-2xl ring-1 ring-white/10 aspect-video">
          {currentVideo ? (
            <div className="h-full w-full relative">
              <video
                ref={videoRef}
                src={currentVideo.url}
                controls
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
              />
              
              {/* Teacher Action: Add Quiz Button */}
              <div className="absolute top-6 right-6 flex gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                {(isTeacher || isAdmin || pathname.includes("/teacher")) && (
                  <Dialog open={isAddingQuiz} onOpenChange={setIsAddingQuiz}>
                    <DialogTrigger asChild>
                      <Button className="bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 rounded-full h-12 px-6 font-bold shadow-2xl">
                        <Plus className="h-4 w-4 mr-2" /> Thêm thử thách
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl overflow-hidden rounded-[2rem] border-none shadow-premium p-0">
                      <DialogHeader className="bg-primary p-8 text-white relative">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Plus className="h-5 w-5" />
                          </div>
                          Thiết lập thử thách video mới
                        </DialogTitle>
                        <p className="text-white/70 text-sm font-medium mt-2 italic">Học sinh sẽ cần vượt qua thử thách này để tiếp tục xem video</p>
                      </DialogHeader>
                      
                      <div className="p-8 space-y-8 bg-white max-h-[80vh] overflow-y-auto">
                        {/* Question Input */}
                        <div className="space-y-3">
                          <Label className="text-base font-black flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-primary" /> Câu hỏi hiển thị
                          </Label>
                          <Textarea 
                            placeholder="Nhập nội dung câu hỏi..." 
                            value={newQuiz.question} 
                            onChange={e => setNewQuiz({...newQuiz, question: e.target.value})} 
                            className="rounded-2xl h-24 border-muted-foreground/20 focus:ring-primary/10 text-lg font-medium italic"
                          />
                        </div>

                        {/* Options Grid */}
                        <div className="grid gap-4">
                          <Label className="text-base font-black flex items-center gap-2 mb-1">
                            <List className="h-4 w-4 text-primary" /> Đáp án lựa chọn
                          </Label>
                          {newQuiz.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                              <div 
                                onClick={() => setNewQuiz({...newQuiz, correctAnswer: i})}
                                className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-sm font-black border-2 cursor-pointer transition-all ${
                                  newQuiz.correctAnswer === i 
                                    ? "bg-status-success text-white border-status-success shadow-lg shadow-status-success/20 scale-105" 
                                    : "bg-muted/10 text-muted-foreground border-muted-foreground/10 hover:border-status-success/40"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                              <Input 
                                placeholder={`Nhập đáp án ${String.fromCharCode(65 + i)}...`} 
                                value={opt}
                                onChange={e => {
                                  const opts = [...newQuiz.options];
                                  opts[i] = e.target.value;
                                  setNewQuiz({...newQuiz, options: opts});
                                }}
                                className={`rounded-2xl h-14 border-muted-foreground/20 italic ${
                                  newQuiz.correctAnswer === i ? "ring-2 ring-status-success/20 border-status-success/40 bg-status-success/5" : ""
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Configuration Row */}
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-muted/20">
                          <div className="space-y-3">
                            <Label className="text-base font-black flex items-center gap-2 text-primary">
                              <Clock className="h-4 w-4" /> Thời điểm dừng (Giây)
                            </Label>
                            <Input 
                              type="number" 
                              value={newQuiz.timestamp} 
                              onChange={e => setNewQuiz({...newQuiz, timestamp: parseInt(e.target.value)})} 
                              className="rounded-2xl h-14 border-muted-foreground/20 font-black text-xl"
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-black">Video sẽ tự động dừng tại giây thứ {newQuiz.timestamp}</p>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-base font-black flex items-center gap-2 text-status-success">
                              <CheckCircle className="h-4 w-4" /> Số câu cần vượt qua
                            </Label>
                            <Input 
                              type="number" 
                              value={newQuiz.passScore} 
                              onChange={e => setNewQuiz({...newQuiz, passScore: parseInt(e.target.value)})} 
                              className="rounded-2xl h-14 border-muted-foreground/20 font-black text-xl"
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-black">Học sinh phải đạt {newQuiz.passScore} điểm để xem tiếp</p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="p-8 bg-muted/5 border-t w-full flex-row justify-end gap-3 mt-0">
                        <Button variant="ghost" onClick={() => setIsAddingQuiz(false)} className="rounded-2xl h-14 px-8 font-black">Hủy bỏ</Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-12 font-black shadow-2xl shadow-primary/30" onClick={() => { setIsAddingQuiz(false); toast.success("Đã lưu thử thách video!"); }}>Lưu thử thách</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Quiz Visual Markers */}
              {(isTeacher || isAdmin || pathname.includes("/teacher")) && currentVideo.quizzes.length > 0 && (
                <div className="absolute inset-x-0 bottom-[60px] h-2 px-12 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative w-full h-full">
                     {currentVideo.quizzes.map((q) => (
                       <div 
                         key={q.id} 
                         className={`absolute top-0 w-3 h-3 rounded-full border border-white shadow-lg ${
                           answeredQuizzes.has(q.id) ? "bg-status-success" : "bg-primary"
                         }`}
                         style={{ left: `${(q.timestamp / currentVideo.duration) * 100}%` }}
                       />
                     ))}
                  </div>
                </div>
              )}
              
              {/* Quiz Overlay */}
              {quizOverlay && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
                  <Card className="w-full max-w-lg border-none shadow-premium animate-in zoom-in-95 duration-200 overflow-hidden">
                    <CardHeader className="bg-primary/10 pb-6 pt-8 text-center ring-1 ring-primary/20">
                      <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4 mx-auto shadow-lg shadow-primary/20 text-white">
                        <HelpCircle className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-black">Thử thách giữa bài</CardTitle>
                      <p className="text-sm text-muted-foreground italic mt-2">Bạn cần trả lời đúng để xem tiếp bài giảng</p>
                    </CardHeader>
                    <CardContent className="space-y-6 p-8">
                      <div className="p-5 rounded-3xl bg-muted/50 border border-muted-foreground/10 font-bold text-lg leading-relaxed text-center">
                        {quizOverlay.question}
                      </div>
                      <div className="grid gap-3">
                        {quizOverlay.options.map((opt, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedAnswer(i)}
                            className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                              selectedAnswer === i 
                                ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                                : "border-transparent bg-muted/40 hover:bg-muted/60"
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                              selectedAnswer === i ? "bg-primary text-white border-primary" : "bg-white border-muted-foreground/20"
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className="font-bold">{opt}</span>
                          </button>
                        ))}
                      </div>
                      <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="w-full h-16 rounded-3xl bg-primary text-lg font-black shadow-2xl shadow-primary/30">
                        Xác nhận câu trả lời
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20">
              <VideoIcon className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-bold">Chưa có video bài học</p>
            </div>
          )}
        </div>

        {/* Right: Tracking Grid (Matching Video Height) */}
        <Card 
          className="border-none shadow-premium bg-white/50 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden flex flex-col min-h-[450px]"
          style={{ height: videoHeight > 0 ? `${videoHeight}px` : "auto" }}
        >
          <CardHeader className="bg-muted/5 border-b py-5 px-6 flex flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <List className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-black italic">Hệ thống Tracking</CardTitle>
            </div>
            {(isTeacher || isAdmin || pathname.includes("/teacher")) && (
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-primary/5 text-primary" onClick={() => setIsAddingSegment(true)}>
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          
          <ScrollArea ref={segmentsListRef} className="flex-1">
            <div className="divide-y divide-muted/20">
              {currentVideo?.segments?.map((seg) => (
                <button
                  key={seg.id}
                  data-segment-id={seg.id}
                  onClick={() => handleSeek(seg.startTime)}
                  className={`w-full text-left p-6 transition-all hover:bg-white group relative flex items-center gap-5 ${
                    activeSegmentId === seg.id ? "bg-white" : ""
                  }`}
                >
                  {activeSegmentId === seg.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full" />
                  )}
                  
                  <div className={`h-14 w-14 shrink-0 rounded-2xl flex flex-col items-center justify-center text-[10px] font-black border-2 transition-all ${
                    activeSegmentId === seg.id 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                      : "bg-muted/10 text-muted-foreground border-muted-foreground/10 group-hover:border-primary/40"
                  }`}>
                    <span className="opacity-70">{formatTime(seg.startTime)}</span>
                    <div className="w-5 h-[1.5px] bg-current/20 my-1 rounded-full" />
                    <span>{formatTime(seg.endTime)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm leading-snug line-clamp-2 ${
                      activeSegmentId === seg.id ? "font-bold text-foreground" : "text-muted-foreground font-medium"
                    }`}>
                      {seg.label}
                    </p>
                    {activeSegmentId === seg.id && (
                      <span className="text-[10px] text-primary font-black uppercase mt-1 flex items-center gap-1.5 animate-pulse">
                        <Play className="h-2 w-2 fill-current" /> Đang xem
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {(!currentVideo?.segments || currentVideo.segments.length === 0) && (
              <div className="p-12 text-center text-muted-foreground font-bold italic">Chưa có dữ liệu tracking</div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Bottom Tabs Section: Quiz Config, Exercises, Documents */}
      <Tabs defaultValue="exercises" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl border ring-1 ring-black/5">
            <TabsTrigger value="exercises" className="rounded-xl px-8 py-3 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">
              <ClipboardList className="mr-2 h-4 w-4" /> Bài tập tiết học
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl px-8 py-3 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">
              <FilePlus className="mr-2 h-4 w-4" /> Tài liệu & Đính kèm
            </TabsTrigger>
            {(isTeacher || isAdmin || pathname.includes("/teacher")) && (
              <TabsTrigger value="config" className="rounded-xl px-8 py-3 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg active:scale-95 transition-all">
                <Settings className="mr-2 h-4 w-4" /> Cấu hình giảng dạy
              </TabsTrigger>
            )}
          </TabsList>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 w-12 rounded-2xl shadow-sm"><Download className="h-5 w-5 text-muted-foreground" /></Button>
          </div>
        </div>

        <TabsContent value="config" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           <Card className="border-none shadow-premium bg-teacher/5 ring-1 ring-teacher/20 overflow-hidden">
              <CardHeader className="py-6 px-8 border-b border-teacher/10 bg-teacher/10">
                <CardTitle className="text-lg font-black text-teacher flex items-center gap-3 italic">
                  <div className="h-10 w-10 rounded-xl bg-teacher/20 flex items-center justify-center">
                    <Settings className="h-5 w-5" />
                  </div>
                  Trình quản lý thử thách & Phân đoạn
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-dashed border-2 bg-transparent p-8 flex flex-col items-center justify-center gap-4 group hover:bg-white/40 transition-colors cursor-pointer" onClick={() => setIsAddingQuiz(true)}>
                       <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <HelpCircle className="h-7 w-7 text-primary" />
                       </div>
                       <p className="font-black text-lg">Tạo thử thách mới</p>
                       <p className="text-xs text-muted-foreground text-center">Đặt câu hỏi tại một mốc thời gian để kiểm tra kiến thức của học kỳ</p>
                    </Card>
                    <Card className="border-dashed border-2 bg-transparent p-8 flex flex-col items-center justify-center gap-4 group hover:bg-white/40 transition-colors cursor-pointer" onClick={() => setIsAddingSegment(true)}>
                       <div className="h-14 w-14 rounded-full bg-teacher/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <List className="h-7 w-7 text-teacher" />
                       </div>
                       <p className="font-black text-lg">Thêm phân đoạn Tracking</p>
                       <p className="text-xs text-muted-foreground text-center">Gắn nhãn các phần quan trọng để học sinh dễ dàng tra cứu</p>
                    </Card>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Summary Quiz Section */}
          {currentLesson.summaryQuiz && (
            <Card className="border-none shadow-premium bg-white ring-1 ring-black/5 p-8 relative group/summary">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Kiểm tra tổng hợp bài học</h3>
                  <p className="text-sm text-muted-foreground">Vui lòng hoàn thành tất cả các câu hỏi dưới đây</p>
                </div>
              </div>
              <div className="grid gap-6">
                {currentLesson.summaryQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="p-6 rounded-3xl bg-muted/30 border space-y-4 relative group/q">
                    <p className="font-bold flex items-center gap-3 pr-12">
                      <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs border border-whiteShadow ring-4 ring-muted">0{idx + 1}</span>
                      {q.question}
                    </p>
                    
                    {(isAdmin || isTeacher) && (
                      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover/q:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary" onClick={() => handleEditQuestion(idx)}>
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-status-error" onClick={() => deleteQuestion(idx)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    )}
                    
                    {!(isAdmin || isTeacher) && (
                      <Textarea className="w-full rounded-2xl border-none shadow-inner p-5 text-sm min-h-[120px] bg-white italic" placeholder="Viết câu trả lời của bạn tại đây..." />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Writing Exercises */}
          {currentLesson.writingExercise && (
            <Card className="border-none shadow-premium overflow-hidden bg-primary/5 ring-1 ring-primary/20 group/writing">
              <CardHeader className="bg-primary/20 py-6 px-10 relative">
                <CardTitle className="text-lg font-black flex items-center justify-between text-primary italic pr-12">
                  <div className="flex items-center gap-3">
                    <Edit2 className="h-6 w-6" />
                    <span>Bài tập thực hành viết văn</span>
                  </div>
                </CardTitle>
                
                {(isAdmin || isTeacher) && (
                  <div className="absolute top-6 right-10 flex gap-2 opacity-0 group-hover/writing:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/50 text-muted-foreground hover:text-primary shadow-sm" onClick={handleEditPrompt}>
                       <Pencil className="h-5 w-5" />
                     </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-10">
                <div className="p-8 rounded-[2rem] bg-white border-2 border-primary/10 shadow-sm relative">
                  <div className="absolute top-0 left-10 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Chủ đề cần giải quyết</div>
                  <p className="text-xl font-bold text-foreground/80 leading-relaxed italic text-center">"{currentLesson.writingExercise.prompt}"</p>
                </div>
                
                {!(isAdmin || isTeacher) && (
                  <div className="mt-10 space-y-6">
                    {currentLesson.writingExercise.type === "online_text" ? (
                      <Textarea className="w-full rounded-[2.5rem] border-muted-foreground/10 p-10 text-lg min-h-[400px] bg-white shadow-xl focus:ring-primary/10 transition-all font-serif" placeholder="Đặt những câu chữ tâm huyết nhất của bạn vào đây..." />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border-4 border-dashed border-primary/20 group hover:border-primary/40 transition-all animate-pulse-slow">
                         <FilePlus className="h-16 w-16 text-primary/40 mb-6 group-hover:scale-110 transition-transform" />
                         <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-black rounded-full px-16 h-16 shadow-2xl transition-all active:scale-95" onClick={() => toast.info("Chọn tệp tin...")}>Chọn tệp hình ảnh bài làm</Button>
                         <p className="text-xs text-muted-foreground mt-6 uppercase font-black tracking-widest opacity-60">Hỗ trợ định dạng .PDF, .JPG, .PNG</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="animate-in slide-in-from-bottom-4 duration-500">
           <div className="grid gap-6 md:grid-cols-3">
              {currentLesson.attachments.map((att) => (
                <Card key={att.id} className="p-6 border-none shadow-sm bg-white hover:shadow-xl transition-all group ring-1 ring-black/5 rounded-3xl relative">
                   <div className="h-16 w-16 bg-muted/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                   </div>
                   
                   {(isAdmin || isTeacher) && (
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary" onClick={() => openAttachmentManager(att.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-status-error" onClick={() => deleteAttachment(att.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                   )}

                   <h4 className="font-black text-lg mb-1 leading-tight">{att.name}</h4>
                   <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-6">{att.size} • 12 May, 2026</p>
                   <Button variant="outline" className="w-full h-12 rounded-2xl font-black group-hover:bg-primary group-hover:text-white transition-all">
                      <Download className="mr-2 h-4 w-4" /> Tải tài liệu
                   </Button>
                </Card>
              ))}
              <Card className="p-6 border-dashed border-2 bg-transparent flex flex-col items-center justify-center gap-4 rounded-3xl cursor-pointer hover:bg-muted/5 transition-colors" onClick={() => openAttachmentManager()}>
                 <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground/40" />
                 </div>
                 <p className="text-xs font-black text-muted-foreground/60 uppercase">Thêm tài liệu bài học</p>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>

    {/* CRUD Modals */}
    <Dialog open={isEditingSummaryQuiz} onOpenChange={setIsEditingSummaryQuiz}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-black">Chỉnh sửa câu hỏi</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label className="font-bold mb-2 block">Nội dung câu hỏi</Label>
          <Textarea 
            value={editingQuestionText} 
            onChange={(e) => setEditingQuestionText(e.target.value)}
            className="rounded-xl min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsEditingSummaryQuiz(false)}>Hủy</Button>
          <Button onClick={saveEditedQuestion} className="bg-primary font-black">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={isEditingWritingPrompt} onOpenChange={setIsEditingWritingPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-black">Chỉnh sửa chủ đề viết</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label className="font-bold mb-2 block">Chủ đề bài viết</Label>
          <Textarea 
            value={editingPromptText} 
            onChange={(e) => setEditingPromptText(e.target.value)}
            className="rounded-xl min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsEditingWritingPrompt(false)}>Hủy</Button>
          <Button onClick={saveEditedPrompt} className="bg-primary font-black">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={isManagingAttachment} onOpenChange={setIsManagingAttachment}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-black">{editingAttachmentId ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-bold">Tên tài liệu</Label>
            <Input 
              placeholder="Ví dụ: Tài liệu ôn tập chương 1..." 
              value={attachmentData.name} 
              onChange={(e) => setAttachmentData({...attachmentData, name: e.target.value})}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Dung lượng (Ví dụ: 1.2MB, 500KB)</Label>
            <Input 
              placeholder="Nhập dung lượng..." 
              value={attachmentData.size} 
              onChange={(e) => setAttachmentData({...attachmentData, size: e.target.value})}
              className="rounded-xl"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsManagingAttachment(false)}>Hủy</Button>
          <Button onClick={saveAttachment} className="bg-primary font-black">Lưu tài liệu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default LessonDetailPage;
