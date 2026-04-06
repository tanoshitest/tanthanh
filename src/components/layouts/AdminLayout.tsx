import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Users, BookOpen, FileText, ClipboardList, DollarSign, Clock, Calendar, MessageSquare, Library, Settings, LogOut, BarChart3 } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Quản lý User", url: "/admin/users", icon: Users },
  { title: "Quản lý lớp học", url: "/admin/classes", icon: BookOpen },
  { title: "Báo cáo", url: "/admin/reports", icon: BarChart3 },
  { title: "Lịch dạy", url: "/admin/schedule", icon: Calendar },
  { title: "Cộng đồng", url: "/admin/community", icon: MessageSquare },
  { title: "Thư viện tài liệu", url: "/admin/library", icon: Library },
  { title: "Cài đặt", url: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="flex items-center gap-2 px-3 py-4">
              <Shield className="h-5 w-5 role-admin" />
              <span className="font-bold text-base">Admin Panel</span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-accent/50"
                      activeClassName="bg-admin-light role-admin font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

const AdminLayout = () => {
  const navigate = useNavigate();
  const { userName, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold text-sm hidden sm:block">Trung tâm Giáo dục ABC</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-admin text-admin-foreground text-xs">{userName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{userName}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
