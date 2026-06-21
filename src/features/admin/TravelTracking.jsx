import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Plane, Plus, Search, CalendarDays } from "lucide-react";
import { travelRecords as initialTravelRecords } from "../../mocks/index";

export const TravelTracking = () => {
  const [records, setRecords] = useState(initialTravelRecords);

  const handleTogglePickup = (id) => {
    const updated = records.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          pickupStatus: rec.pickupStatus === "Completed" ? "Pending" : "Completed"
        };
      }
      return rec;
    });
    setRecords(updated);
    toast.success("Arrival pickup status toggled!");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Travel & Arrival Tracking</h1>
          <p className="text-xs text-text-secondary mt-1">
            Monitor incoming flight detail coordinates, airport cab dispatch statuses, and departure flight dates.
          </p>
        </div>

        <Button onClick={() => toast.success("Opening flight coordinate configuration...")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Log Flight Record
        </Button>
      </div>

      {/* Grid of travel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
        {records.map((rec) => (
          <Card key={rec.id} hoverEffect className="p-5 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{rec.student}</h4>
                    <p className="text-[10px] text-text-secondary font-black uppercase">Flight: {rec.flightNo}</p>
                  </div>
                </div>
                <Badge variant={rec.pickupStatus === "Completed" ? "success" : "warning"}>
                  {rec.pickupStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary">
                <div>
                  <span className="flex items-center space-x-1">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                    <span>Arrival Date</span>
                  </span>
                  <p className="text-text-primary font-black mt-1">{rec.arrivalDate} • {rec.arrivalTime}</p>
                </div>
                <div>
                  <span className="flex items-center space-x-1">
                    <Plane className="w-3.5 h-3.5 text-indigo-500 rotate-45" />
                    <span>Departure Flight</span>
                  </span>
                  <p className="text-text-primary font-black mt-1">{rec.returnFlight} ({rec.departureDate})</p>
                </div>
              </div>

              <div className="bg-slate-100/50 p-2.5 rounded-lg border border-border text-[10px] text-text-secondary font-medium">
                Cab Transport Assigned: <span className="font-bold text-text-primary">{rec.transportAssigned || "Not Assigned"}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => handleTogglePickup(rec.id)}
                className="text-[10px] font-black text-blue-600 hover:underline flex items-center"
              >
                Toggle Pickup Status
              </button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
export default TravelTracking;
