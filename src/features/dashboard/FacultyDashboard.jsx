import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { GlassCard } from "../../components/ui/GlassCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  BookOpen,
  Video,
  Clock,
  FileSpreadsheet,
  CheckSquare,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { internDirectory, logbookReviews, meetings } from "../../mocks/index";

export const FacultyDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Faculty Metrics
  const stats = [
    { label: "Assigned Interns", value: "3", icon: Users, trend: "Supervising", trendUp: true },
    { label: "Active Interns", value: "3", icon: Activity, trend: "In lab", trendUp: true },
    { label: "Pending Reviews", value: "2", icon: BookOpen, trend: "Logbooks", trendUp: false },
    { label: "Upcoming Meetings", value: "2", icon: Video, trend: "Syncs planned", trendUp: true },
    { label: "Project Completion Avg", value: "69%", icon: TrendingUp, trend: "On track", trendUp: true }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const recentActivities = [
    { id: 1, name: "Sophia Müller", action: "Submitted Week 2 Logbook", time: "2 hours ago", type: "logbook" },
    { id: 2, name: "Elena Rostova", action: "Completed task 'Prepare baseline annotations'", time: "1 day ago", type: "task" },
    { id: 3, name: "Markus Fischer", action: "Updated progress on 'Docker orchestration config' to 80%", time: "2 days ago", type: "project" }
  ];

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
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm font-medium max-w-xl">
            {user?.designation} at {user?.department || "Computer Science Department"}. You have 2 logbooks requiring grading decisions today.
          </p>
        </div>

        {/* Decorator rings */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-24 -right-10 w-96 h-96 bg-white opacity-[0.03] rounded-full"></div>
          <div className="absolute top-10 right-20 w-48 h-48 bg-blue-500 opacity-20 rounded-full blur-2xl"></div>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Columns (Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions Shortcuts */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Button onClick={() => navigate("/faculty/logbook-reviews")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-text-primary text-center">Review Logs</span>
              </Button>
              <Button onClick={() => navigate("/faculty/meetings")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <Video className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] text-text-primary text-center">Schedule Sync</span>
              </Button>
              <Button onClick={() => navigate("/faculty/announcements")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] text-text-primary text-center">Send Bulletins</span>
              </Button>
              <Button onClick={() => navigate("/faculty/projects")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs">
                <CheckSquare className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] text-text-primary text-center">Milestones</span>
              </Button>
              <Button onClick={() => navigate("/faculty/analytics")} variant="secondary" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border rounded-xl hover:bg-slate-100 transition-colors h-auto space-y-2 font-bold text-xs col-span-2 sm:col-span-1">
                <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] text-text-primary text-center">View Analytics</span>
              </Button>
            </div>
          </motion.div>

          {/* Interns Progress Overview */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Supervised Interns Progress</h3>
              <Link to="/faculty/directory" className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] hover:underline flex items-center space-x-1">
                <span>Intern Directory</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4 divide-y divide-border">
              {internDirectory.slice(0, 3).map((intern) => (
                <div key={intern.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-text-primary">{intern.name}</h4>
                    <p className="text-[10px] text-text-secondary font-medium truncate max-w-sm">{intern.projectTitle}</p>
                  </div>
                  <div className="flex items-center space-x-4 shrink-0 w-full sm:w-64">
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-bold text-text-secondary mb-1">
                        <span>Overall Progress</span>
                        <span>{intern.progress}%</span>
                      </div>
                      <ProgressBar progress={intern.progress} className="h-1.5" colorClass="bg-blue-600" />
                    </div>
                    <Badge variant={intern.status.includes("Started") ? "info" : "warning"}>
                      {intern.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Pending Approval Queue */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[320px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Pending Logbook Reviews</span>
              </h3>
              <Badge variant="warning">{logbookReviews.filter(r => r.status === "Pending").length}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {logbookReviews.filter(r => r.status === "Pending").map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-border rounded-xl space-y-2 hover:bg-slate-100/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{log.student}</h4>
                      <p className="text-[9px] text-text-secondary font-semibold">Week {log.week} Submitted</p>
                    </div>
                    <span className="text-[9px] text-text-secondary">{log.submittedOn}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed italic">
                    "{log.workDone}"
                  </p>
                  <div className="flex justify-end pt-1">
                    <Link to="/faculty/logbook-reviews" className="text-[9px] font-bold text-blue-600 hover:underline flex items-center">
                      Evaluate Submission <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Meetings & Deadlines */}
          <motion.div variants={itemVariants} className="bg-card rounded-2xl border border-border p-6 shadow-card flex flex-col h-[320px]">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-2">
                <Video className="w-4 h-4 text-blue-500" />
                <span>Upcoming Meetings</span>
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {meetings.map((meet) => (
                <div key={meet.id} className="p-3 border border-border rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{meet.title}</h4>
                      <p className="text-[9px] text-text-secondary font-semibold">With {meet.student}</p>
                    </div>
                    <Badge variant={meet.status === "Upcoming" ? "info" : "success"}>{meet.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-secondary">
                    <span>{meet.date} • {meet.time}</span>
                  </div>
                  {meet.gmeetLink && meet.status === "Upcoming" && (
                    <a href={meet.gmeetLink} target="_blank" rel="noreferrer" className="block text-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-1 rounded-lg transition-colors">
                      Join Google Meet
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};
