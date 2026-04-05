import { teacherPayroll } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminPayroll = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Chấm công & Lương</h1>
    <div className="space-y-3">
      {teacherPayroll.map((p, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{p.teacherName}</p>
                <p className="text-sm text-muted-foreground">{p.type === "main" ? "Giáo viên chính" : "Trợ giảng"} • Tháng {p.month}</p>
                <p className="text-sm text-muted-foreground">{p.sessions} buổi • {p.hours} giờ</p>
              </div>
              <div className="text-right">
                {"base" in p.salary && <p className="text-sm text-muted-foreground">Cơ bản: {(p.salary.base as number).toLocaleString()}₫</p>}
                {"bonus" in p.salary && <p className="text-sm text-muted-foreground">Thưởng: {(p.salary.bonus as number).toLocaleString()}₫</p>}
                {"hourlyRate" in p.salary && <p className="text-sm text-muted-foreground">Giờ: {(p.salary.hourlyRate as number).toLocaleString()}₫/h</p>}
                <p className="text-lg font-bold text-status-success">{p.salary.total.toLocaleString()}₫</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminPayroll;
