import React from "react";
import { calendarEvents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Wifi, User, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  teacherFilter: string;
  classFilter: string;
}

const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const dayIndices = [1, 2, 3, 4, 5, 6, 0];

const sessions = [
  { 
    label: "Sáng", 
    periods: [
      { id: 1, name: "Tiết 1", time: "08:00 - 10:00" },
      { id: 2, name: "Tiết 2", time: "10:00 - 12:00" }
    ],
    color: "bg-blue-500/5 text-blue-700 border-blue-200"
  },
  { 
    label: "Chiều", 
    periods: [
      { id: 3, name: "Tiết 3", time: "14:00 - 16:00" },
      { id: 4, name: "Tiết 4", time: "16:00 - 18:00" }
    ],
    color: "bg-orange-500/5 text-orange-700 border-orange-200"
  },
  { 
    label: "Tối", 
    periods: [
      { id: 5, name: "Tiết 5", time: "18:00 - 20:00" },
      { id: 6, name: "Tiết 6", time: "20:00 - 22:00" }
    ],
    color: "bg-indigo-500/5 text-indigo-700 border-indigo-200"
  }
];

const TeachingScheduleTable = ({ teacherFilter, classFilter }: Props) => {
  const filteredEvents = calendarEvents.filter(e => {
    const matchTeacher = teacherFilter === "all" || e.teacherName === teacherFilter;
    const matchClass = classFilter === "all" || e.className === classFilter;
    return matchTeacher && matchClass;
  });

  const getEventForSlot = (dayIdx: number, startTime: string) => {
    return filteredEvents.find(e => e.dayOfWeek === dayIdx && e.startTime === startTime);
  };

  return (
    <div className="w-full overflow-hidden bg-white rounded-[2.5rem] border border-muted/20 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-muted/5 border-b border-muted/10">
              <th className="w-28 py-3 px-4 text-left font-black text-[9px] uppercase text-muted-foreground tracking-widest border-r border-muted/10">Buổi / Tiết</th>
              {dayNames.map((day, idx) => (
                <th key={idx} className="py-3 px-2 text-center font-black text-[10px] uppercase text-slate-700 tracking-widest border-r border-muted/10 last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, sIdx) => (
              <React.Fragment key={sIdx}>
                {/* Session Header Row */}
                <tr className={cn("border-b border-muted/10", session.color)}>
                  <td colSpan={8} className="py-1.5 px-4 font-black text-[10px] uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm sticky left-0 z-10 flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", session.label === "Sáng" ? "bg-blue-500" : session.label === "Chiều" ? "bg-orange-500" : "bg-indigo-500")} />
                    Buổi {session.label}
                  </td>
                </tr>
                
                {session.periods.map((period, pIdx) => (
                  <tr key={pIdx} className="border-b border-muted/10 last:border-b-0 group hover:bg-slate-50/30 transition-colors">
                    <td className="py-2 px-4 border-r border-muted/10 bg-muted/5 sticky left-0 z-10">
                      <div className="space-y-0.5">
                        <div className="font-black text-[10px] text-slate-800 uppercase tracking-tight">{period.name}</div>
                        <div className="text-[9px] text-muted-foreground font-bold opacity-60">
                          {period.time.split(' - ')[0]}
                        </div>
                      </div>
                    </td>
                    
                    {dayIndices.map((dayIdx) => {
                      const event = getEventForSlot(dayIdx, period.time.split(' - ')[0]);
                      
                      return (
                        <td key={dayIdx} className="p-1 border-r border-muted/10 last:border-r-0 align-middle h-12">
                          {event ? (
                            <div 
                              className="h-full rounded-xl px-3 py-0 flex items-center justify-center border-l-4 shadow-sm transition-all hover:scale-[1.02] cursor-pointer group/card"
                              style={{ 
                                backgroundColor: event.color + "15", 
                                borderColor: event.color,
                                color: event.color
                              }}
                            >
                              <div className="font-black text-[11px] leading-tight tracking-tight uppercase truncate text-center w-full">
                                {event.className}
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-xl border border-dashed border-muted/10 flex items-center justify-center group/empty transition-colors hover:border-muted/20">
                              <span className="text-[8px] font-bold text-muted-foreground/10 uppercase tracking-widest opacity-0 group-hover/empty:opacity-100 transition-opacity">Trống</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TeachingScheduleTable;
