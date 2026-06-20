import { useState } from "react";
import { internProfile } from "../../mocks/index";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, BookOpen, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const MyInternship = () => {
  // Logbook local states
  const [logs, setLogs] = useState([
    {
      week: 2,
      workDone: "Configured ESP32 and calibrated the turbidity sensors under various light levels. Structured SQL database tables for reading logs.",
      challenges: "Intermittent WiFi connectivity in the lab causing data packet loss.",
      learnings: "Learned standard calibration methodologies for water sensors and Python database scripts.",
      goals: "Establish a smooth wireless stream to the dashboard prototype.",
      date: "2026-06-12",
    },
    {
      week: 1,
      workDone: "Orientation, completed literature review on recent water quality systems. Set up the development workspace.",
      challenges: "Getting adjusted to hot weather in Jaipur and local transport systems.",
      learnings: "Acquired a good understanding of India's UPI payments and campus layouts.",
      goals: "Complete literature report and set up IoT hardware sensors.",
      date: "2026-06-05",
    }
  ]);

  const [weekInput, setWeekInput] = useState(3);
  const [workDone, setWorkDone] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");
  const [goals, setGoals] = useState("");

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!workDone || !learnings || !goals) {
      toast.error("Please fill in Work Done, Learnings, and Goals fields.");
      return;
    }

    const newLog = {
      week: Number(weekInput),
      workDone,
      challenges: challenges || "None",
      learnings,
      goals,
      date: new Date().toISOString().split("T")[0],
    };

    setLogs([newLog, ...logs]);
    toast.success(`Weekly Logbook for Week ${weekInput} submitted successfully!`);
    setWeekInput(weekInput + 1);
    setWorkDone("");
    setChallenges("");
    setLearnings("");
    setGoals("");
  };

  // Timeline Milestones
  const milestones = [
    { name: "Arrival & Campus Check-in", date: "June 01, 2026", status: "completed" },
    { name: "Orientation & Lab Allotment", date: "June 03, 2026", status: "completed" },
    { name: "Project Start & Literature Submission", date: "June 08, 2026", status: "completed" },
    { name: "Midterm Review Evaluation", date: "July 12, 2026", status: "active" },
    { name: "Final Review Defense", date: "August 20, 2026", status: "upcoming" },
    { name: "Project Completion & Certificate", date: "August 24, 2026", status: "upcoming" }
  ];

  return (
    <div className="space-y-6 text-foreground">
      <Toaster position="top-right" />
      
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Project Profile */}
        <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-xs font-bold text-[#04376C] dark:text-[#1E6FD9] uppercase tracking-wider">
            Research Internship Project
          </h2>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary leading-snug">
            {internProfile.projectTitle}
          </h1>
          <div className="h-px bg-border my-2"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3 text-text-secondary">
              <BookOpen className="w-4 h-4 text-[#04376C] dark:text-[#1E6FD9]" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold">Department</p>
                <p className="font-semibold text-text-primary">{internProfile.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-secondary">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold">Supervisor Faculty</p>
                <p className="font-semibold text-text-primary">{internProfile.supervisor}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-secondary">
              <Calendar className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold">Duration Dates</p>
                <p className="font-semibold text-text-primary">
                  {internProfile.startDate} to {internProfile.endDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-text-secondary">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-[10px] text-text-secondary uppercase font-bold">Host University</p>
                <p className="font-semibold text-text-primary">JECRC University, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stepper Timeline */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
            Exchange Timeline
          </h3>
          <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-5">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <span className={`absolute -left-[31px] top-1.5 w-[11px] h-[11px] rounded-full border-2 bg-card ${
                  milestone.status === "completed"
                    ? "border-green-500 bg-green-500"
                    : milestone.status === "active"
                    ? "border-[#1E6FD9] bg-[#1E6FD9] animate-ping"
                    : "border-slate-300 dark:border-slate-800"
                }`}></span>
                {/* Visual Dot Overlay for active pulse */}
                {milestone.status === "active" && (
                  <span className="absolute -left-[31px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#1E6FD9] bg-[#1E6FD9]"></span>
                )}
                
                <div>
                  <h4 className={`text-xs font-bold ${
                    milestone.status === "completed"
                      ? "text-text-secondary line-through"
                      : milestone.status === "active"
                      ? "text-[#1E6FD9]"
                      : "text-text-primary"
                  }`}>
                    {milestone.name}
                  </h4>
                  <span className="text-[9px] text-text-secondary">{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Logbook Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly submission form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
            Submit Logbook Entry
          </h3>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Week Number</label>
              <input
                type="number"
                min="1"
                max="12"
                value={weekInput}
                onChange={(e) => setWeekInput(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Work Done</label>
              <textarea
                rows="2"
                value={workDone}
                onChange={(e) => setWorkDone(e.target.value)}
                placeholder="What tasks or research steps did you complete?"
                className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Challenges Faced (Optional)</label>
              <textarea
                rows="2"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="WiFi issues, hardware delays, etc."
                className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Key Learnings</label>
              <textarea
                rows="2"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="New technical libraries, concepts or cultural learnings..."
                className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Goals for Next Week</label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Conduct ESP32 packet transmission test"
                className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-[#04376C] dark:focus:border-[#1E6FD9]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#04376C] dark:bg-[#1E6FD9] text-white font-bold py-2 rounded-xl text-xs hover:opacity-90 transition-opacity"
            >
              Submit Report
            </button>
          </form>
        </div>

        {/* Log History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Weekly Logbook History
          </h3>
          <div className="space-y-4">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.week}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3 relative hover-lift"
                >
                  <div className="flex justify-between items-center bg-[#F5F7FA] dark:bg-slate-800/40 px-3 py-1.5 rounded-xl border border-border shrink-0">
                    <span className="text-xs font-black text-text-primary">
                      WEEK {log.week} REPORT
                    </span>
                    <span className="text-[10px] text-text-secondary font-medium">
                      Submitted: {log.date}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-[#04376C] dark:text-[#1E6FD9]">Work Done</p>
                      <p className="text-text-secondary leading-relaxed">{log.workDone}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-amber-500">Challenges</p>
                      <p className="text-text-secondary leading-relaxed">{log.challenges}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-green-500">Key Learnings</p>
                      <p className="text-text-secondary leading-relaxed">{log.learnings}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-blue-500">Next Week's Goals</p>
                      <p className="text-text-secondary leading-relaxed">{log.goals}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
};
