import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable, Th, Td } from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Card } from "../../components/ui/Card";
import { 
  X, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Mail,
  Phone,
  Building,
  User,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Home,
  Clock,
  ChevronDown
} from "lucide-react";
import { internDirectory as mockInterns } from "../../mocks/index";

export const InternDirectory = () => {
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Unique filter values
  const countries = [...new Set(interns.map(i => i.country))];
  const departments = [...new Set(interns.map(i => i.department))];
  const statuses = [...new Set(interns.map(i => i.status))];

  // Fetch interns on mount
  React.useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/faculty/interns", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setInterns(data);
        } else {
          console.error("Failed to fetch interns:", data.message);
        }
      } catch (error) {
        console.error("Error fetching interns:", error);
      }
    };
    fetchInterns();
  }, []);

  // Search & Filter Logic
  const filteredInterns = interns
    .filter(intern => {
      const matchesSearch = (intern.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (intern.university || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (intern.projectTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountry === "" || intern.country === selectedCountry;
      const matchesDept = selectedDept === "" || intern.department === selectedDept;
      const matchesStatus = selectedStatus === "" || intern.status === selectedStatus;

      return matchesSearch && matchesCountry && matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (typeof valA === "string") {
        return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 text-foreground pb-12 relative">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Supervised Interns Directory</h1>
        <p className="text-xs text-text-secondary mt-1">
          Review profile details, current progress, accommodations, and emergency details of assigned exchange candidates.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-card grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name, university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#04376C]/10 outline-none text-text-primary"
          />
        </div>

        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-500 font-bold"
          >
            <option value="">Filter by Country</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-500 font-bold"
          >
            <option value="">Filter by Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-blue-500 font-bold"
          >
            <option value="">Filter by Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Interns Table */}
      <Card className="overflow-hidden border border-border shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                <th className="px-6 py-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort("name")}>Name</th>
                <th className="px-6 py-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort("country")}>Country</th>
                <th className="px-6 py-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort("university")}>University</th>
                <th className="px-6 py-4 cursor-pointer hover:text-text-primary" onClick={() => handleSort("department")}>Department</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4 cursor-pointer hover:text-text-primary text-center" onClick={() => handleSort("progress")}>Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInterns.map((intern) => (
                <tr
                  key={intern.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-text-primary">{intern.name}</td>
                  <td className="px-6 py-4 font-semibold text-text-secondary">{intern.country}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{intern.university}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{intern.department}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium max-w-xs truncate">{intern.projectTitle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-extrabold text-[#04376C] dark:text-[#1E6FD9]">{intern.progress}%</span>
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#04376C] dark:bg-[#1E6FD9] h-full" style={{ width: `${intern.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={intern.status.includes("Started") ? "info" : "warning"}>
                      {intern.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button onClick={() => setSelectedStudent(intern)} size="sm" variant="secondary" className="font-bold text-[10px] uppercase">
                      Profile Profile
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredInterns.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 font-bold text-text-secondary italic">
                    No interns found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Profile Drawer */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-xl h-full bg-card border-l border-border flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">IAESTE Candidate</span>
                    <h2 className="text-xl font-black text-text-primary mt-0.5">{selectedStudent.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Snapshot Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-border text-center space-y-1">
                    <span className="text-[9px] text-text-secondary font-black uppercase">Attendance</span>
                    <p className="text-lg font-bold text-text-primary">{selectedStudent.attendance}%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-border text-center space-y-1">
                    <span className="text-[9px] text-text-secondary font-black uppercase">Logbooks</span>
                    <p className="text-lg font-bold text-blue-600">{selectedStudent.logbooksCompleted} Logged</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-border text-center space-y-1">
                    <span className="text-[9px] text-text-secondary font-black uppercase">Tasks Done</span>
                    <p className="text-lg font-bold text-emerald-500">{selectedStudent.tasksCompleted} Tasks</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-border text-center space-y-1">
                    <span className="text-[9px] text-text-secondary font-black uppercase">Reviews Recv</span>
                    <p className="text-lg font-bold text-amber-500">{selectedStudent.reviewsReceived} Reviews</p>
                  </div>
                </div>

                {/* Profile Tabs Section */}
                <div className="space-y-4">
                  
                  {/* General Info */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Personal & University Information</h3>
                    <div className="bg-[#F8FAFC]/50 dark:bg-slate-900/20 border border-border rounded-xl p-4 space-y-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-text-secondary" />
                        <span className="font-semibold text-text-primary">{selectedStudent.university} ({selectedStudent.country})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-text-secondary" />
                        <span className="font-bold text-blue-600">{selectedStudent.department} Department</span>
                      </div>
                    </div>
                  </div>

                  {/* IAESTE Project details */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Internship Program Details</h3>
                    <div className="bg-[#F8FAFC]/50 dark:bg-slate-900/20 border border-border rounded-xl p-4 space-y-3 text-xs">
                      <div>
                        <p className="text-[10px] text-text-secondary font-bold uppercase">Research project</p>
                        <p className="font-extrabold text-text-primary mt-0.5">{selectedStudent.projectTitle}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <p className="text-[10px] text-text-secondary font-bold uppercase">Duration Dates</p>
                          <p className="font-bold text-text-primary mt-0.5">{selectedStudent.arrivalDate} to {selectedStudent.departureDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-secondary font-bold uppercase">Faculty Supervisor</p>
                          <p className="font-bold text-text-primary mt-0.5">{selectedStudent.supervisor}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation details */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Accommodation Details</h3>
                    <div className="bg-[#F8FAFC]/50 dark:bg-slate-900/20 border border-border rounded-xl p-4 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <Home className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-text-primary">{selectedStudent.accommodation.hostelName}</p>
                          <p className="text-[10px] text-text-secondary">Room Number: <span className="font-bold">{selectedStudent.accommodation.roomNo}</span></p>
                        </div>
                      </div>
                      <Badge variant="success">{selectedStudent.accommodation.status}</Badge>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Emergency Contact Details</span>
                    </h3>
                    <div className="bg-red-50/30 border border-red-200/50 rounded-xl p-4 text-xs space-y-1">
                      <p className="font-bold text-text-primary">Name: {selectedStudent.emergencyContact.name} ({selectedStudent.emergencyContact.relation})</p>
                      <p className="text-text-secondary">Hotline Phone: <span className="font-bold text-text-primary">{selectedStudent.emergencyContact.phone}</span></p>
                    </div>
                  </div>

                </div>

              </div>

              <div className="pt-6 border-t border-border">
                <Button onClick={() => setSelectedStudent(null)} className="w-full font-bold text-xs uppercase">
                  Close Student Dossier
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
