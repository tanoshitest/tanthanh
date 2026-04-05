import { practiceExams, classes } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ParentPracticeExams = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Luyện đề thi</h1>
    {practiceExams.map((e) => {
      const cls = classes.find((c) => c.id === e.classId);
      return (
        <Card key={e.id}>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{e.title}</p>
                <p className="text-sm text-muted-foreground">{cls?.name} • {e.duration} phút</p>
              </div>
              <Badge className={e.status === "completed" ? "bg-status-success" : "bg-status-warning"}>{e.status === "completed" ? "Hoàn thành" : "Đang mở"}</Badge>
            </div>
            {e.rankings.length > 0 && (
              <div className="mt-2 space-y-1">{e.rankings.map((r) => (
                <div key={r.rank} className="flex gap-2 text-sm"><span className="font-bold">#{r.rank}</span><span>{r.studentName}</span><span className="text-muted-foreground">{r.score}/{e.totalPoints}</span></div>
              ))}</div>
            )}
          </CardContent>
        </Card>
      );
    })}
  </div>
);

export default ParentPracticeExams;
