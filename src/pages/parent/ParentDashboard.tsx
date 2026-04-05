import { useAuthStore } from "@/lib/store";
import { parentStudentAccounts, sessionEvaluations, tuitionFees, classes } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const criteriaLabels: Record<string, string> = {
  knowledgeAbsorption: "Tiếp thu", classFocus: "Tập trung",
  examSkills: "Kỹ năng thi", selfStudy: "Tự học", diligence: "Chăm chỉ", interaction: "Tương tác"
};

const ParentDashboard = () => {
  const { selectedChildId } = useAuthStore();
  const parent = parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];
  const evals = sessionEvaluations.filter((e) => e.studentId === child.id);
  const latestEval = evals[evals.length - 1];
  const radarData = latestEval ? Object.entries(latestEval.criteria).map(([k, v]) => ({ subject: criteriaLabels[k], value: v, fullMark: 10 })) : [];
  const fees = tuitionFees.filter((f) => f.studentName === child.name);
  const currentFee = fees[fees.length - 1];
  const childClasses = classes.filter((c) => child.classes.includes(c.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tổng quan — {child.name}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Thông tin</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Lớp:</span> {child.grade}</p>
            <p><span className="text-muted-foreground">Trình độ:</span> {child.level}</p>
            <p><span className="text-muted-foreground">Ngày sinh:</span> {child.dateOfBirth}</p>
            <p><span className="text-muted-foreground">Lớp học:</span> {childClasses.map((c) => c.name).join(", ")}</p>
          </CardContent>
        </Card>
        {radarData.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Đánh giá gần nhất</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar dataKey="value" stroke="hsl(160,84%,39%)" fill="hsl(160,84%,39%)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground">"{latestEval.comment}"</p>
            </CardContent>
          </Card>
        )}
      </div>
      {currentFee && (
        <Card>
          <CardHeader><CardTitle>Học phí tháng {currentFee.month}</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="font-bold">{currentFee.amount.toLocaleString()}₫</p>
            <Badge className={currentFee.status === "paid" ? "bg-status-success" : currentFee.status === "pending" ? "bg-status-warning" : "bg-status-danger"}>
              {currentFee.status === "paid" ? "Đã đóng" : currentFee.status === "pending" ? "Chờ TT" : "Quá hạn"}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentDashboard;
