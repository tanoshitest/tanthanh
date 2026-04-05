import { assignments, practiceExams, classes } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminAssignments = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Bài tập & Luyện đề</h1>
    <Tabs defaultValue="assignments">
      <TabsList>
        <TabsTrigger value="assignments">Bài tập ({assignments.length})</TabsTrigger>
        <TabsTrigger value="exams">Luyện đề ({practiceExams.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="assignments">
        <div className="space-y-3">
          {assignments.map((a) => {
            const cls = classes.find((c) => c.id === a.classId);
            return (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{cls?.name} • Hạn: {a.dueDate} • {a.totalPoints} điểm</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge className="bg-status-success">{a.submissions.filter((s) => s.status === "graded").length} đã chấm</Badge>
                      <Badge className="bg-status-warning">{a.submissions.filter((s) => s.status === "submitted").length} chờ chấm</Badge>
                      <Badge className="bg-status-danger">{a.submissions.filter((s) => s.status === "not_submitted").length} chưa nộp</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>
      <TabsContent value="exams">
        <div className="space-y-3">
          {practiceExams.map((e) => {
            const cls = classes.find((c) => c.id === e.classId);
            return (
              <Card key={e.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{e.title}</p>
                      <p className="text-sm text-muted-foreground">{cls?.name} • {e.duration} phút • {e.totalPoints} điểm</p>
                    </div>
                    <Badge className={e.status === "completed" ? "bg-status-success" : "bg-status-warning"}>{e.status === "completed" ? "Hoàn thành" : "Đang diễn ra"}</Badge>
                  </div>
                  {e.rankings.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {e.rankings.map((r) => (
                        <div key={r.rank} className="flex items-center gap-2 text-sm">
                          <span className="font-bold w-6">#{r.rank}</span>
                          <span>{r.studentName}</span>
                          <span className="text-muted-foreground">{r.score}/{e.totalPoints}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default AdminAssignments;
