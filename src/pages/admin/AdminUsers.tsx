import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mainTeachers, assistants, accountants, parentStudentAccounts } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusBadge = (s: string) => {
  if (s === "active") return <Badge className="bg-status-success">Hoạt động</Badge>;
  if (s === "on_leave") return <Badge className="bg-status-warning">Nghỉ phép</Badge>;
  return <Badge variant="destructive">Tạm ngưng</Badge>;
};

const allStudents = parentStudentAccounts.flatMap((p) =>
  p.children.map((c) => ({ ...c, parentName: p.name, parentPhone: p.phone }))
);

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Quản lý User</h1>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Học sinh ({allStudents.length})</TabsTrigger>
          <TabsTrigger value="teachers">Giáo viên ({mainTeachers.length})</TabsTrigger>
          <TabsTrigger value="assistants">Trợ giảng ({assistants.length})</TabsTrigger>
          <TabsTrigger value="accountants">Kế toán ({accountants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <div className="grid gap-3">
            {allStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((s) => (
              <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/users/student/${s.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">Lớp {s.grade} • {s.level} • PH: {s.parentName}</p>
                  </div>
                  {statusBadge(s.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teachers">
          <div className="grid gap-3">
            {mainTeachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())).map((t) => (
              <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/users/teacher/${t.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.subject} • {t.sessionsThisMonth} buổi/tháng</p>
                  </div>
                  {statusBadge(t.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assistants">
          <div className="grid gap-3">
            {assistants.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())).map((a) => (
              <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/users/assistant/${a.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.subject} • {a.hoursThisMonth}h/tháng</p>
                  </div>
                  {statusBadge(a.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accountants">
          <div className="grid gap-3">
            {accountants.map((a) => (
              <Card key={a.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/users/accountant/${a.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.email}</p>
                  </div>
                  {statusBadge(a.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
