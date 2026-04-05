import { useNavigate } from "react-router-dom";
import { classes, mainTeachers, assistants } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, WifiOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TeacherClasses = () => {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const myClasses = classes.filter((c) => c.teacherId === userId || c.assistantId === userId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lớp của tôi</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myClasses.map((cls) => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/teacher/classes/${cls.id}`)}>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{cls.name}</h3>
                <Badge variant="outline">{cls.subject}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" /><span>{cls.studentCount}/{cls.maxStudents}</span>
                <Progress value={(cls.studentCount / cls.maxStudents) * 100} className="flex-1 h-2" />
              </div>
              <div className="flex flex-wrap gap-2">
                {cls.schedule.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {s.type === "online" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                    {s.day} {s.time}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherClasses;
