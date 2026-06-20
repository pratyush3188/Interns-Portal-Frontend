import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { internProfile, tasks, trips, events, announcements } from "../../mocks/index";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  Map,
  Megaphone,
  User,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  // Tasks statistics
  const pendingTasks = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress" || t.status === "review").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  // Calculation for progress
  const start = new Date(internProfile.startDate);
  const end = new Date(internProfile.endDate);
  const today = new Date();
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.min(totalDays, Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24))));
  const progressPercent = Math.round((elapsedDays / totalDays) * 100);



  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
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
      className="space-y-6 text-foreground"
    >
      {/* Welcome & Info */}
      <motion.div
        variants={itemVariants}
        className="glass-panel hover-lift rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-card relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-gradient-to-l from-[#04376C]/10 to-transparent pointer-events-none"></div>
        <div className="z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] bg-[#04376C]/10 dark:bg-[#1E6FD9]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              IAESTE SEP Intern
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-sm text-text-secondary max-w-xl">
            You are currently representing <span className="font-bold text-text-primary">{internProfile.country}</span> from <span className="font-bold text-text-primary">{internProfile.university}</span> at JECRC University, Jaipur.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-text-secondary pt-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{internProfile.duration} Internship</span>
            </div>
            <div className="w-1 bg-border h-4 hidden sm:block"></div>
            <div className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>Supervisor: {internProfile.supervisor}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Progress Card */}
        <div className="mt-6 md:mt-0 flex items-center space-x-4 shrink-0 bg-slate-50 dark:bg-slate-900/40 border border-border p-4 rounded-xl z-10">
          {/* Circular Progress (pure SVG) */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#04376C] dark:text-[#1E6FD9]"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-text-primary">
              {progressPercent}%
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary">Internship Progress</h4>
            <p className="text-[10px] text-text-secondary mt-0.5">
              Day {elapsedDays} of {totalDays}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tasks & Action */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Widget */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-3 gap-3">
              <Link
                to="/tasks"
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-center space-y-2 group"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:underline">View Tasks</span>
              </Link>
              <Link
                to="/calendar"
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-center space-y-2 group"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:underline">Open Calendar</span>
              </Link>
              <Link
                to="/trips"
                className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-center space-y-2 group"
              >
                <div className="p-2.5 rounded-lg bg-green-500/10 text-green-500">
                  <Map className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:underline">Register Trips</span>
              </Link>
            </div>
          </motion.div>

          {/* Task Metrics & Upcoming Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Task Summary Widget */}
            <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Task Status Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border">
                    <span className="text-xs text-text-secondary flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                      <span>To Do (Pending)</span>
                    </span>
                    <span className="text-xs font-bold text-text-primary">{pendingTasks}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border">
                    <span className="text-xs text-text-secondary flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E6FD9]"></span>
                      <span>Active (In Progress & Review)</span>
                    </span>
                    <span className="text-xs font-bold text-text-primary">{inProgressTasks}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border">
                    <span className="text-xs text-text-secondary flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      <span>Completed Tasks</span>
                    </span>
                    <span className="text-xs font-bold text-text-primary">{completedTasks}</span>
                  </div>
                </div>
              </div>
              <Link to="/tasks" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center justify-end pt-4 space-x-1 shrink-0">
                <span>Go to Taskboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Upcoming Deadlines Widget */}
            <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Upcoming Deadlines</h3>
                <div className="space-y-2">
                  {tasks
                    .filter((t) => t.status !== "completed")
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-start justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
                        <div className="max-w-[70%]">
                          <h4 className="text-xs font-bold text-text-primary truncate">{task.title}</h4>
                          <span className={`text-[10px] font-semibold uppercase ${
                            task.priority === "high" ? "text-red-500" : "text-amber-500"
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-md border border-red-200/50">
                          {task.deadline}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <Link to="/calendar" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center justify-end pt-4 space-x-1 shrink-0">
                <span>View Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

          </div>

          {/* Featured Trip Widget */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card flex flex-col md:flex-row hover-lift">
            <div className="md:w-1/3 relative h-48 md:h-auto">
              <img
                src={trips[0].image}
                alt={trips[0].destination}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-[#04376C] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                Featured Trip
              </span>
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-lg font-extrabold text-text-primary">{trips[0].destination}</h4>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {trips[0].description}
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-text-secondary font-semibold">
                  <span>Duration: {trips[0].duration}</span>
                  <span className="w-1 h-1 bg-border rounded-full"></span>
                  <span className="text-[#04376C] dark:text-[#1E6FD9]">{trips[0].cost}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs font-bold text-red-500">Only {trips[0].seatsAvailable} seats remaining!</span>
                <Link to={`/trips`} className="inline-flex items-center bg-[#04376C] dark:bg-[#1E6FD9] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Events & Announcements */}
        <div className="space-y-6">
          
          {/* Announcements Feed */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[380px]">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center space-x-2 shrink-0">
              <Megaphone className="w-4 h-4 text-[#04376C] dark:text-[#1E6FD9]" />
              <span>Announcements Feed</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {announcements.map((announce) => (
                <div
                  key={announce.id}
                  className={`p-3 rounded-xl border border-border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    announce.pinned ? "bg-amber-500/5 border-amber-500/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      announce.category === "Urgent"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {announce.category}
                    </span>
                    <span className="text-[9px] text-text-secondary">{announce.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary mt-1.5 truncate">{announce.title}</h4>
                  <p className="text-[10px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                    {announce.message}
                  </p>
                </div>
              ))}
            </div>

            <Link to="/announcements" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center justify-center pt-4 space-x-1 shrink-0 border-t border-border mt-3">
              <span>See All Announcements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Social Events Feed */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[340px]">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center space-x-2 shrink-0">
              <Compass className="w-4 h-4 text-blue-500" />
              <span>Upcoming Events</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {events.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">{event.title}</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">{event.date} • {event.time}</p>
                    <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/events" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center justify-center pt-4 space-x-1 shrink-0 border-t border-border mt-3">
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};
