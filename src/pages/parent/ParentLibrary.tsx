import { library } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const ParentLibrary = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Kiến thức tham khảo</h1>
    {library.map((item, i) => (
      <Card key={i}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.title}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{item.subject}</Badge>
                {item.grade && <span>Lớp {item.grade}</span>}
                <span>{item.fileSize}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Tải xuống (demo)")}><Download className="h-4 w-4" /></Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ParentLibrary;
