import { useState, useEffect } from "react";
import { events as initialEvents } from "../../mocks/index";
import { useAuthStore } from "../../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Heart, Check, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Events = () => {
  const { user } = useAuthStore();
  const [eventsList, setEventsList] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null); // Selected event for detail view
  
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        const safeData = Array.isArray(data) ? data : [];
        if (safeData.length === 0) setEventsList(initialEvents);
        else setEventsList(safeData);
      } else {
        setEventsList(initialEvents);
      }
    } catch (err) { 
      console.error(err); 
      setEventsList(initialEvents);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId, status) => {
    if (status !== "going") return toast.success("Marked as Interested!");

    try {
      const res = await fetch(`http://localhost:5000/api/intern/events/${eventId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (res.ok) {
        toast.success("Successfully Registered for Event!");
        fetchEvents();
        // Update local active event state for immediate UI feedback
        if (activeEvent && activeEvent._id === eventId) {
          setActiveEvent(prev => ({
            ...prev,
            registeredInterns: [...(prev.registeredInterns || []), user._id]
          }));
        }
      } else {
        toast.error("Failed to register");
      }
    } catch (err) { toast.error("Network error"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      <AnimatePresence mode="wait">
        {!activeEvent ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-text-primary">Campus & Social Events</h1>
              <p className="text-xs text-text-secondary mt-1">
                Participate in campus food fests, cultural nights, and photography walks to connect with students.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventsList.map((event) => (
                <motion.div
                  key={event._id}
                  layoutId={`event-card-${event._id}`}
                  onClick={() => setActiveEvent(event)}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift cursor-pointer flex flex-col h-full"
                >
                  <div className="h-48 relative bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    {/* Fallback image cover */}
                    <span className="absolute top-3 left-3 bg-[#04376C] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      EVENT
                    </span>
                    <Calendar className="w-12 h-12 text-slate-400" />
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-text-primary group-hover:underline leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-text-secondary pt-3 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-[#04376C] dark:text-[#1E6FD9]" />
                        <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-red-500" />
                        <span className="truncate">{event.location || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setActiveEvent(null)}
              className="inline-flex items-center space-x-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Listings</span>
            </button>

            {/* Event Header Banner */}
            <div className="h-72 w-full rounded-2xl overflow-hidden relative shadow-lg bg-slate-900 flex items-center justify-center">
              <Calendar className="w-24 h-24 text-slate-700 absolute opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-6 sm:p-8">
                <div className="space-y-2 relative z-10">
                  <span className="bg-[#1E6FD9] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    EVENT
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                    {activeEvent.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Description & Itinerary */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Event Description & Schedule
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {activeEvent.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border text-xs space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-[#04376C] dark:text-[#1E6FD9] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">Time & Schedule</p>
                      <p className="text-text-secondary mt-0.5">{new Date(activeEvent.date).toLocaleDateString()} at {activeEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">Venue & Location</p>
                      <p className="text-text-secondary mt-0.5">{activeEvent.location || "TBD"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">Host Organization</p>
                      <p className="text-text-secondary mt-0.5">{activeEvent.hostOrganization || "Admin Team"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP & Attendee Roster */}
              <div className="space-y-6">
                
                {/* RSVP Actions */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Registration Desk
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleRSVP(activeEvent._id, "going")}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                        activeEvent.registeredInterns?.includes(user._id)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-[#04376C] dark:bg-[#1E6FD9] text-white border-transparent hover:opacity-90"
                      }`}
                    >
                      {activeEvent.registeredInterns?.includes(user._id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Going (RSVP Confirmed)</span>
                        </>
                      ) : (
                        <span>RSVP - Mark as Going</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRSVP(activeEvent._id, "interested")}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border cursor-pointer bg-white dark:bg-slate-800 text-text-primary border-border hover:bg-slate-50"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Interested</span>
                    </button>
                  </div>
                </div>

                {/* Attendee Roster */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
                    Who's Attending ({activeEvent.registeredInterns?.length || 0})
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      {activeEvent.registeredInterns?.length || 0} Registered Users
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
