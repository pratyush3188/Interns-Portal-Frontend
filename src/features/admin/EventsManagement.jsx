import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Sparkles, Users, Award, Calendar, Plus, MessageSquare } from "lucide-react";
import { events as initialEvents } from "../../mocks/index";

export const EventsManagement = () => {
  const [eventList, setEventList] = useState(initialEvents);

  const mockAnalytics = [
    { id: "event-1", rsvp: 21, attendance: "92%", feedback: "4.8/5" },
    { id: "event-2", rsvp: 12, attendance: "85%", feedback: "4.5/5" }
  ];

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Events & Excursions Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Publish social gatherings, weekend excursions, and collect participant feedbacks.
          </p>
        </div>

        <Button onClick={() => toast.success("Opening event registration configs...")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Publish Event
        </Button>
      </div>

      {/* Roster of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {eventList.map((item) => {
          const stats = mockAnalytics.find(s => s.id === item.id) || { rsvp: 0, attendance: "100%", feedback: "5/5" };
          return (
            <Card key={item.id} className="overflow-hidden border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
              
              <div className="h-44 relative shrink-0">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                  <p className="text-text-secondary font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Analytical Stats Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-border text-center text-[10px] text-text-secondary">
                  <div>
                    <span>RSVPs</span>
                    <p className="text-text-primary font-black mt-0.5">{stats.rsvp} Signed Up</p>
                  </div>
                  <div>
                    <span>Attendance</span>
                    <p className="text-text-primary font-black mt-0.5">{stats.attendance}</p>
                  </div>
                  <div>
                    <span>Feedback</span>
                    <p className="text-text-primary font-black mt-0.5 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-amber-500 mr-0.5" /> {stats.feedback}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-text-secondary pt-2 border-t border-border">
                  <span>Venue: {item.venue}</span>
                  <span>Organized: {item.organizer}</span>
                </div>
              </div>

            </Card>
          );
        })}
      </div>

    </div>
  );
};
export default EventsManagement;
