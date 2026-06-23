import React, { useState } from "react";
import { announcements as initialAnnouncements } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Search, Pin, AlertCircle, X, ChevronRight } from "lucide-react";

export const Announcements = () => {
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAnnounce, setSelectedAnnounce] = useState(null);

  const categories = ["All", "high", "medium", "low"];

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/announcements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAnnouncementsList(data);
        } else {
          setAnnouncementsList([]);
        }
      }
    } catch (err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filtering logic
  const filteredAnnouncements = announcementsList.filter((announce) => {
    const titleMatch = announce.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = announce.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSearch = titleMatch || contentMatch;
    const matchesCategory = activeCategory === "All" || announce.priority === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Split into pinned and unpinned (using high priority as pinned for now)
  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.priority === "high");
  const regularAnnouncements = filteredAnnouncements.filter((a) => a.priority !== "high");

  return (
    <div className="space-y-6 text-foreground pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Announcements Board</h1>
        <p className="text-xs text-text-secondary mt-1">
          Stay updated on urgent coordinator announcements, logistics updates, and cultural seminars.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card border border-border p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-[#1E6FD9]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcement content..."
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-[#1E6FD9] focus:bg-card text-text-primary placeholder-text-secondary"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#04376C] text-white dark:bg-[#1E6FD9]"
                  : "bg-slate-100 dark:bg-slate-800 text-text-secondary hover:text-text-primary border border-transparent hover:border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
            <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Pinned Updates</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedAnnouncements.map((announce) => (
              <motion.div
                key={announce._id}
                onClick={() => setSelectedAnnounce(announce)}
                className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 hover-lift cursor-pointer space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[5%] h-[100%] bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                    PINNED URGENT
                  </span>
                  <span className="text-text-secondary">{new Date(announce.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-sm font-black text-text-primary">{announce.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {announce.message}
                </p>
                <div className="text-[10px] text-text-secondary font-medium pt-2 border-t border-border flex justify-between items-center">
                  <span>Author: {announce.adminId ? "Admin Team" : announce.facultyId?.name || "Faculty"}</span>
                  <span className="text-[#04376C] dark:text-[#1E6FD9] font-bold flex items-center">
                    Read Details <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Feed */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
          Recent Feed
        </h3>

        <div className="space-y-3">
          {regularAnnouncements.map((announce) => (
            <motion.div
              key={announce._id}
              onClick={() => setSelectedAnnounce(announce)}
              className="bg-card border border-border rounded-2xl p-5 hover-lift cursor-pointer flex justify-between items-start md:items-center gap-4 shadow-card"
            >
              <div className="min-w-0 space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-text-secondary">
                  <span className={`px-2 py-0.5 rounded uppercase ${
                    announce.priority === "high"
                      ? "bg-red-500/10 text-red-500"
                      : announce.priority === "medium"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-slate-100 dark:bg-slate-800 text-text-secondary"
                  }`}>
                    {announce.priority}
                  </span>
                  <span>{new Date(announce.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>By: {announce.adminId ? "Admin Team" : announce.facultyId?.name || "Faculty"}</span>
                </div>
                <h4 className="text-sm font-black text-text-primary truncate">{announce.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                  {announce.message}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary shrink-0 hidden md:block" />
            </motion.div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-16 text-xs text-text-secondary border-2 border-dashed border-border rounded-2xl">
              No matching announcements found
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal Component */}
      <AnimatePresence>
        {selectedAnnounce && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAnnounce(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] bg-[#04376C]/10 dark:bg-[#1E6FD9]/20 text-[#04376C] dark:text-[#1E6FD9] px-2.5 py-0.5 rounded font-black uppercase">
                    {selectedAnnounce.priority} Update
                  </span>
                  <p className="text-[10px] text-text-secondary font-semibold">{new Date(selectedAnnounce.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setSelectedAnnounce(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-black text-text-primary leading-snug">
                  {selectedAnnounce.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed pt-2 border-t border-border">
                  {selectedAnnounce.message}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-border flex justify-between items-center text-[10px] text-text-secondary font-semibold shrink-0">
                <span>Published by: {selectedAnnounce.adminId ? "Admin Team" : selectedAnnounce.facultyId?.name || "Faculty"}</span>
                <span className="text-green-500 flex items-center">
                  Official Notification
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
