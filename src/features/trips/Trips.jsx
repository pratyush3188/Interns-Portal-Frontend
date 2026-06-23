import { useState, useEffect } from "react";
import { trips as initialTrips } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, DollarSign, Users, Check, ArrowLeft, Image, Backpack } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Trips = () => {
  const [tripsList, setTripsList] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [registeredTrips, setRegisteredTrips] = useState({});

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/trips", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        const safeData = Array.isArray(data) ? data : [];
        if (safeData.length === 0) setTripsList(initialTrips);
        else setTripsList(safeData);
      } else {
        setTripsList(initialTrips);
      }
    } catch (err) { console.error(err); }
  };


  const handleRegister = async (tripId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/intern/trips/${tripId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        toast.success("Successfully registered for the trip!");
        setRegisteredTrips({ ...registeredTrips, [tripId]: "registered" });
        fetchTrips();
        // Option: close the active trip or update it if needed. For simplicity we update it:
        const updatedData = await res.json();
        setActiveTrip(updatedData);
      } else {
        toast.error("Failed to register");
      }
    } catch (err) { toast.error("Error registering"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      <AnimatePresence mode="wait">
        {!activeTrip ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-text-primary">Weekend Excursions</h1>
              <p className="text-xs text-text-secondary mt-1">
                Explore the historic land of Rajasthan. Sign up for upcoming weekend trips arranged by the JECRC local chapter.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tripsList.map((trip) => (
                <motion.div
                  key={trip._id}
                  layoutId={`trip-card-${trip._id}`}
                  onClick={() => setActiveTrip(trip)}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover-lift cursor-pointer flex flex-col h-full"
                >
                  <div className="h-52 relative">
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md px-3 py-1 rounded-xl border border-border">
                      <span className="text-xs font-black text-[#04376C] dark:text-[#1E6FD9]">
                        {trip.cost}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-text-primary">
                        {trip.destination}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-border">
                      <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-[#04376C] dark:text-[#1E6FD9]" />
                          <span>{trip.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{trip.date}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border">
                        <span className="text-[10px] text-text-secondary font-bold uppercase">Seats Counter</span>
                        <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded border border-red-200/50">
                          {trip.seatsAvailable} Seats Available
                        </span>
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
              onClick={() => setActiveTrip(null)}
              className="inline-flex items-center space-x-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Excursions</span>
            </button>

            {/* Hero Image Banner */}
            <div className="h-80 w-full rounded-2xl overflow-hidden relative shadow-lg">
              <img
                src={activeTrip.image}
                alt={activeTrip.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6 sm:p-8">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black text-white">
                    {activeTrip.destination}
                  </h1>
                  <p className="text-sm text-slate-300 font-semibold flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#1E6FD9]" />
                    <span>{activeTrip.duration} • Excursion Dates: {activeTrip.date}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Content Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Itinerary & Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Excursion Description
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {activeTrip.description}
                  </p>
                </div>

                {/* Day-Wise Schedule */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Itinerary Timeline
                  </h3>
                  <div className="space-y-4">
                    {activeTrip.schedule?.map((sched, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <span className="bg-[#04376C]/10 dark:bg-[#1E6FD9]/20 text-[#04376C] dark:text-[#1E6FD9] font-black text-[10px] px-2.5 py-1 rounded-md shrink-0">
                          {sched.day}
                        </span>
                        <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
                          {sched.detail}
                        </p>
                      </div>
                    ))}
                    {!activeTrip.schedule?.length && (
                       <p className="text-xs text-text-secondary italic">Schedule will be provided closer to the departure date.</p>
                    )}
                  </div>
                </div>

                {/* Photo Gallery - Masonry Layout */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2">
                    <Image className="w-4 h-4 text-[#04376C] dark:text-[#1E6FD9]" />
                    <span>Trip Gallery Memories</span>
                  </h3>
                  <div className="columns-1 sm:columns-3 gap-4 space-y-4">
                    {activeTrip.gallery?.map((url, idx) => (
                      <div key={idx} className="break-inside-avoid overflow-hidden rounded-xl border border-border shadow-sm">
                        <img
                          src={url}
                          alt={`Gallery ${idx}`}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                    {!activeTrip.gallery?.length && (
                       <p className="text-xs text-text-secondary italic">No gallery images available yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration and Packing list */}
              <div className="space-y-6">
                
                {/* Registration Desk */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Registration & Seating
                  </h3>

                  <div className="space-y-2 text-xs font-semibold text-text-secondary bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border">
                    <div className="flex justify-between">
                      <span>Package Cost:</span>
                      <span className="font-extrabold text-[#04376C] dark:text-[#1E6FD9]">{activeTrip.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meeting Point:</span>
                      <span className="font-bold text-text-primary truncate max-w-[150px]">{activeTrip.meetingPoint}</span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between text-[11px]">
                      <span>Registered Interns:</span>
                      <span className="font-black text-text-primary">{activeTrip.registeredCount} / {activeTrip.seatsTotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Remaining Seats:</span>
                      <span className="font-black text-green-500">{activeTrip.seatsAvailable} Left</span>
                    </div>
                    {activeTrip.waitingListCount > 0 && (
                      <div className="flex justify-between text-[11px] text-amber-500">
                        <span>Waiting List Size:</span>
                        <span>{activeTrip.waitingListCount} Interns</span>
                      </div>
                    )}
                  </div>

                  {/* Register Trigger button */}
                  <button
                    onClick={() => handleRegister(activeTrip._id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                      registeredTrips[activeTrip._id] === "registered"
                        ? "bg-green-500 text-white border-green-500"
                        : registeredTrips[activeTrip._id] === "waiting"
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-[#04376C] dark:bg-[#1E6FD9] text-white border-transparent hover:opacity-90 shadow-md"
                    }`}
                  >
                    {registeredTrips[activeTrip._id] === "registered" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Registered (Seat Confirmed)</span>
                      </>
                    ) : registeredTrips[activeTrip._id] === "waiting" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>On Waiting List</span>
                      </>
                    ) : (
                      <span>Register for Trip</span>
                    )}
                  </button>
                </div>

                {/* Packing List */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2">
                    <Backpack className="w-4 h-4 text-blue-500" />
                    <span>Packing Checklist</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {activeTrip.packingChecklist?.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-border accent-[#04376C] dark:accent-[#1E6FD9] cursor-pointer"
                        />
                        <span className="text-text-secondary font-medium">{item}</span>
                      </div>
                    ))}
                    {!activeTrip.packingChecklist?.length && (
                      <p className="text-text-secondary italic">Standard travel packing recommended.</p>
                    )}
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
