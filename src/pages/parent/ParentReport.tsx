import { useState } from "react";
import { useAuthStore, useLeaveStore } from "@/lib/store";
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
  AlertCircle,
  Send,
  Trash2,
  Search,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  const { addRequest, requests } = useLeaveStore();
  const parent = parentStudentAccounts.find((p) => p.name === userName) || parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];

  // Tuition Payment Demo State
  const [localFees, setLocalFees] = useState(tuitionFees.filter((f) => f.studentName === child.name));
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<"details" | "scanning" | "success">("details");

  // Leave request dialog state
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [leaveReason, setLeaveReason] = useState("");

  // All sessions available for child's classes
  const childSessions = sessions.filter((s) => child.classes.includes(s.classId));
  const myLeaveRequests = requests.filter((r) => r.studentId === child.id);

  const handleSubmitLeave = () => {
    if (!selectedSessionId) {
      toast.error("Vui lòng chọn buổi học muốn xin nghỉ");
      return;
    }
    if (!leaveReason.trim()) {
      toast.error("Vui lòng nhập lý do xin nghỉ");
      return;
    }
    const sess = sessions.find((s) => s.id === selectedSessionId);
    const cls = classes.find((c) => c.id === sess?.classId);

    addRequest({
      id: `leave-${Date.now()}`,
      studentId: child.id,
      studentName: child.name,
      sessionId: selectedSessionId,
      sessionDate: sess?.date || "",
      sessionTopic: sess?.topic || "",
      classId: sess?.classId || "",
      className: cls?.name || "",
      reason: leaveReason,
      submittedAt: new Date().toLocaleString("vi-VN"),
      status: "pending",
    });

    setIsLeaveOpen(false);
    setSelectedSessionId(null);
    setLeaveReason("");
    toast.success("Đã gửi đơn xin nghỉ học thành công! Giáo viên sẽ xem xét và phê duyệt.");
  };

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

  const handleOpenPayment = (fee: any) => {
    if (fee.status !== "pending") return;
    setSelectedFee(fee);
    setPaymentStep("details");
    setIsPaymentOpen(true);
  };

  const handleScan = () => {
    setPaymentStep("scanning");
    setTimeout(() => {
      setPaymentStep("success");
      // Update local state
      setLocalFees(prev => prev.map(f => 
        f.month === selectedFee?.month ? { ...f, status: "paid" } : f
      ));
      toast.success("Thanh toán thành công! Đã nhận chuyển khoản.");
      
      // Auto close after success
      setTimeout(() => {
        setIsPaymentOpen(false);
      }, 2000);
    }, 3000);
  };

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
        <div className="flex items-center gap-3">
          {myLeaveRequests.length > 0 && (
            <Badge className="bg-amber-500 text-white text-[10px] h-6 px-3 font-black">
              {myLeaveRequests.length} đơn xin nghỉ
            </Badge>
          )}
          <Button className="border-parent text-parent hover:bg-parent/5 font-bold shadow-none bg-white border" onClick={() => setIsLeaveOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Xin nghỉ học
          </Button>
        </div>
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
                   <ShieldCheck className="h-4 w-4 text-parent" /> Tanthanh Edu cam kết
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
                   {localFees.map((f, i) => (
                     <div 
                        key={i} 
                        onClick={() => handleOpenPayment(f)}
                        className={cn(
                          "flex items-center justify-between p-4 transition-all",
                          f.status === "pending" ? "cursor-pointer hover:bg-amber-50/50" : "opacity-80"
                        )}
                      >
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                             f.status === "paid" ? "bg-emerald-50 text-emerald-500" : 
                             f.status === "pending" ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                           )}>
                             <CreditCard className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-800">Tháng {f.month}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase">{f.amount.toLocaleString()}₫ • Hạn: {f.dueDate}</p>
                           </div>
                        </div>
                        <Badge className={`${
                          f.status === "paid" ? "bg-emerald-500 text-white" : 
                          f.status === "pending" ? "bg-amber-500 text-white animate-pulse" : "bg-rose-500 text-white"
                        } border-none shadow-none text-[9px] font-black px-3 h-5`}>
                          {f.status === "paid" ? "ĐÃ ĐÓNG" : f.status === "pending" ? "CHỜ THANH TOÁN" : "QUÁ HẠN"}
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

      {/* Leave Request Dialog */}
      <Dialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-gradient-to-r from-parent to-parent/80 text-white pb-12">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Calendar className="h-6 w-6" /> Đơn xin nghỉ học
            </DialogTitle>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">
              Chọn buổi học cần xin nghỉ và nhập lý do
            </p>
          </DialogHeader>

          <div className="p-8 -mt-8 bg-white rounded-t-[2.5rem] space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Session Schedule Table */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <BookOpen className="h-3 w-3" /> Lịch học của {child.name} — Chọn buổi cần nghỉ
              </Label>
              <div className="rounded-2xl border border-muted/20 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/10 border-b border-muted/20">
                      <th className="py-3 px-4 text-left text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ngày</th>
                      <th className="py-3 px-4 text-left text-[10px] font-black uppercase text-muted-foreground tracking-widest">Thứ</th>
                      <th className="py-3 px-4 text-left text-[10px] font-black uppercase text-muted-foreground tracking-widest">Giờ</th>
                      <th className="py-3 px-4 text-left text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lớp / Chủ đề</th>
                      <th className="py-3 px-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childSessions.map((sess) => {
                      const cls = classes.find(c => c.id === sess.classId);
                      const alreadyRequested = myLeaveRequests.some(r => r.sessionId === sess.id);
                      const isSelected = selectedSessionId === sess.id;

                      return (
                        <tr
                          key={sess.id}
                          onClick={() => !alreadyRequested && setSelectedSessionId(isSelected ? null : sess.id)}
                          className={cn(
                            "border-b border-muted/10 transition-colors",
                            alreadyRequested ? "opacity-50 cursor-not-allowed bg-muted/5" :
                            isSelected ? "bg-parent/10 cursor-pointer" : "hover:bg-slate-50 cursor-pointer"
                          )}
                        >
                          <td className="py-3 px-4 text-[11px] font-black text-slate-700">{sess.date}</td>
                          <td className="py-3 px-4 text-[11px] font-medium text-slate-500">{sess.day}</td>
                          <td className="py-3 px-4 text-[11px] font-medium text-slate-500">{sess.time}</td>
                          <td className="py-3 px-4">
                            <p className="text-[11px] font-black text-slate-700">{cls?.name}</p>
                            <p className="text-[10px] text-muted-foreground italic">{sess.topic}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {alreadyRequested ? (
                              <Badge className="bg-amber-500 text-white text-[9px] h-5 px-2 font-black">Đã gửi đơn</Badge>
                            ) : isSelected ? (
                              <Badge className="bg-parent text-white text-[9px] h-5 px-2 font-black">✓ Đã chọn</Badge>
                            ) : (
                              <span className="text-[9px] text-muted-foreground font-medium">Click để chọn</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <AlertCircle className="h-3 w-3" /> Lý do xin nghỉ
              </Label>
              <Textarea
                className="rounded-2xl bg-slate-50 border-none min-h-[100px] text-sm focus-visible:ring-parent italic placeholder:text-slate-300"
                placeholder="Nhập lý do xin nghỉ học (ví dụ: Bé bị ốm, gia đình có việc bận...)..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              />
            </div>

            {/* History */}
            {myLeaveRequests.length > 0 && (
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Lịch sử đơn xin nghỉ
                </Label>
                <div className="space-y-2">
                  {myLeaveRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between bg-muted/5 rounded-2xl p-4 border border-muted/10">
                      <div>
                        <p className="text-[11px] font-black text-slate-700">{req.className} — {req.sessionDate}</p>
                        <p className="text-[10px] text-muted-foreground italic mt-0.5">"{req.reason}"</p>
                      </div>
                      <Badge className={cn(
                        "text-[9px] font-black h-5 px-2",
                        req.status === "pending" ? "bg-amber-500" : req.status === "approved" ? "bg-emerald-500" : "bg-rose-500"
                      )}>
                        {req.status === "pending" ? "Đang chờ" : req.status === "approved" ? "Đã duyệt" : "Từ chối"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-0 bg-white flex gap-4">
            <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black text-xs uppercase" onClick={() => setIsLeaveOpen(false)}>
              Hủy
            </Button>
            <Button
              className="flex-[2] h-12 rounded-2xl bg-parent hover:bg-parent/90 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
              onClick={handleSubmitLeave}
            >
              <Send className="h-4 w-4 mr-2" /> Gửi đơn xin nghỉ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Payment Dialog - NEW */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className={cn(
            "p-8 text-white pb-12 transition-colors duration-500",
            paymentStep === "success" ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-orange-600"
          )}>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              {paymentStep === "success" ? <CheckCircle className="h-7 w-7 animate-bounce" /> : <CreditCard className="h-7 w-7" />}
              {paymentStep === "success" ? "Thanh toán thành công" : "Thanh toán học phí"}
            </DialogTitle>
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-2">
              {paymentStep === "success" ? "Chúng tôi đã nhận được học phí của bạn" : "Vui lòng quét mã QR bên dưới để đóng học phí"}
            </p>
          </DialogHeader>

          <div className="p-8 -mt-8 bg-white rounded-t-[2.5rem] flex flex-col items-center">
            {paymentStep === "details" && selectedFee && (
              <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black uppercase text-slate-400">Học sinh: <span className="text-slate-900">{child.name}</span></p>
                   <p className="text-3xl font-black text-slate-800">Tháng {selectedFee.month}</p>
                   <p className="text-xl font-bold text-amber-600 tracking-tight">{selectedFee.amount.toLocaleString()} VNĐ</p>
                </div>

                <div className="relative group mx-auto w-48 h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-amber-200 p-4 flex items-center justify-center transition-all hover:border-amber-400">
                   {/* Fake QR Image placeholder */}
                   <div className="bg-white w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 shadow-inner border border-slate-100">
                      <div className="grid grid-cols-3 gap-1 opacity-20">
                         {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-4 h-4 bg-black rounded-[2px]" />)}
                      </div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">QR PAYMENT MOCK</p>
                   </div>
                   <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                      <Search className="h-8 w-8 text-amber-600" />
                   </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Nội dung chuyển khoản</p>
                   <p className="text-xs font-bold text-slate-700 uppercase">HP {child.id} T{selectedFee.month.split('/')[0]} {child.name}</p>
                </div>

                <Button 
                  onClick={handleScan}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Zap className="h-5 w-5 animate-pulse" /> Quét mã thanh toán (Demo)
                </Button>
              </div>
            )}

            {paymentStep === "scanning" && (
              <div className="py-12 space-y-8 flex flex-col items-center animate-in zoom-in duration-500">
                 <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <h4 className="text-xl font-black text-slate-800">Đang kiểm tra giao dịch...</h4>
                    <p className="text-sm font-medium text-slate-400 italic">Vui lòng đợi trong giây lát</p>
                 </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="py-8 space-y-6 flex flex-col items-center animate-in zoom-in duration-500">
                 <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-50 shadow-inner">
                    <CheckCircle className="h-14 w-14" />
                 </div>
                 <div className="text-center space-y-2">
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">Thanh toán hoàn tất!</h4>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Đã nhận được chuyển khoản</p>
                    <div className="mt-4 p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100 w-full">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Mã giao dịch</p>
                       <p className="font-mono text-sm font-bold text-slate-600">TRX-{Date.now().toString().slice(-8)}</p>
                    </div>
                 </div>
                 <p className="text-[10px] font-black text-slate-300 uppercase italic">Giao diện sẽ tự đóng sau 2 giây...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentReport;
