import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  mainTeachers as initialTeachers, 
  assistants as initialAssistants, 
  accountants as initialAccountants, 
  parentStudentAccounts as initialParents, 
  classes as initialClasses 
} from "@/lib/mock-data";
import { 
  Search, 
  Plus, 
  UserPlus, 
  GraduationCap, 
  Users, 
  ChevronRight,
  Filter,
  UserCheck,
  UserCog,
  Briefcase,
  Contact2,
  Settings2,
  GraduationCap as StudentIcon
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusBadge = (s: string) => {
  if (s === "active") return <Badge className="bg-emerald-500/10 text-emerald-600 border-none shadow-none text-[10px] font-black tracking-tight px-2 h-5">HOẠT ĐỘNG</Badge>;
  if (s === "on_leave") return <Badge className="bg-amber-500/10 text-amber-600 border-none shadow-none text-[10px] font-black tracking-tight px-2 h-5">NGHỈ PHÉP</Badge>;
  return <Badge variant="destructive" className="border-none shadow-none text-[10px] font-black tracking-tight px-2 h-5 uppercase">TẠM NGƯNG</Badge>;
};

const roleBadge = (role: string) => {
  const map: Record<string, { label: string, color: string, icon: any }> = {
    student: { label: "Học sinh", color: "bg-blue-500/10 text-blue-600", icon: GraduationCap },
    teacher: { label: "Giáo viên", color: "bg-purple-500/10 text-purple-600", icon: UserCheck },
    assistant: { label: "Trợ giảng", color: "bg-orange-500/10 text-orange-600", icon: UserCog },
    accountant: { label: "Kế toán", color: "bg-slate-500/10 text-slate-600", icon: Briefcase },
  };
  const info = map[role] || map.student;
  const Icon = info.icon;
  return (
    <Badge className={`${info.color} border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 gap-1`}>
      <Icon className="h-3 w-3" /> {info.label}
    </Badge>
  );
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterClassId, setFilterClassId] = useState("all");
  const [activeTab, setActiveTab] = useState("students");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState("student");

  // Local user states (mock only)
  const [teachers] = useState(initialTeachers);
  const [assistants] = useState(initialAssistants);
  const [accountants] = useState(initialAccountants);
  const [parents] = useState(initialParents);

  // Data Preparation
  const studentList = useMemo(() => {
    return parents.flatMap((p) =>
      p.children.map((c) => ({ 
        ...c, 
        role: "student", 
        parentName: p.name, 
        contact: p.phone,
        email: p.email,
        details: `Lớp ${c.grade} • ${c.level.toUpperCase()}`
      }))
    );
  }, [parents]);

  const staffList = useMemo(() => {
    const list = [
      ...teachers.map(t => ({ ...t, role: "teacher", contact: t.phone, details: `${t.subject} (GV Chính)` })),
      ...assistants.map(a => ({ ...a, role: "assistant", contact: a.phone, details: `${a.subject} (Trợ giảng)` })),
      ...accountants.map(a => ({ ...a, role: "accountant", contact: a.phone, details: "Kế toán trung tâm" }))
    ];
    return list;
  }, [teachers, assistants, accountants]);

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return studentList.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.contact?.includes(search);
      let matchesCategory = true;
      if (filterCategory !== "all") {
        const classes = initialClasses.filter(c => s.classes?.includes(c.id));
        matchesCategory = classes.some(c => c.category === filterCategory);
      }
      const matchesClass = filterClassId === "all" || s.classes?.includes(filterClassId);
      return matchesSearch && matchesCategory && matchesClass;
    });
  }, [studentList, search, filterCategory, filterClassId]);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.contact?.includes(search);
      const matchesRole = filterRole === "all" || s.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [staffList, search, filterRole]);

  const availableClasses = useMemo(() => {
    if (filterCategory === "all") return initialClasses;
    return initialClasses.filter(c => c.category === filterCategory);
  }, [filterCategory]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterRole("all");
    setFilterCategory("all");
    setFilterClassId("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-muted/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý thành viên</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1 italic">Hệ thống quản lý học viên và nhân sự vận hành trung tâm</p>
        </div>
        <Button className="bg-admin hover:bg-admin/90 shadow-lg shadow-admin/20 rounded-full h-12 px-8 font-black text-xs uppercase tracking-widest transition-all" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> THÊM THÀNH VIÊN
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); handleResetFilters(); }}>
        <TabsList className="bg-muted/10 p-1 mb-6 rounded-2xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="students" className="rounded-xl flex-1 md:flex-none py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-admin font-black text-xs uppercase tracking-widest transition-all">
            <StudentIcon className="h-4 w-4 mr-2" /> Học viên
          </TabsTrigger>
          <TabsTrigger value="staff" className="rounded-xl flex-1 md:flex-none py-3 px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all">
            <Settings2 className="h-4 w-4 mr-2" /> Vận hành
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-4 items-end bg-card p-5 rounded-[2rem] border border-muted/20 shadow-sm">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Tìm kiếm học viên</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Họ tên, SĐT hoặc Email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11 h-12 rounded-2xl border-muted/30 focus-visible:ring-admin bg-muted/5 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Danh mục lớp</Label>
              <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setFilterClassId("all"); }}>
                <SelectTrigger className="h-12 rounded-2xl border-muted/30 bg-muted/5 font-medium focus:ring-admin">
                  <SelectValue placeholder="Tất cả loại lớp" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tất cả loại lớp</SelectItem>
                  <SelectItem value="kem">Lớp Kèm</SelectItem>
                  <SelectItem value="luyen-thi">Lớp luyện thi</SelectItem>
                  <SelectItem value="dai-tra">Lớp đại trà</SelectItem>
                  <SelectItem value="chuyen">Lớp chuyên</SelectItem>
                  <SelectItem value="online">Lớp online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Lớp chi tiết</Label>
              <Select value={filterClassId} onValueChange={setFilterClassId}>
                <SelectTrigger className="h-12 rounded-2xl border-muted/30 bg-muted/5 font-medium focus:ring-admin">
                  <SelectValue placeholder="Chọn lớp..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tất cả lớp học</SelectItem>
                  {availableClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-[2rem] border border-muted/20 shadow-sm">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-muted/10">
                  <TableHead className="w-[300px] text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-8 py-5">Học viên</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Thông tin lớp</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Vai trò</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Liên hệ</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Trạng thái</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((m) => (
                  <TableRow key={m.id} className="group hover:bg-muted/5 border-muted/10 cursor-pointer transition-colors h-20" onClick={() => navigate(`/admin/users/${m.role}/${m.id}`)}>
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 ring-1 ring-muted/20">
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-xs uppercase">{m.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-800 group-hover:text-admin transition-colors">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs font-semibold text-slate-600">{m.details}</span></TableCell>
                    <TableCell className="text-center">{roleBadge(m.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col"><span className="text-xs font-bold text-slate-700">{m.contact}</span><span className="text-[10px] text-muted-foreground font-medium">{m.email}</span></div>
                    </TableCell>
                    <TableCell className="text-center">{statusBadge(m.status || "active")}</TableCell>
                    <TableCell className="pr-8"><ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-admin group-hover:translate-x-1 transition-all" /></TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="h-60 text-center"><div className="flex flex-col items-center justify-center text-muted-foreground gap-3"><Filter className="h-12 w-12 text-muted/20" /><p className="font-bold text-sm">Không tìm thấy học viên phù hợp</p></div></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-3 items-end bg-card p-5 rounded-[2rem] border border-muted/20 shadow-sm">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Tìm kiếm nhân sự</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Họ tên, SĐT hoặc Email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11 h-12 rounded-2xl border-muted/30 focus-visible:ring-indigo-600 bg-muted/5 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Vị trí</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="h-12 rounded-2xl border-muted/30 bg-muted/5 font-medium focus:ring-indigo-600">
                  <SelectValue placeholder="Tất cả vị trí" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tất cả vị trí</SelectItem>
                  <SelectItem value="teacher">Giáo viên</SelectItem>
                  <SelectItem value="assistant">Trợ giảng</SelectItem>
                  <SelectItem value="accountant">Kế toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-[2rem] border border-muted/20 shadow-sm">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-muted/10">
                  <TableHead className="w-[300px] text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-8 py-5">Nhân sự vận hành</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Phụ trách</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Vai trò</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Liên hệ</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Trạng thái</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? filteredStaff.map((m) => (
                  <TableRow key={m.id} className="group hover:bg-muted/5 border-muted/10 cursor-pointer transition-colors h-20" onClick={() => navigate(`/admin/users/${m.role}/${m.id}`)}>
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 ring-1 ring-muted/20">
                          <AvatarFallback className={`font-black text-xs uppercase ${
                            m.role === 'teacher' ? 'bg-purple-50 text-purple-600' :
                            m.role === 'assistant' ? 'bg-orange-50 text-orange-600' :
                            'bg-slate-50 text-slate-600'
                          }`}>{m.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs font-semibold text-slate-600">{m.details}</span></TableCell>
                    <TableCell className="text-center">{roleBadge(m.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col"><span className="text-xs font-bold text-slate-700">{m.contact}</span><span className="text-[10px] text-muted-foreground font-medium">{m.email}</span></div>
                    </TableCell>
                    <TableCell className="text-center">{statusBadge(m.status || "active")}</TableCell>
                    <TableCell className="pr-8"><ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" /></TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="h-60 text-center"><div className="flex flex-col items-center justify-center text-muted-foreground gap-3"><Filter className="h-12 w-12 text-muted/20" /><p className="font-bold text-sm">Không tìm thấy nhân sự phù hợp</p></div></TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-800">
              <UserPlus className="h-6 w-6 text-admin" /> Thêm thành viên mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3 pb-3 border-b border-muted/10">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Chọn vai trò</Label>
              <div className="flex gap-2">
                {['student', 'teacher', 'assistant', 'accountant'].map((r) => (
                  <Button key={r} variant={newUserRole === r ? "default" : "outline"} className={`flex-1 h-10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    newUserRole === r ? 'bg-admin ring-2 ring-admin/20 shadow-lg' : 'bg-muted/10 border-transparent hover:bg-muted/20'
                  }`} onClick={() => setNewUserRole(r)}>
                    {r === 'student' ? 'Học sinh' : r === 'teacher' ? 'G.Viên' : r === 'assistant' ? 'T.Giảng' : 'K.Toán'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Họ và tên</Label><Input className="h-11 rounded-xl border-muted/30 focus-visible:ring-admin" placeholder="Nguyễn Văn A" /></div>
              <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Số điện thoại</Label><Input className="h-11 rounded-xl border-muted/30 focus-visible:ring-admin" placeholder="09xxxxxxx" /></div>
            </div>
            {newUserRole === "student" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Khối lớp</Label><Select defaultValue="9"><SelectTrigger className="rounded-xl h-11 border-muted/30"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{[6,7,8,9,10,11,12].map(g => <SelectItem key={g} value={g.toString()}>Lớp {g}</SelectItem>)}</SelectContent></Select></div>
                   <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Trình độ</Label><Select defaultValue="beginner"><SelectTrigger className="rounded-xl h-11 border-muted/30"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="beginner">Sơ cấp</SelectItem><SelectItem value="intermediate">Trung cấp</SelectItem><SelectItem value="advanced">Cao cấp</SelectItem></SelectContent></Select></div>
                </div>
                <div className="p-4 bg-muted/10 rounded-3xl space-y-4 border border-muted/20">
                  <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-700"><Contact2 className="h-4 w-4 text-admin" /> Thông tin phụ huynh</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Tên phụ huynh</Label><Input className="h-10 text-xs rounded-xl border-muted/30" /></div>
                    <div className="space-y-1"><Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">SĐT phụ huynh</Label><Input className="h-10 text-xs rounded-xl border-muted/30" /></div>
                  </div>
                </div>
              </>
            )}
            {(newUserRole === "teacher" || newUserRole === "assistant") && (
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Môn học</Label><Select defaultValue="Văn"><SelectTrigger className="rounded-xl h-11 border-muted/30"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="Văn">Văn học</SelectItem><SelectItem value="Toán">Toán học</SelectItem><SelectItem value="Anh">Tiếng Anh</SelectItem></SelectContent></Select></div>
                 <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Lương</Label><Input type="number" className="h-11 rounded-xl border-muted/30 focus-visible:ring-admin" /></div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:justify-center pt-2">
            <Button variant="ghost" className="rounded-full px-8 font-bold" onClick={() => setIsDialogOpen(false)}>Hủy bỏ</Button>
            <Button className="bg-admin rounded-full px-12 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-admin/20" onClick={() => {toast.success("Đã thêm thành công!"); setIsDialogOpen(false);}}>Lưu thông tin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
