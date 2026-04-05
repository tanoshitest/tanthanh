import { tuitionFees } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const AdminTuition = () => {
  const paid = tuitionFees.filter((f) => f.status === "paid");
  const pending = tuitionFees.filter((f) => f.status === "pending");
  const overdue = tuitionFees.filter((f) => f.status === "overdue");
  const totalPaid = paid.reduce((s, f) => s + f.amount, 0);
  const totalUnpaid = [...pending, ...overdue].reduce((s, f) => s + f.amount, 0);

  const sendZaloReminder = (phone: string, name: string) => {
    window.open(`https://zalo.me/${phone}`, "_blank");
    toast.success(`Đã mở Zalo để nhắc ${name}`);
  };

  const remindAll = () => {
    [...pending, ...overdue].forEach((f) => toast.info(`Nhắc ${f.parentName} (${f.studentName})`));
    toast.success("Đã gửi nhắc nhở tất cả!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý học phí</h1>
        <Button onClick={remindAll} variant="outline"><MessageCircle className="mr-2 h-4 w-4" />Nhắc tất cả</Button>
      </div>

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
          <DollarSign className="h-8 w-8" />
          <div><p className="text-sm text-muted-foreground">Tổng</p><p className="text-xl font-bold">{(totalPaid + totalUnpaid).toLocaleString()}₫</p></div>
        </CardContent></Card>
      </div>

      <div className="space-y-2">
        {tuitionFees.map((f, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">{f.studentName}</p>
              <p className="text-sm text-muted-foreground">PH: {f.parentName} • {f.month} • {f.amount.toLocaleString()}₫</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={f.status === "paid" ? "bg-status-success" : f.status === "pending" ? "bg-status-warning" : "bg-status-danger"}>
                {f.status === "paid" ? "Đã đóng" : f.status === "pending" ? "Chờ TT" : "Quá hạn"}
              </Badge>
              {(f.status === "pending" || f.status === "overdue") && (
                <Button size="sm" variant="outline" onClick={() => sendZaloReminder(f.zaloPhone, f.parentName)}>
                  <MessageCircle className="mr-1 h-3 w-3" />Nhắc Zalo
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTuition;
