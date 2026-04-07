import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  classes, sessions, sessionAttendance, sessionEvaluations, 
  lessons, assignments as initialAssignments, 
  mainTeachers, assistants, parentStudentAccounts,
  practiceExams
} from "@/lib/mock-data";
import { useAuthStore, useLeaveStore } from "@/lib/store";
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
  BookOpen, Info, FileSearch, Phone, MessageCircle, MoreHorizontal,
  Settings, Trash2, PlayCircle, Video, UserCheck, BarChart3, TrendingUp,
  FileDown, Download
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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
  const { requests: leaveRequests, updateStatus } = useLeaveStore();
  const isParent = rolePrefix === "/parent";

  const cls = classes.find((c) => c.id === classId);

  const classSessions = sessions.filter((s) => s.classId === classId).sort((a, b) => b.date.localeCompare(a.date));
  const [selectedSessionId, setSelectedSessionId] = useState(classSessions[0]?.id || "");
  const [assignmentList, setAssignmentList] = useState(() => {
    const saved = localStorage.getItem(`assignments_${classId}`);
    return saved ? JSON.parse(saved) : initialAssignments;
  });
  const [localAttendance, setLocalAttendance] = useState(() => {
    const saved = localStorage.getItem(`attendance_${classId}`);
    return saved ? JSON.parse(saved) : sessionAttendance;
  });
  const [localEvals, setLocalEvals] = useState(() => {
    const saved = localStorage.getItem(`evals_${classId}`);
    return saved ? JSON.parse(saved) : sessionEvaluations;
  });
  const [localLessons, setLocalLessons] = useState(() => {
    const saved = localStorage.getItem(`lessons_${classId}`);
    return saved ? JSON.parse(saved) : lessons;
  });

  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Challenge Config State
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  // Homework Upload Demo State
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadImages, setUploadImages] = useState<string[]>([]);
  const [uploadNotes, setUploadNotes] = useState("");
  const [submittingAssgnId, setSubmittingAssgnId] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`assignments_${classId}`, JSON.stringify(assignmentList));
  }, [assignmentList, classId]);

  useEffect(() => {
    localStorage.setItem(`attendance_${classId}`, JSON.stringify(localAttendance));
  }, [localAttendance, classId]);

  useEffect(() => {
    localStorage.setItem(`evals_${classId}`, JSON.stringify(localEvals));
  }, [localEvals, classId]);

  useEffect(() => {
    localStorage.setItem(`lessons_${classId}`, JSON.stringify(localLessons));
  }, [localLessons, classId]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    totalPoints: "10"
  });

  // Results Report State
  const allAssignments = assignmentList.filter(a => a.classId === classId);
  const allExams = practiceExams.filter(e => e.classId === classId);
  const allTests = [
    ...allAssignments.map(a => ({ id: a.id, title: a.title, type: "assignment" })),
    ...allExams.map(e => ({ id: e.id, title: e.title, type: "exam" }))
  ];

  const [reportFilterTestId, setReportFilterTestId] = useState<string>(allTests[0]?.id || "all");
  const [reportFilterGrade, setReportFilterGrade] = useState<string>("all");

  if (!cls) return <p>Không tìm thấy lớp</p>;

  const allTeachers = [...mainTeachers, ...assistants];
  const teacher = allTeachers.find((t) => t.id === cls.teacherId);
  const selectedSession = classSessions.find((s) => s.id === selectedSessionId);
  const attendance = localAttendance.find((a: any) => a.sessionId === selectedSessionId);
  const evals = localEvals.filter((e: any) => e.sessionId === selectedSessionId);
  const sessionLessons = localLessons.filter((l) => selectedSession?.lessonId && l.id === selectedSession.lessonId);
  const sessionAssignments = assignmentList.filter((a) => a.sessionId === selectedSessionId);

  // Merge leave requests: if a student has a leave request for this session, show as absent_excused
  const sessionLeaveRequests = leaveRequests.filter(r => r.sessionId === selectedSessionId && r.classId === classId);
  const filteredAttendance = (attendance?.records.filter((r: any) => !isParent || r.studentId === selectedChildId) || []).map((r: any) => {
    const hasLeave = sessionLeaveRequests.find(lr => lr.studentId === r.studentId);
    return hasLeave ? { ...r, status: "absent_excused" as const, note: `Đơn phép: ${hasLeave.reason}` } : r;
  });
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

  const handleMockUpload = () => {
    const mockImageUrls = [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000"
    ];
    const randomImg = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
    setUploadImages([...uploadImages, randomImg]);
    toast.success("Đã tải ảnh lên thành công!");
  };

  const handleSubmitHomework = () => {
    if (uploadImages.length === 0) {
      toast.error("Vui lòng đính kèm ít nhất 1 ảnh bài làm");
      return;
    }
    
    // In a real app, this would call an API. 
    // Here we just simulate success.
    setIsUploadDialogOpen(false);
    setUploadImages([]);
    setUploadNotes("");
    toast.success("Đã nộp bài tập thành công!");
  };

  const handleUpdateQuiz = () => {
    if (!editingLessonId) return;
    const newLessons = localLessons.map((l: any) => 
      l.id === editingLessonId ? { ...l, quiz: editingQuiz } : l
    );
    setLocalLessons(newLessons);
    setEditingLessonId(null);
    toast.success("Đã cập nhật cấu hình thử thách bài giảng");
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      timestamp: 60,
      question: "Câu hỏi mới",
      options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      correctAnswer: 0
    };
    setEditingQuiz({
      ...editingQuiz,
      questions: [...(editingQuiz?.questions || []), newQuestion]
    });
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
            <TabsTrigger value="session-report" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">Báo cáo buổi học</TabsTrigger>
            <TabsTrigger value="detailed-reports" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold text-admin mx-1 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Báo cáo
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Bài giảng</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
              {isParent ? "Nộp bài tập" : "Bài tập chờ chấm"}
              {!readonly && ungradedCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-[10px] h-4 min-w-[16px] px-1 animate-pulse">
                  {ungradedCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="practice-exams" className="text-xs px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">
              Luyện đề
            </TabsTrigger>
          </TabsList>

          <TabsContent value="session-report" className="mt-4">
            <div className="space-y-4">
              {/* Teacher: Leave Request Notifications */}
              {!readonly && sessionLeaveRequests.length > 0 && (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 overflow-hidden">
                  <div className="px-5 py-3 border-b border-amber-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-black uppercase text-amber-700 tracking-widest">
                      {sessionLeaveRequests.length} Đơn xin nghỉ buổi học này
                    </span>
                  </div>
                  {sessionLeaveRequests.map((req) => (
                    <div key={req.id} className="p-4 flex items-center justify-between gap-4 border-b border-amber-100 last:border-0 bg-white/50">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-black text-amber-700">
                          {req.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{req.studentName}</p>
                          <p className="text-[10px] text-muted-foreground italic mt-0.5">Lý do: "{req.reason}"</p>
                          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Gửi lúc: {req.submittedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-[9px] font-black h-5 px-2",
                          req.status === "pending" ? "bg-amber-400" : req.status === "approved" ? "bg-emerald-500" : "bg-rose-500"
                        )}>
                          {req.status === "pending" ? "Đang chờ" : req.status === "approved" ? "Đã duyệt" : "Từ chối"}
                        </Badge>
                        {req.status === "pending" && (
                          <>
                            <Button size="sm" className="h-7 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black px-3" onClick={() => { updateStatus(req.id, "approved"); toast.success(`Đã duyệt đơn nghỉ của ${req.studentName}`); }}>
                              Duyệt
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 text-[10px] font-black px-3" onClick={() => { updateStatus(req.id, "rejected"); toast.info(`Đã từ chối đơn nghỉ của ${req.studentName}`); }}>
                              Từ chối
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredAttendance.length > 0 ? filteredAttendance.map((record) => {
                const evalData = evals.find(e => e.studentId === record.studentId);
                const radarData = evalData ? Object.entries(evalData.criteria).map(([k, v]) => ({ 
                  subject: criteriaLabels[k], 
                  value: v, 
                  fullMark: 10 
                })) : [];

                return (
                  <Card key={record.studentId} className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
                    <CardHeader className="py-3 px-4 border-b bg-muted/5 flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-admin/10 flex items-center justify-center text-xs font-bold text-admin border border-admin/20">
                          {record.studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold">{record.studentName}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">Báo cáo chi tiết buổi học</p>
                        </div>
                      </div>
                      
                      {!readonly && (
                        <RadioGroup 
                          defaultValue={record.status} 
                          className="flex flex-wrap items-center gap-2 md:gap-4"
                          onValueChange={(val) => {
                            const newAttendance = localAttendance.map((a: any) => {
                              if (a.sessionId === selectedSessionId) {
                                return {
                                  ...a,
                                  records: a.records.map((r: any) => 
                                    r.studentId === record.studentId ? { ...r, status: val } : r
                                  )
                                };
                              }
                              return a;
                            });
                            setLocalAttendance(newAttendance);
                            toast.success(`Đã đánh dấu ${record.studentName}: ${attendanceIcons[val].label}`);
                          }}
                        >
                          {Object.entries(attendanceIcons).map(([key, { label, className }]) => (
                            <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value={key} id={`${record.studentId}-${key}`} className={`h-3.5 w-3.5 border-2 ${className.replace('text-', 'border-').replace('status-', '')}`} />
                              <Label htmlFor={`${record.studentId}-${key}`} className={`text-[10px] font-bold cursor-pointer ${className}`}>{label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      {evalData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="h-[220px] w-full bg-muted/5 rounded-2xl p-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} hide />
                                <Radar name={record.studentName} dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              {Object.entries(evalData.criteria).map(([key, value]) => (
                                <div key={key} className="space-y-1.5">
                                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight text-slate-600">
                                    <Label>{criteriaLabels[key]}</Label>
                                    <span className="bg-admin/10 text-admin px-2 py-0.5 rounded-md font-black">{value as number}/10</span>
                                  </div>
                                  <Slider 
                                    disabled={readonly}
                                    defaultValue={[value as number]} 
                                    max={10} 
                                    step={1} 
                                    className="pt-1"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-1.5 pt-2">
                              <Label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                                <MessageCircle className="h-3 w-3" /> Nhận xét buổi học
                              </Label>
                              <Textarea 
                                disabled={readonly}
                                className="text-xs min-h-[60px] bg-muted/20 border-none shadow-none focus-visible:ring-admin italic"
                                defaultValue={evalData.comment}
                                placeholder="Nhập nhận xét về buổi học..."
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/5 rounded-xl border border-dashed">
                          Chưa có dữ liệu đánh giá chi tiết cho học sinh này
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              }) : (
                <div className="text-center py-12 border-2 border-dashed rounded-3xl bg-muted/10">
                  <p className="text-muted-foreground text-sm font-medium">Không tìm thấy dữ liệu báo cáo cho buổi này</p>
                </div>
              )}

              {!readonly && filteredAttendance.length > 0 && (
                <div className="sticky bottom-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-admin/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 z-10 mx-auto max-w-2xl">
                  <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-status-success" /> Hoàn tất điểm danh và đánh giá:
                  </p>
                  <Button className="bg-admin rounded-xl px-8 shadow-lg shadow-admin/20 hover:scale-[1.02] transition-transform w-full md:w-auto" size="sm" onClick={() => toast.success("Đã lưu báo cáo buổi học thành công!")}>
                    Xác nhận & Lưu báo cáo
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="detailed-reports" className="mt-4">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="bg-muted/20 p-1 mb-4 w-fit h-auto">
                <TabsTrigger value="results" className="text-[10px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">Kết quả đào tạo</TabsTrigger>
                <TabsTrigger value="attendance" className="text-[10px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">Chuyên cần</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="mt-0 space-y-4">
                <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-muted-foreground whitespace-nowrap">Bài kiểm tra:</Label>
                    <Select value={reportFilterTestId} onValueChange={setReportFilterTestId}>
                      <SelectTrigger className="w-[200px] h-8 text-[11px]">
                        <SelectValue placeholder="Chọn bài kiểm tra" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTests.map(t => (
                          <SelectItem key={t.id} value={t.id} className="text-xs">{t.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold text-muted-foreground whitespace-nowrap">Xếp loại:</Label>
                    <Select value={reportFilterGrade} onValueChange={setReportFilterGrade}>
                      <SelectTrigger className="w-[120px] h-8 text-[11px]">
                        <SelectValue placeholder="Tất cả xếp loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs">Tất cả xếp loại</SelectItem>
                        <SelectItem value="excellent" className="text-xs text-indigo-600 font-bold">Xuất sắc (9-10)</SelectItem>
                        <SelectItem value="good" className="text-xs text-green-600 font-bold">Giỏi (8-8.9)</SelectItem>
                        <SelectItem value="fair" className="text-xs text-blue-600 font-bold">Khá (6.5-7.9)</SelectItem>
                        <SelectItem value="average" className="text-xs text-yellow-600 font-bold">Trung bình (5-6.4)</SelectItem>
                        <SelectItem value="weak" className="text-xs text-red-600 font-bold">Yếu (&lt; 5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-[50px] text-[10px] font-bold uppercase py-3">STT</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-3">Học sinh</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-3 text-center">Điểm số</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-3 text-center">Xếp loại</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-3">Nhận xét / Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const students = parentStudentAccounts.flatMap(p => p.children).filter(c => c.classes.includes(classId));
                        const test = allTests.find(t => t.id === reportFilterTestId);
                        
                        let data = students.map(s => {
                          let score: number | null = null;
                          let feedback = "";
                          let status = "N/A";

                          if (test?.type === "assignment") {
                            const assgn = assignmentList.find(a => a.id === test.id);
                            const sub = assgn?.submissions.find(sub => sub.studentId === s.id);
                            score = sub?.score || null;
                            feedback = sub?.feedback || "";
                            status = sub ? (sub.status === "graded" ? "Đã chấm" : "Chờ chấm") : "Chưa nộp";
                          } else if (test?.type === "exam") {
                            const exam = practiceExams.find(e => e.id === test.id);
                            const rank = exam?.rankings.find(r => r.studentName === s.name);
                            score = rank?.score || null;
                            status = score !== null ? "Hoàn thành" : "Chưa làm";
                          }

                          let classification = { label: "N/A", color: "bg-slate-100 text-slate-500", key: "none" };
                          if (score !== null) {
                            if (score >= 9) classification = { label: "Xuất sắc", color: "bg-indigo-100 text-indigo-600", key: "excellent" };
                            else if (score >= 8) classification = { label: "Giỏi", color: "bg-green-100 text-green-600", key: "good" };
                            else if (score >= 6.5) classification = { label: "Khá", color: "bg-blue-100 text-blue-600", key: "fair" };
                            else if (score >= 5) classification = { label: "Trung bình", color: "bg-yellow-100 text-yellow-600", key: "average" };
                            else classification = { label: "Yếu", color: "bg-red-100 text-red-600", key: "weak" };
                          }

                          return { student: s, score, classification, feedback, status };
                        });

                        if (reportFilterGrade !== "all") {
                          data = data.filter(d => d.classification.key === reportFilterGrade);
                        }

                        if (data.length === 0) return (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic text-sm">
                              Không tìm thấy kết quả phù hợp
                            </TableCell>
                          </TableRow>
                        );

                        return data.map((d, index) => (
                          <TableRow key={d.student.id} className="hover:bg-muted/5">
                            <TableCell className="text-xs py-3">{index + 1}</TableCell>
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-admin/10 flex items-center justify-center text-[10px] font-bold text-admin">
                                  {d.student.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold">{d.student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-3">
                              <span className={`text-xs font-black ${d.score !== null ? "text-admin" : "text-muted-foreground"}`}>
                                {d.score !== null ? `${d.score}đ` : "--"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center py-3">
                              {d.score !== null ? (
                                <Badge className={`${d.classification.color} text-[10px] border-none shadow-none`}>
                                  {d.classification.label}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] text-muted-foreground border-slate-200">
                                  {d.status}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-[11px] text-muted-foreground italic py-3 max-w-[200px] truncate">
                              {d.feedback || (d.score !== null ? "Đã có điểm" : "Chưa có nhận xét")}
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="mt-0">
                <Card className="border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="py-4 border-b bg-muted/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" /> Thống kê chuyên cần lớp học
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="w-[50px] text-[10px] font-bold uppercase py-3 sticky left-0 bg-white z-10">STT</TableHead>
                          <TableHead className="min-w-[180px] text-[10px] font-bold uppercase py-3 sticky left-[50px] bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Học sinh</TableHead>
                          <TableHead className="min-w-[100px] text-[10px] font-bold uppercase py-3 text-center bg-emerald-50/50">% Có mặt</TableHead>
                          {classSessions.map(s => (
                            <TableHead key={s.id} className="min-w-[80px] text-[10px] font-bold uppercase py-3 text-center border-l">
                              <div className="flex flex-col">
                                <span>{s.date.split('-').slice(1).reverse().join('/')}</span>
                                <span className="text-[8px] font-medium opacity-60">Buổi {s.id.split('-').pop()}</span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const students = parentStudentAccounts.flatMap(p => p.children).filter(c => c.classes.includes(classId));
                          
                          return students.map((s, index) => {
                            let presentCount = 0;
                            let sessionsWithData = 0;

                            const studentRow = classSessions.map(sess => {
                              const sessAtt = localAttendance.find((a: any) => a.sessionId === sess.id);
                              const record = sessAtt?.records.find((r: any) => r.studentId === s.id);
                              
                              if (record) {
                                sessionsWithData++;
                                if (record.status === "present" || record.status === "late") presentCount++;
                              }

                              return record?.status || null;
                            });

                            const attendancePercent = sessionsWithData > 0 ? Math.round((presentCount / sessionsWithData) * 100) : 0;

                            return (
                              <TableRow key={s.id} className="hover:bg-muted/5 transition-colors">
                                <TableCell className="text-xs py-3 sticky left-0 bg-white">{index + 1}</TableCell>
                                <TableCell className="py-3 sticky left-[50px] bg-white border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                  <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 font-black">
                                      {s.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold">{s.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center py-3 bg-emerald-50/30">
                                  <Badge className={`${attendancePercent >= 90 ? "bg-emerald-500" : attendancePercent >= 70 ? "bg-amber-500" : "bg-destructive"} text-white border-none shadow-none text-[10px] font-black px-2`}>
                                    {attendancePercent}%
                                  </Badge>
                                </TableCell>
                                {studentRow.map((status, i) => (
                                  <TableCell key={i} className="text-center py-3 border-l">
                                    {status ? (
                                      <div className="flex justify-center">
                                        {status === "present" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                        {status === "late" && <Clock className="h-4 w-4 text-amber-500" />}
                                        {status === "absent_excused" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                        {status === "absent_unexcused" && <XCircle className="h-4 w-4 text-destructive" />}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground opacity-20">—</span>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          });
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>


          <TabsContent value="lessons" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Danh sách bài giảng</h3>
              {rolePrefix === "/admin" && (
                <Button size="sm" className="bg-admin h-8 px-4" onClick={() => toast.info("Tính năng thêm bài giảng (demo)")}>
                  <Plus className="mr-2 h-4 w-4" />Thêm bài giảng
                </Button>
              )}
            </div>
            
            {sessionLessons.length > 0 ? sessionLessons.map((lesson) => (
              <Card key={lesson.id} className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-32 md:h-auto bg-slate-100 relative overflow-hidden group-hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`${rolePrefix}/classes/${classId}/lesson/${lesson.id}`)}>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <PlayCircle className="h-10 w-10 text-white drop-shadow-lg" />
                      </div>
                      <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${lesson.id}`} alt="lesson" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="cursor-pointer" onClick={() => navigate(`${rolePrefix}/classes/${classId}/lesson/${lesson.id}`)}>
                          <h4 className="font-bold text-base group-hover:text-admin transition-colors">{lesson.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{lesson.description}</p>
                        </div>
                        
                        {!readonly && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-admin/30 text-admin hover:bg-admin/5">
                                <Settings className="mr-1.5 h-3.5 w-3.5" /> Cấu hình thử thách
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Video className="h-5 w-5 text-admin" /> Cấu hình thử thách: {lesson.title}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="py-4 space-y-6">
                                <section className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-bold flex items-center gap-2"><ClipboardList className="h-4 w-4 text-admin" /> Danh sách câu hỏi</h5>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => toast.info("Thêm câu hỏi mới")}>
                                      <Plus className="mr-1 h-3 w-3" /> Thêm câu hỏi
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                      <Card key={i} className="border bg-muted/5">
                                        <CardContent className="p-4 space-y-4">
                                          <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-2">
                                              <Label className="text-xs font-bold">Câu hỏi {i}</Label>
                                              <Input defaultValue={i === 1 ? "Đâu là đặc điểm chính của đoạn văn NLVH?" : "Biện pháp tu từ nào được sử dụng trong câu trên?"} className="text-sm h-9" />
                                            </div>
                                            <div className="w-[120px] space-y-2">
                                              <Label className="text-xs font-bold">Vị trí dừng (s)</Label>
                                              <Input type="number" defaultValue={i * 120} className="text-sm h-9 text-center" />
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 mt-6">
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-3">
                                            {['A', 'B', 'C', 'D'].map((opt) => (
                                              <div key={opt} className="flex items-center gap-2">
                                                <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black border ${opt === 'A' ? 'bg-admin text-white border-admin' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                  {opt}
                                                </div>
                                                <Input defaultValue={`Đáp án ${opt} mẫu...`} className="text-xs h-8" />
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </section> section

                                <section className="p-4 bg-admin/5 rounded-2xl border border-admin/10 space-y-4">
                                  <h5 className="text-sm font-bold flex items-center gap-2"><Settings className="h-4 w-4 text-admin" /> Cấu hình đạt</h5>
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-bold">Số câu phải đạt</p>
                                      <p className="text-[10px] text-muted-foreground">Học sinh phải trả lời đúng tối thiểu số câu này để xem tiếp video</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Input type="number" defaultValue={2} className="h-9 w-16 text-center font-bold" />
                                      <span className="text-xs font-medium text-slate-500">/ 2 câu</span>
                                    </div>
                                  </div>
                                </section>
                              </div>
                              
                              <DialogFooter>
                                <Button className="bg-admin rounded-xl px-8" onClick={() => toast.success("Đã cập nhật cấu hình thử thách!")}>Lưu cấu hình</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-dashed mt-2">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-medium flex gap-1 items-center">
                          <Video className="h-3 w-3" /> {lesson.videos.length} Videos
                        </Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-medium flex gap-1 items-center">
                          <FileText className="h-3 w-3" /> {lesson.attachments.length} Tài liệu
                        </Badge>
                        <Badge className={`${lesson.status === "published" ? "bg-status-success text-white" : "bg-status-warning text-white"} text-[10px] border-none`}>
                          {lesson.status === "published" ? "Đã xuất bản" : "Nháp"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 border-2 border-dashed rounded-3xl bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm font-medium">Chưa có nội dung bài giảng cho buổi này</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="mt-4">
            <div className="space-y-6">
              {/* For parents: top-level quick submit button */}
              {isParent && sessionAssignments.length > 0 && (
                <div className="flex items-center justify-between bg-gradient-to-r from-admin/5 to-admin/10 border border-admin/20 rounded-3xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-admin/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-admin" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Nộp bài tập</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Tải ảnh bài làm để gửi giáo viên chấm điểm</p>
                    </div>
                  </div>
                  <Button
                    className="h-12 rounded-2xl bg-admin hover:bg-admin/90 text-white font-black text-[11px] uppercase tracking-widest px-8 shadow-lg shadow-admin/20 transition-all active:scale-95"
                    onClick={() => {
                      setSubmittingAssgnId(sessionAssignments[sessionAssignments.length - 1]?.id);
                      setIsUploadDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Đính kèm bài làm
                  </Button>
                </div>
              )}

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
                          {(() => {
                            const currentAssgn = filteredAssignments.find(fa => fa.id === assgn.id);
                            const submissions = currentAssgn?.submissions || [];
                            
                            // If parent and no submission found, create a placeholder for "Chưa nộp"
                            if (isParent && submissions.length === 0) {
                              return (
                                <div className="p-5 hover:bg-muted/5 transition-colors bg-white">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                        <AlertCircle className="h-6 w-6" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Trạng thái bài làm</p>
                                        <p className="text-[10px] text-rose-500 font-black uppercase tracking-tighter mt-0.5 animate-pulse">Chưa nộp bài tập này</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <Button 
                                        className="h-11 rounded-2xl bg-admin hover:bg-admin/90 text-white font-black text-[11px] uppercase tracking-widest px-8 shadow-lg shadow-admin/20 transition-all active:scale-95"
                                        onClick={() => {
                                          setSubmittingAssgnId(assgn.id);
                                          setIsUploadDialogOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Đính kèm bài làm
                                      </Button>
                                      <Badge className="bg-rose-500 text-white text-[10px] border-none shadow-sm h-7 px-4 font-black uppercase tracking-tighter">
                                        Chưa nộp
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (submissions.length === 0) {
                              return <p className="text-xs text-muted-foreground italic text-center py-8">Chưa có học sinh nào nộp bài</p>;
                            }

                            return submissions.map((sub) => (
                              <div key={sub.id} className="p-5 hover:bg-muted/5 transition-colors bg-white">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-admin/10 flex items-center justify-center text-sm font-black text-admin border border-admin/20 shadow-sm">
                                      {sub.studentName.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{sub.studentName}</p>
                                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                        {sub.status === "graded" ? `Nộp lúc: ${sub.submittedAt}` : sub.status === "submitted" ? `Chờ chấm - Nộp lúc: ${sub.submittedAt}` : "Chưa nộp"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-4">
                                    {(sub.status === "submitted" || sub.status === "graded") && (sub as any).imageUrls?.[0] && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-10 rounded-2xl gap-2 border-admin/30 text-admin hover:bg-admin/5 px-4 font-bold transition-all shadow-sm"
                                        onClick={() => setViewingImage((sub as any).imageUrls![0])}
                                      >
                                        <FileSearch className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">File bài làm</span>
                                      </Button>
                                    )}

                                    {!readonly ? (
                                      <div className="flex items-center gap-3 bg-muted/20 p-2 rounded-2xl border border-muted-foreground/10">
                                        <div className="flex items-center gap-2">
                                          <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Điểm</Label>
                                          <Input 
                                            type="number" 
                                            className="h-9 w-16 rounded-xl text-center text-xs font-black border-muted-foreground/20 focus-visible:ring-admin" 
                                            defaultValue={sub.score || 0}
                                          />
                                        </div>
                                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                          <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Nhận xét</Label>
                                          <Input 
                                            className="h-9 rounded-xl text-xs font-medium border-muted-foreground/20 focus-visible:ring-admin italic" 
                                            placeholder="Nhập nhận xét chi tiết..."
                                            defaultValue={sub.feedback || ""}
                                          />
                                        </div>
                                        <Button 
                                          size="sm" 
                                          className="h-9 rounded-xl bg-admin text-[10px] font-black uppercase tracking-widest shadow-md shadow-admin/10 hover:bg-admin/90 px-6"
                                          onClick={() => toast.success(`Đã lưu điểm cho ${sub.studentName}`)}
                                        >
                                          Lưu
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-4 bg-muted/5 p-2 rounded-2xl border border-muted/10 pr-4">
                                        {sub.status === "graded" && (
                                          <div className="text-right border-r border-muted/20 pr-4">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-0.5">Kết quả</p>
                                            <p className="text-lg font-black text-admin leading-none tracking-tighter">{sub.score}<span className="text-xs text-slate-400 ml-0.5">/{assgn.totalPoints}</span></p>
                                            <p className="text-[9px] text-muted-foreground italic truncate max-w-[150px] mt-1 font-medium">“{sub.feedback}”</p>
                                          </div>
                                        )}
                                        <Badge className={cn(
                                          "text-[10px] border-none shadow-sm h-8 px-4 font-black uppercase tracking-tighter",
                                          sub.status === "graded" ? "bg-emerald-500" : "bg-orange-500"
                                        )}>
                                          {sub.status === "graded" ? "Đã chấm" : "Chờ chấm"}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
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

          <TabsContent value="practice-exams" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-admin" /> Danh sách đề thi luyện tập
                </h3>
                <Badge variant="outline" className="text-[10px] border-admin/20 text-admin font-black">5 ĐỀ CÓ SẴN</Badge>
              </div>

              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="group border border-muted/50 hover:border-admin/40 transition-all hover:shadow-md bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-admin/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-6 w-6 text-admin" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-admin transition-colors line-clamp-1">
                          Đề thi thử số {i} - Ngữ văn 9 (Nâng cao) - Học kỳ 2
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 90 phút</span>
                          <span className="flex items-center gap-1"><FileDown className="h-3 w-3" /> PDF (1.{i} MB)</span>
                          <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black text-[8px]">MIỄN PHÍ</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-4 rounded-xl border-admin/20 text-admin hover:bg-admin/5 font-bold text-[11px] flex-1 md:flex-none"
                        onClick={() => toast.info(`Sắp ra mắt: Chế độ làm bài bài thi số ${i}`)}
                      >
                         Làm bài Online
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-9 px-4 rounded-xl bg-admin hover:bg-admin/90 font-bold text-[11px] shadow-lg shadow-admin/10 flex-1 md:flex-none"
                        onClick={() => toast.success(`Đã bắt đầu tải về: Đề thi thử số ${i}`)}
                      >
                        <Download className="mr-2 h-3.5 w-3.5" /> Tải về
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!readonly && (
                <div className="pt-4 flex justify-center">
                   <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-admin hover:bg-admin/5 font-bold" onClick={() => toast.info("Đang mở kho đề thi...")}>
                     <Plus className="mr-2 h-3.5 w-3.5" /> Xem thêm từ kho đề thi chung
                   </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Homework Submission Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-admin text-white pb-12">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Plus className="h-6 w-6" /> Nộp bài tập
            </DialogTitle>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">{assignmentList.find(a => a.id === submittingAssgnId)?.title}</p>
          </DialogHeader>
          
          <div className="p-8 -mt-8 bg-white rounded-t-[2.5rem] space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <FileSearch className="h-3 w-3" /> Tệp đính kèm ({uploadImages.length})
              </Label>
              
              <div className="grid grid-cols-3 gap-4">
                {uploadImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                    <img src={img} alt="upload" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setUploadImages(uploadImages.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={handleMockUpload}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-admin hover:text-admin hover:bg-admin/5 transition-all group"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-admin/10">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase">Tải ảnh lên</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <MessageCircle className="h-3 w-3" /> Ghi chú cho giáo viên
              </Label>
              <Textarea 
                className="rounded-2xl bg-slate-50 border-none min-h-[100px] text-sm focus-visible:ring-admin placeholder:text-slate-300 italic" 
                placeholder="Nhập ghi chú gửi đến cô giáo (ví dụ: Bé làm bài trang 45-46 ạ)..."
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="ghost" 
                className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400"
                onClick={() => setIsUploadDialogOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-2xl bg-admin hover:bg-admin/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-admin/20 transition-all active:scale-95"
                onClick={handleSubmitHomework}
              >
                Xác nhận nộp bài
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassDetailView;

