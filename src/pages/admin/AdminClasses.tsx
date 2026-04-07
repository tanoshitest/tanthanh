import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { classes as initialClasses, mainTeachers, assistants } from "@/lib/mock-data";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Layers, 
  GraduationCap as TeacherIcon,
  LayoutGrid,
  Calendar as CalendarIcon,
  Wifi,
  WifiOff
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const categories = ["all", "kem", "luyen-thi", "dai-tra", "chuyen", "online"];
const categoryLabels: Record<string, string> = { 
  all: "Tất cả", 
  kem: "Lớp Kèm", 
  "luyen-thi": "Lớp luyện thi", 
  "dai-tra": "Lớp đại trà", 
  chuyen: "Lớp chuyên", 
  online: "Lớp online" 
};

const categoryBadge = (cat: string) => {
  const map: Record<string, { label: string, color: string }> = {
    kem: { label: "KÈM", color: "bg-amber-500/10 text-amber-600" },
    "luyen-thi": { label: "LUYỆN THI", color: "bg-red-500/10 text-red-600" },
    "dai-tra": { label: "ĐẠI TRÀ", color: "bg-blue-500/10 text-blue-600" },
    chuyen: { label: "CHUYÊN", color: "bg-purple-500/10 text-purple-600" },
    online: { label: "ONLINE", color: "bg-emerald-500/10 text-emerald-600" },
  };
  const info = map[cat] || { label: cat.toUpperCase(), color: "bg-slate-500/10 text-slate-600" };
  return <Badge className={`${info.color} border-none shadow-none text-[9px] font-black tracking-widest px-2 h-5`}>{info.label}</Badge>;
};

