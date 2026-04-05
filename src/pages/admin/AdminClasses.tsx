import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classes as initialClasses, mainTeachers, assistants } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Wifi, WifiOff, Plus, Calendar } from "lucide-react";
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

const levels = ["all", "beginner", "intermediate", "advanced"];
const levelLabels: Record<string, string> = { all: "Tất cả", beginner: "Sơ cấp", intermediate: "Trung cấp", advanced: "Cao cấp" };

const AdminClasses = () => {
  const [classList, setClassList] = useState(initialClasses);
  const [level, setLevel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const allTeachers = [...mainTeachers, ...assistants];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    subject: "Văn",
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
      teacherId: formData.teacherId,
      assistantId: formData.assistantId,
      studentCount: 0,
      maxStudents: parseInt(formData.maxStudents),
      schedule: [{ day: formData.scheduleDay, time: formData.scheduleTime, type: "offline" as const }]
    };

    setClassList([newClass, ...classList]);
    setIsDialogOpen(false);
    setFormData({ ...formData, name: "" }); // Reset name
    toast.success(`Đã tạo lớp ${newClass.name} thành công!`);
  };

  const filtered = level === "all" ? classList : classList.filter((c) => c.level === level);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin hover:bg-admin/90">
              <Plus className="mr-2 h-4 w-4" /> Thêm lớp học
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm lớp học mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-xs">Tên lớp</Label>
                <Input
                  id="name"
                  placeholder="Lớp 9A - Văn..."
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Môn học</Label>
                  <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Văn">Văn</SelectItem>
                      <SelectItem value="Toán">Toán</SelectItem>
                      <SelectItem value="Anh">Anh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cấp độ</Label>
                  <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Sơ cấp</SelectItem>
                      <SelectItem value="intermediate">Trung cấp</SelectItem>
                      <SelectItem value="advanced">Cao cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Giáo viên</Label>
                  <Select value={formData.teacherId} onValueChange={(v) => setFormData({ ...formData, teacherId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mainTeachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Trợ giảng</Label>
                  <Select value={formData.assistantId} onValueChange={(v) => setFormData({ ...formData, assistantId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {assistants.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Khối</Label>
                  <Input type="number" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Sĩ số tối đa</Label>
                  <Input type="number" value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Lịch học (buổi đầu tiên)</Label>
                <div className="flex gap-2">
                  <Select value={formData.scheduleDay} onValueChange={(v) => setFormData({ ...formData, scheduleDay: v })}>
                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input placeholder="18:00-20:00" value={formData.scheduleTime} onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button className="bg-admin" onClick={handleAddClass}>Tạo lớp</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={level} onValueChange={setLevel}>
        <TabsList className="mb-4">
          {levels.map((l) => (
            <TabsTrigger key={l} value={l}>{levelLabels[l]}</TabsTrigger>
          ))}
        </TabsList>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => {
            const teacher = allTeachers.find((t) => t.id === cls.teacherId);
            return (
              <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{cls.name}</h3>
                    <Badge variant="outline" className="bg-primary/5">{cls.subject}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-status-success"></span>
                    GV: {teacher?.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{cls.studentCount}/{cls.maxStudents}</span>
                    <Progress value={(cls.studentCount / cls.maxStudents) * 100} className="flex-1 h-1.5" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cls.schedule.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] font-normal py-0 px-2 h-5 bg-muted/50 border-none">
                        {s.type === "online" ? <Wifi className="h-2.5 w-2.5 mr-1" /> : <WifiOff className="h-2.5 w-2.5 mr-1" />}
                        {s.day} {s.time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminClasses;

