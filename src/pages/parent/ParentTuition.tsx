import { useAuthStore } from "@/lib/store";
import { parentStudentAccounts, tuitionFees } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ParentTuition = () => {
  const { selectedChildId } = useAuthStore();
  const parent = parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];
  const fees = tuitionFees.filter((f) => f.studentName === child.name);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Học phí — {child.name}</h1>
      <div className="space-y-3">
        {fees.map((f, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Tháng {f.month}</p>
                <p className="text-sm text-muted-foreground">{f.amount.toLocaleString()}₫ • Hạn: {f.dueDate}</p>
                {f.transactionRef && <p className="text-xs text-muted-foreground">Ref: {f.transactionRef}</p>}
              </div>
              <Badge className={f.status === "paid" ? "bg-status-success" : f.status === "pending" ? "bg-status-warning" : "bg-status-danger"}>
                {f.status === "paid" ? "Đã đóng" : f.status === "pending" ? "Chờ TT" : "Quá hạn"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Hướng dẫn chuyển khoản</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Ngân hàng: <strong>Vietcombank</strong></p>
          <p>STK: <strong>1234567890</strong></p>
          <p>Chủ TK: <strong>TRUNG TAM GIAO DUC ABC</strong></p>
          <p>Nội dung CK: <strong>HP {child.name} T01/2025</strong></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentTuition;
