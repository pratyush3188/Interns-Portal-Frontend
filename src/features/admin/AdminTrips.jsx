import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, MapPin, Users, CalendarDays, IndianRupee, Map } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTripInfo, setSelectedTripInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    cost: "",
    seatsTotal: 20,
    date: "",
    description: "",
    meetingPoint: "",
    image: "",
    galleryRaw: "",
    packingChecklistRaw: ""
  });
  const [schedule, setSchedule] = useState([{ day: "Day 1", detail: "" }]);

  const fetchTrips = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/trips", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) return toast.error("Destination is required");
    if (!formData.date.trim()) return toast.error("Date is required");
    if (!formData.duration.trim()) return toast.error("Duration is required");
    try {
      const payload = {
        ...formData,
        seatsAvailable: formData.seatsTotal,
        gallery: formData.galleryRaw.split(",").map(url => url.trim()).filter(Boolean),
        packingChecklist: formData.packingChecklistRaw.split(",").map(item => item.trim()).filter(Boolean),
        schedule: schedule.filter(item => item.detail.trim())
      };
      const res = await fetch("http://localhost:5000/api/admin/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        fetchTrips();
        setIsAdding(false);
        setFormData({
          destination: "",
          duration: "",
          cost: "",
          seatsTotal: 20,
          date: "",
          description: "",
          meetingPoint: "",
          image: "",
          galleryRaw: "",
          packingChecklistRaw: ""
        });
        setSchedule([{ day: "Day 1", detail: "" }]);
        toast.success("Trip created successfully");
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (err) { toast.error("Error creating trip"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        fetchTrips();
        toast.success("Trip deleted");
      }
    } catch (err) { toast.error("Error deleting trip"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Trips & Excursions</h1>
          <p className="text-xs text-text-secondary mt-1">
            Organize official weekend trips for international interns to explore local heritage.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-1.5 bg-[#04376C] dark:bg-[#1E6FD9] text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift flex flex-col relative group">
            <button onClick={() => handleDelete(trip._id)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="h-40 bg-slate-200 dark:bg-slate-800 relative">
              {trip.image ? (
                <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-50">
                  <Map className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-base font-black text-text-primary mb-1">{trip.destination}</h3>
              <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed mb-4">
                {trip.description}
              </p>
              
              <div className="space-y-2 text-xs font-semibold text-text-secondary mb-4 flex-1">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                  <span>{trip.date} ({trip.duration})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-3.5 h-3.5 text-green-500" />
                  <span>{trip.cost}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span className="truncate">{trip.meetingPoint}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>{trip.registeredCount || 0} / {trip.seatsTotal} Registered</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border mt-auto">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1E6FD9] rounded-full"
                    style={{ width: `${Math.min(100, ((trip.registeredCount || 0) / trip.seatsTotal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-text-secondary pt-2 border-t border-border mt-2">
                <button
                  onClick={() => setSelectedTripInfo(trip)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View Registered Interns
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-slate-900 backdrop-blur-xs" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Plan Official Trip</h3>
                <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Destination</label>
                  <input required value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} placeholder="e.g. Udaipur Lakes Tour" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Date</label>
                    <input required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} placeholder="2026-06-26" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Duration</label>
                    <input required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} placeholder="2 Days, 1 Night" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Total Seats</label>
                    <input type="number" required value={formData.seatsTotal} onChange={(e) => setFormData({...formData, seatsTotal: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Est. Cost</label>
                    <input value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} placeholder="₹4,500 (optional)" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Meeting Point</label>
                  <input value={formData.meetingPoint} onChange={(e) => setFormData({...formData, meetingPoint: e.target.value})} placeholder="Main Gate (optional)" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Description</label>
                  <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Trip details and itinerary..." className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>

                {/* Cover Image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Cover Image URL</label>
                  <input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>

                {/* Gallery Image URLs */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Gallery Image URLs <span className="font-normal text-text-secondary">(comma-separated)</span></label>
                  <textarea rows="2" value={formData.galleryRaw} onChange={(e) => setFormData({...formData, galleryRaw: e.target.value})} placeholder="https://img1.jpg, https://img2.jpg, https://img3.jpg" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>

                {/* Packing Checklist */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Packing Checklist <span className="font-normal text-text-secondary">(comma-separated)</span></label>
                  <textarea rows="2" value={formData.packingChecklistRaw} onChange={(e) => setFormData({...formData, packingChecklistRaw: e.target.value})} placeholder="Sunscreen, Water Bottle, Camera, Hat, Comfortable Shoes" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-[#1E6FD9]" />
                </div>

                {/* Dynamic Schedule / Itinerary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Day-by-Day Itinerary</label>
                    <button type="button" onClick={() => setSchedule([...schedule, { day: `Day ${schedule.length + 1}`, detail: "" }])} className="text-[10px] font-bold text-[#1E6FD9] hover:underline flex items-center space-x-1">
                      <Plus className="w-3 h-3" /> <span>Add Day</span>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {schedule.map((entry, idx) => (
                      <div key={idx} className="flex items-start space-x-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border">
                        <input value={entry.day} onChange={(e) => { const updated = [...schedule]; updated[idx].day = e.target.value; setSchedule(updated); }} className="w-20 shrink-0 bg-white dark:bg-slate-800 border border-border rounded-lg px-2 py-1.5 text-[11px] font-bold text-text-primary outline-none" />
                        <input value={entry.detail} onChange={(e) => { const updated = [...schedule]; updated[idx].detail = e.target.value; setSchedule(updated); }} placeholder="Activity description..." className="flex-1 bg-white dark:bg-slate-800 border border-border rounded-lg px-2 py-1.5 text-[11px] text-text-primary outline-none" />
                        {schedule.length > 1 && (
                          <button type="button" onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))} className="p-1 text-red-400 hover:text-red-600 shrink-0 mt-0.5">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#04376C] dark:bg-[#1E6FD9] text-white font-bold py-2.5 rounded-xl text-xs hover:opacity-90 mt-2">
                  Publish Trip
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Registered Interns Modal */}
      {selectedTripInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedTripInfo(null)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-wider">{selectedTripInfo.destination} Registrations</h2>
              <button onClick={() => setSelectedTripInfo(null)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>
            
            <div className="space-y-3">
              {selectedTripInfo.registeredInterns?.length > 0 ? (
                selectedTripInfo.registeredInterns.map((intern, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {intern.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">{intern.name}</p>
                      <p className="text-[10px] text-text-secondary">{intern.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-text-secondary text-xs font-bold py-8 border-2 border-dashed border-border rounded-xl">
                  No interns have registered yet.
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button 
                className="bg-[#04376C] dark:bg-[#1E6FD9] text-white font-bold py-2 px-4 rounded-xl text-xs hover:opacity-90"
                onClick={() => setSelectedTripInfo(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
