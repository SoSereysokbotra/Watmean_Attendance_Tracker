import React, { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : props.type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          className={`w-full pl-10 ${isPassword ? "pr-10" : "pr-4"} py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/15 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all ${className}`}
          {...props}
          type={inputType}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none focus:text-brand-primary transition-colors"
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
