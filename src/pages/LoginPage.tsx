import { useNavigate } from "react-router-dom";
import { Shield, GraduationCap, Users } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const roles: { role: Role; label: string; subtitle: string; icon: typeof Shield; colorClass: string; bgClass: string; borderClass: string }[] = [
  { role: "admin", label: "Admin", subtitle: "Quản lý toàn bộ hệ thống", icon: Shield, colorClass: "role-admin", bgClass: "bg-role-admin-light", borderClass: "border-role-admin" },
  { role: "teacher", label: "Giáo viên", subtitle: "Giảng dạy & chấm điểm", icon: GraduationCap, colorClass: "role-teacher", bgClass: "bg-role-teacher-light", borderClass: "border-role-teacher" },
  { role: "parent", label: "Phụ huynh & Học sinh", subtitle: "Theo dõi kết quả học tập", icon: Users, colorClass: "role-parent", bgClass: "bg-role-parent-light", borderClass: "border-role-parent" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);

  const handleLogin = (role: Role) => {
    setRole(role);
    const paths: Record<Role, string> = { admin: "/admin", teacher: "/teacher/classes", parent: "/parent" };
    navigate(paths[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">Trung tâm Giáo dục</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-admin via-teacher to-parent bg-clip-text text-transparent mb-3">
          ABC
        </h1>
        <p className="text-muted-foreground mb-10 text-lg">Chọn vai trò để đăng nhập</p>

        <div className="grid gap-5 sm:grid-cols-3">
          {roles.map(({ role, label, subtitle, icon: Icon, colorClass, bgClass, borderClass }) => (
            <button
              key={role}
              onClick={() => handleLogin(role)}
              className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 ${borderClass} ${bgClass} p-8 transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring`}
            >
              <div className={`rounded-xl p-4 bg-card shadow-sm ${colorClass}`}>
                <Icon className="h-10 w-10" />
              </div>
              <div>
                <div className={`text-lg font-bold ${colorClass}`}>{label}</div>
                <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
