import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mainTeachers as initialTeachers, assistants as initialAssistants, accountants as initialAccountants, parentStudentAccounts as initialParents } from "@/lib/mock-data";
import { Search, Plus, UserPlus, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusBadge = (s: string) => {
  if (s === "active") return <Badge className="bg-status-success">Hoạt động</Badge>;
  if (s === "on_leave") return <Badge className="bg-status-warning">Nghỉ phép</Badge>;
  return <Badge variant="destructive">Tạm ngưng</Badge>;
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState("student");

  // Local user states
  const [teachers, setTeachers] = useState(initialTeachers);
  const [assistants, setAssistants] = useState(initialAssistants);
  const [accountants, setAccountants] = useState(initialAccountants);
  const [parents, setParents] = useState(initialParents);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "9",
    level: "beginner",
    dateOfBirth: "2011-01-01",
    parentName: "",
    parentPhone: "",
    subject: "Văn",
    baseSalary: "4000000",
    rate: "150000"
  });

  const students = parents.flatMap((p) =>
    p.children.map((c) => ({ ...c, parentName: p.name, parentPhone: p.phone }))
  );

  const handleAddUser = () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    const newId = `user-${Date.now()}`;

    if (userRole === "student") {
      const newStudent = {
        id: `hs-${Date.now()}`,
        name: formData.name,
        grade: parseInt(formData.grade),
        level: formData.level as any,
        classes: [],
        dateOfBirth: formData.dateOfBirth,
        status: "active" as const
      };
      // For mock, create new parent entry
      const newParent = {
        id: `ph-${Date.now()}`,
        name: formData.parentName || "Phụ huynh mới",
        email: formData.email,
        phone: formData.parentPhone || formData.phone,
        zaloPhone: formData.parentPhone || formData.phone,
        children: [newStudent]
      };
      setParents([newParent, ...parents]);
    } else if (userRole === "teacher") {
      const newTeacher = {
        id: `gv-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        type: "main" as const,
        phone: formData.phone,
        subject: formData.subject,
        baseSalary: parseInt(formData.baseSalary),
        perSessionRate: parseInt(formData.rate),
        sessionsThisMonth: 0,
        status: "active" as const
      };
      setTeachers([newTeacher, ...teachers]);
    } else if (userRole === "assistant") {
      const newAssistant = {
        id: `tg-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        type: "assistant" as const,
        phone: formData.phone,
        subject: formData.subject,
        hourlyRate: parseInt(formData.rate),
        hoursThisMonth: 0,
        status: "active" as const
      };
      setAssistants([newAssistant, ...assistants]);
    } else if (userRole === "accountant") {
      const newAccountant = {
        id: `kt-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: "active" as const,
        baseSalary: parseInt(formData.baseSalary)
      };
      setAccountants([newAccountant, ...accountants]);
    }

    setIsDialogOpen(false);
    toast.success(`Đã thêm ${formData.name} thành công!`);
    // Reset name for next time
    setFormData({ ...formData, name: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý User</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin hover:bg-admin/90 shadow-md transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4" /> Thêm User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-admin" /> Thêm User mới
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2 pb-2 border-b">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Vai trò</Label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger className="w-full bg-muted/30 border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Học sinh</SelectItem>
                    <SelectItem value="teacher">Giáo viên</SelectItem>
                    <SelectItem value="assistant">Trợ giảng</SelectItem>
                    <SelectItem value="accountant">Kế toán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Họ và tên</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Số điện thoại</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="09xxxxxxx" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Email</Label>
                <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
              </div>

              {userRole === "student" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Khối lớp</Label>
                      <Select value={formData.grade} onValueChange={(v) => setFormData({...formData, grade: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[6,7,8,9,10,11,12].map(g => <SelectItem key={g} value={g.toString()}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Cấp độ</Label>
                      <Select value={formData.level} onValueChange={(v) => setFormData({...formData, level: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Sơ cấp</SelectItem>
                          <SelectItem value="intermediate">Trung cấp</SelectItem>
                          <SelectItem value="advanced">Cao cấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Ngày sinh</Label>
                    <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg space-y-3 border border-dashed border-muted">
                    <p className="text-xs font-bold flex items-center gap-2"><Users className="h-3 w-3" /> Thông tin phụ huynh</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Tên phụ huynh</Label>
                        <Input className="h-8 text-sm" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">SĐT phụ huynh</Label>
                        <Input className="h-8 text-sm" value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(userRole === "teacher" || userRole === "assistant") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Môn học phụ trách</Label>
                    <Select value={formData.subject} onValueChange={(v) => setFormData({...formData, subject: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Văn">Văn</SelectItem>
                        <SelectItem value="Toán">Toán</SelectItem>
                        <SelectItem value="Anh">Anh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{userRole === "teacher" ? "Lương cơ bản" : "Lương theo giờ"}</Label>
                    <Input type="number" value={userRole === "teacher" ? formData.baseSalary : formData.rate} onChange={(e) => setFormData({...formData, [userRole === "teacher" ? 'baseSalary' : 'rate']: e.target.value})} />
                  </div>
                </div>
              )}

              {userRole === "accountant" && (
                <div className="space-y-2">
                  <Label className="text-xs">Lương cơ bản</Label>
                  <Input type="number" value={formData.baseSalary} onChange={(e) => setFormData({...formData, baseSalary: e.target.value})} />
                </div>
              )}
            </div>
            <DialogFooter className="border-t pt-4">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button className="bg-admin w-full sm:w-auto" onClick={handleAddUser}>Lưu thông tin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-11 border-none bg-muted/30 focus-visible:ring-admin" />
      </div>

      <Tabs defaultValue="students">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Học sinh ({students.length})</TabsTrigger>
          <TabsTrigger value="teachers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Giáo viên ({teachers.length})</TabsTrigger>
          <TabsTrigger value="assistants" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Trợ giảng ({assistants.length})</TabsTrigger>
          <TabsTrigger value="accountants" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Kế toán ({accountants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <div className="grid gap-3">
            {students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())).map((s) => (
              <Card key={s.id} className="cursor-pointer hover:shadow-md transition-all hover:bg-muted/5 group" onClick={() => navigate(`/admin/users/student/${s.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-admin/10 flex items-center justify-center text-admin font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-admin transition-colors">{s.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Lớp {s.grade} • {s.level} • PH: {s.parentName}
                      </p>
                    </div>
                  </div>
                  {statusBadge(s.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4">
          <div className="grid gap-3">
            {teachers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())).map((t) => (
              <Card key={t.id} className="cursor-pointer hover:shadow-md transition-all hover:bg-muted/5 group" onClick={() => navigate(`/admin/users/teacher/${t.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-admin transition-colors">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subject} • {t.sessionsThisMonth} buổi/tháng</p>
                    </div>
                  </div>
                  {statusBadge(t.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assistants" className="mt-4">
          <div className="grid gap-3">
            {assistants.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())).map((a) => (
              <Card key={a.id} className="cursor-pointer hover:shadow-md transition-all hover:bg-muted/5 group" onClick={() => navigate(`/admin/users/assistant/${a.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-admin transition-colors">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.subject} • {a.hoursThisMonth}h/tháng</p>
                    </div>
                  </div>
                  {statusBadge(a.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accountants" className="mt-4">
          <div className="grid gap-3">
            {accountants.map((a) => (
              <Card key={a.id} className="cursor-pointer hover:shadow-md transition-all hover:bg-muted/5 group" onClick={() => navigate(`/admin/users/accountant/${a.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-admin transition-colors">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>
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

