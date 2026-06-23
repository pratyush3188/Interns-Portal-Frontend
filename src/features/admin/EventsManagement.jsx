import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Sparkles, Users, Award, Calendar, Plus, MessageSquare, X } from "lucide-react";
import { events as initialEvents } from "../../mocks/index";

export const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    hostOrganization: "",
    image: ""
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setEvents(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Event title is required");
    if (!formData.date) return toast.error("Event date is required");
    if (!formData.time.trim()) return toast.error("Event time is required");
    if (!formData.description.trim()) return toast.error("Event description is required");
    try {
      const res = await fetch("http://localhost:5000/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Event created successfully!");
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          endTime: "",
          location: "",
          hostOrganization: "",
          image: ""
        });
        fetchEvents();
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (err) { toast.error("Error creating event"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Events & Excursions Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Publish social gatherings, weekend excursions, and collect participant feedbacks.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Publish Event
        </Button>
      </div>

      {/* Roster of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {events.map((item) => (
          <Card key={item._id} className="overflow-hidden border border-border flex flex-col justify-between hover:shadow-md transition-shadow p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                    <p className="text-[10px] text-text-secondary font-black uppercase">
                      {new Date(item.date).toLocaleDateString()} at {item.time}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-text-secondary font-medium leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border text-center text-[10px] text-text-secondary">
                <div>
                  <span>RSVPs</span>
                  <p className="text-text-primary font-black mt-0.5">{item.registeredInterns?.length || 0} Registered</p>
                </div>
                <div>
                  <span>Location</span>
                  <p className="text-text-primary font-black mt-0.5 truncate">{item.location || "TBD"}</p>
                </div>
                <div>
                  <span>Host</span>
                  <p className="text-text-primary font-black mt-0.5 truncate">{item.hostOrganization || "Admin Team"}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-text-secondary pt-2 border-t border-border">
                <button
                  onClick={() => setSelectedEventInfo(item)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View Registered Interns
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Publish Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Publish New Event</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Event Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Description</label>
                <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Start Time</label>
                  <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">End Time</label>
                  <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Location / Venue</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Host Organization</label>
                  <input type="text" value={formData.hostOrganization} onChange={e => setFormData({...formData, hostOrganization: e.target.value})} placeholder="e.g. Cultural Committee" className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Cover Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Publish Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Registered Interns Modal */}
      {selectedEventInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedEventInfo(null)} />
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-wider">{selectedEventInfo.title} Registrations</h2>
              <button onClick={() => setSelectedEventInfo(null)}><X className="w-5 h-5 text-text-secondary" /></button>
            </div>
            
            <div className="space-y-3">
              {selectedEventInfo.registeredInterns?.length > 0 ? (
                selectedEventInfo.registeredInterns.map((intern, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
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
              <Button variant="secondary" onClick={() => setSelectedEventInfo(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default EventsManagement;
