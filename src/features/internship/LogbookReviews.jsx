import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  CheckCircle, 
  AlertCircle, 
  X, 
  MessageSquare,
  History,
  CornerDownRight,
  BookOpen
} from "lucide-react";
import { logbookReviews } from "../../mocks/index";

export const LogbookReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending"); // "Pending", "Approved", "Rejected" / "Changes Requested"
  const [selectedReview, setSelectedReview] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/faculty/logbooks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data.map(d => ({ ...d, id: d._id })));
      }
    } catch (err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (reviewId, action) => {
    if (action !== "Approved" && !feedbackComment.trim()) {
      toast.error("Please add evaluation feedback comments first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/faculty/logbooks/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: action, facultyFeedback: feedbackComment || "Approved with no remarks." })
      });
      if (response.ok) {
        toast.success(`Submission successfully marked as: ${action}`);
        fetchReviews();
        setSelectedReview(null);
        setFeedbackComment("");
      } else {
        toast.error("Failed to update logbook status");
      }
    } catch (err) {
      toast.error("Error updating logbook");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <Badge variant="success">Approved</Badge>;
      case "Rejected": return <Badge variant="danger">Rejected</Badge>;
      case "Pending": return <Badge variant="warning">Pending Review</Badge>;
      default: return <Badge variant="info">Changes Requested</Badge>;
    }
  };

  const getFilteredReviews = () => {
    if (activeTab === "Pending") {
      return reviews.filter(r => r.status === "Pending");
    }
    if (activeTab === "Approved") {
      return reviews.filter(r => r.status === "Approved");
    }
    // Else changes requested or rejected
    return reviews.filter(r => r.status === "Rejected" || r.status === "Changes Requested");
  };

  const filteredData = getFilteredReviews();

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Weekly Logbook Evaluations</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review, approve, and comment on weekly progress diaries submitted by assigned candidates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 border-b border-border pb-1">
        {["Pending", "Approved", "Rejected / Revisions"].map((tab) => {
          const tabName = tab.startsWith("Rejected") ? "Rejected" : tab;
          const isActive = activeTab === tabName;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tabName)}
              className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
                isActive 
                  ? "text-blue-600 border-blue-600 font-extrabold" 
                  : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Roster Queue */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.map((log) => (
          <Card key={log.id} hoverEffect className="p-5 border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs font-extrabold text-text-primary">{log.internId?.name || "Unknown"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span className="text-[10px] font-black text-blue-600 uppercase">Week {log.week} Report</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                <span className="text-[10px] text-text-secondary">Submitted: {new Date(log.submittedOn).toLocaleDateString()}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-border">
                <div>
                  <span className="text-[9px] font-black text-[#04376C] dark:text-[#1E6FD9] uppercase block mb-1">Work Done</span>
                  <p className="text-text-secondary line-clamp-2">{log.workDone}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-amber-500 uppercase block mb-1">Next Week Plan</span>
                  <p className="text-text-secondary line-clamp-2">{log.nextWeekPlan || "None"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
              {getStatusBadge(log.status)}
              <Button onClick={() => setSelectedReview(log)} size="sm">
                Evaluate Report
              </Button>
            </div>
          </Card>
        ))}

        {filteredData.length === 0 && (
          <Card className="p-10 border border-dashed border-border text-center text-text-secondary italic font-semibold">
            No weekly logbook entries found in this queue category.
          </Card>
        )}
      </div>

      {/* Review evaluation modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 shrink-0">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-black text-text-primary">Review: {selectedReview.internId?.name}</h3>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Week {selectedReview.week} Logbook Submission</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReview(null)} className="p-1 rounded-lg hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs">
                
                {/* Submission Details */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Student Submission Details</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/20 border border-border rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-extrabold text-[#04376C] dark:text-[#1E6FD9] text-[10px] uppercase">Work Done</p>
                      <p className="text-text-primary leading-relaxed mt-0.5">{selectedReview.workDone}</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-amber-500 text-[10px] uppercase">Challenges Faced</p>
                      <p className="text-text-secondary leading-relaxed mt-0.5">{selectedReview.challenges || "None"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-extrabold text-green-500 text-[10px] uppercase">Faculty Feedback</p>
                        <p className="text-text-secondary leading-relaxed mt-0.5">{selectedReview.facultyFeedback || "None yet"}</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-blue-500 text-[10px] uppercase">Goals for Next Week</p>
                        <p className="text-text-secondary leading-relaxed mt-0.5">{selectedReview.nextWeekPlan || "None"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review History */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1">
                    <History className="w-4 h-4" />
                    <span>Grading & Evaluation History</span>
                  </h4>
                  {selectedReview.facultyFeedback ? (
                    <div className="space-y-2">
                        <div className="bg-slate-50 dark:bg-slate-900/10 border border-border rounded-xl p-3 flex items-start space-x-3">
                          <CornerDownRight className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-[10px]">
                              <span className="font-bold text-text-primary">Supervisor</span>
                              <span className="w-1 h-1 bg-border rounded-full"></span>
                              <span className="text-text-secondary">{new Date(selectedReview.updatedAt).toLocaleDateString()}</span>
                              <span className="w-1 h-1 bg-border rounded-full"></span>
                              <Badge variant={selectedReview.status === "Approved" ? "success" : "warning"}>{selectedReview.status}</Badge>
                            </div>
                            <p className="text-text-secondary leading-relaxed font-medium">"{selectedReview.facultyFeedback}"</p>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <p className="italic text-text-secondary">No prior comments or grading rounds logged.</p>
                  )}
                </div>

                {/* Evaluation Action Input */}
                {selectedReview.status === "Pending" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">Add Evaluation Remarks</label>
                    <textarea
                      rows="3"
                      placeholder="Specify validation comments or explain changes requested before approval..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-600"
                    />
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="p-5 border-t border-border bg-slate-50 dark:bg-slate-900/40 flex justify-end space-x-2 shrink-0">
                <Button onClick={() => setSelectedReview(null)} variant="secondary" size="sm">
                  Close Review
                </Button>
                {selectedReview.status === "Pending" && (
                  <>
                    <Button onClick={() => handleAction(selectedReview.id, "Changes Requested")} variant="ghost" className="text-amber-600 hover:bg-amber-50" size="sm">
                      Request Changes
                    </Button>
                    <Button onClick={() => handleAction(selectedReview.id, "Rejected")} variant="ghost" className="text-red-600 hover:bg-red-50" size="sm">
                      Reject
                    </Button>
                    <Button onClick={() => handleAction(selectedReview.id, "Approved")} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Approve Logbook
                    </Button>
                  </>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
