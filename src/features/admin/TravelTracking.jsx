import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Plane, Plus, Search, CalendarDays, X } from "lucide-react";
import { travelRecords as initialTravelRecords } from "../../mocks/index";

export const TravelTracking = () => {
  const [records, setRecords] = useState([]);
  const [interns, setInterns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    internId: "",
    internName: "",
    arrivalDate: "",
    arrivalTime: "",
    departureDate: "",
    departureTime: "",
    cabNumber: ""
  });

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [trvRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/travel", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers })
      ]);
      
      if (trvRes.ok) setRecords(await trvRes.json());
      if (usersRes.ok) {
        const data = await usersRes.json();
        setInterns(data.interns || []);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectIntern = (e) => {
    const selectedId = e.target.value;
    const intern = interns.find(i => i._id === selectedId);
    setFormData({
      ...formData,
      internId: selectedId,
      internName: intern ? intern.name : ""
    });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!formData.internId || !formData.arrivalDate) {
      return toast.error("Intern and Arrival Date are required!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/admin/travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Travel Record Successfully Logged!");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to log travel record");
      }
    } catch (err) { toast.error("Error connecting to server"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Travel & Arrival Tracking</h1>
          <p className="text-xs text-text-secondary mt-1">
            Monitor incoming flight detail coordinates, airport cab dispatch statuses, and departure flight dates.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Log Flight Record
        </Button>
      </div>

      {/* Grid of travel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {records.map((rec) => (
          <Card key={rec._id} hoverEffect className="p-5 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{rec.internName}</h4>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Tracking Active</p>
                  </div>
                </div>
                <Badge variant="success">Scheduled</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary">
                <div>
                  <span className="flex items-center space-x-1">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                    <span>Arrival Date</span>
                  </span>
                  <p className="text-text-primary font-black mt-1">
                    {new Date(rec.arrivalDate).toLocaleDateString()} {rec.arrivalTime ? `• ${rec.arrivalTime}` : ""}
                  </p>
                </div>
                <div>
                  <span className="flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5 text-indigo-500 rotate-45" />
                    <span>Departure Flight</span>
                  </span>
                  <p className="text-text-primary font-black mt-1">
                    {rec.departureDate ? new Date(rec.departureDate).toLocaleDateString() : "TBD"}
                  </p>
                </div>
              </div>

              <div className="bg-slate-100/50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-border text-[10px] text-text-secondary font-medium">
                Cab Assigned: <span className="font-bold text-text-primary">{rec.cabNumber || "Not Assigned"}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Log Travel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Log Travel Record</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Select Intern</label>
                <select
                  required
                  value={formData.internId}
                  onChange={handleSelectIntern}
                  className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="">Select Intern...</option>
                  {interns.map(i => <option key={i._id} value={i._id}>{i.name} ({i.email})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Arrival Date</label>
                  <input type="date" required value={formData.arrivalDate} onChange={e => setFormData({...formData, arrivalDate: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Arrival Time</label>
                  <input type="time" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Departure Date</label>
                  <input type="date" value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Departure Time</label>
                  <input type="time" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Cab / Transport Details</label>
                <input type="text" value={formData.cabNumber} onChange={e => setFormData({...formData, cabNumber: e.target.value})} placeholder="e.g. RJ14 TA 1234, Uber" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Save Travel Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default TravelTracking;
