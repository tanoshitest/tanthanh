import { useState } from "react";
import { tuitionFees, teacherPayroll, classes, sessions, sessionAttendance, sessionEvaluations, parentStudentAccounts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, AlertTriangle, CheckCircle, MessageCircle, BarChart3, 
  Clock, UserCheck, GraduationCap, Calendar, Filter, Users,
  Search, Download, FileText, ChevronRight, XCircle, AlertCircle, TrendingUp,
  LayoutGrid, Pencil, History
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AdminReports = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("01/2025");
  const [selectedTest, setSelectedTest] = useState("all");
  const [selectedGradeRange, setSelectedGradeRange] = useState("all");

  // Tuition Edit State
  const [localTuition, setLocalTuition] = useState(tuitionFees);
  const [editingFee, setEditingFee] = useState<any | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");
  const [tuitionLog, setTuitionLog] = useState<Array<{
    id: string;
    timestamp: string;
    studentName: string;
    field: string;
    oldValue: string;
    newValue: string;
    note: string;
    admin: string;
  }>>([{
    id: "log-demo-1",
    timestamp: "07/04/2025 08:30",
    studentName: "Trương Đình Phúc",
    field: "Khoản thu",
    oldValue: "3,000,000₫",
    newValue: "2,500,000₫",
    note: "Áp dụng học bổng 500k cho học sinh xuất sắc",
    admin: "Nguyễn Văn Admin"
  }, {
    id: "log-demo-2",
    timestamp: "06/04/2025 15:45",
    studentName: "Nguyễn Minh Khôi",
    field: "Tình trạng",
    oldValue: "Chờ TT",
    newValue: "Đã đóng",
    note: "PH xác nhận đã chuyển khoản",
    admin: "Nguyễn Văn Admin"
  }]);

  // Filter Logic
  const filteredTuition = localTuition.filter(f => 
    (selectedClass === "all" || parentStudentAccounts.find(p => p.children.some(c => c.name === f.studentName))?.children.some(c => c.classes.includes(selectedClass))) &&
    f.month === selectedMonth
  );

  const handleSaveFeeEdit = () => {
    if (!editingFee) return;
    const changes: string[] = [];
    const newAmount = parseInt(editAmount.replace(/,/g, ""));
    const statusLabels: Record<string, string> = { paid: "Đã đóng", pending: "Chờ TT", overdue: "Quá hạn" };

    const updatedTuition = localTuition.map((f) => {
      if (f.studentName === editingFee.studentName && f.month === editingFee.month) {
        const logs = [];
        if (newAmount !== f.amount) {
          logs.push({ field: "Khoản thu", oldValue: `${f.amount.toLocaleString()}₫`, newValue: `${newAmount.toLocaleString()}₫` });
        }
        if (editStatus !== f.status) {
          logs.push({ field: "Tình trạng", oldValue: statusLabels[f.status], newValue: statusLabels[editStatus] });
        }
        logs.forEach(log => {
          setTuitionLog(prev => [{
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toLocaleString("vi-VN"),
            studentName: editingFee.studentName,
            field: log.field,
            oldValue: log.oldValue,
            newValue: log.newValue,
            note: editNote,
            admin: "Nguyễn Văn Admin"
          }, ...prev]);
        });
        return { ...f, amount: newAmount, status: editStatus as any };
      }
      return f;
    });
    setLocalTuition(updatedTuition);
    setEditingFee(null);
    toast.success(`Đã cập nhật học phí cho ${editingFee.studentName}!`);
  };

  const filteredPayroll = teacherPayroll.filter(p => p.month === selectedMonth);

  // Attendance Logic
  const sessionIds = sessions
    .filter(s => (selectedClass === "all" || s.classId === selectedClass) && s.date.includes(selectedMonth.split("/")[1]))
    .map(s => s.id);
  
  const filteredAttendance = sessionAttendance.filter(a => sessionIds.includes(a.sessionId));
  
  const attendanceStats = filteredAttendance.reduce((acc, curr) => {
    curr.records.forEach(r => {
      acc.total++;
      if (r.status === "present") acc.present++;
      else if (r.status === "late") acc.late++;
      else acc.absent++;
    });
    return acc;
  }, { total: 0, present: 0, late: 0, absent: 0 });

  const attendanceRate = attendanceStats.total > 0 ? (attendanceStats.present / attendanceStats.total) * 100 : 0;

  // Performance Logic
  const filteredEvaluations = sessionEvaluations.filter(e => sessionIds.includes(e.sessionId));
  
  const criteriaAvg = filteredEvaluations.reduce((acc: any, curr) => {
    Object.entries(curr.criteria).forEach(([k, v]) => {
      acc[k] = (acc[k] || 0) + (v as number);
    });
    acc.count++;
    return acc;
  }, { count: 0 });

  const criteriaLabels: Record<string, string> = {
    knowledgeAbsorption: "Tiếp thu", classFocus: "Tập trung",
    examSkills: "Kỹ năng thi", selfStudy: "Tự học", diligence: "Chăm chỉ", interaction: "Tương tác"
  };

  const performanceChartData = Object.entries(criteriaLabels).map(([k, label]) => ({
    name: label,
    value: criteriaAvg.count > 0 ? Number((criteriaAvg[k] / criteriaAvg.count).toFixed(1)) : 0
  }));

  const totalPaid = filteredTuition.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const totalUnpaid = filteredTuition.filter(f => f.status !== "paid").reduce((s, f) => s + f.amount, 0);

  const sendZaloReminder = (phone: string, name: string) => {
    window.open(`https://zalo.me/${phone}`, "_blank");
    toast.success(`Đã mở Zalo để nhắc ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-muted/20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-admin/10 p-2.5 rounded-2xl">
            <Filter className="h-5 w-5 text-admin" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Báo cáo hệ thống</h1>
            <p className="text-[11px] text-muted-foreground font-bold italic uppercase tracking-tighter mt-0.5">Xác định phạm vi dữ liệu báo cáo</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Lớp học</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] h-11 rounded-2xl border-muted/30 font-bold bg-muted/5 transition-all focus:ring-admin">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold">Tất cả lớp học</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-semibold">{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Kỳ báo cáo</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[160px] h-11 rounded-2xl border-muted/30 font-bold bg-muted/5 transition-all focus:ring-admin">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="01/2025" className="font-semibold">Tháng 01/2025</SelectItem>
                <SelectItem value="02/2025" className="font-semibold">Tháng 02/2025</SelectItem>
                <SelectItem value="03/2025" className="font-semibold">Tháng 03/2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="training-results" className="w-full text-center md:text-left">
        <TabsList className="bg-muted/10 p-1.5 rounded-[2rem] mb-6 h-auto inline-flex flex-wrap gap-1 border border-muted/20">
          <TabsTrigger value="payroll" className="px-6 py-2.5 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-admin font-black text-[11px] uppercase tracking-widest transition-all">
            <Clock className="h-4 w-4 mr-2" /> Chấm công
          </TabsTrigger>
          <TabsTrigger value="tuition" className="px-6 py-2.5 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-admin font-black text-[11px] uppercase tracking-widest transition-all">
            <DollarSign className="h-4 w-4 mr-2" /> Học phí
          </TabsTrigger>
          <TabsTrigger value="training-results" className="px-6 py-2.5 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-admin font-black text-[11px] uppercase tracking-widest transition-all">
            <GraduationCap className="h-4 w-4 mr-2" /> Kết quả đào tạo
          </TabsTrigger>
          <TabsTrigger value="attendance" className="px-6 py-2.5 rounded-[1.5rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-admin font-black text-[11px] uppercase tracking-widest transition-all">
            <UserCheck className="h-4 w-4 mr-2" /> Chuyên cần
          </TabsTrigger>
        </TabsList>


        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-admin-light/20 border-none shadow-sm rounded-3xl overflow-hidden relative">
              <Clock className="absolute -right-4 -bottom-4 h-24 w-24 text-admin/10 rotate-12" />
              <CardContent className="p-6 relative">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tổng buổi dạy</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{filteredPayroll.reduce((s, p) => s + p.sessions, 0)}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tổng giờ dạy</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{filteredPayroll.reduce((s, p) => s + p.hours, 0)}h</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-500/10 border-none shadow-sm rounded-3xl overflow-hidden relative">
              <DollarSign className="absolute -right-4 -bottom-4 h-24 w-24 text-emerald-500/10 rotate-12" />
              <CardContent className="p-6 relative">
                <p className="text-[10px] font-black uppercase text-emerald-600/80 tracking-widest">Tổng chi lương</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{filteredPayroll.reduce((s, p) => s + p.salary.total, 0).toLocaleString()}₫</p>
              </CardContent>
            </Card>
          </div>
          <div className="overflow-hidden bg-white rounded-[2rem] border border-muted/20 shadow-sm">
             <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow className="hover:bg-transparent border-muted/10">
                    <TableHead className="w-[300px] text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-8 py-5">Nhân sự</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Khối lượng công việc</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Vai trò</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Tổng lương thực nhận</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((p, i) => (
                    <TableRow key={i} className="group hover:bg-muted/5 border-muted/10 transition-colors h-20">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-admin/10 flex items-center justify-center text-admin font-black text-xs">{p.teacherName.charAt(0)}</div>
                           <div><span className="font-bold text-slate-800 block">{p.teacherName}</span><span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Tháng {p.month}</span></div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs font-semibold text-slate-600">{p.sessions} buổi • {p.hours} giờ dạy</span></TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-muted/30">{p.type === "main" ? "Chính" : "Trợ giảng"}</Badge></TableCell>
                      <TableCell className="text-right pr-8"><span className="text-lg font-black text-emerald-600">{p.salary.total.toLocaleString()}₫</span></TableCell>
                      <TableCell className="pr-4"><ChevronRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          </div>
        </TabsContent>

        <TabsContent value="tuition" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
             <Card className="bg-emerald-50 border-emerald-100 shadow-sm rounded-3xl"><CardContent className="flex flex-col gap-1 p-6 relative overflow-hidden">
               <CheckCircle className="absolute -right-6 -bottom-6 h-24 w-24 text-emerald-100 -rotate-12" />
               <p className="text-[10px] font-black uppercase text-emerald-600/80 tracking-widest relative">Đã thu</p>
               <p className="text-3xl font-black text-emerald-700 relative">{totalPaid.toLocaleString()}₫</p>
             </CardContent></Card>
             <Card className="bg-rose-50 border-rose-100 shadow-sm rounded-3xl"><CardContent className="flex flex-col gap-1 p-6 relative overflow-hidden">
               <AlertTriangle className="absolute -right-6 -bottom-6 h-24 w-24 text-rose-100 -rotate-12" />
               <p className="text-[10px] font-black uppercase text-rose-600/80 tracking-widest relative">Chưa thu</p>
               <p className="text-3xl font-black text-rose-700 relative">{totalUnpaid.toLocaleString()}₫</p>
             </CardContent></Card>
             <Card className="bg-white border-muted/20 shadow-sm rounded-3xl"><CardContent className="flex flex-col gap-1 p-6 relative overflow-hidden">
               <DollarSign className="absolute -right-6 -bottom-6 h-24 w-24 text-slate-50 -rotate-12" />
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative">Tổng dự kiến</p>
               <p className="text-3xl font-black text-slate-800 relative">{(totalPaid + totalUnpaid).toLocaleString()}₫</p>
             </CardContent></Card>
          </div>
          <div className="overflow-hidden bg-white rounded-[2rem] border border-muted/20 shadow-sm">
             <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow className="hover:bg-transparent border-muted/10">
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-8 py-5">Học sinh & Phụ huynh</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Khoản thu</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Tình trạng</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTuition.map((f, i) => (
                    <TableRow key={i} className="group hover:bg-muted/5 border-muted/10 transition-colors h-16">
                      <TableCell className="pl-8">
                         <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-1 ring-muted/20">
                              <AvatarFallback className="bg-slate-50 text-slate-600 font-bold text-[10px]">{f.studentName[0]}</AvatarFallback>
                            </Avatar>
                            <div><span className="font-bold text-slate-800 block text-xs">{f.studentName}</span><span className="text-[10px] font-bold text-muted-foreground opacity-70">PH: {f.parentName}</span></div>
                         </div>
                      </TableCell>
                      <TableCell><span className="text-xs font-black text-slate-700 underline underline-offset-4 decoration-muted-foreground/30">{f.amount.toLocaleString()}₫</span></TableCell>
                      <TableCell className="text-center">
                         <Badge className={`border-none shadow-none text-[9px] font-black px-2 h-5 uppercase tracking-widest ${
                           f.status === "paid" ? "bg-emerald-500/10 text-emerald-600" : 
                           f.status === "pending" ? "bg-amber-500/10 text-amber-600" : 
                           "bg-rose-500/10 text-rose-600"
                         }`}>
                           {f.status === "paid" ? "Đã đóng" : f.status === "pending" ? "Chờ TT" : "Quá hạn"}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 flex items-center justify-end gap-2">
                         <Button
                           size="sm"
                           variant="outline"
                           className="h-8 rounded-full border-admin/30 text-admin hover:bg-admin/5 font-black text-[9px] tracking-widest uppercase"
                           onClick={() => {
                             setEditingFee(f);
                             setEditAmount(f.amount.toLocaleString());
                             setEditStatus(f.status);
                             setEditNote("");
                           }}
                         >
                           <Pencil className="h-3 w-3 mr-1.5" /> Sửa
                         </Button>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="h-8 rounded-full border-admin text-admin hover:bg-admin/5 font-black text-[9px] tracking-widest uppercase"
                           onClick={() => {
                             const reportMessage = encodeURIComponent(
                               f.status === "paid" 
                               ? `Chào phụ huynh ${f.parentName}, Tanthanh Edu thông báo đã nhận đủ học phí tháng ${f.month} của bé ${f.studentName}.\n- Số tiền: ${f.amount.toLocaleString()}₫\n\nCảm ơn phụ huynh!`
                               : `Chào phụ huynh ${f.parentName}, Tanthanh Edu gửi thông báo học phí tháng ${f.month} của bé ${f.studentName}.\n- Số tiền: ${f.amount.toLocaleString()}₫\n- Hạn đóng: ${f.dueDate || 'Sớm nhất có thể'}\n\nNhờ phụ huynh kiểm tra và hoàn thành giúp trung tâm ạ. Em cảm ơn!`
                             );
                             window.open(`https://zalo.me/${f.zaloPhone}?text=${reportMessage}`, "_blank");
                             toast.success(`Đã mở Zalo báo cáo học phí cho PH ${f.parentName}`);
                           }}
                         >
                           <MessageCircle className="h-3 w-3 mr-2" /> Báo cáo Zalo
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
           </div>

           {/* Change Log */}
           {tuitionLog.length > 0 && (
             <div className="bg-white rounded-[2rem] border border-muted/20 shadow-sm overflow-hidden">
               <div className="px-8 py-4 border-b border-muted/10 flex items-center gap-3">
                 <History className="h-4 w-4 text-admin" />
                 <span className="text-sm font-black uppercase text-slate-700 tracking-wider">Lịch sử sửa đổi học phí</span>
                 <Badge variant="outline" className="ml-auto text-[9px] font-black border-admin/20 text-admin">{tuitionLog.length} thay đổi</Badge>
               </div>
               <div className="divide-y divide-muted/10">
                 {tuitionLog.map((log) => (
                   <div key={log.id} className="px-8 py-4 flex items-start gap-4 hover:bg-muted/5 transition-colors">
                     <div className="h-8 w-8 rounded-full bg-admin/10 flex items-center justify-center shrink-0 mt-0.5">
                       <Pencil className="h-3.5 w-3.5 text-admin" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex flex-wrap items-center gap-2 mb-1">
                         <span className="text-xs font-black text-slate-800">{log.studentName}</span>
                         <span className="text-[10px] text-muted-foreground">—</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.field}</span>
                       </div>
                       <div className="flex items-center gap-2 flex-wrap">
                         <Badge className="bg-rose-100 text-rose-600 text-[9px] font-black border-none">{log.oldValue}</Badge>
                         <ChevronRight className="h-3 w-3 text-muted-foreground" />
                         <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-black border-none">{log.newValue}</Badge>
                       </div>
                       {log.note && <p className="text-[10px] text-muted-foreground italic mt-1.5">"{log.note}"</p>}
                     </div>
                     <div className="text-right shrink-0">
                       <p className="text-[9px] font-black text-muted-foreground uppercase">{log.admin}</p>
                       <p className="text-[9px] text-muted-foreground mt-0.5">{log.timestamp}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Edit Fee Dialog */}
           <Dialog open={!!editingFee} onOpenChange={(open) => !open && setEditingFee(null)}>
             <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
               <DialogHeader className="p-8 bg-admin text-white pb-12">
                 <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                   <Pencil className="h-5 w-5" /> Sửa học phí
                 </DialogTitle>
                 <p className="text-white/70 text-xs font-bold mt-2">{editingFee?.studentName} — Tháng {editingFee?.month}</p>
               </DialogHeader>
               <div className="p-8 -mt-8 bg-white rounded-t-[2.5rem] space-y-5">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Khoản thu (₫)</Label>
                   <Input
                     className="h-12 rounded-2xl border-muted/30 font-black text-lg focus-visible:ring-admin"
                     value={editAmount}
                     onChange={(e) => setEditAmount(e.target.value)}
                     placeholder="Nhập số tiền..."
                   />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tình trạng thanh toán</Label>
                   <Select value={editStatus} onValueChange={setEditStatus}>
                     <SelectTrigger className="h-12 rounded-2xl border-muted/30 font-bold focus:ring-admin">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl">
                       <SelectItem value="paid" className="font-bold text-emerald-600">✓ Đã đóng</SelectItem>
                       <SelectItem value="pending" className="font-bold text-amber-600">⏳ Chờ thanh toán</SelectItem>
                       <SelectItem value="overdue" className="font-bold text-rose-600">⚠ Quá hạn</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ghi chú thay đổi (cho log)</Label>
                   <Textarea
                     className="rounded-2xl bg-slate-50 border-none min-h-[80px] text-sm focus-visible:ring-admin italic placeholder:text-slate-300"
                     placeholder="Lý do sửa đổi (ví dụ: Áp dụng học bổng, PH đã thanh toán...)..."
                     value={editNote}
                     onChange={(e) => setEditNote(e.target.value)}
                   />
                 </div>
               </div>
               <DialogFooter className="px-8 pb-8 bg-white flex gap-3">
                 <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black text-xs uppercase" onClick={() => setEditingFee(null)}>Hủy</Button>
                 <Button className="flex-[2] h-12 rounded-2xl bg-admin text-white font-black text-xs uppercase tracking-widest shadow-lg" onClick={handleSaveFeeEdit}>
                   <CheckCircle className="h-4 w-4 mr-2" /> Lưu thay đổi
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </TabsContent>

        <TabsContent value="training-results" className="mt-0 space-y-4">
           <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-[1.8rem] border border-muted/20 shadow-sm mb-4">
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kỳ đánh giá:</span>
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger className="w-[240px] h-9 text-[11px] font-bold rounded-xl border-muted/20 bg-muted/5">
                  <SelectValue placeholder="Chọn bài kiểm tra" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">Tất cả bài tập & Đề thi</SelectItem>
                  <SelectItem value="bt-001">Bài tập: Phân tích Lặng lẽ Sa Pa</SelectItem>
                  <SelectItem value="de-001">Đề thi thử: Giữa kỳ 1 - Văn 9</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Xếp loại:</span>
              <Select value={selectedGradeRange} onValueChange={setSelectedGradeRange}>
                <SelectTrigger className="w-[160px] h-9 text-[11px] font-bold rounded-xl border-muted/20 bg-muted/5">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tất cả xếp loại</SelectItem>
                  <SelectItem value="gioi" className="text-emerald-600 font-bold">Giỏi (8.0 - 10)</SelectItem>
                  <SelectItem value="kha" className="text-blue-600 font-bold">Khá (6.5 - 7.9)</SelectItem>
                  <SelectItem value="tb" className="text-amber-600 font-bold">Trung bình (5.0 - 6.4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="ml-auto">
               <Button size="sm" variant="outline" className="h-9 rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-black text-[10px] tracking-widest uppercase px-6">
                 <Download className="mr-2 h-3.5 w-3.5" /> Xuất Excel
               </Button>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-[2.5rem] border border-muted/20 shadow-sm pt-2">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-muted/10">
                  <TableHead className="w-[60px] text-center font-black text-[10px] uppercase text-muted-foreground tracking-widest py-5">STT</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Học sinh</TableHead>
                  <TableHead className="text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Điểm số</TableHead>
                  <TableHead className="text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Xếp loại</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nhận xét & Tiến độ</TableHead>
                  <TableHead className="w-[150px] text-right font-black text-[10px] uppercase text-muted-foreground tracking-widest pr-8">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "hs-001", name: "Nguyễn Minh Khôi", score: 8.5, grade: "Giỏi", color: "bg-emerald-500/10 text-emerald-600", feedback: "Tốt, cần thêm dẫn chứng nghệ thuật." },
                  { id: "hs-003", name: "Trương Đình Phúc", score: 7.0, grade: "Khá", color: "bg-blue-500/10 text-blue-600", feedback: "Bài làm khá, cần chú ý cách trình bày." },
                  { id: "hs-004", name: "Lý Thanh Tâm", score: 9.0, grade: "Giỏi", color: "bg-emerald-500/10 text-emerald-600", feedback: "Lập luận sắc bén, súc tích." },
                  { id: "hs-005", name: "Hoàng Gia Bảo", score: 5.5, grade: "Trung bình", color: "bg-amber-500/10 text-amber-600", feedback: "Cần cố gắng hơn ở phần diễn đạt." }
                ]
                .filter(s => selectedGradeRange === "all" || (selectedGradeRange === "gioi" && s.score >= 8) || (selectedGradeRange === "kha" && s.score >= 6.5 && s.score < 8))
                .map((student, idx) => {
                  const parent = parentStudentAccounts.find(ph => ph.children.some(c => c.name === student.name));
                  const zaloLink = parent ? `https://zalo.me/${parent.zaloPhone}` : "#";
                  const reportMessage = encodeURIComponent(`Chào phụ huynh ${parent?.name}, Tanthanh Edu gửi báo cáo kết quả đánh giá của bé ${student.name}.\n\n- Bài kiểm tra: ${selectedTest === 'all' ? 'Tổng hợp' : selectedTest}\n- Điểm số: ${student.score}đ\n- Xếp loại: ${student.grade}\n- Nhận xét: ${student.feedback}`);

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-muted/10 h-10">
                      <TableCell className="text-center font-bold text-muted-foreground text-xs py-4">{idx + 1}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-admin/10 flex items-center justify-center text-admin font-black text-[10px]">{student.name.charAt(0)}</div>
                          <span className="font-bold text-slate-700 text-xs">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span className="text-xs font-black text-admin bg-admin/5 px-2 py-1 rounded-lg border border-admin/10 tracking-widest">{student.score}đ</span>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge className={`${student.color} border-none shadow-none text-[9px] font-black uppercase px-2 h-5 tracking-widest`}>{student.grade}</Badge>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground italic py-4 max-w-[250px] truncate">{student.feedback}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 rounded-full border-admin text-admin hover:bg-admin/5 font-black text-[9px] tracking-widest uppercase"
                          onClick={() => {
                            if (!parent) {
                              return;
                            }
                            window.open(`${zaloLink}?text=${reportMessage}`, "_blank");
                          }}
                        >
                          <MessageCircle className="h-3 w-3 mr-2" /> Báo cáo Zalo
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
             <Card className="border-none shadow-sm rounded-3xl bg-white"><CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
               <Users className="h-5 w-5 mb-2 text-admin" />
               <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Sĩ số trung bình</p>
               <p className="text-2xl font-black text-slate-800 mt-1">{attendanceStats.total > 0 ? (attendanceStats.total / filteredAttendance.length).toFixed(0) : 0}</p>
             </CardContent></Card>
             <Card className="border-none shadow-sm rounded-3xl bg-emerald-500/10"><CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
               <CheckCircle className="h-5 w-5 mb-2 text-emerald-600" />
               <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Chuyên cần</p>
               <p className="text-2xl font-black text-emerald-600 mt-1">{attendanceRate.toFixed(1)}%</p>
             </CardContent></Card>
             <Card className="border-none shadow-sm rounded-3xl bg-amber-500/10"><CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
               <Clock className="h-5 w-5 mb-2 text-amber-600" />
               <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest">Tỉ lệ trễ</p>
               <p className="text-2xl font-black text-amber-600 mt-1">{attendanceStats.total > 0 ? ((attendanceStats.late / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
             </CardContent></Card>
             <Card className="border-none shadow-sm rounded-3xl bg-rose-500/10"><CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
               <AlertCircle className="h-5 w-5 mb-2 text-rose-600" />
               <p className="text-[9px] text-rose-600 font-black uppercase tracking-widest">Tỉ lệ vắng</p>
               <p className="text-2xl font-black text-rose-600 mt-1">{attendanceStats.total > 0 ? ((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
             </CardContent></Card>
          </div>

          {selectedClass === "all" ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-muted/30">
               <TrendingUp className="h-12 w-12 text-muted-foreground/20 mb-4" />
               <h3 className="text-lg font-black text-slate-700 tracking-tight uppercase">Vui lòng chọn lớp học</h3>
               <p className="text-xs text-muted-foreground font-semibold mt-1">Để xem biểu đồ chuyên cần chi tiết, bạn cần chọn một lớp học từ bộ lọc phía trên.</p>
            </div>
          ) : (
            <Card className="border-none shadow-sm bg-white rounded-[2.5rem] border border-muted/20 overflow-hidden">
               <div className="px-8 py-5 border-b border-muted/10 bg-muted/5 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-admin" /> Bảng theo dõi chuyên cần chi tiết
                  </h3>
                  <Badge variant="outline" className="rounded-full bg-admin/5 text-admin border-admin/20 font-black text-[9px] tracking-widest uppercase px-3 h-6">Tháng {selectedMonth}</Badge>
               </div>
               <ScrollArea className="w-full whitespace-nowrap">
                  <Table>
                    <TableHeader className="bg-muted/5">
                      <TableRow className="hover:bg-transparent border-muted/10">
                        <TableHead className="sticky left-0 bg-white z-20 w-[50px] text-center font-black text-[9px] uppercase text-muted-foreground py-4">STT</TableHead>
                        <TableHead className="sticky left-[50px] bg-white z-20 min-w-[200px] font-black text-[9px] uppercase text-muted-foreground py-4 border-r shadow-[2px_0_8px_-2px_rgba(0,0,0,0.05)] px-6">Học sinh</TableHead>
                        <TableHead className="min-w-[100px] text-[9px] font-black uppercase py-4 text-center bg-emerald-50/50">Có mặt %</TableHead>
                        {sessions.filter(s => s.classId === selectedClass).map(s => (
                          <TableHead key={s.id} className="min-w-[85px] font-black text-[9px] uppercase text-muted-foreground text-center border-l border-muted/10 py-4 font-black">
                             <div className="flex flex-col gap-0.5">
                               <span>{s.date.split("-").slice(1).reverse().join("/")}</span>
                               <span className="text-[7px] text-admin opacity-60">B.{s.id.split('-').pop()}</span>
                             </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parentStudentAccounts.flatMap(p => p.children).filter(c => c.classes.includes(selectedClass)).map((student, studentIdx) => {
                        let presentCount = 0;
                        let sessionsWithData = 0;
                        const classSessions = sessions.filter(s => s.classId === selectedClass);
                        const studentRow = classSessions.map(sess => {
                           const sessAtt = sessionAttendance.find(a => a.sessionId === sess.id);
                           const record = sessAtt?.records.find(r => (r as any).studentId === student.id);
                           if (record) {
                              sessionsWithData++;
                              if (record.status === "present" || record.status === "late") presentCount++;
                           }
                           return record || null;
                        });
                        const attendancePercent = sessionsWithData > 0 ? Math.round((presentCount / sessionsWithData) * 100) : 0;

                        return (
                          <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-muted/10 h-10">
                            <TableCell className="sticky left-0 bg-white z-10 text-center font-bold text-[10px] text-muted-foreground py-4">{studentIdx + 1}</TableCell>
                            <TableCell className="sticky left-[50px] bg-white z-10 py-4 border-r shadow-[2px_0_8px_-2px_rgba(0,0,0,0.05)] px-6">
                               <div className="flex items-center gap-3">
                                  <div className="h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 ring-1 ring-emerald-500/20">{student.name.charAt(0)}</div>
                                  <span className="text-xs font-black text-slate-700 tracking-tight">{student.name}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-center py-4 bg-emerald-50/20">
                               <Badge className={`${attendancePercent >= 90 ? "bg-emerald-500" : attendancePercent >= 70 ? "bg-amber-500" : "bg-rose-500"} text-white border-none shadow-none text-[8px] font-black px-1.5 h-4 ring-1 ring-white/20`}>
                                 {attendancePercent}%
                               </Badge>
                            </TableCell>
                            {studentRow.map((record, i) => (
                              <TableCell key={i} className="py-4 text-center border-l border-muted/10">
                                <div className="flex items-center justify-center">
                                  {!record ? (
                                    <span className="text-muted-foreground opacity-20">—</span>
                                  ) : record.status === "present" ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-500 shadow-sm" />
                                  ) : (record.status === "late" || record.status === "absent_excused") ? (
                                    <Clock className="h-4 w-4 text-amber-500 shadow-sm" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-rose-500 shadow-sm" />
                                  )}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
               </ScrollArea>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
