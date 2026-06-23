import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  LineChart,
  Line
} from "recharts";
import { ChartContainer } from "../../components/ui/ChartContainer";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  UserCheck 
} from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const FacultyAnalytics = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logbooks, setLogbooks] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
        const [intRes, tskRes, logRes] = await Promise.all([
          fetch("http://localhost:5000/api/faculty/interns", { headers }),
          fetch("http://localhost:5000/api/faculty/tasks", { headers }),
          fetch("http://localhost:5000/api/faculty/logbooks", { headers })
        ]);

        if (intRes.ok && tskRes.ok && logRes.ok) {
          const internsData = await intRes.json();
          const tasksData = await tskRes.json();
          const logbooksData = await logRes.json();
          setInterns(Array.isArray(internsData) ? internsData : []);
          setTasks(Array.isArray(tasksData) ? tasksData : []);
          setLogbooks(Array.isArray(logbooksData) ? logbooksData : []);
        }
      } catch (err) { console.error("Failed to load analytics"); }
    };
    fetchAnalyticsData();
  }, []);

  // Compute Progress Distribution
  const progressDistribution = interns.map(intern => {
    const internTasks = tasks.filter(t => t.internId?._id === intern._id || t.internId === intern._id);
    const completedTasks = internTasks.filter(t => t.status === "completed").length;
    const progress = internTasks.length > 0 ? Math.round((completedTasks / internTasks.length) * 100) : (intern.progress || 0);
    return {
      name: intern.name,
      progress,
      tasks: completedTasks
    };
  });

  // Compute Review Trends
  const logbookData = {};
  logbooks.forEach(log => {
    const weekLabel = `Wk ${log.week}`;
    if (!logbookData[weekLabel]) {
      logbookData[weekLabel] = { week: weekLabel, reviewsSubmitted: 0, reviewsApproved: 0 };
    }
    logbookData[weekLabel].reviewsSubmitted++;
    if (log.status === "Approved") logbookData[weekLabel].reviewsApproved++;
  });
  const reviewTrends = Object.values(logbookData).sort((a,b) => {
    const numA = parseInt(a.week.replace("Wk ", ""));
    const numB = parseInt(b.week.replace("Wk ", ""));
    return numA - numB;
  });

  // Compute Engagement Brackets instead of hardcoded attendance
  const highlyEngaged = progressDistribution.filter(p => p.progress >= 80).length;
  const mediumEngaged = progressDistribution.filter(p => p.progress >= 40 && p.progress < 80).length;
  const lowEngaged = progressDistribution.filter(p => p.progress < 40).length;

  const engagementMetrics = [
    { name: "High Progress (80%+)", value: highlyEngaged },
    { name: "Medium Progress (40-80%)", value: mediumEngaged },
    { name: "Low Progress (<40%)", value: lowEngaged }
  ].filter(e => e.value > 0);

  if (engagementMetrics.length === 0) {
    engagementMetrics.push({ name: "No Interns", value: 1 });
  }

  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Faculty Performance Analytics</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review overall student progress distributions, task completion rates, logbook submission trendlines, and engagement metrics based on your assigned interns.
        </p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Progress & Task Counts Chart */}
        <ChartContainer title="Student Progress Distribution" subtitle="Overall project progress percentage per intern">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="progress" fill="#8884d8" radius={[4, 4, 0, 0]} name="Progress %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Task Completion Counts */}
        <ChartContainer title="Task Completion Rates" subtitle="Number of tasks completed per supervised intern">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="tasks" stroke="#00C49F" fill="#00C49F" fillOpacity={0.2} name="Tasks Done" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Logbook submissions trend */}
        <ChartContainer title="Review Completion Trend" subtitle="Logbook submissions vs approvals over the last 4 weeks">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reviewTrends} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line type="monotone" dataKey="reviewsSubmitted" stroke="#0088FE" strokeWidth={2.5} name="Submitted" />
              <Line type="monotone" dataKey="reviewsApproved" stroke="#FFBB28" strokeWidth={2.5} name="Approved" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Attendance Pie Chart */}
        <ChartContainer title="Engagement Statistics" subtitle="Distribution of interns across progress brackets">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementMetrics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {engagementMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>
    </div>
  );
};
