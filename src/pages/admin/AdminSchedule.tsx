import WeeklyCalendar from "@/components/shared/WeeklyCalendar";

const AdminSchedule = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Lịch dạy</h1>
    <WeeklyCalendar editable={true} />
  </div>
);

export default AdminSchedule;
