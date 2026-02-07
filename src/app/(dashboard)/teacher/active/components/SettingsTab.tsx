/**
 * Settings tab component
 * Displays location configuration and geofence settings
 */

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";

export function SettingsTab() {
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
            <div className="flex items-center justify-between mt-2">
              <span className="font-medium text-foreground">
                Room A-204 (Block B)
              </span>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Geofence Radius
            </label>
            <div className="flex items-center gap-4 mt-2">
              <Input type="number" defaultValue={50} className="w-24" />
              <span className="text-sm text-muted-foreground">meters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
