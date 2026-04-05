import { teacherPayroll } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeacherAttendance = () => {
  const { userName } = useAuthStore();
  const payroll = teacherPayroll.find((p) => p.teacherName === userName);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Chấm công của tôi</h1>
      {payroll ? (
        <Card>
          <CardHeader><CardTitle>Tháng {payroll.month}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Số buổi: <span className="font-bold">{payroll.sessions}</span></p>
            <p>Số giờ: <span className="font-bold">{payroll.hours}h</span></p>
            <p className="text-lg font-bold text-status-success mt-4">Tổng lương: {payroll.salary.total.toLocaleString()}₫</p>
          </CardContent>
        </Card>
      ) : <p className="text-muted-foreground">Chưa có dữ liệu</p>}
    </div>
  );
};

export default TeacherAttendance;
