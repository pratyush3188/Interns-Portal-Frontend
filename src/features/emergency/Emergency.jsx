import { useState, useEffect } from "react";
import { buddy } from "../../mocks/index";
import { motion } from "framer-motion";
import { Phone, AlertOctagon, HeartPulse, Shield, MessageSquare, Info } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Emergency = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/intern/emergency-contacts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) setContacts(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchContacts();
  }, []);
  const handleDialSim = (name, phone) => {
    toast.success(`Dialing Emergency: ${name} (${phone}). Calling simulated.`);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-start space-x-4">
        <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-500">
            Emergency Support & Response Center
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            If you face a medical crisis, security issue, or legal emergency (passport/visa loss), use the dialers below immediately.
          </p>
        </div>
      </div>

      {/* Emergency Contact Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
          Quick-Dial Emergency Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact, idx) => (
            <motion.div
              key={contact._id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border-2 border-red-500/20 rounded-2xl p-5 shadow-card space-y-4 hover:border-red-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-500">
                  <AlertOctagon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {contact.type} Priority
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-black text-text-primary">{contact.name || contact.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{contact.phone}</p>
                </div>
              </div>

              <button
                onClick={() => handleDialSim(contact.name || contact.title, contact.phone)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-red-600/10"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency Line</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Standard Operating Procedures (SOPs) */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-6">
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Standard Operating Procedures (SOPs)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          
          <div className="space-y-2">
            <h4 className="font-extrabold text-text-primary flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Medical Emergencies</span>
            </h4>
            <p className="text-text-secondary">
              Contact Mahatma Gandhi Hospital ER or visit the JECRC campus medical room (Admin Block Ground Floor). Notify your JECRC Student Buddy immediately so they can escort you.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-text-primary flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Lost Passport or Visa issues</span>
            </h4>
            <p className="text-text-secondary">
              In case of lost passport, immediately file an online Police FIR (First Information Report) via the Jaipur Police Portal. Contact Prof. Rajesh Gupta to coordinate with the German Embassy/Consulate.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-text-primary flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Late Entry/Curfew Protocol</span>
            </h4>
            <p className="text-text-secondary">
              Campus gates curfew is at 10 PM. If you are delayed during travel, submit a Late Permission Ticket in the Accommodation panel or call the warden/buddy to avoid campus lockouts.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-text-primary flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>General Campus Help</span>
            </h4>
            <p className="text-text-secondary">
              For common disputes or general questions, contact JECRC Security or JECRC IAESTE volunteer buddies. Do not share credentials or personal details with local taxi drivers.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
