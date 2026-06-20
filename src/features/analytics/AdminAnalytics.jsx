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
import { analyticsData } from "../../mocks/index";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#D946EF"];
const GENDER_COLORS = ["#EC4899", "#3B82F6"];

const genderDistribution = [
  { name: "Female", value: 3 },
  { name: "Male", value: 2 }
];

export const AdminAnalytics = () => {
  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Global Exchange Analytics Center</h1>
        <p className="text-xs text-text-secondary mt-1">
          Monitor country representation distributions, host department profiles, lifecycle progression summaries, and monthly trends.
        </p>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Country Distribution */}
        <ChartContainer title="Country Distribution" subtitle="Intern representations by passport origin">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.countryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.countryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Department Distribution */}
        <ChartContainer title="Department Distribution" subtitle="Number of active interns vs host supervisors per department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.departmentDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="interns" fill="#00C49F" radius={[4, 4, 0, 0]} name="Interns" />
              <Bar dataKey="faculty" fill="#8884d8" radius={[4, 4, 0, 0]} name="Supervisors" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Internship Status */}
        <ChartContainer title="Internship Stages Lifecycle" subtitle="Progression state count across all active candidates">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.internshipStatus} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="count" stroke="#04376C" fill="#04376C" fillOpacity={0.15} name="Students Count" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Monthly Trend */}
        <ChartContainer title="Monthly Participation Trends" subtitle="Active portal registrations during the current exchange cycle">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.monthlyParticipation} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line type="monotone" dataKey="active" stroke="#D946EF" strokeWidth={2.5} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Gender Stats */}
        <ChartContainer title="Gender Demographics" subtitle="Ratios of male vs female exchange students">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                label
              >
                {genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Completion rate summary card (Gauge/Progress visual) */}
        <Card className="p-6 border border-border flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Exchange Completion Rate</h3>
            <p className="text-xs text-text-secondary mt-1">Average checklist completion percentage across all host groups</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="63, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-text-primary">63%</span>
                <span className="text-[8px] font-black text-text-secondary uppercase">Average Rate</span>
              </div>
            </div>
            
            <div className="flex space-x-6 text-[10px] text-text-secondary font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Completed Tasks: 51</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span>Remaining: 30</span>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
