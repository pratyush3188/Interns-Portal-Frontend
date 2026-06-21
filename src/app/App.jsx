import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Suspense, lazy } from "react";

// Layout shells
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AuthLayout } from "../layouts/AuthLayout";

// Eager load Login for fast boot
import Login from "../features/auth/Login";

// Lazy load the 12 intern feature modules
const Dashboard = lazy(() => import("../features/dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const MyInternship = lazy(() => import("../features/internship/MyInternship").then(m => ({ default: m.MyInternship })));
const Tasks = lazy(() => import("../features/tasks/Tasks").then(m => ({ default: m.Tasks })));
const Calendar = lazy(() => import("../features/calendar/Calendar").then(m => ({ default: m.Calendar })));
const Events = lazy(() => import("../features/events/Events").then(m => ({ default: m.Events })));
const Trips = lazy(() => import("../features/trips/Trips").then(m => ({ default: m.Trips })));
const Announcements = lazy(() => import("../features/announcements/Announcements").then(m => ({ default: m.Announcements })));
const Documents = lazy(() => import("../features/documents/Documents").then(m => ({ default: m.Documents })));
const Accommodation = lazy(() => import("../features/accommodation/Accommodation").then(m => ({ default: m.Accommodation })));
const Culture = lazy(() => import("../features/culture/Culture").then(m => ({ default: m.Culture })));
const Emergency = lazy(() => import("../features/emergency/Emergency").then(m => ({ default: m.Emergency })));
const Profile = lazy(() => import("../features/profile/Profile").then(m => ({ default: m.Profile })));

// Lazy load the 7 Faculty modules
const FacultyDashboard = lazy(() => import("../features/dashboard/FacultyDashboard").then(m => ({ default: m.FacultyDashboard })));
const InternDirectory = lazy(() => import("../features/internship/InternDirectory").then(m => ({ default: m.InternDirectory })));
const LogbookReviews = lazy(() => import("../features/internship/LogbookReviews").then(m => ({ default: m.LogbookReviews })));
const FacultyProjects = lazy(() => import("../features/projects/FacultyProjects").then(m => ({ default: m.FacultyProjects })));
const FacultyMeetings = lazy(() => import("../features/calendar/FacultyMeetings").then(m => ({ default: m.FacultyMeetings })));
const FacultyAnalytics = lazy(() => import("../features/analytics/FacultyAnalytics").then(m => ({ default: m.FacultyAnalytics })));
const FacultyAnnouncements = lazy(() => import("../features/announcements/FacultyAnnouncements").then(m => ({ default: m.FacultyAnnouncements })));

// Lazy load the 13 Admin modules
const AdminDashboard = lazy(() => import("../features/dashboard/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminAnalytics = lazy(() => import("../features/analytics/AdminAnalytics").then(m => ({ default: m.AdminAnalytics })));
const UserManagement = lazy(() => import("../features/admin/UserManagement").then(m => ({ default: m.UserManagement })));
const RosterManagement = lazy(() => import("../features/admin/RosterManagement").then(m => ({ default: m.RosterManagement })));
const InternshipLifecycle = lazy(() => import("../features/admin/InternshipLifecycle").then(m => ({ default: m.InternshipLifecycle })));
const AccommodationManagement = lazy(() => import("../features/admin/AccommodationManagement").then(m => ({ default: m.AccommodationManagement })));
const TravelTracking = lazy(() => import("../features/admin/TravelTracking").then(m => ({ default: m.TravelTracking })));
const AdminEvents = lazy(() => import("../features/admin/EventsManagement").then(m => ({ default: m.EventsManagement })));
const DocumentCenter = lazy(() => import("../features/admin/DocumentCenter").then(m => ({ default: m.DocumentCenter })));
const AdminAnnouncementCenter = lazy(() => import("../features/announcements/AdminAnnouncementCenter").then(m => ({ default: m.AdminAnnouncementCenter })));
const EmergencyCenter = lazy(() => import("../features/admin/EmergencyCenter").then(m => ({ default: m.EmergencyCenter })));
const AuditLogs = lazy(() => import("../features/admin/AuditLogs").then(m => ({ default: m.AuditLogs })));
const SystemSettings = lazy(() => import("../features/admin/SystemSettings").then(m => ({ default: m.SystemSettings })));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallbackPath = user?.role === "admin" ? "/admin/dashboard" : user?.role === "faculty" ? "/faculty/dashboard" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

// Full screen fallback page loader
const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#04376C] dark:border-t-[#1E6FD9] animate-spin mb-4"></div>
      <p className="text-xs font-semibold text-text-secondary">
        Loading IAESTE SEP Portal...
      </p>
    </div>
  </div>
);

export const App = () => {
  const { user } = useAuthStore();
  
  // Calculate dynamic default redirect based on active user role
  const getDefaultRedirect = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "faculty") return "/faculty/dashboard";
    return "/dashboard";
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth Route */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dynamic Redirect Root */}
            <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
            
            {/* Intern Routes */}
            <Route element={<ProtectedRoute allowedRoles={["intern"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/internship" element={<MyInternship />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/events" element={<Events />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/culture" element={<Culture />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Faculty Routes */}
            <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/directory" element={<InternDirectory />} />
              <Route path="/faculty/logbook-reviews" element={<LogbookReviews />} />
              <Route path="/faculty/projects" element={<FacultyProjects />} />
              <Route path="/faculty/meetings" element={<FacultyMeetings />} />
              <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
              <Route path="/faculty/announcements" element={<FacultyAnnouncements />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/roster" element={<RosterManagement />} />
              <Route path="/admin/lifecycle" element={<InternshipLifecycle />} />
              <Route path="/admin/accommodation" element={<AccommodationManagement />} />
              <Route path="/admin/travel" element={<TravelTracking />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/documents" element={<DocumentCenter />} />
              <Route path="/admin/announcements" element={<AdminAnnouncementCenter />} />
              <Route path="/admin/emergency" element={<EmergencyCenter />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/settings" element={<SystemSettings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

