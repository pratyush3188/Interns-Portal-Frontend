import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Home, SlidersHorizontal, Plus, AlertOctagon } from "lucide-react";
import { accommodations as initialAccommodations } from "../../mocks/index";

export const AccommodationManagement = () => {
  const [accommList, setAccommList] = useState(initialAccommodations);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "success";
      case "Maintenance": return "danger";
      default: return "info";
    }
  };

  const handleToggleStatus = (id) => {
    const updated = accommList.map(item => {
      if (item.id === id) {
        let nextStatus = "Available";
        if (item.status === "Available") nextStatus = "Maintenance";
        else if (item.status === "Maintenance") nextStatus = "Occupied";
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setAccommList(updated);
    toast.success("Room status updated successfully!");
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">Accommodation Management</h1>
          <p className="text-xs text-text-secondary mt-1">
            Track JECRC international hostels allocations, room occupancies, and suite maintenance.
          </p>
        </div>

        <Button onClick={() => toast.success("Simulating room assignment configuration...")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Allocate Room
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-xs font-semibold">
        {accommList.map((item) => (
          <Card key={item.id} hoverEffect className="p-5 border border-border space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary font-black uppercase">Room {item.roomNo}</p>
                  <h4 className="font-bold text-text-primary mt-0.5 truncate max-w-[180px]">{item.hostelName}</h4>
                </div>
              </div>

              <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/20 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary">
              <div>
                <span>Capacity</span>
                <p className="text-text-primary font-black mt-0.5">{item.capacity} Beds</p>
              </div>
              <div>
                <span>Occupants</span>
                <p className="text-text-primary font-black mt-0.5">{item.occupancy} Active</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-[10px] text-text-secondary">
                {item.capacity - item.occupancy} slots available
              </span>

              <button
                onClick={() => handleToggleStatus(item.id)}
                className="text-[10px] font-black text-blue-600 hover:underline flex items-center"
              >
                Toggle Status
              </button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
export default AccommodationManagement;
