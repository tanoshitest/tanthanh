import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { parentStudentAccounts, classes } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const ParentClasses = () => {
  const { selectedChildId } = useAuthStore();
  const navigate = useNavigate();
  const parent = parentStudentAccounts[0];
  const child = parent.children.find((c) => c.id === selectedChildId) || parent.children[0];
  const myClasses = classes.filter((c) => child.classes.includes(c.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lớp học của {child.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {myClasses.map((cls) => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/parent/classes/${cls.id}`)}>
            <CardContent className="p-5 space-y-2">
              <h3 className="font-bold">{cls.name}</h3>
              <Badge variant="outline">{cls.subject}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" />{cls.studentCount} HS</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ParentClasses;
