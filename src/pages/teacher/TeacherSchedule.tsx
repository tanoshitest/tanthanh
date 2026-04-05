import WeeklyCalendar from "@/components/shared/WeeklyCalendar";
import { useAuthStore } from "@/lib/store";

const TeacherSchedule = () => {
  const { userName } = useAuthStore();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Lịch dạy</h1>
      <WeeklyCalendar editable={false} filterTeacher={userName} />
    </div>
  );
};

export default TeacherSchedule;
