import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/layouts/AdminLayout";
import TeacherLayout from "./components/layouts/TeacherLayout";
import ParentLayout from "./components/layouts/ParentLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminClassDetail from "./pages/admin/AdminClassDetail";
import AdminReports from "./pages/admin/AdminReports";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminLibrary from "./pages/admin/AdminLibrary";
import AdminSettings from "./pages/admin/AdminSettings";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherClassDetail from "./pages/teacher/TeacherClassDetail";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherSchedule from "./pages/teacher/TeacherSchedule";
import TeacherCommunity from "./pages/teacher/TeacherCommunity";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentReport from "./pages/parent/ParentReport";
import ParentClasses from "./pages/parent/ParentClasses";
import ParentClassDetail from "./pages/parent/ParentClassDetail";
import ParentLibrary from "./pages/parent/ParentLibrary";
import ParentCommunity from "./pages/parent/ParentCommunity";
import LessonDetailPage from "./components/shared/LessonDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:type/:id" element={<AdminUserDetail />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="classes/:id" element={<AdminClassDetail />} />
            <Route path="classes/:id/lesson/:lid" element={<LessonDetailPage />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="community" element={<AdminCommunity />} />
            <Route path="library" element={<AdminLibrary />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<Navigate to="/teacher/classes" replace />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="classes/:id" element={<TeacherClassDetail />} />
            <Route path="classes/:id/lesson/:lid" element={<LessonDetailPage />} />
            <Route path="my-attendance" element={<TeacherAttendance />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="community" element={<TeacherCommunity />} />
          </Route>

          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<Navigate to="/parent/report" replace />} />
            <Route path="report" element={<ParentReport />} />
            <Route path="classes" element={<ParentClasses />} />
            <Route path="classes/:id" element={<ParentClassDetail />} />
            <Route path="classes/:id/lesson/:lid" element={<LessonDetailPage />} />
            <Route path="library" element={<ParentLibrary />} />
            <Route path="community" element={<ParentCommunity />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
