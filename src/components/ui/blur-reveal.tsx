"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  blur?: string;
  className?: string;
}

export const BlurReveal = ({
  children,
  duration = 0.8,
  delay = 0,
  blur = "20px",
  className,
  ...props
}: BlurRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blur})` }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1], // easeOutQuad-ish
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
