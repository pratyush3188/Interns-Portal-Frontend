import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Key, 
  UserX, 
  UserCheck, 
  X,
  Mail,
  Building,
  Globe
} from "lucide-react";
import { internDirectory, facultyUsers, adminUsers } from "../../mocks/index";

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("interns"); // "interns", "faculty", "admins"
  
  // Data lists with state
  const [interns, setInterns] = useState(internDirectory);
  const [faculty, setFaculty] = useState(facultyUsers);
  const [admins, setAdmins] = useState(adminUsers);

  // Modal control states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);

  // Form states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDept, setUserDept] = useState("Computer Science & Engineering");
  const [userCountry, setUserCountry] = useState("Germany");
  const [userUni, setUserUni] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      toast.error("Please fill in Name and Email fields.");
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userName,
      email: userEmail,
      role: activeTab === "interns" ? "intern" : activeTab === "faculty" ? "faculty" : "admin",
      department: userDept,
      country: userCountry,
      university: userUni || "JECRC University",
      status: "Application Received",
      progress: 0,
      attendance: 100,
      logbooksCompleted: 0,
      tasksCompleted: 0,
      reviewsReceived: 0,
      emergencyContact: { name: "Guardian", relation: "Father", phone: "+91 9988776655" },
      accommodation: { hostelName: "Pending Allocation", roomNo: "-", status: "Pending" }
    };

    if (activeTab === "interns") {
      setInterns([newUser, ...interns]);
    } else if (activeTab === "faculty") {
      setFaculty([
        { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email, 
          role: "faculty", 
          department: newUser.department, 
          designation: "Assistant Professor", 
          assignedInternsCount: 0 
        }, 
        ...faculty
      ]);
    } else {
      setAdmins([
        { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email, 
          role: "admin", 
          department: "IRC", 
          designation: "Coordinator" 
        }, 
        ...admins
      ]);
    }

    setIsAddingUser(false);
    setUserName("");
    setUserEmail("");
    setUserUni("");
    toast.success("User account registered successfully!");
  };

  const handleSuspend = (id) => {
    if (activeTab === "interns") {
      setInterns(interns.map(i => i.id === id ? { ...i, status: i.status === "Suspended" ? "Internship Started" : "Suspended" } : i));
    }
    toast.success("User account suspension status toggled!");
  };

  const handleDelete = (id) => {
    if (activeTab === "interns") setInterns(interns.filter(i => i.id !== id));
    if (activeTab === "faculty") setFaculty(faculty.filter(f => f.id !== id));
    if (activeTab === "admins") setAdmins(admins.filter(a => a.id !== id));
    toast.success("User account deleted successfully!");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setSelectedUserForPassword(null);
    toast.success("Password reset link sent to registered email address.");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">System User Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain logins, add supervisor departments, assign roles, and toggle credentials constraints.
          </p>
        </div>

        <Button onClick={() => setIsAddingUser(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Register New Account
        </Button>
      </div>

      {/* Segment Tabs */}
      <div className="flex space-x-1.5 border-b border-border pb-1">
        {["interns", "faculty", "admins"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2 uppercase tracking-wide cursor-pointer ${
              activeTab === tab 
                ? "text-emerald-600 border-emerald-600 font-extrabold" 
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabular Lists */}
      <Card className="overflow-hidden border border-border shadow-card text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border text-text-secondary uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                {activeTab === "interns" ? (
                  <>
                    <th className="px-6 py-4">University</th>
                    <th className="px-6 py-4 text-center">Progress</th>
                    <th className="px-6 py-4">Status</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Designation</th>
                  </>
                )}
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeTab === "interns" && interns.map((stud) => (
                <tr key={stud.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-text-primary">{stud.name}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{stud.email}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{stud.university}</td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">{stud.progress}%</td>
                  <td className="px-6 py-4">
                    <Badge variant={stud.status === "Suspended" ? "danger" : stud.status.includes("Started") ? "info" : "warning"}>
                      {stud.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-1">
                    <button onClick={() => setSelectedUserForPassword(stud)} className="p-1.5 rounded hover:bg-slate-100 text-blue-600 cursor-pointer" title="Reset password"><Key className="w-4 h-4" /></button>
                    <button onClick={() => handleSuspend(stud.id)} className="p-1.5 rounded hover:bg-slate-100 text-amber-500 cursor-pointer" title="Suspend"><UserX className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(stud.id)} className="p-1.5 rounded hover:bg-slate-100 text-red-500 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}

              {activeTab === "faculty" && faculty.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-text-primary">{fac.name}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{fac.email}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{fac.department}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{fac.designation}</td>
                  <td className="px-6 py-4 flex justify-center space-x-1">
                    <button onClick={() => setSelectedUserForPassword(fac)} className="p-1.5 rounded hover:bg-slate-100 text-blue-600 cursor-pointer" title="Reset password"><Key className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(fac.id)} className="p-1.5 rounded hover:bg-slate-100 text-red-500 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}

              {activeTab === "admins" && admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-text-primary">{adm.name}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{adm.email}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{adm.department}</td>
                  <td className="px-6 py-4 text-text-secondary font-medium">{adm.designation}</td>
                  <td className="px-6 py-4 flex justify-center space-x-1">
                    <button onClick={() => setSelectedUserForPassword(adm)} className="p-1.5 rounded hover:bg-slate-100 text-blue-600 cursor-pointer" title="Reset password"><Key className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(adm.id)} className="p-1.5 rounded hover:bg-slate-100 text-red-500 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Creation Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingUser(false)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary">Add System Account</h3>
                <button onClick={() => setIsAddingUser(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Jean-Pierre"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                {activeTab === "interns" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-text-secondary uppercase">Home Country</label>
                        <input
                          type="text"
                          required
                          value={userCountry}
                          onChange={(e) => setUserCountry(e.target.value)}
                          placeholder="France"
                          className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-text-secondary uppercase">Department</label>
                        <select
                          value={userDept}
                          onChange={(e) => setUserDept(e.target.value)}
                          className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                        >
                          <option value="Computer Science & Engineering">CSE</option>
                          <option value="AI & ML">AI & ML</option>
                          <option value="Mechanical">Mechanical</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-secondary uppercase">Home University</label>
                      <input
                        type="text"
                        required
                        value={userUni}
                        onChange={(e) => setUserUni(e.target.value)}
                        placeholder="École Polytechnique"
                        className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Department</label>
                    <select
                      value={userDept}
                      onChange={(e) => setUserDept(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Eng</option>
                      <option value="AI & ML">AI & ML Research</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                      <option value="International Relations Cell">International Cell</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsAddingUser(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Register User</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {selectedUserForPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserForPassword(null)}
              className="absolute inset-0 bg-slate-900 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-sm font-black text-text-primary">Reset Password</h3>
                <button onClick={() => setSelectedUserForPassword(null)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-text-secondary">
                  Trigger an automated password reset recovery email link for <span className="font-extrabold text-text-primary">{selectedUserForPassword.name}</span> ({selectedUserForPassword.email})?
                </p>
                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setSelectedUserForPassword(null)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Send Recovery Link</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
