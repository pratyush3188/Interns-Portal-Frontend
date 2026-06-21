import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Search, History, Trash2, Shield } from "lucide-react";
import { auditLogs as initialLogs } from "../../mocks/index";

export const AuditLogs = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const modules = [...new Set(initialLogs.map(l => l.module))];

  const filtered = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !moduleFilter || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleClearLogs = () => {
    setLogs([]);
    toast.success("Audit log buffer cleared.");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Operational Audit Logs</h1>
          <p className="text-xs text-text-secondary mt-1">
            System logs recording user authentications, weekly logbook review approvals, and bulletin notices publishing.
          </p>
        </div>

        <Button onClick={handleClearLogs} variant="secondary" className="border border-red-200/50 hover:bg-red-50 hover:text-red-600 text-red-500 font-bold text-xs uppercase flex items-center shrink-0">
          <Trash2 className="w-4 h-4 mr-1.5" /> Clear Audit Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-card grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by action description or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
          />
        </div>
        <div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
          >
            <option value="">All Action Modules</option>
            {modules.map(mod => <option key={mod} value={mod}>{mod}</option>)}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden border border-border shadow-card text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Operator User</th>
                <th className="px-6 py-4">Action Summary</th>
                <th className="px-6 py-4">Target Module</th>
                <th className="px-6 py-4">Timestamp Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 font-medium">
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-text-primary">{log.user}</span>
                  </td>
                  <td className="px-6 py-4 text-text-primary font-semibold">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] text-gray-500 font-black uppercase px-2 py-0.5 rounded">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{log.timestamp}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 font-bold text-text-secondary italic">
                    No matching audit actions logged.
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
export default AuditLogs;