const AdminClasses = () => {
  const [classList, setClassList] = useState(initialClasses);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const allTeachersData = [...mainTeachers, ...assistants];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    subject: "Văn",
    category: "dai-tra" as const,
    level: "beginner",
    grade: "9",
    teacherId: mainTeachers[0].id,
    assistantId: assistants[0].id,
    maxStudents: "30",
    scheduleDay: "Thứ 2",
    scheduleTime: "18:00-20:00"
  });

  const handleAddClass = () => {
    if (!formData.name) {
      toast.error("Vui lòng nhập tên lớp");
      return;
    }

    const newClass = {
      id: `class-${Date.now()}`,
      name: formData.name,
      subject: formData.subject,
      grade: parseInt(formData.grade),
      level: formData.level as any,
      category: formData.category as any,
      teacherId: formData.teacherId,
      assistantId: formData.assistantId,
      studentCount: 0,
      maxStudents: parseInt(formData.maxStudents),
      schedule: [{ day: formData.scheduleDay, time: formData.scheduleTime, type: "offline" as const }]
    };

    setClassList([newClass, ...classList]);
    setIsDialogOpen(false);
    setFormData({ ...formData, name: "" });
    toast.success(`Đã tạo lớp ${newClass.name} thành công!`);
  };

  const filteredClasses = useMemo(() => {
    return classList.filter(c => {
      const teacher = allTeachersData.find(t => t.id === c.teacherId);
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                           teacher?.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [classList, search, filterCategory]);

  const handleResetFilters = () => {
    setSearch("");
    setFilterCategory("all");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-muted/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý lớp học</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1 italic">Hệ thống phân phối và theo dõi sĩ số lớp học tập trung</p>
        </div>
        <Button className="bg-admin hover:bg-admin/90 shadow-lg shadow-admin/20 rounded-full h-12 px-8 font-black text-xs uppercase tracking-widest transition-all" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> THÊM LỚP HỌC
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 items-end bg-card p-5 rounded-[2rem] border border-muted/20 shadow-sm">
        <div className="col-span-2 space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Tìm kiếm lớp học</Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tên lớp, môn học hoặc giáo viên..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-11 h-12 rounded-2xl border-muted/30 focus-visible:ring-admin bg-muted/5 font-medium" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Loại lớp</Label>
            {(search || filterCategory !== "all") && (
              <button onClick={handleResetFilters} className="text-[9px] font-black text-admin uppercase tracking-widest hover:underline px-1">Xóa lọc</button>
            )}
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-12 rounded-2xl border-muted/30 bg-muted/5 font-medium focus:ring-admin transition-all">
              <SelectValue placeholder="Tất cả loại lớp" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-xs font-bold text-slate-700">{categoryLabels[cat]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden bg-white rounded-[2.5rem] border border-muted/20 shadow-sm px-2 pt-2">
        <Table>
          <TableHeader className="bg-muted/5">
            <TableRow className="hover:bg-transparent border-muted/10">
              <TableHead className="w-[300px] text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-8 py-5">
                <div className="flex items-center gap-2"><LayoutGrid className="h-3 w-3" /> THÔNG TIN LỚP</div>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <div className="flex items-center gap-2"><TeacherIcon className="h-3 w-3" /> GIÁO VIÊN</div>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <div className="flex items-center gap-2"><Users className="h-3 w-3" /> SĨ SỐ</div>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <div className="flex items-center gap-2"><CalendarIcon className="h-3 w-3" /> LỊCH HỌC</div>
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">LOẠI LỚP</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? filteredClasses.map((cls) => {
              const teacher = allTeachersData.find(t => t.id === cls.teacherId);
              const percentage = Math.min((cls.studentCount / cls.maxStudents) * 100, 100);
              
              return (
                <TableRow key={cls.id} className="group hover:bg-muted/5 border-muted/10 cursor-pointer transition-colors h-24" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                  <TableCell className="pl-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 group-hover:text-admin transition-colors">{cls.name}</span>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] h-4 font-black">{cls.subject}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 uppercase tracking-tighter">KHỐI {cls.grade} • {cls.level === 'advanced' ? 'CAO CẤP' : cls.level === 'intermediate' ? 'TRUNG CẤP' : 'SƠ CẤP'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-1 ring-muted/20">
                        <AvatarFallback className="bg-purple-50 text-purple-600 font-black text-[10px]">{teacher?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold text-slate-700">{teacher?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-32 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black tracking-widest">
                        <span className="text-slate-800">{cls.studentCount}/{cls.maxStudents}</span>
                        <span className={percentage > 90 ? 'text-red-500' : 'text-muted-foreground'}>{Math.round(percentage)}%</span>
                      </div>
                      <Progress value={percentage} className={`h-1.5 rounded-full ${percentage > 90 ? 'bg-red-100' : 'bg-muted/20'}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {cls.schedule.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                          {s.type === "online" ? <Wifi className="h-2.5 w-2.5 text-emerald-500" /> : <WifiOff className="h-2.5 w-2.5 text-muted-foreground" />}
                          {s.day} • {s.time}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{categoryBadge(cls.category)}</TableCell>
                  <TableCell className="pr-8"><ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-admin group-hover:translate-x-1 transition-all" /></TableCell>
                </TableRow>
              );
            }) : (
              <TableRow><TableCell colSpan={6} className="h-60 text-center"><div className="flex flex-col items-center justify-center text-muted-foreground gap-3"><Filter className="h-12 w-12 text-muted/20" /><p className="font-bold text-sm uppercase tracking-widest">Không tìm thấy lớp học phù hợp</p></div></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
          <div className="bg-admin p-8 text-white relative overflow-hidden">
            <Layers className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
            <DialogTitle className="text-2xl font-black tracking-tight uppercase">Thêm lớp học mới</DialogTitle>
            <p className="text-white/70 text-xs font-semibold mt-1 tracking-wider uppercase">Khởi tạo môi trường học tập lý tưởng</p>
          </div>
          
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Tên lớp học</Label>
                <Input 
                  placeholder="Ví dụ: Đại trà - 7, Luyện thi - 3..." 
                  className="h-12 rounded-2xl border-muted/30 focus-visible:ring-admin font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Môn học</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-muted/20 bg-muted/5 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Văn" className="font-semibold">Văn</SelectItem>
                      <SelectItem value="Toán" className="font-semibold">Toán</SelectItem>
                      <SelectItem value="Anh" className="font-semibold">Anh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-admin">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Loại lớp</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                    <SelectTrigger className="h-11 rounded-xl border-admin/20 bg-admin/5 font-black ring-0 focus:ring-0"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categories.filter(c => c !== "all").map(c => (
                        <SelectItem key={c} value={c} className="font-bold text-slate-700">{categoryLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Khối lớp</Label>
                   <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-muted/20 bg-muted/5 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl pb-10">
                      {[6,7,8,9,10,11,12].map(g => <SelectItem key={g} value={g.toString()} className="font-semibold text-center">Khối {g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Giáo viên chính</Label>
                  <Select value={formData.teacherId} onValueChange={(v) => setFormData({ ...formData, teacherId: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-muted/20 bg-muted/5 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {mainTeachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Trợ giảng</Label>
                  <Select value={formData.assistantId} onValueChange={(v) => setFormData({ ...formData, assistantId: v })}>
                    <SelectTrigger className="h-11 rounded-xl border-muted/20 bg-muted/5 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {assistants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Sĩ số tối đa</Label>
                  <Input 
                    type="number" 
                    value={formData.maxStudents} 
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} 
                    className="h-11 rounded-xl border-muted/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Lịch học</Label>
                  <div className="flex gap-2">
                    <Select value={formData.scheduleDay} onValueChange={(v) => setFormData({ ...formData, scheduleDay: v })}>
                      <SelectTrigger className="h-11 flex-none w-[110px] rounded-xl border-muted/20 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl pb-10">
                        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map(d => <SelectItem key={d} value={d} className="font-semibold">{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="18:00-20:00" 
                      value={formData.scheduleTime} 
                      onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })} 
                      className="h-11 rounded-xl border-muted/20 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-muted/5 flex gap-3 justify-end border-t border-muted/10">
            <Button variant="ghost" className="rounded-full px-8 font-bold text-slate-500" onClick={() => setIsDialogOpen(false)}>Hủy bỏ</Button>
            <Button className="bg-admin rounded-full px-12 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-admin/20 transition-all hover:scale-105 active:scale-95" onClick={handleAddClass}>Khởi tạo lớp</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClasses;
