import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classes, mainTeachers, assistants } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Wifi, WifiOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const levels = ["all", "beginner", "intermediate", "advanced"];
const levelLabels: Record<string, string> = { all: "Tất cả", beginner: "Sơ cấp", intermediate: "Trung cấp", advanced: "Cao cấp" };

const AdminClasses = () => {
  const [level, setLevel] = useState("all");
  const navigate = useNavigate();
  const allTeachers = [...mainTeachers, ...assistants];

  const filtered = level === "all" ? classes : classes.filter((c) => c.level === level);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Quản lý lớp học</h1>
      <Tabs value={level} onValueChange={setLevel}>
        <TabsList>
          {levels.map((l) => (
            <TabsTrigger key={l} value={l}>{levelLabels[l]}</TabsTrigger>
          ))}
        </TabsList>
        {levels.map((l) => (
          <TabsContent key={l} value={l}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(l === "all" ? classes : classes.filter((c) => c.level === l)).map((cls) => {
                const teacher = allTeachers.find((t) => t.id === cls.teacherId);
                return (
                  <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{cls.name}</h3>
                        <Badge variant="outline">{cls.subject}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">GV: {teacher?.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{cls.studentCount}/{cls.maxStudents}</span>
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
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminClasses;
