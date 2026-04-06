import { useAuthStore } from "@/lib/store";
import { 
  parentStudentAccounts, 
  sessionAttendance, 
  sessionEvaluations, 
  sessions, 
  classes, 
  tuitionFees 
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  TrendingUp, 
  BookOpen, 
  GraduationCap,
  Info,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", 
  classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", 
  selfStudy: "Tự học", 
  diligence: "Chăm chỉ", 
  interaction: "Tương tác"
};

const RatingDots = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <div 
        key={i} 
        className={`h-1 w-1 rounded-full ${i <= value ? "bg-parent" : "bg-muted"}`} 
      />
    ))}
  </div>
);

const ParentReport = () => {
  const { userName, selectedChildId } = useAuthStore();
  const parent = parentStudentAccounts.find((p) => p.name === userName) || parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];

  const attendance = sessionAttendance.flatMap((sa) =>
    sa.records.filter((r) => r.studentId === child.id).map((r) => ({ 
      ...r, 
      sessionId: sa.sessionId 
    }))
  ).sort((a, b) => {
     const sA = sessions.find(s => s.id === a.sessionId);
     const sB = sessions.find(s => s.id === b.sessionId);
     return new Date(sB?.date || "").getTime() - new Date(sA?.date || "").getTime();
  });

  const evals = sessionEvaluations.filter((e) => e.studentId === child.id);
  const latestEval = evals[evals.length - 1];
  const radarData = latestEval ? Object.entries(latestEval.criteria).map(([k, v]) => ({ 
    subject: criteriaLabels[k] || k, 
    value: v, 
    fullMark: 10 
  })) : [];

  const fees = tuitionFees.filter((f) => f.studentName === child.name);

  // Stats
  const totalSessions = attendance.length;
  const presentCount = attendance.filter(a => a.status === "present").length;
  const lateCount = attendance.filter(a => a.status === "late").length;
  const absentCount = attendance.filter(a => a.status.startsWith("absent")).length;
  const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-muted/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-parent/10 flex items-center justify-center text-parent font-black text-xl rotate-3">
            {child.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Báo cáo học tập: {child.name}
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] h-5">Học sinh</Badge>
            </h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-parent" /> Lớp {child.grade} • {child.level.toUpperCase()}
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-parent text-parent hover:bg-parent/5 font-bold shadow-none" onClick={() => toast.info("Tính năng đang phát triển")}>
          Xin nghỉ học
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="bg-muted/30 p-1 mb-6 flex-wrap h-auto">
          <TabsTrigger value="info" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><Info className="h-3.5 w-3.5 mr-2" /> Thông tin</TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><Clock className="h-3.5 w-3.5 mr-2" /> Chuyên cần</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><TrendingUp className="h-3.5 w-3.5 mr-2" /> Kết quả học tập</TabsTrigger>
          <TabsTrigger value="tuition" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-[11px] font-bold h-9 px-6"><CreditCard className="h-3.5 w-3.5 mr-2" /> Học phí</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/5 py-4 border-b">
                 <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                   <User className="h-4 w-4 text-parent" /> Hồ sơ học viên
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Họ và tên</p>
                      <p className="font-bold text-slate-800">{child.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">ID Học sinh</p>
                      <p className="font-bold text-slate-800">{child.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Trình độ</p>
                      <p className="font-bold text-parent uppercase">{child.level}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Ngày sinh</p>
                      <p className="font-bold text-slate-800">{child.dateOfBirth}</p>
                    </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/5 py-4 border-b">
                 <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-slate-700">
                   <ShieldCheck className="h-4 w-4 text-parent" /> Trung tâm cam kết
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-xs font-medium text-slate-600">
                  <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Theo sát lộ trình cá nhân hóa</li>
                  <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Báo cáo kết quả định kỳ hàng tháng</li>
                  <li className="flex gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Hỗ trợ 24/7 qua cổng trao đổi</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <Card className="border-none bg-emerald-50 shadow-sm"><CardContent className="p-3 text-center">
              <p className="text-[9px] font-black uppercase text-emerald-600 mb-1">Có mặt</p>
              <p className="text-xl font-black text-emerald-700">{presentCount}</p>
            </CardContent></Card>
            <Card className="border-none bg-amber-50 shadow-sm"><CardContent className="p-3 text-center">
              <p className="text-[9px] font-black uppercase text-amber-600 mb-1">Đi trễ</p>
              <p className="text-xl font-black text-amber-700">{lateCount}</p>
            </CardContent></Card>
            <Card className="border-none bg-rose-50 shadow-sm"><CardContent className="p-3 text-center">
              <p className="text-[9px] font-black uppercase text-rose-600 mb-1">Nghỉ học</p>
              <p className="text-xl font-black text-rose-700">{absentCount}</p>
            </CardContent></Card>
            <Card className="border-none bg-parent/5 shadow-sm border border-parent/10"><CardContent className="p-3 text-center">
              <p className="text-[9px] font-black uppercase text-parent mb-1">Chuyên cần</p>
              <p className="text-xl font-black text-parent">{attendanceRate}%</p>
            </CardContent></Card>
          </div>

          <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
             <CardHeader className="py-4 border-b bg-muted/5">
                <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
                   <Clock className="h-4 w-4 text-parent" /> Nhật ký điểm danh
                </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-muted/10">
                  {attendance.map((a, i) => {
                    const session = sessions.find((s) => s.id === a.sessionId);
                    const cls = classes.find((c) => c.id === session?.classId);
                    return (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                             a.status === "present" ? "bg-emerald-100 text-emerald-600" :
                             a.status === "late" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                          }`}>
                            {a.status === "present" ? <CheckCircle className="h-4 w-4" /> : a.status === "late" ? <Clock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{session?.topic || "Nội dung buổi học"}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{session?.date} • {cls?.name}</p>
                          </div>
                        </div>
                        <Badge className={`${
                          a.status === "present" ? "bg-emerald-500/10 text-emerald-600" : 
                          a.status === "late" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                        } border-none shadow-none text-[9px] font-black px-2 h-5`}>
                          {a.status === "present" ? "CÓ MẶT" : a.status === "late" ? "ĐI TRỄ" : "VẮNG HỌC"}
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
                <CardHeader className="py-4 border-b bg-muted/5"><CardTitle className="text-xs font-black uppercase">Radar Kỹ Năng</CardTitle></CardHeader>
                <CardContent className="pt-6">
                  {radarData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                          <PolarRadiusAxis domain={[0, 10]} axisLine={false} tick={false} />
                          <Radar dataKey="value" stroke="hsl(217,91%,60%)" fill="hsl(217,91%,60%)" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 p-4 rounded-2xl bg-parent/5 border border-parent/10 italic text-[13px] text-slate-700 leading-relaxed">
                        "{latestEval?.comment}"
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10"><p className="text-sm text-muted-foreground">Đang cập nhật dữ liệu...</p></div>
                  )}
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
                <CardHeader className="py-4 border-b bg-muted/5"><CardTitle className="text-xs font-black uppercase">Lịch sử đánh giá</CardTitle></CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-muted/10">
                     {[...evals].reverse().map((ev, i) => {
                       const session = sessions.find(s => s.id === ev.sessionId);
                       return (
                         <div key={i} className="p-4 bg-white hover:bg-muted/5 transition-colors">
                           <div className="flex justify-between items-center mb-2">
                              <Badge variant="outline" className="text-[9px] font-black bg-muted/5 uppercase border-none">{session?.date}</Badge>
                              <RatingDots value={8} />
                           </div>
                           <p className="text-xs text-slate-700 font-medium leading-relaxed italic">"{ev.comment}"</p>
                         </div>
                       );
                     })}
                   </div>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="tuition" className="mt-0 space-y-6">
           <Card className="border-none shadow-sm ring-1 ring-muted/20 rounded-3xl overflow-hidden">
              <CardHeader className="py-4 border-b bg-muted/5"><CardTitle className="text-xs font-black uppercase">Danh sách học phí</CardTitle></CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-muted/10">
                   {fees.map((f, i) => (
                     <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <CreditCard className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800">Tháng {f.month}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase">{f.amount.toLocaleString()}₫ • Hạn: {f.dueDate}</p>
                           </div>
                        </div>
                        <Badge className={`${
                          f.status === "paid" ? "bg-emerald-500" : f.status === "pending" ? "bg-amber-500" : "bg-rose-500"
                        } text-white border-none shadow-none text-[9px] font-black px-3 h-5`}>
                          {f.status === "paid" ? "ĐÃ ĐỐNG" : f.status === "pending" ? "CHỜ THANH TOÁN" : "QUÁ HẠN"}
                        </Badge>
                     </div>
                   ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm ring-1 border-2 border-dashed border-parent/20 bg-parent/5 rounded-3xl overflow-hidden">
             <CardHeader className="py-4 border-b border-parent/10">
               <CardTitle className="text-xs font-black uppercase text-parent flex items-center gap-2">
                 <AlertCircle className="h-4 w-4" /> Thông tin thanh toán
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 text-sm space-y-3 font-medium text-slate-700">
               <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-parent/10">
                  <span className="text-xs text-muted-foreground uppercase font-black">Ngân hàng</span>
                  <span className="font-black">Vietcombank</span>
               </div>
               <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-parent/10">
                  <span className="text-xs text-muted-foreground uppercase font-black">Số tài khoản</span>
                  <span className="font-black text-parent">1234567890</span>
               </div>
               <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-parent/10">
                  <span className="text-xs text-muted-foreground uppercase font-black">Nội dung</span>
                  <span className="font-black uppercase">HP {child.name} T01/2025</span>
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentReport;
