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
  Search, Download, FileText, ChevronRight, XCircle, AlertCircle, TrendingUp
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

const AdminReports = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("01/2025");
  const [selectedTest, setSelectedTest] = useState("all");
  const [selectedGradeRange, setSelectedGradeRange] = useState("all");

  // Filter Logic
  const filteredTuition = tuitionFees.filter(f => 
    (selectedClass === "all" || classes.find(c => c.id === selectedClass)?.name.includes(f.studentName)) &&
    f.month === selectedMonth
  );

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

  // Tuition Summary
  const totalPaid = filteredTuition.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);
  const totalUnpaid = filteredTuition.filter(f => f.status !== "paid").reduce((s, f) => s + f.amount, 0);

  const sendZaloReminder = (phone: string, name: string) => {
    window.open(`https://zalo.me/${phone}`, "_blank");
    toast.success(`Đã mở Zalo để nhắc ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold">Bộ lọc báo cáo</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Lớp:</span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp học</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tháng:</span>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01/2025">Tháng 01/2025</SelectItem>
                <SelectItem value="02/2025">Tháng 02/2025</SelectItem>
                <SelectItem value="03/2025">Tháng 03/2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="payroll" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-[600px] mb-6">
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Chấm công
          </TabsTrigger>
          <TabsTrigger value="tuition" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Học phí
          </TabsTrigger>
          <TabsTrigger value="detailed-reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-admin-light/20"><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tổng buổi dạy</p>
              <p className="text-2xl font-bold">{filteredPayroll.reduce((s, p) => s + p.sessions, 0)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tổng giờ dạy</p>
              <p className="text-2xl font-bold">{filteredPayroll.reduce((s, p) => s + p.hours, 0)}h</p>
            </CardContent></Card>
            <Card className="bg-status-success/10"><CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Tổng chi lương</p>
              <p className="text-2xl font-bold text-status-success">{filteredPayroll.reduce((s, p) => s + p.salary.total, 0).toLocaleString()}₫</p>
            </CardContent></Card>
          </div>
          <div className="space-y-3">
            {filteredPayroll.map((p, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{p.teacherName}</p>
                      <p className="text-sm text-muted-foreground">{p.type === "main" ? "Giáo viên chính" : "Trợ giảng"} • {p.sessions} buổi • {p.hours} giờ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-status-success">{p.salary.total.toLocaleString()}₫</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tuition" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="flex items-center gap-3 p-5">
              <CheckCircle className="h-8 w-8 text-status-success" />
              <div><p className="text-sm text-muted-foreground">Đã thu</p><p className="text-xl font-bold text-status-success">{totalPaid.toLocaleString()}₫</p></div>
            </CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-5">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div><p className="text-sm text-muted-foreground">Chưa thu</p><p className="text-xl font-bold text-destructive">{totalUnpaid.toLocaleString()}₫</p></div>
            </CardContent></Card>
            <Card><CardContent className="flex items-center gap-3 p-5">
              <DollarSign className="h-8 w-8 text-primary" />
              <div><p className="text-sm text-muted-foreground">Tổng phải thu</p><p className="text-xl font-bold">{(totalPaid + totalUnpaid).toLocaleString()}₫</p></div>
            </CardContent></Card>
          </div>
          <div className="space-y-2">
            {filteredTuition.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{f.studentName[0]}</div>
                  <div>
                    <p className="font-medium">{f.studentName}</p>
                    <p className="text-xs text-muted-foreground">PH: {f.parentName} • {f.amount.toLocaleString()}₫</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={f.status === "paid" ? "bg-status-success" : f.status === "pending" ? "bg-status-warning" : "bg-status-danger"}>
                    {f.status === "paid" ? "Đã đóng" : f.status === "pending" ? "Chờ TT" : "Quá hạn"}
                  </Badge>
                  {(f.status === "pending" || f.status === "overdue") && (
                    <Button size="sm" variant="outline" onClick={() => sendZaloReminder(f.zaloPhone, f.parentName)}><MessageCircle className="h-3 w-3" /></Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed-reports" className="space-y-4">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="bg-muted/20 p-1 mb-6 w-fit h-auto">
              <TabsTrigger value="performance" className="text-[10px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">Kết quả đào tạo</TabsTrigger>
              <TabsTrigger value="attendance" className="text-[10px] px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all font-bold">Chuyên cần</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="mt-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border shadow-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap uppercase">Bài kiểm tra:</span>
                  <Select value={selectedTest} onValueChange={setSelectedTest}>
                    <SelectTrigger className="w-[220px] h-8 text-[11px] font-bold">
                      <SelectValue placeholder="Chọn bài kiểm tra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-bold">Tất cả bài tập & Đề thi</SelectItem>
                      <SelectItem value="bt-001" className="text-xs">Bài tập: Phân tích Lặng lẽ Sa Pa</SelectItem>
                      <SelectItem value="de-001" className="text-xs">Đề thi thử: Giữa kỳ 1 - Văn 9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap uppercase">Xếp loại:</span>
                  <Select value={selectedGradeRange} onValueChange={setSelectedGradeRange}>
                    <SelectTrigger className="w-[140px] h-8 text-[11px] font-bold">
                      <SelectValue placeholder="Tất cả xếp loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">Tất cả xếp loại</SelectItem>
                      <SelectItem value="gioi" className="text-xs text-green-600 font-bold">Giỏi (8.0 - 10)</SelectItem>
                      <SelectItem value="kha" className="text-xs text-blue-600 font-bold">Khá (6.5 - 7.9)</SelectItem>
                      <SelectItem value="tb" className="text-xs text-yellow-600 font-bold">T.Bình (5.0 - 6.4)</SelectItem>
                      <SelectItem value="yeu" className="text-xs text-red-600 font-bold">Yếu {"(< 5.0)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="ml-auto">
                   <Button size="sm" variant="outline" className="h-8 border-admin text-admin hover:bg-admin/5 font-bold text-[11px]">
                     <Download className="mr-2 h-3.5 w-3.5" /> Xuất Excel
                   </Button>
                </div>
              </div>

              <Card className="border-none shadow-sm overflow-hidden rounded-2xl border border-muted/20">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-muted/50">
                      <TableHead className="w-[60px] text-center font-black text-[10px] uppercase text-muted-foreground py-3">STT</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-muted-foreground py-3">Học sinh</TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase text-muted-foreground py-3">Điểm số</TableHead>
                      <TableHead className="text-center font-black text-[10px] uppercase text-muted-foreground py-3">Xếp loại</TableHead>
                      <TableHead className="font-black text-[10px] uppercase text-muted-foreground py-3">Nhận xét / Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, name: "Nguyễn Minh Khôi", score: 8.5, grade: "Giỏi", color: "bg-green-100 text-green-600", feedback: "Tốt, cần thêm dẫn chứng nghệ thuật." },
                      { id: 2, name: "Trương Đình Phúc", score: 7.0, grade: "Khá", color: "bg-blue-100 text-blue-600", feedback: "Bài làm khá, cần chú ý cách trình bày." },
                      { id: 3, name: "Lý Thanh Tâm", score: 9.0, grade: "Giỏi", color: "bg-green-100 text-green-600", feedback: "Lập luận sắc bén, súc tích." },
                      { id: 4, name: "Hoàng Gia Bảo", score: 5.5, grade: "Trung bình", color: "bg-yellow-100 text-yellow-600", feedback: "Cần cố gắng hơn ở phần diễn đạt." }
                    ]
                    .filter(s => selectedGradeRange === "all" || (selectedGradeRange === "gioi" && s.score >= 8) || (selectedGradeRange === "kha" && s.score >= 6.5 && s.score < 8))
                    .map((student, idx) => (
                      <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-b border-muted/20 last:border-0 h-10">
                        <TableCell className="text-center font-bold text-muted-foreground text-xs py-3">{idx + 1}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-admin/10 flex items-center justify-center text-admin font-black text-[10px]">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-700 text-xs">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <span className="text-xs font-black text-admin bg-admin/5 px-2 py-1 rounded-lg border border-admin/10">{student.score}đ</span>
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <Badge className={`${student.color} border-none shadow-none text-[10px] font-black uppercase px-2 py-0.5`}>
                            {student.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground italic py-3 max-w-[250px] truncate">
                          {student.feedback}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-4 mb-6">
                <Card><CardContent className="p-4 text-center">
                  <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-[10px] text-muted-foreground font-black uppercase">Sĩ số bình quân</p>
                  <p className="text-xl font-black text-slate-800">{attendanceStats.total > 0 ? (attendanceStats.total / filteredAttendance.length).toFixed(0) : 0}</p>
                </CardContent></Card>
                <Card className="bg-emerald-50 border-emerald-100"><CardContent className="p-4 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
                  <p className="text-[10px] text-emerald-600/80 font-black uppercase">Tỉ lệ chuyên cần</p>
                  <p className="text-xl font-black text-emerald-700">{attendanceRate.toFixed(1)}%</p>
                </CardContent></Card>
                <Card className="bg-amber-50 border-amber-100"><CardContent className="p-4 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-amber-600" />
                  <p className="text-[10px] text-amber-600/80 font-black uppercase">Tỉ lệ đi trễ</p>
                  <p className="text-xl font-black text-amber-700">{attendanceStats.total > 0 ? ((attendanceStats.late / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
                </CardContent></Card>
                <Card className="bg-rose-50 border-rose-100"><CardContent className="p-4 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-rose-600" />
                  <p className="text-[10px] text-rose-600/80 font-black uppercase">Tỉ lệ nghỉ học</p>
                  <p className="text-xl font-black text-rose-700">{attendanceStats.total > 0 ? ((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
                </CardContent></Card>
              </div>

              {selectedClass === "all" ? (
                <div className="text-center py-20 bg-muted/10 border-2 border-dashed rounded-3xl">
                   <UserCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                   <h3 className="text-lg font-black text-slate-700 uppercase tracking-tight">Vui lòng chọn một lớp học</h3>
                   <p className="text-sm text-muted-foreground max-w-[320px] mx-auto font-medium">Để xem ma trận chuyên cần chi tiết, bạn cần chọn một lớp học cụ thể từ bộ lọc bên trên.</p>
                </div>
              ) : (
                <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl border border-muted/20">
                  <CardHeader className="py-4 border-b bg-muted/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" /> Thống kê chuyên cần chi tiết
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b border-muted/50">
                          <TableHead className="sticky left-0 bg-white z-20 w-[50px] text-center font-black text-[10px] uppercase text-muted-foreground py-3">STT</TableHead>
                          <TableHead className="sticky left-[50px] bg-white z-20 min-w-[180px] font-black text-[10px] uppercase text-muted-foreground py-3 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] px-6">Học sinh</TableHead>
                          <TableHead className="min-w-[100px] text-[10px] font-black uppercase py-3 text-center bg-emerald-50/50">Có mặt %</TableHead>
                          {sessions.filter(s => s.classId === selectedClass).map(s => (
                            <TableHead key={s.id} className="min-w-[80px] font-black text-[9px] uppercase text-muted-foreground text-center border-l py-3">
                               <div className="flex flex-col">
                                 <span>{s.date.split("-").slice(1).reverse().join("/")}</span>
                                 <span className="text-[7px] opacity-60 font-medium">BUỔI {s.id.split('-').pop()}</span>
                               </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parentStudentAccounts.flatMap(p => p.children).filter(c => c.classes.includes(selectedClass)).map((student, studentIdx) => {
                          let presentCount = 0;
                          let sessionsWithData = 0;

                          const studentSessions = sessions.filter(s => s.classId === selectedClass);
                          const studentRow = studentSessions.map(sess => {
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
                            <TableRow key={student.id} className="hover:bg-muted/5 transition-colors border-b border-muted/20 last:border-0 h-10">
                              <TableCell className="sticky left-0 bg-white z-10 text-center font-bold text-[10px] text-muted-foreground py-3 whitespace-nowrap">
                                {studentIdx + 1}
                              </TableCell>
                              <TableCell className="sticky left-[50px] bg-white z-10 py-3 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] px-6">
                                <div className="flex items-center gap-3">
                                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700">
                                    {student.name.charAt(0)}
                                  </div>
                                  <span className="text-xs font-black text-slate-700">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-3 bg-emerald-50/30">
                                <Badge className={`${attendancePercent >= 90 ? "bg-emerald-500" : attendancePercent >= 70 ? "bg-amber-500" : "bg-destructive"} text-white border-none shadow-none text-[8px] font-black px-1.5 h-4`}>
                                  {attendancePercent}%
                                </Badge>
                              </TableCell>
                              {studentRow.map((record, i) => (
                                <TableCell key={i} className="py-3 text-center border-l">
                                  <div className="flex items-center justify-center">
                                    {!record ? (
                                      <span className="text-muted-foreground opacity-20">—</span>
                                    ) : record.status === "present" ? (
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : (record.status === "late" || record.status === "absent_excused") ? (
                                      <Clock className="h-4 w-4 text-amber-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-rose-500" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
