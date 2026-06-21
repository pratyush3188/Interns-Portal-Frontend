import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  AlertOctagon, 
  Plus, 
  Phone, 
  Building, 
  UserCheck, 
  Clock, 
  CheckCircle,
  X
} from "lucide-react";
import { incidentReports as initialIncidents } from "../../mocks/index";

export const EmergencyCenter = () => {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [student, setStudent] = useState("Sophia Müller");
  const [desc, setDesc] = useState("");
  const [resolutionInput, setResolutionInput] = useState("");
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState(null);

  // Emergency Hotlines Directory
  const hotlines = [
    { title: "Jaipur Emergency Police Helpline", phone: "112 / 100", type: "Security" },
    { title: "JECRC University Medical Center Clinic", phone: "+91 141 3912345", type: "Medical" },
    { title: "German Consulate Liaison Delhi Office", phone: "+91 11 4419 9000", type: "Consulate" },
    { title: "German Embassy Emergency Liaison Duty Officer", phone: "+91 981 000 0000", type: "Consulate" },
    { title: "IAESTE India National Coordinator (JU Office)", phone: "+91 9079968792", type: "IAESTE Support" }
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill in both the title and incident details.");
      return;
    }

    const newInc = {
      id: `inc-${Date.now()}`,
      student,
      title,
      description: desc,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
      resolution: ""
    };

    setIncidents([newInc, ...incidents]);
    setIsAdding(false);
    setTitle("");
    setDesc("");
    toast.success("New emergency incident report logged successfully.");
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolutionInput.trim()) {
      toast.error("Please specify resolution notes.");
      return;
    }

    const updated = incidents.map(inc => {
      if (inc.id === selectedIncidentForResolve.id) {
        return {
          ...inc,
          status: "Resolved",
          resolution: resolutionInput
        };
      }
      return inc;
    });

    setIncidents(updated);
    setSelectedIncidentForResolve(null);
    setResolutionInput("");
    toast.success("Incident marked as resolved.");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Emergency Support Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain local security hotlines, log emergency incidents, and track active resolution statuses.
          </p>
        </div>

        <Button onClick={() => setIsAdding(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Log Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
        
        {/* Left Column: Direct Hotlines */}
        <div className="space-y-6">
          <Card className="p-5 border border-border shadow-card space-y-4">
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4" />
              <span>Emergency Contacts Directory</span>
            </h3>
            
            <div className="space-y-3 divide-y divide-border">
              {hotlines.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-text-primary font-bold">{item.title}</p>
                    <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-gray-500 font-extrabold uppercase">
                      {item.type}
                    </span>
                  </div>
                  <a href={`tel:${item.phone.replace(/[\s\/\+]/g, "")}`} className="flex items-center space-x-1 font-bold text-red-600 hover:underline shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Columns: Incidents Queue */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Active Incident Reports</h3>
          
          <div className="space-y-4">
            {incidents.map((inc) => (
              <Card key={inc.id} className="p-5 border border-border space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-text-primary text-sm">{inc.title}</h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">Student: {inc.student} • Logged: {inc.date}</p>
                  </div>
                  <Badge variant={inc.status === "Resolved" ? "success" : "danger"}>
                    {inc.status}
                  </Badge>
                </div>

                <p className="text-text-secondary leading-relaxed font-semibold">
                  {inc.description}
                </p>

                {inc.status === "Resolved" ? (
                  <div className="bg-emerald-50/30 border border-emerald-200/50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] font-black text-emerald-600 uppercase flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolution notes</span>
                    </span>
                    <p className="text-text-secondary leading-relaxed font-semibold">
                      {inc.resolution}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2 border-t border-border">
                    <Button onClick={() => setSelectedIncidentForResolve(inc)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                      Resolve Incident
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

      </div>

      {/* Incident Logger Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary flex items-center space-x-2">
                  <AlertOctagon className="w-5 h-5 text-red-500" />
                  <span>Log Emergency Incident</span>
                </h3>
                <button onClick={() => setIsAdding(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Incident Brief</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lost passport during local travel"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Affected Candidate</label>
                  <select
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                  >
                    <option value="Sophia Müller">Sophia Müller</option>
                    <option value="Markus Fischer">Markus Fischer</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Description details</label>
                  <textarea
                    rows="4"
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Provide incident timestamps, current situation details..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsAdding(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">Log Report</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resolution Logger Modal */}
      <AnimatePresence>
        {selectedIncidentForResolve && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIncidentForResolve(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary">Resolve Incident: {selectedIncidentForResolve.title}</h3>
                <button onClick={() => setSelectedIncidentForResolve(null)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleResolveSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Resolution Summary notes</label>
                  <textarea
                    rows="4"
                    required
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Detail the steps taken to resolve this ticket..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setSelectedIncidentForResolve(null)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Submit Resolution</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default EmergencyCenter;
