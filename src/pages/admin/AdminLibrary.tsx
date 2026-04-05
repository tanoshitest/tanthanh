import { useState } from "react";
import { library as initialLibrary } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus, UploadCloud, FileUp } from "lucide-react";
import { toast } from "sonner";
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

const AdminLibrary = () => {
  const [libraryList, setLibraryList] = useState(initialLibrary);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Văn",
    grade: "9",
  });

  const handleUpload = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tên tài liệu");
      return;
    }

    const newItem = {
      title: formData.title,
      subject: formData.subject,
      grade: parseInt(formData.grade),
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      downloadCount: 0,
    };

    setLibraryList([newItem, ...libraryList]);
    setIsDialogOpen(false);
    toast.success(`Đã tải lên tài liệu: ${formData.title}`);
    setFormData({ ...formData, title: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Thư viện tài liệu</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-admin hover:bg-admin/90 shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Tải tài liệu lên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5 text-admin" /> Tải tài liệu mới
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs">Tên tài liệu</Label>
                <Input 
                  placeholder="Ví dụ: Đề thi thử Toán tháng 4..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <Label className="text-xs">Khối lớp</Label>
                  <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[6, 7, 8, 9, 10, 11, 12].map(g => (
                        <SelectItem key={g} value={g.toString()}>Lớp {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2 text-center p-8 border-2 border-dashed rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto mb-2 group-hover:text-admin transition-colors" />
                <p className="text-xs text-muted-foreground font-medium">Nhấn để chọn tệp hoặc kéo thả</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PDF, DOCX, PNG, JPG (Max 20MB)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
              <Button className="bg-admin" onClick={handleUpload}>Tải lên hệ thống</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {libraryList.map((item, i) => (
          <Card key={i} className="group hover:shadow-md transition-all hover:-translate-y-0.5 border-none bg-card shadow-sm overflow-hidden">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-admin/10 flex items-center justify-center text-admin group-hover:bg-admin group-hover:text-white transition-all">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1 group-hover:text-admin transition-colors">{item.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="bg-muted/50 font-normal py-0 h-5 px-2">{item.subject}</Badge>
                    {item.grade && <span className="flex items-center gap-1"><Badge variant="outline" className="text-[10px] h-4 px-1 border-admin/30 text-admin font-normal">Lớp {item.grade}</Badge></span>}
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                    <span>{item.fileSize}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                    <span className="italic">{item.downloadCount} lượt tải</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-full border-admin text-admin hover:bg-admin hover:text-white transition-all"
                onClick={() => toast.info("Đang chuẩn bị tải xuống...")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLibrary;

