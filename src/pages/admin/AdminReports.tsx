import { useState } from "react";
import { tuitionFees, teacherPayroll, classes, sessions, sessionAttendance, sessionEvaluations } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, AlertTriangle, CheckCircle, MessageCircle, BarChart3, 
  Clock, UserCheck, GraduationCap, Calendar, Filter, Users
} from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

const AdminReports = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("01/2025");

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-[800px] mb-6">
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Chấm công
          </TabsTrigger>
          <TabsTrigger value="tuition" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Học phí
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" /> Chuyên cần
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Kết quả đào tạo
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

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Sĩ số bình quân</p>
              <p className="text-xl font-bold">{attendanceStats.total > 0 ? (attendanceStats.total / filteredAttendance.length).toFixed(0) : 0}</p>
            </CardContent></Card>
            <Card className="bg-status-success/5"><CardContent className="p-4 text-center">
              <CheckCircle className="h-5 w-5 mx-auto mb-2 text-status-success" />
              <p className="text-xs text-muted-foreground">Tỉ lệ chuyên cần</p>
              <p className="text-xl font-bold text-status-success">{attendanceRate.toFixed(1)}%</p>
            </CardContent></Card>
            <Card className="bg-status-warning/5"><CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-status-warning" />
              <p className="text-xs text-muted-foreground">Tỉ lệ đi trễ</p>
              <p className="text-xl font-bold text-status-warning">{attendanceStats.total > 0 ? ((attendanceStats.late / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
            </CardContent></Card>
            <Card className="bg-destructive/5"><CardContent className="p-4 text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-destructive" />
              <p className="text-xs text-muted-foreground">Tỉ lệ nghỉ học</p>
              <p className="text-xl font-bold text-destructive">{attendanceStats.total > 0 ? ((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1) : 0}%</p>
            </CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">Chi tiết chuyên cần theo buổi</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance.map((a, i) => {
                  const s = sessions.find(sess => sess.id === a.sessionId);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded border bg-card">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{s?.date} — {s?.topic}</p>
                          <p className="text-xs text-muted-foreground">{classes.find(c => c.id === s?.classId)?.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs font-medium">
                        <span className="text-status-success">Đủ: {a.records.filter(r => r.status === "present").length}</span>
                        <span className="text-status-warning">Trễ: {a.records.filter(r => r.status === "late").length}</span>
                        <span className="text-destructive">Vắng: {a.records.filter(r => r.status.includes("absent")).length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Phân tích kỹ năng trung bình</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceChartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 10]} hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {performanceChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(217, 91%, ${60 - index * 5}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Ghi chú & Đánh giá giáo viên</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-[300px] overflow-auto pr-2">
                {filteredEvaluations.map((ev, i) => (
                  <div key={i} className="p-3 rounded border bg-muted/20 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold">{sessionAttendance.flatMap(sa => sa.records).find(r => r.studentId === ev.studentId)?.studentName}</p>
                      <Badge variant="outline" className="text-[10px] h-4">Buổi: {sessions.find(s => s.id === ev.sessionId)?.date}</Badge>
                    </div>
                    <p className="italic text-muted-foreground">"{ev.comment}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">Danh sách học sinh tiến bộ nhất</CardTitle></CardHeader>
            <CardContent>
               <div className="grid gap-4 sm:grid-cols-3">
                  {filteredEvaluations.slice(0, 3).map((ev, i) => (
                    <div key={i} className="flex flex-col items-center p-4 rounded-xl border bg-status-success/5 border-status-success/20">
                      <div className="h-12 w-12 rounded-full bg-status-success/20 flex items-center justify-center text-status-success font-bold text-xl mb-2">#{i+1}</div>
                      <p className="font-bold">{sessionAttendance.flatMap(sa => sa.records).find(r => r.studentId === ev.studentId)?.studentName}</p>
                      <p className="text-xs text-muted-foreground">Điểm TB: {((Object.values(ev.criteria).reduce((a, b) => a + (b as number), 0)) / 6).toFixed(1)}</p>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
