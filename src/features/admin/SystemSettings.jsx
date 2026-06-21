import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { useThemeStore } from "../../store/useThemeStore";
import { useLangStore } from "../../store/useLangStore";
import { 
  Settings, 
  Sun, 
  Moon, 
  Globe, 
  Calendar, 
  ShieldCheck,
  Check
} from "lucide-react";

export const SystemSettings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLangStore();

  const [semDates, setSemDates] = useState("2026-06-01 to 2026-08-31");
  const [cycle, setCycle] = useState("Summer 2026 Exchange");

  const languagesList = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
  ];

  const handleSaveConfigs = (e) => {
    e.preventDefault();
    toast.success("Platform exchange configurations saved successfully!");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Global Portal Configurations</h1>
        <p className="text-xs text-text-secondary mt-1">
          Adjust portal dark/light modes, default language selectors, academic semesters, and calendar durations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-semibold">
        
        {/* Theme and Language Cards */}
        <div className="space-y-6">
          
          {/* Theme & Display Options */}
          <Card className="p-5 border border-border shadow-card space-y-4">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
              {theme === "light" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
              <span>Theme & Interface Settings</span>
            </h3>
            <p className="text-text-secondary leading-relaxed font-semibold">
              Toggle the system-wide visual colors between responsive light and dark glassmorphic styling modes.
            </p>
            <div className="pt-2">
              <Button onClick={toggleTheme} className="bg-[#04376C] hover:bg-[#0A4D8C] text-white font-bold text-xs uppercase flex items-center">
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4 mr-1.5" /> Toggle Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 mr-1.5" /> Toggle Light Mode
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Language Selection */}
          <Card className="p-5 border border-border shadow-card space-y-4">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Language Configurations</span>
            </h3>
            <p className="text-text-secondary leading-relaxed font-semibold">
              Select the active localization translator script for standard text and form labels.
            </p>
            
            <div className="grid grid-cols-2 gap-2 max-w-sm pt-2">
              {languagesList.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      toast.success(`Language switched to: ${lang.name}`);
                    }}
                    className={`flex items-center justify-between px-3 py-2 border rounded-xl font-bold transition-all text-left cursor-pointer ${
                      isSelected 
                        ? "border-[#04376C] bg-slate-50 text-text-primary" 
                        : "border-border text-text-secondary hover:bg-slate-50"
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Academic Configs Form */}
        <div className="space-y-6">
          <Card className="p-5 border border-border shadow-card space-y-4">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Exchange Cycle Configurations</span>
            </h3>

            <form onSubmit={handleSaveConfigs} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Active Exchange Cycle Title</label>
                <input
                  type="text"
                  required
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-indigo-600 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-text-secondary uppercase">Academic Semester Dates</label>
                <input
                  type="text"
                  required
                  value={semDates}
                  onChange={(e) => setSemDates(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-slate-800/50 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-indigo-600 font-bold"
                />
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <Button type="submit" className="bg-[#04376C] text-white font-bold text-xs uppercase flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5" /> Save Platform Configs
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>

    </div>
  );
};
export default SystemSettings;
