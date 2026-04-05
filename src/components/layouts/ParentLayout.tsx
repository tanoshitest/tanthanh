import { Outlet, useNavigate } from "react-router-dom";
import { Users, LayoutDashboard, BarChart3, BookOpen, DollarSign, FileText, Library, MessageSquare, LogOut } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parentStudentAccounts } from "@/lib/mock-data";

const items = [
  { title: "Tổng quan", url: "/parent", icon: LayoutDashboard, end: true },
  { title: "Báo cáo học tập", url: "/parent/report", icon: BarChart3 },
  { title: "Lớp học của tôi", url: "/parent/classes", icon: BookOpen },
  { title: "Học phí", url: "/parent/tuition", icon: DollarSign },
  { title: "Thư viện kiến thức", url: "/parent/library", icon: Library },
  { title: "Cộng đồng", url: "/parent/community", icon: MessageSquare },
];

function ParentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="flex items-center gap-2 px-3 py-4">
              <Users className="h-5 w-5 role-parent" />
              <span className="font-bold text-base">Phụ huynh</span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.end} className="hover:bg-accent/50" activeClassName="bg-parent-light role-parent font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const ParentLayout = () => {
  const navigate = useNavigate();
  const { userName, logout, selectedChildId, setSelectedChildId } = useAuthStore();
  const handleLogout = () => { logout(); navigate("/"); };
  const parent = parentStudentAccounts.find((p) => p.name === userName) ?? parentStudentAccounts[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ParentSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-semibold text-sm hidden sm:block">Trung tâm Giáo dục ABC</span>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Chọn con" />
                </SelectTrigger>
                <SelectContent>
                  {parent.children.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} - Lớp {c.grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-parent text-parent-foreground text-xs">{userName[0]}</AvatarFallback>
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

export default ParentLayout;
