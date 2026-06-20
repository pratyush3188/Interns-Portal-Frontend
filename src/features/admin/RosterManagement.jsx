import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import {
  Download,
  Search,
  Filter,
  FileText,
  Sheet,
  FileCheck
} from "lucide-react";
import { internDirectory } from "../../mocks/index";

export const RosterManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const countries = [...new Set(internDirectory.map(i => i.country))];
  const departments = [...new Set(internDirectory.map(i => i.department))];
  const statuses = [...new Set(internDirectory.map(i => i.status))];

  const filtered = internDirectory.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !countryFilter || intern.country === countryFilter;
    const matchesDept = !deptFilter || intern.department === deptFilter;
    const matchesStatus = !statusFilter || intern.status === statusFilter;

    return matchesSearch && matchesCountry && matchesDept && matchesStatus;
  });

  const triggerExport = (format) => {
    toast.success(`Simulating directory export as: ${format.toUpperCase()} (${filtered.length} rows)`);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Interns Details</h1>
          <p className="text-xs text-text-secondary mt-1">
            Global repository list of all exchange student registrants. Sort, filter and trigger export formats.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0 bg-card border border-border p-1 rounded-xl shadow-sm">
          <Button onClick={() => triggerExport("csv")} variant="secondary" size="sm" className="font-bold text-[10px] uppercase flex items-center">
            <Sheet className="w-3.5 h-3.5 mr-1 text-emerald-600" /> CSV
          </Button>
          <Button onClick={() => triggerExport("excel")} variant="secondary" size="sm" className="font-bold text-[10px] uppercase flex items-center">
            <FileCheck className="w-3.5 h-3.5 mr-1 text-blue-500" /> Excel
          </Button>
          <Button onClick={() => triggerExport("pdf")} variant="secondary" size="sm" className="font-bold text-[10px] uppercase flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-red-500" /> PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-card grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
          />
        </div>
        <div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
          >
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
          >
            <option value="">All Lifecycle Stages</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Roster Master Table */}
      <Card className="overflow-hidden border border-border shadow-card text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">University</th>
                <th className="px-6 py-4">Host Department</th>
                <th className="px-6 py-4">Arrival Date</th>
                <th className="px-6 py-4">Status Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((intern) => (
                <tr key={intern.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-text-primary">{intern.name}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{intern.email}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{intern.country}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{intern.university}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{intern.department}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{intern.arrivalDate}</td>
                  <td className="px-6 py-4">
                    <Badge variant={intern.status.includes("Started") ? "info" : "warning"}>
                      {intern.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 font-bold text-text-secondary italic">
                    No matching roster entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
