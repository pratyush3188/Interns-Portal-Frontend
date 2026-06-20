import { useState } from "react";
import { events as initialEvents } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Heart, Check, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Events = () => {
  const [eventsList, setEventsList] = useState(initialEvents);
  const [activeEvent, setActiveEvent] = useState(null); // Selected event for detail view
  const [userStatus, setUserStatus] = useState({}); // { [eventId]: "going" | "interested" | null }

  const handleRSVP = (eventId, status) => {
    setUserStatus({
      ...userStatus,
      [eventId]: userStatus[eventId] === status ? null : status
    });

    // Adjust attendee list/counter dynamically
    const event = eventsList.find((e) => e.id === eventId);
    let updatedAttendees = [...event.attendees];

    if (status === "going") {
      if (userStatus[eventId] === "going") {
        updatedAttendees = updatedAttendees.filter((a) => a !== "Sophia (You)");
        toast.success("RSVP cancelled.");
      } else {
        if (!updatedAttendees.includes("Sophia (You)")) {
          updatedAttendees.push("Sophia (You)");
        }
        toast.success("You are marked as Going!");
      }
    } else if (status === "interested") {
      if (userStatus[eventId] === "interested") {
        toast.success("Removed from interested list.");
      } else {
        toast.success("Marked as Interested!");
      }
    }

    setEventsList(
      eventsList.map((e) => (e.id === eventId ? { ...e, attendees: updatedAttendees } : e))
    );
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
                  key={event.id}
                  layoutId={`event-card-${event.id}`}
                  onClick={() => setActiveEvent(event)}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift cursor-pointer flex flex-col h-full"
                >
                  <div className="h-48 relative">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#04376C] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      {event.category}
                    </span>
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
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-red-500" />
                        <span className="truncate">{event.venue}</span>
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
            <div className="h-72 w-full rounded-2xl overflow-hidden relative shadow-lg">
              <img
                src={activeEvent.coverImage}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6 sm:p-8">
                <div className="space-y-2">
                  <span className="bg-[#1E6FD9] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {activeEvent.category}
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
                      <p className="text-text-secondary mt-0.5">{activeEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">Venue & Location</p>
                      <p className="text-text-secondary mt-0.5">{activeEvent.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-text-primary">Host Organization</p>
                      <p className="text-text-secondary mt-0.5">{activeEvent.organizer}</p>
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
                      onClick={() => handleRSVP(activeEvent.id, "going")}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                        userStatus[activeEvent.id] === "going"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-[#04376C] dark:bg-[#1E6FD9] text-white border-transparent hover:opacity-90"
                      }`}
                    >
                      {userStatus[activeEvent.id] === "going" ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Going (RSVP Confirmed)</span>
                        </>
                      ) : (
                        <span>RSVP - Mark as Going</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRSVP(activeEvent.id, "interested")}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                        userStatus[activeEvent.id] === "interested"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-text-primary border-border hover:bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${userStatus[activeEvent.id] === "interested" ? "fill-white" : ""}`} />
                      <span>Interested</span>
                    </button>
                  </div>
                </div>

                {/* Attendee Roster */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
                    Who's Attending ({activeEvent.attendees.length})
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {activeEvent.attendees.map((attendee, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          attendee.includes("(You)")
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {attendee}
                      </span>
                    ))}
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
