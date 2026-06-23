import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Video, CalendarDays, Clock, ExternalLink, User, X, CheckCircle, FileText, ListTodo } from "lucide-react";

export const Meetings = () => {
  const [meetingList, setMeetingList] = useState([]);
  const [activeSegment, setActiveSegment] = useState("upcoming");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/intern/meetings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setMeetingList(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const getFilteredMeetings = () => {
    if (activeSegment === "upcoming") {
      return meetingList.filter(m => m.status === "scheduled" || m.status === "Upcoming");
    }
    return meetingList.filter(m => m.status === "completed" || m.status === "Completed");
  };

  const filtered = getFilteredMeetings();

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">My Meetings</h1>
        <p className="text-xs text-text-secondary mt-1">
          View scheduled syncs, join video calls, and review agenda notes assigned by your supervisor.
        </p>
      </div>

      {/* Segments Toggle */}
      <div className="flex space-x-1.5 border-b border-border pb-1">
        <button
          onClick={() => setActiveSegment("upcoming")}
          className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
            activeSegment === "upcoming" 
              ? "text-blue-600 border-blue-600 font-extrabold" 
              : "text-text-secondary border-transparent hover:text-text-primary"
          }`}
        >
          Upcoming ({meetingList.filter(m => m.status === "scheduled" || m.status === "Upcoming").length})
        </button>
        <button
          onClick={() => setActiveSegment("completed")}
          className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
            activeSegment === "completed" 
              ? "text-blue-600 border-blue-600 font-extrabold" 
              : "text-text-secondary border-transparent hover:text-text-primary"
          }`}
        >
          Completed ({meetingList.filter(m => m.status === "completed" || m.status === "Completed").length})
        </button>
      </div>

      {/* Meeting Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((meet) => (
          <Card key={meet._id} hoverEffect className="p-5 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{meet.title}</h4>
                  <p className="text-[10px] text-text-secondary font-bold flex items-center space-x-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-text-secondary" />
                    <span>Supervisor: {meet.facultyId?.name || "Faculty"}</span>
                  </p>
                </div>
                <Badge variant={meet.status === "scheduled" || meet.status === "Upcoming" ? "info" : "success"}>
                  {meet.status === "scheduled" ? "Upcoming" : "Completed"}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-xs font-bold text-text-secondary pt-1">
                <span className="flex items-center space-x-1">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span>{meet.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{meet.time}</span>
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-border text-xs text-text-secondary space-y-1">
                <span className="text-[9px] font-black text-text-secondary uppercase">Agenda Notes</span>
                <p className="line-clamp-2 leading-relaxed">"{meet.agenda || meet.notes}"</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border shrink-0">
              {(meet.meetingLink || meet.gmeetLink) && (meet.status === "scheduled" || meet.status === "Upcoming") ? (
                <a
                  href={meet.meetingLink || meet.gmeetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
                >
                  Join Call <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              ) : (
                <span className="text-[10px] text-text-secondary italic">Archived Call</span>
              )}

              <Button onClick={() => setSelectedMeeting(meet)} size="sm" variant="secondary" className="font-bold text-[10px] uppercase">
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 font-bold text-text-secondary border-2 border-dashed border-border rounded-2xl bg-card">
            No scheduled meetings found in this tab.
          </div>
        )}
      </div>

      {/* Meeting Details drawer */}
      <AnimatePresence>
        {selectedMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMeeting(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-black text-text-primary">{selectedMeeting.title}</h3>
                  <p className="text-[9px] text-text-secondary font-bold uppercase">Call Details & Notes</p>
                </div>
                <button onClick={() => setSelectedMeeting(null)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-text-secondary font-black uppercase">Mentorship Agenda Notes</p>
                  <div className="bg-slate-50 dark:bg-slate-900/20 border border-border p-3 rounded-xl text-text-primary font-medium leading-relaxed mt-1">
                    "{selectedMeeting.agenda || selectedMeeting.notes}"
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary font-black uppercase flex items-center space-x-1.5">
                    <ListTodo className="w-4 h-4 text-blue-500" />
                    <span>Action Items</span>
                  </p>
                  {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 ? (
                    <div className="space-y-1">
                      {selectedMeeting.actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/10 border border-border p-2.5 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-bold text-text-primary">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-text-secondary pl-1">No specific follow-up items assigned for this session.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <Button onClick={() => setSelectedMeeting(null)} size="sm">
                  Close Sync Summary
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
