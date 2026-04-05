import { useParams, useNavigate } from "react-router-dom";
import { mainTeachers, assistants, accountants, parentStudentAccounts, sessionAttendance, sessionEvaluations, tuitionFees, sessions, classes, teacherPayroll } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", selfStudy: "Tự học", diligence: "Chăm chỉ", interaction: "Tương tác"
};

const AdminUserDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  if (type === "student") {
    const parent = parentStudentAccounts.find((p) => p.children.some((c) => c.id === id));
    const student = parent?.children.find((c) => c.id === id);
    if (!student || !parent) return <p>Không tìm thấy</p>;

    const evals = sessionEvaluations.filter((e) => e.studentId === id);
    const latestEval = evals[evals.length - 1];
    const radarData = latestEval ? Object.entries(latestEval.criteria).map(([k, v]) => ({ subject: criteriaLabels[k] || k, value: v, fullMark: 10 })) : [];

    const attendance = sessionAttendance.flatMap((sa) => sa.records.filter((r) => r.studentId === id).map((r) => ({ ...r, sessionId: sa.sessionId })));
    const fees = tuitionFees.filter((f) => f.studentName === student.name);

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <Badge className={student.status === "active" ? "bg-status-success" : "bg-status-danger"}>{student.status === "active" ? "Hoạt động" : "Tạm ngưng"}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Thông tin</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Lớp:</span> {student.grade}</p>
              <p><span className="text-muted-foreground">Trình độ:</span> {student.level}</p>
              <p><span className="text-muted-foreground">Ngày sinh:</span> {student.dateOfBirth}</p>
              <p><span className="text-muted-foreground">Phụ huynh:</span> {parent.name} — {parent.phone}</p>
            </CardContent>
          </Card>
          {radarData.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Đánh giá gần nhất</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 10]} />
                    <Radar dataKey="value" stroke="hsl(217,91%,60%)" fill="hsl(217,91%,60%)" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-2">"{latestEval.comment}"</p>
              </CardContent>
            </Card>
          )}
        </div>
        <Card>
          <CardHeader><CardTitle>Điểm danh</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attendance.map((a, i) => {
                const session = sessions.find((s) => s.id === a.sessionId);
                return (
                  <div key={i} className="flex items-center justify-between rounded border p-3 text-sm">
                    <span>{session?.date} — {session?.topic}</span>
                    <Badge className={a.status === "present" ? "bg-status-success" : a.status === "late" ? "bg-status-warning" : "bg-status-danger"}>
                      {a.status === "present" ? "Có mặt" : a.status === "late" ? "Trễ" : a.status === "absent_excused" ? "Vắng CP" : "Vắng KP"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Học phí</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fees.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded border p-3 text-sm">
                  <span>{f.month} — {f.amount.toLocaleString()}₫</span>
                  <Badge className={f.status === "paid" ? "bg-status-success" : f.status === "pending" ? "bg-status-warning" : "bg-status-danger"}>
                    {f.status === "paid" ? "Đã đóng" : f.status === "pending" ? "Chờ TT" : "Quá hạn"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "teacher" || type === "assistant") {
    const allTeachers = [...mainTeachers, ...assistants];
    const teacher = allTeachers.find((t) => t.id === id);
    if (!teacher) return <p>Không tìm thấy</p>;
    const teacherClasses = classes.filter((c) => c.teacherId === id || c.assistantId === id);
    const payroll = teacherPayroll.find((p) => p.teacherName === teacher.name);

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
        <h1 className="text-2xl font-bold">{teacher.name}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Thông tin</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Email:</span> {teacher.email}</p>
              <p><span className="text-muted-foreground">SĐT:</span> {teacher.phone}</p>
              <p><span className="text-muted-foreground">Môn:</span> {teacher.subject}</p>
              <p><span className="text-muted-foreground">Loại:</span> {teacher.type === "main" ? "Giáo viên chính" : "Trợ giảng"}</p>
            </CardContent>
          </Card>
          {payroll && (
            <Card>
              <CardHeader><CardTitle>Lương tháng {payroll.month}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Buổi dạy:</span> {payroll.sessions}</p>
                <p><span className="text-muted-foreground">Giờ:</span> {payroll.hours}h</p>
                <p className="text-lg font-bold text-status-success">{payroll.salary.total.toLocaleString()}₫</p>
              </CardContent>
            </Card>
          )}
        </div>
        <Card>
          <CardHeader><CardTitle>Lớp phụ trách</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {teacherClasses.map((c) => (
                <div key={c.id} className="rounded border p-3 text-sm">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-muted-foreground">{c.studentCount}/{c.maxStudents} HS • {c.schedule.map((s) => `${s.day} ${s.time}`).join(", ")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "accountant") {
    const acc = accountants.find((a) => a.id === id);
    if (!acc) return <p>Không tìm thấy</p>;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
        <h1 className="text-2xl font-bold">{acc.name}</h1>
        <Card>
          <CardContent className="space-y-2 text-sm p-6">
            <p><span className="text-muted-foreground">Email:</span> {acc.email}</p>
            <p><span className="text-muted-foreground">SĐT:</span> {acc.phone}</p>
            <p><span className="text-muted-foreground">Lương:</span> {acc.baseSalary.toLocaleString()}₫</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <p>Không tìm thấy user</p>;
};

export default AdminUserDetail;
