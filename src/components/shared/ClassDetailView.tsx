import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classes, sessions, sessionAttendance, sessionEvaluations, lessons, assignments, mainTeachers, assistants } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", selfStudy: "Tự học", diligence: "Chăm chỉ", interaction: "Tương tác"
};

const attendanceIcons: Record<string, { icon: typeof CheckCircle; label: string; className: string }> = {
  present: { icon: CheckCircle, label: "Có mặt", className: "text-status-success" },
  late: { icon: Clock, label: "Trễ", className: "text-status-warning" },
  absent_excused: { icon: AlertCircle, label: "Vắng CP", className: "text-status-warning" },
  absent_unexcused: { icon: XCircle, label: "Vắng KP", className: "text-destructive" },
};

interface Props {
  classId: string;
  readonly: boolean;
  rolePrefix: string;
}

const ClassDetailView = ({ classId, readonly, rolePrefix }: Props) => {
  const navigate = useNavigate();
  const cls = classes.find((c) => c.id === classId);
  const classSessions = sessions.filter((s) => s.classId === classId).sort((a, b) => b.date.localeCompare(a.date));
  const [selectedSessionId, setSelectedSessionId] = useState(classSessions[0]?.id || "");

  if (!cls) return <p>Không tìm thấy lớp</p>;

  const allTeachers = [...mainTeachers, ...assistants];
  const teacher = allTeachers.find((t) => t.id === cls.teacherId);
  const selectedSession = classSessions.find((s) => s.id === selectedSessionId);
  const attendance = sessionAttendance.find((a) => a.sessionId === selectedSessionId);
  const evals = sessionEvaluations.filter((e) => e.sessionId === selectedSessionId);
  const sessionLessons = lessons.filter((l) => selectedSession?.lessonId && l.id === selectedSession.lessonId);
  const sessionAssignments = assignments.filter((a) => a.sessionId === selectedSessionId);
  const ungradedCount = sessionAssignments.reduce((c, a) => c + a.submissions.filter((s) => s.status === "submitted").length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
        <div>
          <h1 className="text-xl font-bold">{cls.name}</h1>
          <p className="text-sm text-muted-foreground">GV: {teacher?.name} • {cls.studentCount}/{cls.maxStudents} HS</p>
        </div>
      </div>

      <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
        <SelectTrigger className="max-w-md">
          <SelectValue placeholder="Chọn buổi học" />
        </SelectTrigger>
        <SelectContent>
          {classSessions.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.date} — {s.day} {s.time} — {s.topic}
              {s.status === "upcoming" ? " (Sắp tới)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSession && (
        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
            <TabsTrigger value="evaluation">Nhập điểm & Nhận xét</TabsTrigger>
            <TabsTrigger value="lessons">Bài giảng</TabsTrigger>
            <TabsTrigger value="assignments">
              {readonly ? "Bài tập" : "Bài cần chấm"}
              {!readonly && ungradedCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs px-1.5">{ungradedCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardContent className="p-4 space-y-3">
                {attendance?.records.map((r) => {
                  const a = attendanceIcons[r.status];
                  return (
                    <div key={r.studentId} className="flex items-center justify-between rounded border p-3">
                      <span className="font-medium">{r.studentName}</span>
                      <div className="flex items-center gap-2">
                        <a.icon className={`h-4 w-4 ${a.className}`} />
                        <Badge variant="outline" className={a.className}>{a.label}</Badge>
                        {r.note && <span className="text-xs text-muted-foreground">({r.note})</span>}
                      </div>
                    </div>
                  );
                }) || <p className="text-muted-foreground">Chưa có dữ liệu điểm danh</p>}
                {!readonly && attendance && (
                  <Button className="mt-2" onClick={() => toast.success("Đã lưu điểm danh!")}>Lưu</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluation">
            <div className="space-y-4">
              {evals.length > 0 ? evals.map((ev) => {
                const radarData = Object.entries(ev.criteria).map(([k, v]) => ({ subject: criteriaLabels[k], value: v, fullMark: 10 }));
                return (
                  <Card key={ev.studentId}>
                    <CardHeader><CardTitle className="text-base">{sessionAttendance.find((a) => a.sessionId === ev.sessionId)?.records.find((r) => r.studentId === ev.studentId)?.studentName || ev.studentId}</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                          <PolarRadiusAxis domain={[0, 10]} />
                          <Radar dataKey="value" stroke="hsl(217,91%,60%)" fill="hsl(217,91%,60%)" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {Object.entries(ev.criteria).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-2 text-sm">
                            <span className="w-20 text-muted-foreground">{criteriaLabels[k]}</span>
                            <Slider value={[v]} max={10} step={0.5} disabled={readonly} className="flex-1" />
                            <span className="w-8 text-right font-medium">{v}</span>
                          </div>
                        ))}
                        <p className="text-sm text-muted-foreground mt-2">"{ev.comment}"</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) : <p className="text-muted-foreground">Chưa có đánh giá cho buổi này</p>}
              {!readonly && <Button onClick={() => toast.success("Đã lưu đánh giá!")}>Lưu</Button>}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            {sessionLessons.length > 0 ? sessionLessons.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer hover:shadow-md" onClick={() => navigate(`${rolePrefix}/classes/${classId}/lesson/${lesson.id}`)}>
                <CardContent className="p-4">
                  <h3 className="font-bold">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{lesson.videos.length} video</Badge>
                    <Badge variant="secondary">{lesson.attachments.length} tài liệu</Badge>
                  </div>
                </CardContent>
              </Card>
            )) : <p className="text-muted-foreground">Chưa có bài giảng cho buổi này</p>}
          </TabsContent>

          <TabsContent value="assignments">
            {sessionAssignments.length > 0 ? sessionAssignments.map((assgn) => (
              <Card key={assgn.id}>
                <CardHeader>
                  <CardTitle className="text-base">{assgn.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">Hạn nộp: {assgn.dueDate} • {assgn.totalPoints} điểm</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assgn.submissions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between rounded border p-3">
                      <div>
                        <p className="font-medium">{sub.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {sub.status === "graded" ? `${sub.score}/${assgn.totalPoints} — ${sub.feedback}` : sub.status === "submitted" ? `Nộp: ${sub.submittedAt}` : "Chưa nộp"}
                        </p>
                        {sub.status === "submitted" && sub.type === "online_text" && (
                          <p className="text-sm mt-1 border-l-2 pl-2 text-muted-foreground">{(sub as any).content?.slice(0, 100)}...</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={sub.status === "graded" ? "bg-status-success" : sub.status === "submitted" ? "bg-status-warning" : "bg-status-danger"}>
                          {sub.status === "graded" ? "Đã chấm" : sub.status === "submitted" ? "Chờ chấm" : "Chưa nộp"}
                        </Badge>
                        {!readonly && sub.status === "submitted" && (
                          <Button size="sm" onClick={() => toast.success("Đã chấm điểm!")}>Chấm</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )) : <p className="text-muted-foreground">Chưa có bài tập cho buổi này</p>}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ClassDetailView;
