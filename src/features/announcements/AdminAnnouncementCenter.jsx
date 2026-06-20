import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Clock, 
  User, 
  X,
  Edit3,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { announcements as initialAnnouncements } from "../../mocks/index";

export const AdminAnnouncementCenter = () => {
  const [bulletins, setBulletins] = useState(initialAnnouncements);
  const [isPosting, setIsPosting] = useState(false);
  const [editingBulletin, setEditingBulletin] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [scheduleDate, setScheduleDate] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in the title and bulletin details.");
      return;
    }

    if (editingBulletin) {
      // Edit mode
      const updated = bulletins.map(b => b.id === editingBulletin.id ? {
        ...b,
        title,
        category,
        message,
        priority,
        scheduleDate: scheduleDate || "Immediate"
      } : b);
      setBulletins(updated);
      setEditingBulletin(null);
      toast.success("Announcement updated successfully!");
    } else {
      // Add mode
      const newBulletin = {
        id: `announce-${Date.now()}`,
        title,
        message,
        category,
        date: new Date().toISOString().split("T")[0],
        pinned: priority === "High",
        author: "IAESTE Coordinator",
        priority,
        scheduleDate: scheduleDate || "Immediate"
      };
      setBulletins([newBulletin, ...bulletins]);
      toast.success("Announcement posted to all portals!");
    }

    setIsPosting(false);
    clearForm();
  };

  const handleEditClick = (bulletin) => {
    setEditingBulletin(bulletin);
    setTitle(bulletin.title);
    setCategory(bulletin.category);
    setMessage(bulletin.message);
    setPriority(bulletin.priority || "Medium");
    setScheduleDate(bulletin.scheduleDate || "");
    setIsPosting(true);
  };

  const handleDelete = (id) => {
    setBulletins(bulletins.filter(b => b.id !== id));
    toast.success("Announcement deleted successfully!");
  };

  const clearForm = () => {
    setTitle("");
    setCategory("General");
    setMessage("");
    setPriority("Medium");
    setScheduleDate("");
    setEditingBulletin(null);
  };

  const getPriorityColor = (pr) => {
    switch (pr?.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-500 border border-red-200/50";
      case "low": return "bg-blue-500/10 text-blue-500 border border-blue-200/50";
      default: return "bg-amber-500/10 text-amber-500 border border-amber-200/50";
    }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">System Announcement Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Broadcast emergency updates, travel excursions registrations, and academic schedules to interns and faculty.
          </p>
        </div>

        <Button onClick={() => { clearForm(); setIsPosting(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Publish Broadcast
        </Button>
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 gap-4 text-xs">
        {bulletins.map((announce) => (
          <Card key={announce.id} className="p-5 border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant={announce.category === "Urgent" || announce.category === "Emergency" ? "danger" : "info"}>
                    {announce.category}
                  </Badge>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getPriorityColor(announce.priority || "Medium")}`}>
                    {announce.priority || "Medium"} Priority
                  </span>
                  <span className="text-[10px] text-text-secondary font-bold flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Published: {announce.date}</span>
                  </span>
                  {announce.scheduleDate && announce.scheduleDate !== "Immediate" && (
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      Scheduled: {announce.scheduleDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button onClick={() => handleEditClick(announce)} className="p-1 rounded text-blue-500 hover:bg-blue-50 cursor-pointer" title="Edit broadcast"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(announce.id)} className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer" title="Delete broadcast"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-text-primary">{announce.title}</h3>
              <p className="text-text-secondary leading-relaxed font-semibold">
                {announce.message}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-[10px] font-bold text-text-secondary">
              <span>Creator: {announce.author}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Broadcast Creation Modal */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosting(false)}
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
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  <span>{editingBulletin ? "Edit Broadcast Bulletin" : "Create Broadcast Bulletin"}</span>
                </h3>
                <button onClick={() => setIsPosting(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handlePost} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Bulletin Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekend Jaipur Heritage Walk Timings"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                    >
                      <option value="General">General</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Events">Events</option>
                      <option value="Travel">Travel</option>
                      <option value="Academic">Academic</option>
                      <option value="Administrative">Administrative</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Schedule Date (Optional)</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Message Details</label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify complete announcement details here..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsPosting(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    {editingBulletin ? "Update Notice" : "Broadcast Notice"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
