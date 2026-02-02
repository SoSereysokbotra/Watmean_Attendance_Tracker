import React from "react";
import { MapPin, CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  rightSideTitle?: React.ReactNode; // Flexible title for right side
  rightSideDescription?: string;
  rightSideFeatures?: string[];
}

export function AuthLayout({
  children,
  rightSideTitle = (
    <>
      Modernize your campus <br />
      <span className="text-muted-foreground">attendance tracking.</span>
    </>
  ),
  rightSideDescription,
  rightSideFeatures = [
    "GPS & Device DNA Verification",
    "Instant Canvas & Moodle Sync",
    "Secure Faculty Reporting",
  ],
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background font-sans text-foreground selection:bg-brand-primary/30">
      {/* --- LEFT SIDE: Form Container --- */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10 bg-background transition-colors duration-300">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden mb-8 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Watmean
          </span>
        </div>

        {/* Page Content */}
        <div className="w-full max-w-md mx-auto space-y-8">{children}</div>

        {/* Copyright Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center lg:text-left lg:px-24">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
            © 2026 WATMEAN INC • ENTERPRISE SECURE
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: Branding (Hidden on Mobile) --- */}
      <div className="hidden lg:flex flex-1 relative bg-brand-dark overflow-hidden flex-col justify-between p-16 text-foreground border-l border-border transition-colors duration-300">
        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xl shadow-brand-primary/20">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-brand-light">
            Watmean
          </span>
        </div>

        {/* Value Prop */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] mb-8 text-brand-light">
            {rightSideTitle}
          </h2>

          {rightSideDescription && (
            <p className="text-lg text-muted-foreground mb-8">
              {rightSideDescription}
            </p>
          )}

          <div className="space-y-5 pt-8 border-t border-border">
            {rightSideFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-brand-light"
              >
                <div className="h-6 w-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                </div>
                <span className="font-medium text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Accent */}
        <div className="relative z-10 flex gap-2">
          <div className="h-1 w-12 rounded-full bg-brand-primary"></div>
          <div className="h-1 w-4 rounded-full bg-white/20"></div>
          <div className="h-1 w-4 rounded-full bg-white/20"></div>
        </div>
      </div>
    </div>
  );
}
