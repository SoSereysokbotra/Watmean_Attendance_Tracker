"use client";

import { useEffect, useState, useRef } from "react";

interface TypingAnimationProps {
  text: string;
  className?: string;
  delay?: number;
  minSpeed?: number; // Minimum ms per character (faster = lower number)
  maxSpeed?: number; // Maximum ms per character
  onComplete?: () => void;
}

export function TypingAnimation({
  text,
  className = "",
  delay = 0,
  minSpeed = 30, // Default: standard human speed
  maxSpeed = 90, // Default: standard human speed
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  const isCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started || isCompleteRef.current) return;

    let currentIndex = 0;
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;

        // Use the custom speed props here
        const randomSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        setTimeout(typeNextChar, randomSpeed);
      } else {
        isCompleteRef.current = true;
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    typeNextChar();
  }, [started, text, minSpeed, maxSpeed]); // Added speed props to dependencies

  return (
    <span className={className}>
      {displayedText}
      {started && !isCompleteRef.current && (
        <span className="animate-pulse ml-0.5 inline-block h-[1em] w-[2px] align-middle bg-primary" />
      )}
    </span>
  );
}
