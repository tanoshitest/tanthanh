import { useParams, useNavigate } from "react-router-dom";
import { 
  mainTeachers, 
  assistants, 
  accountants, 
  parentStudentAccounts, 
  sessionAttendance, 
  sessionEvaluations, 
  tuitionFees, 
  sessions, 
  classes, 
  teacherPayroll 
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  TrendingUp, 
  BookOpen,
  Users,
  DollarSign,
  Briefcase,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", 
  classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", 
  selfStudy: "Tự học", 
  diligence: "Chăm chỉ", 
  interaction: "Tương tác"
};

const RatingDots = ({ value }: { value: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div 
          key={i} 
          className={`h-1.5 w-1.5 rounded-full ${i <= value ? "bg-admin" : "bg-muted"}`} 
        />
      ))}
    </div>
  );
};

const AdminUserDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  if (type === "student") {
    const parent = parentStudentAccounts.find((p) => p.children.some((c) => c.id === id));
    const student = parent?.children.find((c) => c.id === id);
    if (!student || !parent) return <p className="p-8 text-center text-muted-foreground">Không tìm thấy học sinh</p>;

    const evals = sessionEvaluations.filter((e) => e.studentId === id);
    const latestEval = evals[evals.length - 1];
    const radarData = latestEval ? Object.entries(latestEval.criteria).map(([k, v]) => ({ 
      subject: criteriaLabels[k] || k, 
      value: v, 
      fullMark: 10 
    })) : [];

    const attendance = sessionAttendance.flatMap((sa) => sa.records.filter((r) => r.studentId === id).map((r) => ({ 
      ...r, 
      sessionId: sa.sessionId 
    })));
    const fees = tuitionFees.filter((f) => f.studentName === student.name);

    // Calculate Stats
    const totalSessions = attendance.length;
    const presentCount = attendance.filter(a => a.status === "present").length;
    const lateCount = attendance.filter(a => a.status === "late").length;
    const absentCount = attendance.filter(a => a.status.startsWith("absent")).length;
    const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;

    const totalFees = fees.reduce((acc, f) => acc + f.amount, 0);
    const paidFees = fees.filter(f => f.status === "paid").reduce((acc, f) => acc + f.amount, 0);
    const balance = totalFees - paidFees;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-admin/5 text-muted-foreground hover:text-admin transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-muted/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-admin/10 flex items-center justify-center text-admin font-black text-2xl rotate-3">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{student.name}</h1>
                <Badge className={student.status === "active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"}>
                  {student.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-admin" /> ID: {student.id} • Khối {student.grade} • {student.level.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="border-admin text-admin hover:bg-admin/5 font-bold">Gửi tin nhắn</Button>
             <Button className="bg-admin hover:bg-admin/90 font-bold">Chỉnh sửa</Button>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="bg-muted/30 p-1 mb-6 flex-wrap h-auto">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><User className="h-3.5 w-3.5 mr-2" /> Thông tin</TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><Clock className="h-3.5 w-3.5 mr-2" /> Báo cáo chuyên cần</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><TrendingUp className="h-3.5 w-3.5 mr-2" /> Báo cáo học tập</TabsTrigger>
            <TabsTrigger value="tuition" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><CreditCard className="h-3.5 w-3.5 mr-2" /> Học phí</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/5 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                     <User className="h-4 w-4 text-admin" /> Thông tin cá nhân
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Khối lớp</p>
                      <p className="font-bold text-slate-800">Lớp {student.grade}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Trình độ</p>
                      <p className="font-bold text-slate-800 uppercase text-admin">{student.level}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Ngày sinh</p>
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" /> {student.dateOfBirth}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Email</p>
                      <p className="font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground/50" /> {parent.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/5 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                     <Users className="h-4 w-4 text-admin" /> Thông tin phụ huynh
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {parent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{parent.name}</p>
                        <p className="text-xs text-muted-foreground">Phụ huynh học sinh</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Số điện thoại</p>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-500" /> {parent.phone}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">SĐT Zalo</p>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-blue-500" /> {parent.zaloPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-0 space-y-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <Card className="border-none bg-emerald-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-emerald-600/80 mb-1">Có mặt</p>
                <p className="text-2xl font-black text-emerald-700">{presentCount}</p>
              </CardContent></Card>
              <Card className="border-none bg-amber-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-amber-600/80 mb-1">Đi trễ</p>
                <p className="text-2xl font-black text-amber-700">{lateCount}</p>
              </CardContent></Card>
              <Card className="border-none bg-rose-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-rose-600/80 mb-1">Vắng mặt</p>
                <p className="text-2xl font-black text-rose-700">{absentCount}</p>
              </CardContent></Card>
              <Card className="border-none bg-indigo-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-indigo-600/80 mb-1">Tỉ lệ</p>
                <p className="text-2xl font-black text-indigo-700">{attendanceRate}%</p>
              </CardContent></Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
              <CardHeader className="py-4 border-b bg-muted/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                   <Clock className="h-4 w-4 text-admin" /> Lịch sử điểm danh
                </CardTitle>
                <Badge variant="outline" className="text-[10px] h-5 bg-white border-muted/50">{totalSessions} buổi học</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/10">
                  {attendance.map((a, i) => {
                    const session = sessions.find((s) => s.id === a.sessionId);
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-muted/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                             a.status === "present" ? "bg-emerald-100 text-emerald-600" :
                             a.status === "late" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                          }`}>
                            {a.status === "present" ? <CheckCircle className="h-4 w-4" /> : a.status === "late" ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-700">{session?.topic || "Buổi học không tên"}</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase">{session?.date} • {session?.time}</p>
                          </div>
                        </div>
                        <Badge className={`${
                          a.status === "present" ? "bg-emerald-500/10 text-emerald-600" : 
                          a.status === "late" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                        } border-none shadow-none text-[9px] font-black`}>
                          {a.status === "present" ? "CÓ MẶT" : a.status === "late" ? "TRỄ" : a.status === "absent_excused" ? "VẮNG CP" : "VẮNG KP"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-0 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="py-4 border-b bg-muted/5"><CardTitle className="text-xs font-black uppercase tracking-tight">Đánh giá năng lực tổng quát</CardTitle></CardHeader>
                <CardContent className="pt-6">
                  {radarData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                          <PolarRadiusAxis domain={[0, 10]} axisLine={false} tick={false} />
                          <Radar dataKey="value" stroke="hsl(217,91%,60%)" fill="hsl(217,91%,60%)" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 italic text-sm text-indigo-800 leading-relaxed">
                        "{latestEval?.comment}"
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10"><p className="text-sm text-muted-foreground">Chưa có dữ liệu đánh giá</p></div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="py-4 border-b bg-muted/5"><CardTitle className="text-xs font-black uppercase tracking-tight">Chi tiết kỹ năng</CardTitle></CardHeader>
                <CardContent className="p-6">
                   <div className="space-y-4">
                     {radarData.map((d, i) => (
                       <div key={i} className="space-y-1.5">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wide">
                            <span className="text-slate-600">{d.subject}</span>
                            <span className="text-admin font-black">{d.value}/10</span>
                         </div>
                         <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-admin rounded-full transition-all duration-1000" 
                               style={{ width: `${d.value * 10}%` }}
                            />
                         </div>
                       </div>
                     ))}
                   </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden mt-6">
              <CardHeader className="py-4 border-b bg-muted/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                   <BookOpen className="h-4 w-4 text-admin" /> Nhận xét chi tiết theo buổi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/10">
                  {[...evals].reverse().map((ev, i) => {
                    const session = sessions.find(s => s.id === ev.sessionId);
                    return (
                      <div key={i} className="p-4 bg-white hover:bg-muted/5 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                           <Badge variant="outline" className="text-[9px] font-black bg-muted/5 uppercase">{session?.date} • {session?.topic}</Badge>
                           <RatingDots value={6} />
                        </div>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">"{ev.comment}"</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tuition" className="mt-0 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-none bg-slate-900 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Tổng học phí</p>
                <p className="text-2xl font-black text-white">{totalFees.toLocaleString()}₫</p>
              </CardContent></Card>
              <Card className="border-none bg-emerald-500 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-emerald-50/80 mb-1">Đã đóng</p>
                <p className="text-2xl font-black text-white">{paidFees.toLocaleString()}₫</p>
              </CardContent></Card>
              <Card className="border-none bg-rose-500 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-rose-50/80 mb-1">Phải thu</p>
                <p className="text-2xl font-black text-white">{balance.toLocaleString()}₫</p>
              </CardContent></Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
              <CardHeader className="py-4 border-b bg-muted/5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                   <CreditCard className="h-4 w-4 text-admin" /> Lịch sử thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/10">
                  {fees.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-700">Học phí {f.month}</p>
                          <p className="text-[10px] font-black text-admin">{f.amount.toLocaleString()}₫</p>
                        </div>
                      </div>
                      <Badge className={`${
                        f.status === "paid" ? "bg-emerald-500" : f.status === "pending" ? "bg-amber-500" : "bg-rose-500"
                      } text-white border-none shadow-none text-[9px] font-black px-3 h-5`}>
                        {f.status === "paid" ? "ĐÃ ĐÓNG" : f.status === "pending" ? "CHỜ THANH TOÁN" : "QUÁ HẠN"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (type === "teacher" || type === "assistant") {
    const allTeachers = [...mainTeachers, ...assistants];
    const teacher = allTeachers.find((t) => t.id === id);
    if (!teacher) return <p className="p-8 text-center text-muted-foreground">Không tìm thấy giáo viên</p>;
    const teacherClasses = classes.filter((c) => c.teacherId === id || c.assistantId === id);
    const payroll = teacherPayroll.find((p) => p.teacherName === teacher.name);
    
    // Derive Sessions Taught
    const teacherSessions = sessions.filter(s => teacherClasses.some(c => c.id === s.classId)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-admin/5 text-muted-foreground hover:text-admin transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-muted/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-2xl rotate-3">
              {teacher.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{teacher.name}</h1>
                <Badge className="bg-indigo-500 hover:bg-indigo-600">
                  {teacher.type === "main" ? "Giáo viên chính" : "Trợ giảng"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-500" /> {teacher.subject} • {teacherClasses.length} Lớp phụ trách
              </p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 font-bold">Lịch cá nhân</Button>
             <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold">Chỉnh sửa</Button>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="bg-muted/30 p-1 mb-6 flex-wrap h-auto">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><User className="h-3.5 w-3.5 mr-2" /> Thông tin</TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><Clock className="h-3.5 w-3.5 mr-2" /> Điểm danh buổi làm</TabsTrigger>
            <TabsTrigger value="payroll" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><DollarSign className="h-3.5 w-3.5 mr-2" /> Báo cáo lương</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/5 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                     <User className="h-4 w-4 text-indigo-600" /> Thông tin liên hệ
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="space-y-4 font-medium text-slate-700">
                     <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground/60" /> {teacher.email}</p>
                     <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-emerald-500" /> {teacher.phone}</p>
                     <p className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-indigo-500" /> Chuyên môn: {teacher.subject}</p>
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/5 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                     <GraduationCap className="h-4 w-4 text-indigo-600" /> Lớp phụ trách
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-muted/10">
                    {teacherClasses.map((c) => (
                      <div key={c.id} className="p-4 hover:bg-muted/5 transition-colors">
                        <p className="text-sm font-black text-slate-800 mb-1">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-2 uppercase tracking-wide">
                          <Users className="h-3.5 w-3.5" /> {c.studentCount}/{c.maxStudents} Học sinh • {c.schedule.map((s) => `${s.day} ${s.time}`).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-0">
             <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="py-4 border-b bg-muted/5 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                     <Clock className="h-4 w-4 text-indigo-600" /> Nhật ký giảng dạy
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] h-5 bg-white border-muted/50 font-bold">{teacherSessions.length} buổi đã dạy</Badge>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-muted/10">
                     {teacherSessions.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-muted/5 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-black">
                             {i + 1}
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{s.topic || "Nội dung buổi dạy"}</p>
                             <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                               {classes.find(c => c.id === s.classId)?.name} • {s.date} • {s.time}
                             </p>
                           </div>
                         </div>
                         <Badge className="bg-emerald-500/10 text-emerald-600 border-none shadow-none text-[9px] font-black tracking-widest h-6 px-3">HOÀN THÀNH</Badge>
                       </div>
                     ))}
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-0 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-none bg-slate-900 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Lương tháng {payroll?.month}</p>
                <p className="text-2xl font-black text-white">{payroll?.salary.total.toLocaleString()}₫</p>
              </CardContent></Card>
              <Card className="border-none bg-indigo-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-indigo-600/80 mb-1">Số buổi dạy</p>
                <p className="text-2xl font-black text-indigo-700">{payroll?.sessions}</p>
              </CardContent></Card>
              <Card className="border-none bg-emerald-50 shadow-sm"><CardContent className="p-4 text-center">
                <p className="text-[10px] font-black uppercase text-emerald-600/80 mb-1">Số giờ dạy</p>
                <p className="text-2xl font-black text-emerald-700">{payroll?.hours}h</p>
              </CardContent></Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
               <CardHeader className="py-4 border-b bg-muted/5">
                 <CardTitle className="text-xs font-black uppercase tracking-tight">Chi tiết thanh toán</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Lương cơ bản (mỗi buổi)</span>
                      <span className="font-black text-slate-800">{(payroll?.salary.total / payroll?.sessions).toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Phụ cấp/Thưởng</span>
                      <span className="font-black text-emerald-600">+0₫</span>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center">
                       <span className="font-black text-slate-800">TỔNG LƯƠNG NHẬN</span>
                       <span className="text-xl font-black text-indigo-700 underline decoration-indigo-200 underline-offset-4">{payroll?.salary.total.toLocaleString()}₫</span>
                    </div>
                 </div>
               </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (type === "accountant") {
    const acc = accountants.find((a) => a.id === id);
    if (!acc) return <p className="p-8 text-center text-muted-foreground">Không tìm thấy kế toán</p>;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-admin/5 text-muted-foreground hover:text-admin transition-all">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-muted/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-admin font-black text-2xl rotate-3">
              {acc.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{acc.name}</h1>
                <Badge className="bg-slate-500 text-white font-black h-5 text-[10px]">KẾ TOÁN</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 uppercase tracking-wide text-[10px]">
                <FileText className="h-4 w-4 text-admin" /> Quản lý tài chính & Nhân sự
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="bg-muted/30 p-1 mb-6 flex-wrap h-auto">
            <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><User className="h-3.5 w-3.5 mr-2" /> Thông tin</TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><Clock className="h-3.5 w-3.5 mr-2" /> Điểm danh buổi làm</TabsTrigger>
            <TabsTrigger value="payroll" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><DollarSign className="h-3.5 w-3.5 mr-2" /> Báo cáo lương</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
             <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden max-w-xl">
                <CardHeader className="bg-muted/5 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                     <User className="h-4 w-4 text-admin" /> Thông tin liên hệ
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm font-bold p-8">
                  <p className="flex items-center gap-4 text-slate-700">
                    <Mail className="h-5 w-5 text-muted-foreground/50" /> 
                    <span>{acc.email}</span>
                  </p>
                  <p className="flex items-center gap-4 text-slate-700">
                    <Phone className="h-5 w-5 text-emerald-500" /> 
                    <span>{acc.phone}</span>
                  </p>
                  <div className="pt-4 mt-2 border-t">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Loại nhân viên</p>
                    <p className="text-admin font-black">Nhân viên văn phòng (Cố định)</p>
                  </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-0">
             <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                   <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-slate-300" />
                   </div>
                   <p className="text-slate-500 font-bold max-w-xs">Nhân viên kế toán làm việc theo giờ hành chính cố định. Không có nhật ký buổi học.</p>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="payroll" className="mt-0">
             <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden max-w-md">
                <CardHeader className="bg-admin/90 py-4 border-b">
                   <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
                     <CreditCard className="h-4 w-4" /> Chi tiết lương
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Lương cứng hàng tháng</p>
                    <p className="text-3xl font-black text-slate-900">{acc.baseSalary.toLocaleString()}₫</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                       <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-indigo-900 tracking-tight">Thanh toán đúng hạn</p>
                      <p className="text-[10px] font-bold text-indigo-400">Ngày 05 hàng tháng</p>
                    </div>
                  </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return <p className="p-8 text-center text-muted-foreground">Sức khỏe hệ thống không ổn định</p>;
};

export default AdminUserDetail;
