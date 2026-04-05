import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { lessons, classes, sessions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Plus, Video, FileText, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AdminLessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return <p>Không tìm thấy bài giảng</p>;

  const cls = classes.find((c) => c.id === lesson.classId);
  const lessonSessions = sessions.filter((s) => lesson.sessionIds.includes(s.id));

  const [title, setTitle] = useState(lesson.title);
  const [desc, setDesc] = useState(lesson.description);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success(lesson.status === "published" ? "Chuyển sang Nháp" : "Đã xuất bản!")}>
            {lesson.status === "published" ? "Chuyển Nháp" : "Xuất bản"}
          </Button>
          <Button variant="destructive" onClick={() => toast.error("Xóa bài giảng (demo)")}><Trash2 className="mr-2 h-4 w-4" />Xóa</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Thông tin bài giảng</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên bài giảng</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex gap-4 text-sm">
            <p><span className="text-muted-foreground">Lớp:</span> {cls?.name}</p>
            <p><span className="text-muted-foreground">Buổi:</span> {lessonSessions.map((s) => `${s.date} - ${s.topic}`).join(", ")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5" />Video ({lesson.videos.length})</CardTitle>
          <Button size="sm" onClick={() => toast.info("Thêm video mới (demo)")}><Plus className="mr-1 h-3 w-3" />Thêm</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {lesson.videos.map((v) => (
            <div key={v.id} className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{v.title}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info("Sửa video (demo)")}>Sửa</Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.error("Xóa video (demo)")}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Quiz: {v.quizzes.length} câu</p>
              {v.quizzes.map((q) => (
                <div key={q.id} className="ml-4 rounded bg-muted p-3 text-sm">
                  <p className="font-medium">@{q.timestamp}s: {q.question}</p>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {q.options.map((opt, i) => (
                      <span key={i} className={i === q.correctAnswer ? "font-bold text-status-success" : "text-muted-foreground"}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Tài liệu ({lesson.attachments.length})</CardTitle>
          <Button size="sm" onClick={() => toast.info("Thêm tài liệu (demo)")}><Plus className="mr-1 h-3 w-3" />Thêm</Button>
        </CardHeader>
        <CardContent>
          {lesson.attachments.map((att) => (
            <div key={att.id} className="flex items-center justify-between rounded border p-3 mb-2">
              <span className="text-sm">{att.name} ({att.size})</span>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Xóa tài liệu (demo)")}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {lesson.summaryQuiz && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Câu hỏi tổng hợp</CardTitle></CardHeader>
          <CardContent>
            {lesson.summaryQuiz.questions.map((q) => (
              <div key={q.id} className="rounded border p-3 mb-2 text-sm">{q.question}</div>
            ))}
          </CardContent>
        </Card>
      )}

      {lesson.writingExercise && (
        <Card>
          <CardHeader><CardTitle>Bài viết kết nối</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{lesson.writingExercise.title}</p>
            <p className="text-muted-foreground">{lesson.writingExercise.prompt}</p>
            <Badge variant="secondary" className="mt-2">Loại: {lesson.writingExercise.type}</Badge>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="preview">
          <AccordionTrigger>Preview bài giảng (như HS/GV xem)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {lesson.videos.map((v) => (
                <div key={v.id} className="space-y-2">
                  <p className="font-medium">{v.title}</p>
                  <video src={v.url} controls className="w-full rounded-lg max-h-[300px]" />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdminLessonDetail;
