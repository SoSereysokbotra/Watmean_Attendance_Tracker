import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";

import { useState } from "react";

interface SettingsTabProps {
  session: {
    id: string;
    radius: number;
    room: string;
  };
  onUpdate: (data: Partial<{ radius: number; room: string }>) => void;
}

export function SettingsTab({ session, onUpdate }: SettingsTabProps) {
  const [radius, setRadius] = useState(session.radius || 50);
  const [room, setRoom] = useState(session.room || "Unknown Room");
  const [isEditingRoom, setIsEditingRoom] = useState(false);

  const handleUpdateRadius = () => {
    onUpdate({ radius });
  };

  const handleUpdateRoom = () => {
    onUpdate({ room });
    setIsEditingRoom(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {/* Location Settings */}
      <div className="bg-card p-6 rounded-2xl border border-border space-y-6 lg:col-span-2">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin size={20} className="text-brand-primary" /> Location
            Configuration
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage geofencing and classroom targets.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-xl border border-border">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              Target Classroom
            </label>
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
              {isEditingRoom ? (
                <div className="flex w-full flex-col sm:flex-row gap-2">
                  <Input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="h-8 flex-1"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateRoom}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingRoom(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="font-medium text-foreground break-all">
                    {room}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingRoom(true)}
                  >
                    Change
                  </Button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Geofence Radius
            </label>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <Input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                onBlur={handleUpdateRadius}
                className="w-full sm:w-24"
              />
              <span className="text-sm text-muted-foreground">meters</span>
              <Button size="sm" variant="ghost" onClick={handleUpdateRadius}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
