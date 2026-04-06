import { useState } from "react";
import { library as initialLibrary } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Plus, 
  UploadCloud, 
  FileUp, 
  Trophy, 
  Library as LibraryIcon, 
  BookOpen,
  Search
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminLibrary = () => {
  const [libraryList, setLibraryList] = useState(initialLibrary);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subject: "Văn",
    grade: "9",
    category: "learning"
  });

  const handleUpload = () => {
    if (!formData.title) {
      toast.error("Vui lòng nhập tên tài liệu");
      return;
    }

    const newItem = {
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade === "all" ? null : parseInt(formData.grade),
      category: formData.category,
      fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      downloadCount: 0,
    };

    setLibraryList([newItem, ...libraryList]);
    setIsDialogOpen(false);
    toast.success(`Đã tải lên tài liệu: ${formData.title}`);
    setFormData({ ...formData, title: "" });
  };

  const filteredList = libraryList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLibraryItems = (category: string) => {
    const items = filteredList.filter(item => item.category === category);
    if (items.length === 0) {
      return (
        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-muted/20 mt-4">
          <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium italic">Không tìm thấy tài liệu nào</p>
        </div>
      );
    }
    return (
      <div className="grid gap-3 mt-4">
        {items.map((item, i) => (
          <Card key={i} className="group hover:shadow-md transition-all hover:-translate-y-0.5 border-none bg-white shadow-sm overflow-hidden">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                  item.category === "hsg" ? "bg-amber-100 text-amber-600 group-hover:bg-amber-600" :
                  item.category === "reference" ? "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600" :
                  "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600"
                } group-hover:text-white`}>
                  {item.category === "hsg" ? <Trophy className="h-6 w-6" /> : 
                   item.category === "reference" ? <LibraryIcon className="h-6 w-6" /> : 
                   <BookOpen className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1 group-hover:text-admin transition-colors">{item.title}</p>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    <Badge variant="secondary" className="bg-muted/50 font-black h-5 px-2">{item.subject}</Badge>
                    {item.grade && <span>Lớp {item.grade}</span>}
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                    <span>{item.fileSize}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                    <span className="italic normal-case font-medium">{item.downloadCount} lượt tải</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full border-muted/20 text-muted-foreground hover:border-admin hover:text-admin transition-all shrink-0"
                onClick={() => toast.success(`Đã tải xuống: ${item.title}`)}
              >
                <Download className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thư viện tài liệu</h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Quản lý và chia sẻ học liệu toàn trung tâm</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm tài liệu..." 
              className="pl-10 h-10 w-[240px] rounded-full border-muted/30 focus-visible:ring-admin" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-admin hover:bg-admin/90 shadow-lg shadow-admin/20 rounded-full h-10 px-6 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Tải tài liệu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-800">
                  <FileUp className="h-6 w-6 text-admin" /> Tải học liệu mới
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Phân loại danh mục</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="rounded-xl h-12 border-muted/30"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hsg">1. Tài liệu bồi dưỡng học sinh giỏi</SelectItem>
                      <SelectItem value="reference">2. Thư viện sách tham khảo</SelectItem>
                      <SelectItem value="learning">3. Tài liệu học tập</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Tên tài liệu</Label>
                  <Input 
                    className="rounded-xl h-12 border-muted/30"
                    placeholder="Ví dụ: Chuyên đề bồi dưỡng HSG Toán..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Môn học</Label>
                    <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                      <SelectTrigger className="rounded-xl h-11 border-muted/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Văn">Văn</SelectItem>
                        <SelectItem value="Toán">Toán</SelectItem>
                        <SelectItem value="Anh">Anh</SelectItem>
                        <SelectItem value="Địa">Địa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Khối lớp</Label>
                    <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })}>
                      <SelectTrigger className="rounded-xl h-11 border-muted/30"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {[6, 7, 8, 9, 10, 11, 12].map(g => (
                          <SelectItem key={g} value={g.toString()}>Lớp {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-center p-8 border-2 border-dashed rounded-3xl bg-muted/10 hover:bg-muted/20 transition-all border-muted/30 group cursor-pointer">
                  <UploadCloud className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2 group-hover:scale-110 group-hover:text-admin transition-all" />
                  <p className="text-xs text-slate-600 font-bold">Chọn tệp tài liệu để tải lên</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-black tracking-tighter">Hỗ trợ PDF, DOCX, XLXS (Sắp ra mắt)</p>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-center pt-2">
                <Button variant="ghost" className="rounded-full px-8 font-bold" onClick={() => setIsDialogOpen(false)}>Hủy bỏ</Button>
                <Button className="bg-admin rounded-full px-10 font-bold shadow-lg shadow-admin/20" onClick={handleUpload}>Xác nhận tải lên</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="hsg" className="w-full">
        <TabsList className="bg-muted/30 p-1 mb-8 w-full md:w-auto h-auto rounded-2xl flex flex-wrap gap-1">
          <TabsTrigger value="hsg" className="rounded-xl flex-1 md:flex-none py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 font-black text-xs uppercase tracking-tighter transition-all">
            <Trophy className="h-4 w-4 mr-2" /> Bồi dưỡng HSG
          </TabsTrigger>
          <TabsTrigger value="reference" className="rounded-xl flex-1 md:flex-none py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-black text-xs uppercase tracking-tighter transition-all">
            <LibraryIcon className="h-4 w-4 mr-2" /> Sách tham khảo
          </TabsTrigger>
          <TabsTrigger value="learning" className="rounded-xl flex-1 md:flex-none py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 font-black text-xs uppercase tracking-tighter transition-all">
            <BookOpen className="h-4 w-4 mr-2" /> Tài liệu học tập
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hsg">{renderLibraryItems("hsg")}</TabsContent>
        <TabsContent value="reference">{renderLibraryItems("reference")}</TabsContent>
        <TabsContent value="learning">{renderLibraryItems("learning")}</TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLibrary;
