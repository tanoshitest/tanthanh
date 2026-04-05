import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lessons, classes } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Video } from "lucide-react";
import { toast } from "sonner";

const AdminLessons = () => {
  const navigate = useNavigate();
  const [data] = useState(lessons);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bài giảng</h1>
        <Button onClick={() => toast.info("Tạo bài giảng mới (demo)")}><Plus className="mr-2 h-4 w-4" />Thêm bài giảng</Button>
      </div>
      <div className="grid gap-4">
        {data.map((lesson) => {
          const cls = classes.find((c) => c.id === lesson.classId);
          return (
            <Card key={lesson.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/lessons/${lesson.id}`)}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{lesson.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cls?.name} • {lesson.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Video className="h-3 w-3" />{lesson.videos.length} video</span>
                    <span>{lesson.attachments.length} tài liệu</span>
                  </div>
                </div>
                <Badge className={lesson.status === "published" ? "bg-status-success" : "bg-status-warning"}>
                  {lesson.status === "published" ? "Đã xuất bản" : "Nháp"}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLessons;
