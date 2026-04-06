import { useState } from "react";
import { library as initialLibrary } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Trophy, 
  Library as LibraryIcon, 
  BookOpen,
  Search,
  LayoutList
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParentLibrary = () => {
  const [libraryList] = useState(initialLibrary);
  const [searchQuery, setSearchQuery] = useState("");

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
                  item.category === "reference" ? "bg-parent/10 text-parent group-hover:bg-parent" :
                  "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600"
                } group-hover:text-white`}>
                  {item.category === "hsg" ? <Trophy className="h-6 w-6" /> : 
                   item.category === "reference" ? <LibraryIcon className="h-6 w-6" /> : 
                   <BookOpen className="h-6 w-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1 group-hover:text-parent transition-colors">{item.title}</p>
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
                className="h-10 w-10 rounded-full border-muted/20 text-muted-foreground hover:border-parent hover:text-parent transition-all shrink-0"
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-parent/10 flex items-center justify-center">
            <LayoutList className="h-6 w-6 text-parent" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thư viện tài liệu</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm tài liệu..." 
            className="pl-10 h-11 w-full md:w-[320px] rounded-full border-muted/30 focus-visible:ring-parent shadow-sm" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="hsg" className="w-full">
        <TabsList className="bg-muted/30 p-1 mb-8 w-full md:w-auto h-auto rounded-2xl flex flex-wrap gap-1">
          <TabsTrigger value="hsg" className="rounded-xl flex-1 md:flex-none py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-600 font-black text-xs uppercase tracking-tighter transition-all">
            <Trophy className="h-4 w-4 mr-2" /> Bồi dưỡng HSG
          </TabsTrigger>
          <TabsTrigger value="reference" className="rounded-xl flex-1 md:flex-none py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-parent font-black text-xs uppercase tracking-tighter transition-all">
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

export default ParentLibrary;
