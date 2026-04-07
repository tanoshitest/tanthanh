import { useState } from "react";
import TeachingScheduleTable from "@/components/admin/TeachingScheduleTable";
import { useAuthStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { classes } from "@/lib/mock-data";
import { Calendar as CalendarIcon, Filter, Bookmark } from "lucide-react";

const TeacherSchedule = () => {
  const { userName } = useAuthStore();
  const [classFilter, setClassFilter] = useState("all");

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2 text-teacher">
            <div className="p-2.5 rounded-[1.2rem] bg-teacher/10 border border-teacher/20">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Lịch dạy của tôi</h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Lịch giảng dạy chi tiết theo tiết học (Tiết 1 - 6)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-muted/20">
          <div className="flex items-center gap-2 px-4 border-r border-muted/20 text-teacher">
            <Filter className="h-4 w-4" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Bộ lọc</span>
          </div>

          <div className="space-y-1.5 min-w-[220px]">
            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1 flex items-center gap-1.5">
              <Bookmark className="h-3 w-3" /> Lớp chi tiết
            </Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-10 rounded-2xl border-muted/20 bg-muted/5 font-bold text-xs ring-offset-0 focus:ring-1 focus:ring-teacher transition-all">
                <SelectValue placeholder="Tất cả các lớp" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-muted/20 shadow-xl overflow-hidden">
                <SelectItem value="all" className="font-bold text-xs">Tất cả các lớp</SelectItem>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.name} className="font-bold text-xs">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-teacher/5 to-blue-500/5 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          {/* Automatically filter for current teacher, and allow class filtering */}
          <TeachingScheduleTable teacherFilter={userName} classFilter={classFilter} />
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;

