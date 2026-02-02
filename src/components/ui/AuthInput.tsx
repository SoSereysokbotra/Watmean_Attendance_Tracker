import React from "react";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  rightElement?: React.ReactNode; // For "Forgot Password" link
  helperText?: React.ReactNode;
}

export function AuthInput({
  label,
  icon: Icon,
  rightElement,
  helperText,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative group">
        <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
        <input
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all ${className}`}
          {...props}
        />
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
