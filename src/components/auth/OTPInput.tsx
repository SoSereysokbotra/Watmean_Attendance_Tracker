"use client";

import React, { useRef } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function OTPInput({ value, onChange }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...value];
    newOtp[index] = val.substring(val.length - 1);
    onChange(newOtp);
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOtp = [...value];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    onChange(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border bg-card text-foreground outline-none transition-all
            ${
              digit
                ? "border-brand-primary ring-2 ring-brand-primary/20"
                : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
            }`}
        />
      ))}
    </div>
  );
}
