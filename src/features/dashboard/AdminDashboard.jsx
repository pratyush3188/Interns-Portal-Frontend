import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { 
  Users, 
  Activity, 
  UserCheck, 
  Globe, 
  FolderKanban, 
  Clock, 
  Sparkles,
  Bell,
  ArrowRight,
  TrendingUp,
  History
} from "lucide-react";
import { auditLogs, events, logbookReviews } from "../../mocks/index";

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [interns, setInterns] = React.useState([]);
  const [facultyCount, setFacultyCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (res.ok) {
          setInterns(data.interns.map(i => ({ ...i, id: i._id })));
          setFacultyCount(data.faculties.length);
        }
      } catch (err) {
        console.error("Failed to load dashboard data");
      }
    };
    fetchUsers();
  }, []);

  // Metrics calculating from DB collections
  const totalStudents = interns.length;
  const activeStudents = interns.filter(i => i.status !== "Completed" && i.status !== "Alumni").length;
  const countriesCount = new Set(interns.map(i => i.country)).size;
  const pendingReviewsCount = logbookReviews.filter(r => r.status === "Pending").length;

  const stats = [
    { label: "Total Interns", value: totalStudents.toString(), icon: Users, trend: "Registrations", trendUp: true },
    { label: "Active Exchange", value: activeStudents.toString(), icon: Activity, trend: "Currently in lab", trendUp: true },
    { label: "Faculty Supervisors", value: facultyCount.toString(), icon: UserCheck, trend: "Approved staff", trendUp: true },
    { label: "Countries Represented", value: countriesCount.toString(), icon: Globe, trend: "Global program", trendUp: true },
    { label: "Ongoing Projects", value: activeStudents.toString(), icon: FolderKanban, trend: "Trackers active", trendUp: true },
    { label: "Pending Approvals", value: pendingReviewsCount.toString(), icon: Clock, trend: "Awaiting review", trendUp: false }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-foreground pb-10"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10 space-y-2">
          <span className="bg-white/10 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider font-extrabold text-white">
            Admin Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Central Exchange Workspace 👑
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm font-medium max-w-xl">
            Logged in as {user?.name}. You have full operational overview of hostel allocations, arrival pickups, and academic milestones.
          </p>
        </div>

        {/* abstract spheres */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-24 -right-10 w-96 h-96 bg-white opacity-[0.03] rounded-full"></div>
          <div className="absolute top-10 right-20 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-2xl"></div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Admin Actions */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-4">Central Controls</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button onClick={() => navigate("/admin/users")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] text-text-primary">User Accounts</span>
              </Button>
              <Button onClick={() => navigate("/admin/roster")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-text-primary">Master Roster</span>
              </Button>
              <Button onClick={() => navigate("/admin/lifecycle")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] text-text-primary">Lifecycle Stage</span>
              </Button>
              <Button onClick={() => navigate("/admin/accommodation")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] text-text-primary">Hostel Allocation</span>
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={async () => {
                try {
                  const res = await fetch("http://localhost:5000/api/admin/seed", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                  });
                  if (res.ok) alert("Data seeded to MongoDB successfully!");
                  else alert("Failed to seed data. Make sure an Intern and Admin exist.");
                } catch(e) { alert("Error seeding"); }
              }} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
                Force Seed Dummy Data
              </Button>
            </div>
          </motion.div>

          {/* Roster Snap Grid */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Recent Registrations</h3>
              <Link to="/admin/roster" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center space-x-1">
                <span>Roster Manager</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border font-bold text-text-secondary uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Country</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {interns.slice(0, 4).map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-text-primary">{stud.name}</td>
                      <td className="py-3 text-text-secondary font-semibold">{stud.country}</td>
                      <td className="py-3 font-bold text-blue-600">{stud.department}</td>
                      <td className="py-3">
                        <Badge variant={stud.status.includes("Started") ? "info" : "warning"}>{stud.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {interns.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-text-secondary italic">No interns registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          
          {/* Global Activity Feed */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[340px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Operational Activity Feed</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-border rounded-xl space-y-1 hover:bg-slate-100/50 transition-colors text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-text-primary">{log.user}</span>
                    <span className="text-[9px] text-text-secondary">{log.timestamp.split(" ")[1]}</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed font-semibold">
                    {log.action}
                  </p>
                  <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-gray-500 font-extrabold block w-fit">
                    {log.module}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Social Gatherings */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Excursions & Events</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide text-xs">
              {events.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-text-primary truncate">{event.title}</h4>
                    <p className="text-[10px] text-text-secondary font-semibold">{event.date} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};
