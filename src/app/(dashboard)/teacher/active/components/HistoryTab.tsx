import { BarChart3 } from "lucide-react";

export function HistoryTab() {
  return (
    <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-dashed border-border px-4 sm:px-6">
      <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
      <p>Select a date range to view historical logs</p>
    </div>
  );
}
