import { useAuthStore } from "@/lib/store";
import { parentStudentAccounts, sessionAttendance, sessionEvaluations, sessions, classes } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", selfStudy: "Tự học", diligence: "Chăm chỉ", interaction: "Tương tác"
};

const ParentReport = () => {
  const { selectedChildId } = useAuthStore();
  const parent = parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];

  const attendance = sessionAttendance.flatMap((sa) =>
    sa.records.filter((r) => r.studentId === child.id).map((r) => ({ ...r, sessionId: sa.sessionId }))
  );

  const evals = sessionEvaluations.filter((e) => e.studentId === child.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Báo cáo học tập — {child.name}</h1>
        <Button variant="outline" onClick={() => toast.info("Xin nghỉ cho con (demo)")}>Xin nghỉ cho con</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-status-success">{attendance.filter((a) => a.status === "present").length}</p>
          <p className="text-sm text-muted-foreground">Có mặt</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-status-warning">{attendance.filter((a) => a.status === "late").length}</p>
          <p className="text-sm text-muted-foreground">Đi trễ</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-destructive">{attendance.filter((a) => a.status.startsWith("absent")).length}</p>
          <p className="text-sm text-muted-foreground">Vắng</p>
        </CardContent></Card>
      </div>

      <h2 className="text-lg font-bold mt-6">Chi tiết theo buổi</h2>
      {attendance.map((a, i) => {
        const session = sessions.find((s) => s.id === a.sessionId);
        const cls = classes.find((c) => c.id === session?.classId);
        const ev = evals.find((e) => e.sessionId === a.sessionId);
        return (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{session?.date} — {session?.topic}</p>
                  <p className="text-sm text-muted-foreground">{cls?.name}</p>
                </div>
                <Badge className={a.status === "present" ? "bg-status-success" : a.status === "late" ? "bg-status-warning" : "bg-status-danger"}>
                  {a.status === "present" ? "Có mặt" : a.status === "late" ? "Trễ" : "Vắng"}
                </Badge>
              </div>
              {ev && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(ev.criteria).map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-muted-foreground">{criteriaLabels[k]}</span><span className="font-medium">{v}/10</span></div>
                  ))}
                  <p className="col-span-3 text-muted-foreground italic">"{ev.comment}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ParentReport;
