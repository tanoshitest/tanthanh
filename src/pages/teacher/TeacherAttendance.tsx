import { useState, useEffect } from "react";
import { teacherPayroll, teacherAttendanceLogs } from "@/lib/mock-data";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, MapPin, AlertCircle, CheckCircle2, Download, 
  ChevronLeft, ChevronRight, Fingerprint, LogOut, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const TeacherAttendance = () => {
  const { userName } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Tháng 3 / 2025");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatSeconds = (date: Date) => {
    return date.getSeconds().toString().padStart(2, '0');
  };

  const formatDate = (date: Date) => {
    const days = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];
    return `${days[date.getDay()]}, ${date.getDate()} THÁNG ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  const payroll = teacherPayroll.find((p) => p.teacherName === userName);

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Chấm công Điện tử</h1>
        <p className="text-muted-foreground text-sm font-medium">Ghi nhận giờ làm việc tự động với hệ thống nhận diện vị trí GPS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Clock & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-muted/20 shadow-xl overflow-hidden bg-gradient-to-br from-white to-slate-50/50 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Clock className="w-32 h-32" />
            </div>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {formatDate(currentTime)}
              </p>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-7xl font-black tracking-tighter text-slate-800 drop-shadow-sm">
                  {formatTime(currentTime)}
                </span>
                <span className="text-3xl font-black text-slate-400">
                  {formatSeconds(currentTime)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-10 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">
                  Vị trí: MENGLISH BA ĐÌNH
                </span>
              </div>

              <div className="w-full space-y-4">
                <Button 
                  onClick={() => setIsCheckedIn(true)}
                  disabled={isCheckedIn}
                  className={cn(
                    "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95",
                    isCheckedIn ? "bg-muted text-muted-foreground" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                  )}
                >
                  <Fingerprint className="w-5 h-5 mr-3" />
                  Check In ca dạy
                </Button>

                <Button 
                  onClick={() => setIsCheckedIn(false)}
                  disabled={!isCheckedIn}
                  variant="outline"
                  className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-muted/20 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 disabled:opacity-30"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Check Out ra về
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
              Bạn phải cấp quyền truy cập vị trí (Location) trong trình duyệt để tính năng Chấm công hoạt động hợp lệ.
            </p>
          </div>
        </div>

        {/* Right Column: Reports & History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Báo cáo tháng:</h3>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mã nhân sự: TCH001</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-muted/20 shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-xs font-black uppercase tracking-widest px-4">{selectedMonth}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-[1.5rem] border-muted/10 shadow-sm overflow-hidden bg-white group hover:border-blue-200 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tổng giờ làm</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{payroll?.hours || 0}h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border-muted/10 shadow-sm overflow-hidden bg-white group hover:border-orange-200 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Số phút đi muộn</p>
                  <p className="text-2xl font-black text-orange-600 tracking-tight">20m</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.5rem] border-muted/10 shadow-sm overflow-hidden bg-white group hover:border-emerald-200 transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Số buổi đúng giờ</p>
                  <p className="text-2xl font-black text-emerald-600 tracking-tight">{payroll?.sessions || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Log */}
          <div className="bg-white rounded-[2.5rem] border border-muted/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-muted/10 flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-700">Chi tiết từng ngày</h4>
              </div>
              <Button variant="outline" className="h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 border-none px-6 font-black text-[10px] uppercase tracking-widest shadow-md shadow-blue-100">
                <Download className="w-3.5 h-3.5 mr-2" /> Xuất Excel
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-muted/10 bg-muted/5">
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Ngày</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Giờ vào</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Giờ ra</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Số giờ</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Vị trí</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Trạng thái</th>
                    <th className="py-4 px-6 text-left text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherAttendanceLogs.length > 0 ? (
                    teacherAttendanceLogs.map((log, i) => (
                      <tr key={i} className="border-b border-muted/5 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="text-[11px] font-bold text-slate-700">{log.date}</span>
                        </td>
                        <td className="py-4 px-6 text-[11px] font-black text-slate-600">{log.checkIn}</td>
                        <td className="py-4 px-6 text-[11px] font-black text-slate-600">{log.checkOut}</td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="bg-slate-100 font-black text-[10px] h-6 px-2">{log.totalHours}h</Badge>
                        </td>
                        <td className="py-4 px-6 text-[10px] font-bold text-muted-foreground">{log.location}</td>
                        <td className="py-4 px-6">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase tracking-tighter h-5 px-2",
                            log.status === "on-time" ? "bg-emerald-500" : "bg-orange-500"
                          )}>
                            {log.status === "on-time" ? "Đúng giờ" : "Đi muộn"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-[10px] italic text-muted-foreground font-medium">{log.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <AlertCircle className="w-10 h-10" />
                          <p className="text-sm font-black uppercase tracking-widest">Không có dữ liệu chấm công</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Payroll Button Link */}
          <Card className="rounded-[1.5rem] border-blue-100 bg-blue-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-dashed">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800">Phiếu lương & Bảng lương</h4>
                <p className="text-xs text-muted-foreground font-medium">Báo cáo thu nhập chi tiết tháng 03/2025</p>
              </div>
            </div>
            <Button className="rounded-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white px-8 h-12 font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-sm">
              Xem báo cáo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;

