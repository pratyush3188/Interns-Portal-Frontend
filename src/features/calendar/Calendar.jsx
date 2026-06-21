import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { calendarEvents } from "../../mocks/index";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Map, Sparkles, AlertTriangle, Users } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export const Calendar = () => {
  const [eventsList, setEventsList] = useState(calendarEvents);

  const handleDateClick = (arg) => {
    toast(`Clicked date: ${arg.dateStr}. Add Event form simulated.`);
  };

  const handleEventClick = (info) => {
    toast.success(`Event: ${info.event.title}`);
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-text-primary">Internship Schedule</h1>
        <p className="text-xs text-text-secondary mt-1">
          Stay updated on upcoming excursions, project deadlines, holidays, and campus meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* FullCalendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-card"
        >
          <div className="calendar-container text-xs text-text-primary">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={eventsList}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              height="auto"
            />
          </div>
        </motion.div>

        {/* Categories & Legends */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-card"
          >
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
              Schedule Legends
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className="font-medium text-text-secondary">Arrivals & Seminars</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0"></span>
                <span className="font-medium text-text-secondary">Project Deadlines</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-green-500 shrink-0"></span>
                <span className="font-medium text-text-secondary">Weekend Excursions</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className="font-medium text-text-secondary">Cultural Gatherings</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 shrink-0"></span>
                <span className="font-medium text-text-secondary">National Holidays</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-card"
          >
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
              Next Highlight Event
            </h3>
            <div className="border border-border rounded-xl p-4 bg-slate-50 dark:bg-slate-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] bg-red-100 dark:bg-red-950/20 text-red-600 font-black uppercase px-2 py-0.5 rounded-md">
                  Due Soon
                </span>
                <span className="text-[9px] text-text-secondary font-semibold">June 20</span>
              </div>
              <h4 className="text-xs font-bold text-text-primary">
                IoT Node Calibration Report
              </h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Submit raw calibration datasets and curves to Dr. Alok Kumar via the Portal.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
