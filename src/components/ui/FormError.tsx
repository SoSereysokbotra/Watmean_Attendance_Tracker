import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 text-sm text-red-500 animate-in fade-in-50 slide-in-from-top-1 mt-1">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
