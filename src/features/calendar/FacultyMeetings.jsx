import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  Video, 
  CalendarDays, 
  Plus, 
  Clock, 
  ListTodo, 
  CheckCircle,
  FileText,
  User,
  ExternalLink,
  X
} from "lucide-react";
import { meetings as initialMeetings } from "../../mocks/index";

export const FacultyMeetings = () => {
  const [meetingList, setMeetingList] = useState(initialMeetings);
  const [activeSegment, setActiveSegment] = useState("upcoming"); // "upcoming" or "completed"
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Form states
  const [meetTitle, setMeetTitle] = useState("");
  const [meetStudent, setMeetStudent] = useState("Sophia Müller");
  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [meetLink, setMeetLink] = useState("https://meet.google.com/abc-defg-hij");
  const [meetNotes, setMeetNotes] = useState("");

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!meetTitle.trim() || !meetDate || !meetTime) {
      toast.error("Please fill in the title, date, and meeting time.");
      return;
    }

    const newMeeting = {
      id: `meet-${Date.now()}`,
      title: meetTitle,
      student: meetStudent,
      date: meetDate,
      time: meetTime,
      status: "Upcoming",
      gmeetLink: meetLink,
      notes: meetNotes || "Weekly progress review sync.",
      actionItems: [],
      studentFeedback: ""
    };

    setMeetingList([newMeeting, ...meetingList]);
    setIsScheduling(false);
    
    // Clear form
    setMeetTitle("");
    setMeetDate("");
    setMeetTime("");
    setMeetNotes("");
    toast.success("Mentorship meeting successfully scheduled!");
  };

  const getFilteredMeetings = () => {
    if (activeSegment === "upcoming") {
      return meetingList.filter(m => m.status === "Upcoming");
    }
    return meetingList.filter(m => m.status === "Completed");
  };

  const filtered = getFilteredMeetings();

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Meetings & Mentorship Planner</h1>
          <p className="text-xs text-text-secondary mt-1">
            Coordinate sync calls, document action items, track notes, and collect candidate feedbacks.
          </p>
        </div>

        <Button onClick={() => setIsScheduling(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Schedule Sync Call
        </Button>
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
          Upcoming Sessions ({meetingList.filter(m => m.status === "Upcoming").length})
        </button>
        <button
          onClick={() => setActiveSegment("completed")}
          className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
            activeSegment === "completed" 
              ? "text-blue-600 border-blue-600 font-extrabold" 
              : "text-text-secondary border-transparent hover:text-text-primary"
          }`}
        >
          Completed Archive ({meetingList.filter(m => m.status === "Completed").length})
        </button>
      </div>

      {/* Meeting Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((meet) => (
          <Card key={meet.id} hoverEffect className="p-5 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{meet.title}</h4>
                  <p className="text-[10px] text-text-secondary font-bold flex items-center space-x-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-text-secondary" />
                    <span>Candidate: {meet.student}</span>
                  </p>
                </div>
                <Badge variant={meet.status === "Upcoming" ? "info" : "success"}>
                  {meet.status}
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
                <p className="line-clamp-2 leading-relaxed">"{meet.notes}"</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border shrink-0">
              {meet.gmeetLink && meet.status === "Upcoming" ? (
                <a
                  href={meet.gmeetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
                >
                  Join Google Meet <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              ) : (
                <span className="text-[10px] text-text-secondary italic">Archived Call</span>
              )}

              <Button onClick={() => setSelectedMeeting(meet)} size="sm" variant="secondary" className="font-bold text-[10px] uppercase">
                View Notes & Feedback
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

      {/* Meetings Scheduler Form Modal */}
      <AnimatePresence>
        {isScheduling && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduling(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary">Schedule Mentorship Call</h3>
                <button onClick={() => setIsScheduling(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleSchedule} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Sync Title</label>
                  <input
                    type="text"
                    required
                    value={meetTitle}
                    onChange={(e) => setMeetTitle(e.target.value)}
                    placeholder="e.g. Midterm Evaluation Review"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Date</label>
                    <input
                      type="date"
                      required
                      value={meetDate}
                      onChange={(e) => setMeetDate(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Time Slot</label>
                    <input
                      type="text"
                      required
                      value={meetTime}
                      onChange={(e) => setMeetTime(e.target.value)}
                      placeholder="e.g. 11:00 AM - 11:30 AM"
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Google Meet Link</label>
                  <input
                    type="text"
                    required
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Agenda & Guidelines</label>
                  <textarea
                    rows="3"
                    value={meetNotes}
                    onChange={(e) => setMeetNotes(e.target.value)}
                    placeholder="Provide meeting context, what the student needs to prepare..."
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600 font-bold"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsScheduling(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Schedule Call</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    "{selectedMeeting.notes}"
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-text-secondary font-black uppercase flex items-center space-x-1.5">
                    <ListTodo className="w-4 h-4 text-blue-500" />
                    <span>Action Items assigned</span>
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

                <div>
                  <p className="text-[10px] text-text-secondary font-black uppercase flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Student Feedback Logs</span>
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900/20 border border-border p-3 rounded-xl text-text-secondary leading-relaxed mt-1">
                    {selectedMeeting.studentFeedback ? `"${selectedMeeting.studentFeedback}"` : "No remarks submitted by the student."}
                  </div>
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
