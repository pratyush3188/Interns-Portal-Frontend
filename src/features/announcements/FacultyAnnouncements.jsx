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
  MessageSquare,
  ArrowRight,
  X
} from "lucide-react";
import { announcements as initialAnnouncements } from "../../mocks/index";

export const FacultyAnnouncements = () => {
  const [bulletins, setBulletins] = useState(initialAnnouncements);
  const [isPosting, setIsPosting] = useState(false);

  // Form states
  const [bulletinTitle, setBulletinTitle] = useState("");
  const [bulletinCategory, setBulletinCategory] = useState("Academic");
  const [bulletinMessage, setBulletinMessage] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (!bulletinTitle.trim() || !bulletinMessage.trim()) {
      toast.error("Please fill in both the title and detail message.");
      return;
    }

    const newBulletin = {
      id: `announce-${Date.now()}`,
      title: bulletinTitle,
      message: bulletinMessage,
      category: bulletinCategory,
      date: new Date().toISOString().split("T")[0],
      pinned: false,
      author: "Dr. Michael Schneider"
    };

    setBulletins([newBulletin, ...bulletins]);
    setIsPosting(false);
    setBulletinTitle("");
    setBulletinMessage("");
    toast.success("Bulletin notice published to all interns!");
  };

  const handleDelete = (id) => {
    setBulletins(bulletins.filter(b => b.id !== id));
    toast.success("Announcement deleted successfully!");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Faculty Announcements Manager</h1>
          <p className="text-xs text-text-secondary mt-1">
            Publish department notices, sync call reminders, research milestone deadlines, and emergency alerts.
          </p>
        </div>

        <Button onClick={() => setIsPosting(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Post Bulletin Notice
        </Button>
      </div>

      {/* Notices Roster */}
      <div className="grid grid-cols-1 gap-4">
        {bulletins.map((bulletin) => (
          <Card key={bulletin.id} className="p-5 border border-border flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant={bulletin.category === "Urgent" ? "danger" : "info"}>
                    {bulletin.category}
                  </Badge>
                  <span className="text-[10px] text-text-secondary font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{bulletin.date}</span>
                  </span>
                </div>
                
                {bulletin.author === "Dr. Michael Schneider" && (
                  <button onClick={() => handleDelete(bulletin.id)} className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer" title="Delete notice">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="text-sm font-bold text-text-primary">{bulletin.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                {bulletin.message}
              </p>
            </div>

            <div className="flex items-center text-[10px] font-bold text-text-secondary border-t border-border pt-3">
              <User className="w-3.5 h-3.5 mr-1 text-blue-600" />
              <span>Published by: {bulletin.author}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Posting Modal */}
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
                  <Megaphone className="w-5 h-5 text-blue-600" />
                  <span>Publish Department Bulletin</span>
                </h3>
                <button onClick={() => setIsPosting(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handlePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={bulletinTitle}
                    onChange={(e) => setBulletinTitle(e.target.value)}
                    placeholder="e.g. Lab Safety Equipment Inspections"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Notice Category</label>
                  <select
                    value={bulletinCategory}
                    onChange={(e) => setBulletinCategory(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="General">General Announcement</option>
                    <option value="Urgent">Urgent / Alert</option>
                    <option value="Logistics">Logistics Update</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Bulletin Details</label>
                  <textarea
                    rows="4"
                    required
                    value={bulletinMessage}
                    onChange={(e) => setBulletinMessage(e.target.value)}
                    placeholder="Specify the complete message contents here..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsPosting(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Publish Notice</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
