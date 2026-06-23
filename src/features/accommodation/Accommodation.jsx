import { useState, useEffect } from "react";
import { accommodation as initialAccommodation } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Wifi, Clock, ShieldAlert, Plus, X, CheckCircle, Clock3, Calendar } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Accommodation = () => {
  const [tickets, setTickets] = useState(initialAccommodation.tickets);
  const [showModal, setShowModal] = useState(false);
  const [myAccommodation, setMyAccommodation] = useState(null);

  useEffect(() => {
    const fetchAcc = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/intern/accommodation", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) setMyAccommodation(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchAcc();
  }, []);

  // Form states
  const [ticketCategory, setTicketCategory] = useState("WiFi");
  const [ticketTitle, setTicketTitle] = useState("");

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketTitle.trim()) {
      toast.error("Please enter a ticket description title.");
      return;
    }

    const newTicket = {
      id: `tick-${Math.floor(Math.random() * 900) + 100}`,
      category: ticketCategory,
      title: ticketTitle,
      status: "Open",
      date: new Date().toISOString().split("T")[0]
    };

    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setTicketTitle("");
    toast.success("Support ticket created successfully! The warden has been notified.");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Accommodation & Hostel Guide</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review your room assignment, hostel guides, mess timings, and lodge maintenance support requests.
        </p>
      </div>

      {/* Room Information and Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Room Info Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-3 text-text-primary">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Room Details</h3>
          </div>
          
          <div className="space-y-2 text-xs font-semibold text-text-secondary bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-border">
            <div>
              <p className="text-[9px] uppercase text-text-secondary">Hostel Residence</p>
              <p className="text-text-primary font-bold mt-0.5">{myAccommodation?.allottedRoom ? "JECRC Main Hostel" : "Pending Assignment"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-[9px] uppercase text-text-secondary">Room Number</p>
                <p className="text-text-primary font-bold mt-0.5">{myAccommodation?.allottedRoom || "N/A"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-text-secondary">WiFi SSid</p>
                <p className="text-text-primary font-bold mt-0.5">{initialAccommodation.wifiSsid}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 border-t border-border pt-2">
              <div>
                <p className="text-[9px] uppercase text-text-secondary">Start Date</p>
                <p className="text-text-primary font-bold mt-0.5">{myAccommodation?.startDate ? new Date(myAccommodation.startDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase text-text-secondary">End Date</p>
                <p className="text-text-primary font-bold mt-0.5">{myAccommodation?.endDate ? new Date(myAccommodation.endDate).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mess and Laundry Schedule */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-3 text-text-primary">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Hostel Schedules</h3>
          </div>
          
          <div className="space-y-2 text-xs text-text-secondary">
            <div>
              <p className="text-[9px] uppercase font-bold text-text-secondary">Mess Timings</p>
              <div className="mt-1 space-y-1 font-semibold text-text-primary">
                <p>Breakfast: {initialAccommodation.messTimings.breakfast}</p>
                <p>Lunch: {initialAccommodation.messTimings.lunch}</p>
                <p>Dinner: {initialAccommodation.messTimings.dinner}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-[9px] uppercase font-bold text-text-secondary">Laundry Days</p>
              <p className="font-semibold text-text-primary mt-0.5">{initialAccommodation.laundryDays}</p>
            </div>
          </div>
        </div>

        {/* Hostel Rules */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-3 text-text-primary">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Resident Guidelines</h3>
          </div>
          
          <div className="space-y-2 text-xs text-text-secondary">
            <ul className="list-disc pl-4 space-y-1 font-medium leading-relaxed">
              {initialAccommodation.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Support Tickets Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-6">
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Maintenance Support Requests</h3>
            <p className="text-[10px] text-text-secondary mt-0.5">Submit wifi, plumbing, electricity, or cleaning tickets.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center bg-[#04376C] dark:bg-[#1E6FD9] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        </div>

        {/* Ticket History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#04376C] dark:text-[#1E6FD9]">
                    #{t.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-secondary">
                    {t.category}
                  </td>
                  <td className="px-6 py-4 text-text-primary font-bold">
                    {t.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      t.status === "Resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-950/20"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/20"
                    }`}>
                      {t.status === "Resolved" ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Clock3 className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{t.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  New Support Request
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#1E6FD9] focus:bg-card"
                  >
                    <option value="WiFi">WiFi Connection</option>
                    <option value="Water">Water Supply</option>
                    <option value="Electricity">Electricity & AC</option>
                    <option value="Cleaning">Room Cleaning</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Issue Description</label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Brief description of the problem..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#1E6FD9] focus:bg-card"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#04376C] dark:bg-[#1E6FD9] text-white font-bold py-2 rounded-xl text-xs hover:opacity-90 transition-opacity"
                >
                  Submit Ticket
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
