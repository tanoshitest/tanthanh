import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import { classes, tuitionFees, mainTeachers, assistants } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Tổng học sinh", value: 200, icon: Users, color: "bg-parent-light role-parent" },
  { label: "Tổng giáo viên", value: mainTeachers.length + assistants.length, icon: GraduationCap, color: "bg-teacher-light role-teacher" },
  { label: "Tổng lớp học", value: classes.length, icon: BookOpen, color: "bg-admin-light role-admin" },
  { label: "Doanh thu tháng", value: "45,000,000₫", icon: DollarSign, color: "bg-parent-light text-status-success" },
];

const chartData = [
  { month: "T10", paid: 35, unpaid: 5 },
  { month: "T11", paid: 38, unpaid: 3 },
  { month: "T12", paid: 36, unpaid: 6 },
  { month: "T01", paid: 32, unpaid: 8 },
  { month: "T02", paid: 28, unpaid: 12 },
];

const overdue = tuitionFees.filter((f) => f.status === "overdue");

const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Tổng quan</h1>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Học phí theo tháng</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" name="Đã thu" fill="hsl(142,71%,45%)" radius={[4,4,0,0]} />
              <Bar dataKey="unpaid" name="Chưa thu" fill="hsl(0,84%,60%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-destructive">Học phí quá hạn</CardTitle></CardHeader>
        <CardContent>
          {overdue.length === 0 ? (
            <p className="text-muted-foreground">Không có học phí quá hạn</p>
          ) : (
            <div className="space-y-3">
              {overdue.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{f.studentName}</p>
                    <p className="text-sm text-muted-foreground">{f.month} — {f.amount.toLocaleString()}₫</p>
                  </div>
                  <Badge variant="destructive">Quá hạn</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminDashboard;
