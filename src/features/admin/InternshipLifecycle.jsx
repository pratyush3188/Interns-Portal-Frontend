import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  Milestone, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { internDirectory } from "../../mocks/index";

const STAGES = [
  "Application Received",
  "Approved",
  "Arrival",
  "Internship Started",
  "Mid-Term Review",
  "Final Review",
  "Completed",
  "Alumni"
];

export const InternshipLifecycle = () => {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          const dbInterns = data.interns.map(i => ({ ...i, id: i._id, status: i.status || "Application Received" }));
          setInterns(dbInterns);
          if (dbInterns.length > 0) {
            setSelectedIntern(dbInterns[0]);
          }
        }
      } catch (err) {
        toast.error("Failed to fetch lifecycle data");
      }
    };
    fetchUsers();
  }, []);

  const handleStageChange = (direction) => {
    const currentIndex = STAGES.indexOf(selectedIntern.status);
    let nextIndex = currentIndex;

    if (direction === "forward" && currentIndex < STAGES.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === "backward" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex === currentIndex) return;

    const nextStage = STAGES[nextIndex];
    const updatedInterns = interns.map(i => {
      if (i.id === selectedIntern.id) {
        return { ...i, status: nextStage };
      }
      return i;
    });

    setInterns(updatedInterns);
    const updatedSelected = { ...selectedIntern, status: nextStage };
    setSelectedIntern(updatedSelected);
    toast.success(`Intern status updated to: ${nextStage}`);
  };

  const handleSelectIntern = (id) => {
    const student = interns.find(i => i.id === id);
    setSelectedIntern(student);
  };

  const currentStageIndex = selectedIntern ? STAGES.indexOf(selectedIntern.status) : 0;

  if (!selectedIntern) {
    return (
      <div className="space-y-6 text-foreground pb-12">
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Internship Lifecycle Management</h1>
        <div className="text-text-secondary italic">No interns registered yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Internship Lifecycle Management</h1>
        <p className="text-xs text-text-secondary mt-1">
          Promote or revert interns through the 8 stages of the exchange program sequence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Left Side: Student Selection list */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-card space-y-4">
          <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Select Candidate</h3>
          <div className="space-y-2 divide-y divide-border">
            {interns.map((stud) => (
              <button
                key={stud.id}
                onClick={() => handleSelectIntern(stud.id)}
                className={`w-full flex items-center justify-between p-3 first:pt-0 hover:bg-slate-50 transition-colors text-left rounded-xl cursor-pointer ${
                  selectedIntern.id === stud.id ? "bg-slate-100/70" : ""
                }`}
              >
                <div>
                  <p className="font-bold text-text-primary">{stud.name}</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">{stud.department}</p>
                </div>
                <Badge variant={stud.status.includes("Started") ? "info" : "warning"}>
                  {stud.status}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Stepper & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stepper Visualization */}
          <Card className="p-6 border border-border shadow-card space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                <div>
                  <h4 className="font-bold text-text-primary">Lifecycle Tracking: {selectedIntern.name}</h4>
                  <p className="text-[10px] text-text-secondary font-semibold uppercase">{selectedIntern.university}</p>
                </div>
              </div>

              {/* Stage Controls */}
              <div className="flex space-x-1">
                <Button 
                  onClick={() => handleStageChange("backward")} 
                  disabled={currentStageIndex === 0} 
                  variant="secondary" 
                  size="sm" 
                  className="font-bold text-[10px] uppercase flex items-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Revert
                </Button>
                <Button 
                  onClick={() => handleStageChange("forward")} 
                  disabled={currentStageIndex === STAGES.length - 1} 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase flex items-center"
                >
                  Promote <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Stepper Node Tree */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage} className={`flex flex-col items-center p-3 border rounded-2xl relative transition-all ${
                    isCurrent 
                      ? "border-indigo-600 bg-indigo-50/20 shadow-sm" 
                      : isPassed 
                      ? "border-emerald-500 bg-emerald-50/10" 
                      : "border-border opacity-60"
                  }`}>
                    {/* Circle Node Number */}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[11px] mb-2 ${
                      isCurrent 
                        ? "bg-indigo-600 text-white" 
                        : isPassed 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className={`font-bold text-center text-[10px] leading-tight ${
                      isCurrent ? "text-indigo-600" : isPassed ? "text-emerald-600" : "text-text-secondary"
                    }`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Stepper Guidelines */}
          <Card className="p-6 border border-border shadow-card space-y-4">
            <h4 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
              <Milestone className="w-4 h-4 text-indigo-500" />
              <span>Program Phase Guidelines</span>
            </h4>
            <div className="space-y-3 leading-relaxed text-text-secondary">
              <p>
                1. <strong>Arrival & Welcome</strong>: When the student lands in Jaipur, coordinate with transport for immediate pickup. Mark as <em>Arrival</em>.
              </p>
              <p>
                2. <strong>Mid-Term Evaluation</strong>: Completed after Week 6 checkin. Check the student's logbooks before prompting to <em>Mid-Term Review</em>.
              </p>
              <p>
                3. <strong>Program Completed</strong>: Final report uploaded and supervisor score sheets validated. Prompt to <em>Completed</em> to release certificates.
              </p>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
