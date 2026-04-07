import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSettings = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
    <Card>
      <CardHeader><CardTitle>Thông tin trung tâm</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div><label className="text-sm font-medium">Tên trung tâm</label><Input defaultValue="Tanthanh Edu" /></div>
        <div><label className="text-sm font-medium">Địa chỉ</label><Input defaultValue="123 Nguyễn Văn Linh, Q.7, TP.HCM" /></div>
        <div><label className="text-sm font-medium">SĐT</label><Input defaultValue="028-1234-5678" /></div>
        <Button onClick={() => toast.success("Đã lưu cài đặt!")}>Lưu</Button>
      </CardContent>
    </Card>
  </div>
);

export default AdminSettings;
