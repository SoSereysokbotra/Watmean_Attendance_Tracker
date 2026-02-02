import { TriangleAlert } from "lucide-react";

interface ErrorAlertProps {
  message?: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 flex items-start gap-3 shadow-sm mb-4">
      <TriangleAlert className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm font-medium leading-relaxed">{message}</div>
    </div>
  );
};
