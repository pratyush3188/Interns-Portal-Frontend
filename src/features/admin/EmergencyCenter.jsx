import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { 
  AlertOctagon, Plus, Phone, Building, UserCheck, Clock, CheckCircle, X, Trash2
} from "lucide-react";

export const EmergencyCenter = () => {
  const [contacts, setContacts] = useState([]);
  const [interns, setInterns] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Form states for Contact
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("Common");
  const [targetIntern, setTargetIntern] = useState("");

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [contactRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/emergency", { headers }),
        fetch("http://localhost:5000/api/admin/users", { headers })
      ]);
      
      if (contactRes.ok) setContacts(await contactRes.json());
      if (userRes.ok) {
        const users = await userRes.json();
        setInterns(users.interns || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateContact = async (e) => {
    e.preventDefault();
    if (!title.trim() || !phone.trim()) {
      return toast.error("Please fill in both title and phone number.");
    }
    if (type === "Specific" && !targetIntern) {
      return toast.error("Please select a target intern for Specific contacts.");
    }

    try {
      const payload = {
        name: title,
        title, // sending title as well for backward compatibility if needed
        role: "Emergency Support",
        phone,
        type: type.toLowerCase(),
      };
      if (type === "Specific") payload.targetIntern = targetIntern;

      const res = await fetch("http://localhost:5000/api/admin/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Emergency contact created successfully.");
        fetchData();
        setIsAddingContact(false);
        setTitle("");
        setPhone("");
        setType("Common");
        setTargetIntern("");
      } else {
        toast.error(`Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) { toast.error("Network error."); }
  };

  const handleDeleteContact = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/emergency/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        toast.success("Contact deleted");
        fetchData();
      }
    } catch (err) { toast.error("Network error"); }
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Emergency Support Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Maintain local security hotlines, log emergency incidents, and track active resolution statuses.
          </p>
        </div>

        <Button onClick={() => setIsAddingContact(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
        
        {/* Full Width: Direct Hotlines */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-5 border border-border shadow-card space-y-4">
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4" />
              <span>Global & Specific Emergency Contacts Directory</span>
            </h3>
            
            <div className="space-y-3 divide-y divide-border">
              {contacts.map((item) => (
                <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-text-primary font-bold">{item.name || item.title}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        (item.type || "").toLowerCase() === "common" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.type}
                      </span>
                      {(item.type || "").toLowerCase() === "specific" && item.targetIntern && (
                        <span className="text-[10px] text-text-secondary font-semibold">
                          (Assigned to {item.targetIntern.name})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <a href={`tel:${item.phone.replace(/[\s\/\+]/g, "")}`} className="flex items-center space-x-1 font-bold text-red-600 hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </a>
                    <button onClick={() => handleDeleteContact(item._id)} className="p-1 hover:bg-slate-100 rounded text-red-400 hover:text-red-600" title="Delete Contact">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-6 text-xs text-text-secondary font-bold border-2 border-dashed border-border rounded-xl">
                  No emergency contacts configured.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Contact Logger Modal */}
      <AnimatePresence>
        {isAddingContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingContact(false)}
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
                  <AlertOctagon className="w-5 h-5 text-red-500" />
                  <span>Add Emergency Contact</span>
                </h3>
                <button onClick={() => setIsAddingContact(false)} className="p-1 rounded hover:bg-slate-100 cursor-pointer">
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleCreateContact} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Contact Title / Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. German Embassy Delhi"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-red-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase">Contact Visibility</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                  >
                    <option value="Common">Common (All Interns)</option>
                    <option value="Specific">Specific (Target Intern Only)</option>
                  </select>
                </div>

                {type === "Specific" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-secondary uppercase">Target Intern</label>
                    <select
                      required
                      value={targetIntern}
                      onChange={(e) => setTargetIntern(e.target.value)}
                      className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none font-bold"
                    >
                      <option value="">Select an intern...</option>
                      {interns.map((i) => (
                        <option key={i._id} value={i._id}>{i.name} ({i.email})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                  <Button onClick={() => setIsAddingContact(false)} variant="secondary" size="sm" type="button">Cancel</Button>
                  <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">Save Contact</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
};
export default EmergencyCenter;
