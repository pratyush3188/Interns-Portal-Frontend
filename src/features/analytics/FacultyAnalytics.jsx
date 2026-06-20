import React from "react";
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

const progressDistribution = [
  { name: "Sophia Müller", progress: 75, tasks: 12 },
  { name: "Markus Fischer", progress: 88, tasks: 15 },
  { name: "Elena Rostova", progress: 45, tasks: 5 },
  { name: "Lucas Dupont", progress: 10, tasks: 1 },
  { name: "Anna Nowak", progress: 95, tasks: 18 }
];

const reviewTrends = [
  { week: "Wk 1", reviewsSubmitted: 4, reviewsApproved: 4 },
  { week: "Wk 2", reviewsSubmitted: 5, reviewsApproved: 3 },
  { week: "Wk 3", reviewsSubmitted: 6, reviewsApproved: 5 },
  { week: "Wk 4", reviewsSubmitted: 3, reviewsApproved: 3 }
];

const attendanceMetrics = [
  { name: "90%+", value: 4 },
  { name: "80%-90%", value: 1 },
  { name: "<80%", value: 0 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const FacultyAnalytics = () => {
  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Faculty Performance Analytics</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review overall student progress distributions, task completion rates, logbook submission trendlines, and attendance metrics.
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
        <ChartContainer title="Attendance Statistics" subtitle="Distribution of interns across attendance brackets">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceMetrics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {attendanceMetrics.map((entry, index) => (
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
