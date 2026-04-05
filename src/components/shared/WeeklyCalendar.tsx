import { useState } from "react";
import { calendarEvents } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import { toast } from "sonner";

const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7-22

interface Props {
  editable?: boolean;
  filterTeacher?: string;
}

const WeeklyCalendar = ({ editable = false, filterTeacher }: Props) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const events = filterTeacher
    ? calendarEvents.filter((e) => e.teacherName === filterTeacher)
    : calendarEvents;

  const getEventsForSlot = (dayOfWeek: number, hour: number) => {
    return events.filter((e) => {
      const startHour = parseInt(e.startTime.split(":")[0]);
      return e.dayOfWeek === dayOfWeek && startHour === hour;
    });
  };

  const getEventDuration = (e: typeof calendarEvents[0]) => {
    const start = parseInt(e.startTime.split(":")[0]);
    const end = parseInt(e.endTime.split(":")[0]);
    return end - start;
  };

  const uniqueTeachers = [...new Set(events.map((e) => e.teacherName))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">Tuần {weekOffset === 0 ? "hiện tại" : weekOffset > 0 ? `+${weekOffset}` : weekOffset}</span>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>Hôm nay</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {uniqueTeachers.map((t) => {
            const color = events.find((e) => e.teacherName === t)?.color;
            return (
              <Badge key={t} variant="outline" className="text-xs" style={{ borderColor: color, color }}>
                {t}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="overflow-auto border rounded-xl">
        <div className="grid grid-cols-8 min-w-[800px]">
          <div className="border-b border-r p-2 text-xs font-medium text-muted-foreground">Giờ</div>
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <div key={d} className="border-b p-2 text-xs font-medium text-center">{dayNames[d]}</div>
          ))}

          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-r p-2 text-xs text-muted-foreground h-16 flex items-start">{hour}:00</div>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const slotEvents = getEventsForSlot(d, hour);
                return (
                  <div
                    key={d}
                    className={`border-b border-r p-0.5 h-16 relative ${editable ? "cursor-pointer hover:bg-accent/30" : ""}`}
                    onClick={editable && slotEvents.length === 0 ? () => toast.info("Thêm event mới (demo)") : undefined}
                  >
                    {slotEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="rounded px-1.5 py-0.5 text-xs leading-tight cursor-pointer"
                        style={{ backgroundColor: ev.color + "22", color: ev.color, borderLeft: `3px solid ${ev.color}` }}
                        onClick={(e) => { e.stopPropagation(); editable ? toast.info(`Sửa/Xóa: ${ev.className}`) : undefined; }}
                      >
                        <div className="font-medium truncate flex items-center gap-0.5">
                          {ev.type === "online" && <Wifi className="h-2.5 w-2.5" />}
                          {ev.className}
                        </div>
                        <div className="truncate opacity-70">{ev.teacherName}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
