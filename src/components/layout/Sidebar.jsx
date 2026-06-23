import { NavLink } from "react-router-dom";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../utils/cn";
import logoStandard from "../../assets/Iaeste Logo Standard.png";
import logoVertical from "../../assets/logo-removebg-preview 1.png";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Calendar,
  Sparkles,
  Map,
  Megaphone,
  FileText,
  Home,
  Globe,
  AlertOctagon,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  BookOpen,
  FolderKanban,
  Video,
  BarChart3,
  UserCheck,
  Milestone,
  Plane,
  Shield,
  Activity,
  Settings,
  FolderOpen
} from "lucide-react";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const getLinks = () => {
    const role = user?.role || "intern";

    if (role === "admin") {
      return [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { name: "Users", path: "/admin/users", icon: UserCheck },
        { name: "Interns Management", path: "/admin/roster", icon: Users },
        { name: "Internship Lifecycle", path: "/admin/lifecycle", icon: Milestone },
        { name: "Accommodation", path: "/admin/accommodation", icon: Home },
        { name: "Travel Tracking", path: "/admin/travel", icon: Plane },
        { name: "Trips & Excursions", path: "/admin/trips", icon: Map },
        { name: "Events", path: "/admin/events", icon: Sparkles },
        { name: "Documents", path: "/admin/documents", icon: FolderOpen },
        { name: "Announcements", path: "/admin/announcements", icon: Megaphone },
        { name: "Emergency Center", path: "/admin/emergency", icon: AlertOctagon },
        { name: "Audit Logs", path: "/admin/audit-logs", icon: FileText },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ];
    }

    if (role === "faculty") {
      return [
        { name: "Dashboard", path: "/faculty/dashboard", icon: LayoutDashboard },
        { name: "Intern Directory", path: "/faculty/directory", icon: Users },
        { name: "Logbook Reviews", path: "/faculty/logbook-reviews", icon: BookOpen },
        { name: "Projects", path: "/faculty/projects", icon: FolderKanban },
        { name: "Meetings", path: "/faculty/meetings", icon: Video },
        { name: "Analytics", path: "/faculty/analytics", icon: BarChart3 },
        { name: "Announcements", path: "/faculty/announcements", icon: Megaphone },
      ];
    }

    // Default: intern links
    return [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "My Internship", path: "/internship", icon: Briefcase },
      { name: "Tasks", path: "/tasks", icon: CheckSquare },
      { name: "Calendar", path: "/calendar", icon: Calendar },
      { name: "Meetings", path: "/meetings", icon: Video },
      { name: "Events", path: "/events", icon: Sparkles },
      { name: "Trips", path: "/trips", icon: Map },
      { name: "Announcements", path: "/announcements", icon: Megaphone },
      { name: "Documents", path: "/documents", icon: FileText },
      { name: "Accommodation", path: "/accommodation", icon: Home },
      { name: "Cultural Guide", path: "/culture", icon: Globe },
      { name: "Emergency Support", path: "/emergency", icon: AlertOctagon },
      { name: "Profile", path: "/profile", icon: User },
    ];
  };

  const links = getLinks();

  return (
    <div
      className={cn(
        "relative h-full flex flex-col bg-card text-foreground border-r border-border transition-all duration-300",
        isOpen ? "w-[280px]" : "w-[80px]",
      )}
    >
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Branding Section */}
        <div className={cn(
          "flex items-center justify-center shrink-0 py-6 border-b border-border bg-[#F8FAFC]/50",
          isOpen ? "px-6" : "px-2"
        )}>
          {isOpen ? (
            <div className="flex flex-col items-center justify-center w-full">
              <img
                src={logoStandard}
                alt="IAESTE Logo"
                className="w-32 object-contain"
              />
              <p className="text-[10px] text-text-secondary mt-1.5 font-bold uppercase tracking-wider">
                JECRC UNIVERSITY
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={logoVertical}
                alt="Logo Icon"
                className="w-12 h-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Main Menu Label */}
        <div className="px-6 py-4 text-[10px] font-bold text-text-secondary tracking-widest uppercase">
          {isOpen ? `${user?.role?.toUpperCase()} MENU` : "···"}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group relative font-medium text-sm",
                  isActive
                    ? "bg-[#0b3d59] text-white shadow-sm"
                    : "text-text-secondary hover:bg-slate-100 hover:text-[#0b3d59]",
                )
              }
              title={!isOpen ? link.name : undefined}
            >
              <link.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isOpen ? "mr-3" : "mx-auto",
                )}
              />
              {isOpen && <span className="truncate">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer",
            )}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut
              className={cn("w-4 h-4 shrink-0", isOpen ? "mr-3" : "mx-auto")}
            />
            {isOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>

      {/* Sidebar Collapse Toggle for Desktop */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 bg-card border border-border rounded-full p-1 text-gray-400 hover:text-text-primary shadow-sm z-10 md:flex hidden cursor-pointer"
      >
        {isOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

