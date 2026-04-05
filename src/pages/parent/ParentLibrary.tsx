import { library, practiceExams, classes } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, LayoutList, GraduationCap, Clock } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParentLibrary = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-parent/10 flex items-center justify-center">
        <LayoutList className="h-6 w-6 text-parent" />
      </div>
      <h1 className="text-2xl font-bold">Thư viện kiến thức</h1>
    </div>

    <Tabs defaultValue="exams" className="w-full">
      <TabsList className="bg-muted/30 p-1 mb-6">
        <TabsTrigger value="exams" className="px-8 py-2 data-[state=active]:bg-parent data-[state=active]:text-parent-foreground">
          Luyện đề
        </TabsTrigger>
        <TabsTrigger value="documents" className="px-8 py-2 data-[state=active]:bg-parent data-[state=active]:text-parent-foreground">
          Kiến thức tham khảo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="exams" className="space-y-4">
        {practiceExams.length > 0 ? practiceExams.map((e) => {
          const cls = classes.find((c) => c.id === e.classId);
          return (
            <Card key={e.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex h-full min-h-[100px]">
                  <div className={`w-2 ${e.status === "completed" ? "bg-status-success" : "bg-status-warning"}`} />
                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-lg">{e.title}</p>
                          <Badge variant="outline" className={e.status === "completed" ? "border-status-success text-status-success" : "border-status-warning text-status-warning"}>
                            {e.status === "completed" ? "Hoàn thành" : "Đang mở"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {cls?.name}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {e.duration} phút</span>
                          <span>{e.totalPoints} điểm tối đa</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {e.status === "completed" ? (
                          <Button variant="outline" className="border-parent text-parent hover:bg-parent/5">Xem lại bài</Button>
                        ) : (
                          <Button className="bg-parent text-parent-foreground">Bắt đầu làm bài</Button>
                        )}
                      </div>
                    </div>

                    {e.rankings.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-muted/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-wider">Bảng xếp hạng lớp</p>
                        <div className="flex flex-wrap gap-4">
                          {e.rankings.map((r) => (
                            <div key={r.rank} className="flex items-center gap-2 bg-muted/20 px-3 py-1 rounded-full text-sm border border-muted-foreground/10">
                              <span className={`font-bold ${r.rank === 1 ? "text-yellow-600" : "text-muted-foreground"}`}>#{r.rank}</span>
                              <span className="font-medium">{r.studentName}</span>
                              <span className="text-parent font-bold">{r.score}đ</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Hiện chưa có đề thi luyện tập nào</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        {library.map((item, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:bg-parent/10 transition-colors">
                  <FileText className="h-6 w-6 text-muted-foreground group-hover:text-parent transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-base mb-1">{item.title}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold">{item.subject}</Badge>
                    {item.grade && <span className="flex items-center gap-1">• Lớp {item.grade}</span>}
                    <span className="flex items-center gap-1">• {item.fileSize}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-muted-foreground/20 hover:border-parent hover:text-parent hover:bg-parent/5 h-10 w-10"
                onClick={() => toast.success(`Đã tải xuống: ${item.title}`)}
              >
                <Download className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  </div>
);

export default ParentLibrary;
