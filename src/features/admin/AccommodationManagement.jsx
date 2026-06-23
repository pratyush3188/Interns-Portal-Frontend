import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Home, SlidersHorizontal, Plus, AlertOctagon, X } from "lucide-react";
import { accommodations as initialAccommodations } from "../../mocks/index";

export const AccommodationManagement = () => {
  const [allocations, setAllocations] = useState([]);
  const [interns, setInterns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    internId: "",
    internName: "",
    intlPhone: "",
    indianPhone: "",
    uniName: "",
    gender: "",
    age: "",
    allottedRoom: "",
    startDate: "",
    endDate: ""
  });

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [accRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/accommodation", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers })
      ]);
      
      if (accRes.ok) setAllocations(await accRes.json());
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
      internName: intern ? intern.name : "",
      uniName: intern ? intern.university : ""
    });
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!formData.internId || !formData.allottedRoom) {
      return toast.error("Intern and Allotted Room are required!");
    }
    try {
      const res = await fetch("http://localhost:5000/api/admin/accommodation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Room Successfully Allocated to Intern!");
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error("Failed to allocate room");
      }
    } catch (err) { toast.error("Error connecting to server"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Accommodation Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Track JECRC international hostels allocations, room occupancies, and suite maintenance.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Allocate Room
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-xs font-semibold">
        {allocations.map((item) => (
          <Card key={item._id} hoverEffect className="p-5 border border-border space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary font-black uppercase">Room {item.allottedRoom}</p>
                  <h4 className="font-bold text-text-primary mt-0.5 truncate max-w-[180px]">{item.internName}</h4>
                </div>
              </div>
              <Badge variant="success">Occupied</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary">
              <div>
                <span>University</span>
                <p className="text-text-primary font-black mt-0.5">{item.uniName || "N/A"}</p>
              </div>
              <div>
                <span>Dates</span>
                <p className="text-text-primary font-black mt-0.5">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString() : "TBD"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Allocate Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Allocate Hostel Room</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Allotted Room</label>
                  <input
                    type="text" required value={formData.allottedRoom} onChange={e => setFormData({...formData, allottedRoom: e.target.value})} placeholder="e.g. A-102"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Intern Name</label>
                  <input type="text" required value={formData.internName} onChange={e => setFormData({...formData, internName: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">University Name</label>
                  <input type="text" value={formData.uniName} onChange={e => setFormData({...formData, uniName: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">International Phone No.</label>
                  <input type="text" value={formData.intlPhone} onChange={e => setFormData({...formData, intlPhone: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Indian Phone No.</label>
                  <input type="text" value={formData.indianPhone} onChange={e => setFormData({...formData, indianPhone: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none">
                    <option value="">Select Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">End Date</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Save Allocation</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default AccommodationManagement;
