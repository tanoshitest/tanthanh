import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessons } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Play, Circle, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import type { Quiz, Video } from "@/lib/types";

const LessonDetailPage = () => {
  const { lid } = useParams();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === lid);

  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [quizOverlay, setQuizOverlay] = useState<Quiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);

  const currentVideo: Video | undefined = lesson?.videos[currentVideoIdx];

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || !currentVideo || quizOverlay) return;
    const time = Math.floor(videoRef.current.currentTime);
    if (time === lastTimeRef.current) return;
    lastTimeRef.current = time;

    const quiz = currentVideo.quizzes.find((q) => q.timestamp === time && !answeredQuizzes.has(q.id));
    if (quiz) {
      videoRef.current.pause();
      setQuizOverlay(quiz);
      setSelectedAnswer(null);
      setAttempts(0);
    }
  }, [currentVideo, quizOverlay, answeredQuizzes]);

  useEffect(() => {
    lastTimeRef.current = 0;
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

  const allQuizzes = lesson.videos.flatMap((v) => v.quizzes);
  const answeredCount = answeredQuizzes.size;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
      <h1 className="text-xl font-bold">{lesson.title}</h1>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {currentVideo ? (
            <div className="relative rounded-xl overflow-hidden bg-foreground/5">
              <video
                ref={videoRef}
                src={currentVideo.url}
                controls
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
              />
              {quizOverlay && (
                <div className="absolute inset-0 bg-foreground/70 flex items-center justify-center p-4">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle className="text-base">📝 Quiz</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="font-medium">{quizOverlay.question}</p>
                      <div className="space-y-2">
                        {quizOverlay.options.map((opt, i) => (
                          <label key={i} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${selectedAnswer === i ? "border-primary bg-primary/5" : "hover:bg-accent"}`}>
                            <input type="radio" name="quiz" checked={selectedAnswer === i} onChange={() => setSelectedAnswer(i)} className="accent-primary" />
                            <span>{String.fromCharCode(65 + i)}. {opt}</span>
                          </label>
                        ))}
                      </div>
                      <Button onClick={handleAnswer} disabled={selectedAnswer === null} className="w-full">Trả lời</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentVideo.quizzes.length > 0 && (
                <div className="p-3 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Quiz:</span>
                  {currentVideo.quizzes.map((q) => (
                    <span key={q.id} className={`inline-block w-3 h-3 rounded-full ${answeredQuizzes.has(q.id) ? "bg-status-success" : "bg-muted-foreground/30"}`} title={`@${q.timestamp}s`} />
                  ))}
                  <span className="ml-2 text-muted-foreground">{answeredCount}/{allQuizzes.length}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Bài giảng này chưa có video</p>
          )}

          {lesson.attachments.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />Tài liệu</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {lesson.attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between rounded border p-3 text-sm">
                    <span>{att.name} ({att.size})</span>
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Tải xuống (demo)")}><Download className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {lesson.summaryQuiz && (
            <Card>
              <CardHeader><CardTitle className="text-base">Câu hỏi tổng hợp</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {lesson.summaryQuiz.questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-medium">{q.question}</p>
                    <textarea className="w-full rounded border p-2 text-sm min-h-[80px] bg-background" placeholder="Nhập câu trả lời..." />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {lesson.writingExercise && (
            <Card>
              <CardHeader><CardTitle className="text-base">{lesson.writingExercise.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{lesson.writingExercise.prompt}</p>
                {lesson.writingExercise.type === "online_text" ? (
                  <textarea className="w-full rounded border p-2 text-sm min-h-[120px] bg-background" placeholder="Viết bài..." />
                ) : (
                  <Button variant="outline" onClick={() => toast.info("Upload ảnh bài làm (demo)")}>📷 Upload ảnh bài làm</Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Danh sách video</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {lesson.videos.map((v, i) => (
                <button key={v.id} onClick={() => setCurrentVideoIdx(i)} className={`w-full flex items-center gap-2 rounded-lg p-3 text-left text-sm transition-colors ${i === currentVideoIdx ? "bg-primary/10 font-medium" : "hover:bg-accent"}`}>
                  {answeredQuizzes.size > 0 && v.quizzes.every((q) => answeredQuizzes.has(q.id)) && v.quizzes.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-status-success shrink-0" />
                  ) : i === currentVideoIdx ? (
                    <Play className="h-4 w-4 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="line-clamp-2">{v.title}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
