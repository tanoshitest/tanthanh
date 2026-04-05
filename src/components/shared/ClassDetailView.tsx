import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  classes, sessions, sessionAttendance, sessionEvaluations, 
  lessons, assignments as initialAssignments, 
  mainTeachers, assistants, parentStudentAccounts
} from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle, Calendar,
  Plus, ClipboardList, GraduationCap, FileText,
  BookOpen, Info, FileSearch, Phone, MessageCircle, MoreHorizontal
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
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
  const { selectedChildId } = useAuthStore();
  const isParent = rolePrefix === "/parent";

  const cls = classes.find((c) => c.id === classId);

  const classSessions = sessions.filter((s) => s.classId === classId).sort((a, b) => b.date.localeCompare(a.date));
  const [selectedSessionId, setSelectedSessionId] = useState(classSessions[0]?.id || "");
  const [assignmentList, setAssignmentList] = useState(initialAssignments);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    totalPoints: "10"
  });

  if (!cls) return <p>Không tìm thấy lớp</p>;

  const allTeachers = [...mainTeachers, ...assistants];
  const teacher = allTeachers.find((t) => t.id === cls.teacherId);
  const selectedSession = classSessions.find((s) => s.id === selectedSessionId);
  const attendance = sessionAttendance.find((a) => a.sessionId === selectedSessionId);
  const evals = sessionEvaluations.filter((e) => e.sessionId === selectedSessionId);
  const sessionLessons = lessons.filter((l) => selectedSession?.lessonId && l.id === selectedSession.lessonId);
  const sessionAssignments = assignmentList.filter((a) => a.sessionId === selectedSessionId);
  
  const filteredAttendance = attendance?.records.filter(r => !isParent || r.studentId === selectedChildId) || [];
  const filteredEvals = evals.filter(e => !isParent || e.studentId === selectedChildId);
  const filteredAssignments = sessionAssignments.map(assgn => ({
    ...assgn,
    submissions: assgn.submissions.filter(s => !isParent || s.studentId === selectedChildId)
  }));

  const ungradedCount = sessionAssignments.reduce((c, a) => c + a.submissions.filter((s) => s.status === "submitted").length, 0);

  const handleAddAssignment = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tên bài tập");
      return;
    }

    const newAssgn = {
      id: `bt-${Date.now()}`,
      sessionId: selectedSessionId,
      lessonId: selectedSession?.lessonId || "",
      classId: classId,
      title: formData.title,
      submitType: "online_or_upload" as const,
      dueDate: formData.dueDate,
      totalPoints: parseInt(formData.totalPoints),
      submissions: []
    };

    setAssignmentList([...assignmentList, newAssgn]);
    setIsAddAssignmentOpen(false);
    toast.success(`Đã thêm bài tập: ${formData.title}`);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" />Quay lại
        </Button>
        <div>
          <h1 className="text-xl font-bold">{cls.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-admin">GV: {teacher?.name}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
            <span>{cls.studentCount}/{cls.maxStudents} Học sinh</span>
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-muted/20">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Label className="text-xs font-bold text-muted-foreground whitespace-nowrap">Chọn buổi học:</Label>
            <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
              <SelectTrigger className="max-w-md border-none bg-white shadow-none focus-visible:ring-admin h-9">
                <SelectValue placeholder="Chọn buổi học" />
              </SelectTrigger>
              <SelectContent>
                {classSessions.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.date} — {s.day} {s.time} — {s.topic}
                    {s.status === "upcoming" ? " (Sắp tới)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedSession && (
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="bg-muted/30 p-1 w-full justify-start overflow-x-auto no-scrollbar h-auto">
            <TabsTrigger value="attendance" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Điểm danh</TabsTrigger>
            <TabsTrigger value="evaluation" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Nhập điểm & Nhận xét</TabsTrigger>
            <TabsTrigger value="lessons" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Bài giảng</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              Bài tập 
              {!readonly && ungradedCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-[10px] h-4 min-w-[16px] px-1 animate-pulse">
                  {ungradedCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-4">
            <div className="space-y-2">
              {filteredAttendance.map((r) => (
                <div 
                  key={r.studentId} 
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-muted/20 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-admin/5 flex items-center justify-center text-xs font-bold text-admin border border-admin/10">
                      {r.studentName.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{r.studentName}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {readonly ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-status-success/10 text-status-success rounded-full border border-status-success/20">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold">Có mặt</span>
                      </div>
                    ) : (
                      <RadioGroup 
                        defaultValue={r.status} 
                        className="flex items-center gap-4"
                        onValueChange={() => toast.info(`Cập nhật: ${r.studentName}`)}
                      >
                        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted/30 rounded-lg transition-colors">
                          <RadioGroupItem value="present" id={`p-${r.studentId}`} className="h-4 w-4 text-admin" />
                          <Label htmlFor={`p-${r.studentId}`} className="text-[11px] font-medium cursor-pointer">Có mặt</Label>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted/30 rounded-lg transition-colors">
                          <RadioGroupItem value="absent_excused" id={`ae-${r.studentId}`} className="h-4 w-4 text-status-warning" />
                          <Label htmlFor={`ae-${r.studentId}`} className="text-[11px] font-medium cursor-pointer">Vắng CP</Label>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted/30 rounded-lg transition-colors">
                          <RadioGroupItem value="absent_unexcused" id={`au-${r.studentId}`} className="h-4 w-4 text-destructive" />
                          <Label htmlFor={`au-${r.studentId}`} className="text-[11px] font-medium cursor-pointer">Vắng KP</Label>
                        </div>
                      </RadioGroup>
                    )}

                    {!readonly && (
                      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-admin hover:bg-admin/5">
                           <Phone className="h-3.5 w-3.5" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-green-600 hover:bg-green-50">
                           <MessageCircle className="h-3.5 w-3.5" />
                         </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {!readonly && attendance && filteredAttendance.length > 0 && (
                <div className="pt-4 flex justify-center">
                  <Button 
                    className="bg-admin hover:bg-admin/90 h-10 px-10 rounded-full font-bold shadow-lg shadow-admin/20 transition-all hover:scale-[1.02]" 
                    onClick={() => toast.success("Đã xác nhận điểm danh!")}
                  >
                    Xác nhận hoàn tất điểm danh
                  </Button>
                </div>
              )}

              {filteredAttendance.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed">
                  <p className="text-muted-foreground text-sm italic">Chưa có dữ liệu học sinh</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="mt-4">
            <div className="space-y-4">
              {filteredEvals.length > 0 ? filteredEvals.map((ev) => {
                const radarData = Object.entries(ev.criteria).map(([k, v]) => ({ subject: criteriaLabels[k], value: v, fullMark: 10 }));
                return (
                  <Card key={ev.studentId} className="border-none shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-base font-bold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-admin" /> {sessionAttendance.find((a) => a.sessionId === ev.sessionId)?.records.find((r) => r.studentId === ev.studentId)?.studentName || ev.studentId}</CardTitle></CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <PolarRadiusAxis domain={[0, 10]} stroke="#e2e8f0" />
                            <Radar dataKey="value" stroke="hsl(217,91%,60%)" fill="hsl(217,91%,60%)" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(ev.criteria).map(([k, v]) => (
                          <div key={k} className="space-y-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{criteriaLabels[k]}</span>
                              {!readonly ? (
                                <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-lg border border-muted-foreground/10">
                                  <Input 
                                    type="number" 
                                    className="h-6 w-12 text-center text-[11px] font-bold p-0 bg-transparent border-none shadow-none focus-visible:ring-0" 
                                    defaultValue={v} 
                                    max={10} 
                                    min={0} 
                                    step={0.1}
                                  />
                                  <span className="text-[10px] font-bold text-muted-foreground opacity-50">/10</span>
                                </div>
                              ) : (
                                <span className="text-[11px] font-bold text-admin">{v}/10</span>
                              )}
                            </div>
                            <Slider value={[v]} max={10} step={0.5} disabled={readonly} className="h-1.5" />
                          </div>
                        ))}
                        <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-muted-foreground/10">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1 tracking-wider"><CheckCircle className="h-3 w-3 text-admin" /> Nhận xét tiết học</p>
                          {!readonly ? (
                            <Textarea 
                              className="text-xs bg-white border-muted-foreground/20 min-h-[80px] focus-visible:ring-admin" 
                              placeholder="Nhập nhận xét về buổi học của học sinh..."
                              defaultValue={ev.comment}
                            />
                          ) : (
                            <p className="text-sm italic font-medium leading-relaxed text-muted-foreground">"{ev.comment}"</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) : (
                <p className="text-muted-foreground text-center py-8">
                  {isParent ? "Chưa có đánh giá cho học sinh này" : "Chưa có đánh giá cho buổi này"}
                </p>
              )}

              {!readonly && (
                <div className="p-4 bg-white rounded-xl border border-admin/20 shadow-sm flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Sau khi điều chỉnh điểm, hãy nhấn lưu:</p>
                  <Button className="bg-admin" size="sm" onClick={() => toast.success("Đã cập nhật đánh giá!")}>Lưu thay đổi</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="mt-4 space-y-4">
            {rolePrefix === "/admin" && (
              <div className="flex justify-end">
                <Button size="sm" className="bg-admin h-8 px-4" onClick={() => toast.info("Tính năng thêm bài giảng (demo)")}>
                  <Plus className="mr-2 h-4 w-4" />Thêm bài giảng
                </Button>
              </div>
            )}
            {sessionLessons.length > 0 ? sessionLessons.map((lesson) => (
              <div key={lesson.id} className="group relative">
                <Card className="cursor-pointer hover:shadow-md transition-all border-none shadow-sm overflow-hidden" onClick={() => navigate(`${rolePrefix}/classes/${classId}/lesson/${lesson.id}`)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base transition-colors group-hover:text-admin">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px]">{lesson.videos.length} video</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px]">{lesson.attachments.length} tài liệu</Badge>
                        <Badge className={`${lesson.status === "published" ? "bg-status-success" : "bg-status-warning"} text-[10px]`}>
                          {lesson.status === "published" ? "Đã xuất bản" : "Nháp"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )) : (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4 font-medium">Chưa có nội dung bài giảng cho buổi này</p>
                {rolePrefix === "/admin" && (
                  <Button size="sm" variant="outline" className="border-admin text-admin hover:bg-admin/5" onClick={() => toast.info("Gán bài giảng từ thư viện")}>
                    Gán bài giảng từ thư viện
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="mt-4">
            <div className="space-y-6">
              {sessionAssignments.length > 0 ? [...sessionAssignments].reverse().map((assgn) => {
                const lesson = lessons.find(l => l.id === assgn.lessonId);
                return (
                  <div key={assgn.id} className="space-y-4">
                    {/* Bài tập giao học sinh - New section */}
                    <Card className="border-admin/20 bg-admin/5 shadow-none">
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-admin uppercase tracking-wider">
                          <BookOpen className="h-4 w-4" /> Nội dung bài tập giao học sinh
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] bg-white border-admin/30 text-admin font-bold">
                          Điểm tối đa: {assgn.totalPoints}đ
                        </Badge>
                      </CardHeader>
                      <CardContent className="py-3 px-4 bg-white/50">
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm">{assgn.title}</h4>
                          {lesson?.writingExercise && (
                            <div className="p-3 bg-white rounded-lg border border-dashed border-admin/30">
                              <p className="text-xs text-muted-foreground font-bold mb-1 flex items-center gap-1 uppercase tracking-tight">
                                <Info className="h-3 w-3" /> Yêu cầu chi tiết:
                              </p>
                              <p className="text-sm italic">"{lesson.writingExercise.prompt}"</p>
                            </div>
                          )}
                          <div className="flex gap-4 text-[10px] text-muted-foreground">
                            <span>Hạn nộp: <span className="font-bold text-admin">{assgn.dueDate}</span></span>
                            <span>Hình thức: <span className="font-bold">{assgn.submitType === "online_or_upload" ? "Trực tuyến / Tải tệp" : "Tải ảnh"}</span></span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Danh sách học sinh nộp bài */}
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardHeader className="py-3 px-4 border-b bg-muted/10">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" /> Danh sách học sinh nộp bài
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-muted/50">
                          {filteredAssignments.find(fa => fa.id === assgn.id)?.submissions.map((sub) => (
                            <div key={sub.id} className="p-4 hover:bg-muted/5 transition-colors">

                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-admin/10 flex items-center justify-center text-xs font-bold text-admin border border-admin/20">
                                    {sub.studentName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold">{sub.studentName}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      {sub.status === "graded" ? `Đã nộp: ${sub.submittedAt}` : sub.status === "submitted" ? `Chờ chấm - Nộp lúc: ${sub.submittedAt}` : "Chưa nộp"}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  {/* Cột File bài làm - New */}
                                  {(sub.status === "submitted" || sub.status === "graded") && sub.imageUrls?.[0] && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8 gap-2 border-admin/30 text-admin hover:bg-admin/5 px-2"
                                      onClick={() => setViewingImage(sub.imageUrls![0])}
                                    >
                                      <FileSearch className="h-4 w-4" />
                                      <span className="text-[10px] font-bold">File bài làm</span>
                                    </Button>
                                  )}

                                  {!readonly ? (
                                    <div className="flex items-center gap-3 bg-muted/20 p-2 rounded-xl border border-muted-foreground/10">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Điểm</Label>
                                        <Input 
                                          type="number" 
                                          className="h-8 w-16 text-center text-xs font-bold border-muted-foreground/20 focus-visible:ring-admin" 
                                          defaultValue={sub.score || 0}
                                        />
                                      </div>
                                      <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Nhận xét</Label>
                                        <Input 
                                          className="h-8 text-xs border-muted-foreground/20 focus-visible:ring-admin" 
                                          placeholder="Nhập nhận xét..."
                                          defaultValue={sub.feedback || ""}
                                        />
                                      </div>
                                      <Button 
                                        size="sm" 
                                        className="h-8 bg-admin text-[11px] font-bold shadow-none hover:bg-admin/90"
                                        onClick={() => toast.success(`Đã lưu điểm cho ${sub.studentName}`)}
                                      >
                                        Lưu điểm
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      {sub.status === "graded" && (
                                        <div className="text-right mr-2">
                                          <p className="text-xs font-bold text-admin">{sub.score}/{assgn.totalPoints}đ</p>
                                          <p className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{sub.feedback}</p>
                                        </div>
                                      )}
                                      <Badge className={`${sub.status === "graded" ? "bg-status-success" : sub.status === "submitted" ? "bg-status-warning" : "bg-status-danger"} text-[10px] border-none shadow-sm h-6 px-3`}>
                                        {sub.status === "graded" ? "Đã chấm" : sub.status === "submitted" ? "Chờ chấm" : "Chưa nộp"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )) : (
                            <p className="text-xs text-muted-foreground italic text-center py-8">Chưa có học sinh nào tham gia lớp này</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {!readonly && (
                      <div className="flex justify-end">
                        <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-admin text-admin h-8 px-4 font-bold hover:bg-admin/5">
                              <Plus className="mr-2 h-4 w-4" />Giao thêm bài tập khác
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Tạo bài tập mới cho buổi học</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {/* ... (Existing dialog fields) ... */}
                              <div className="space-y-2">
                                <Label className="text-xs">Tiêu đề bài tập</Label>
                                <Input 
                                  placeholder="Ví dụ: Bài tập về nhà tiết 1"
                                  value={formData.title}
                                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs">Hạn nộp</Label>
                                  <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Điểm tối đa</Label>
                                  <Input type="number" value={formData.totalPoints} onChange={(e) => setFormData({...formData, totalPoints: e.target.value})} />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setIsAddAssignmentOpen(false)}>Hủy</Button>
                              <Button className="bg-admin" onClick={handleAddAssignment}>Tạo bài tập</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/10">
                  <ClipboardList className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm font-medium mb-4">Chưa giao bài tập cho buổi học này</p>
                  {!readonly && (
                    <Button size="sm" className="bg-admin" onClick={() => setIsAddAssignmentOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Giao bài tập đầu tiên
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <div className="relative group">
            <img 
              src={viewingImage || ""} 
              alt="Student Submission" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="rounded-full h-8 w-8 p-0 bg-white/80 hover:bg-white text-black border-none shadow-md"
                onClick={() => setViewingImage(null)}
              >
                ✕
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              Ảnh chụp bài làm của học sinh
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassDetailView;

