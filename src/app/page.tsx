"use client";

import Link from "next/link";
import { ModeToggle } from "../components/mode-toggle";
import { motion, Variants } from "framer-motion";
import { BlurReveal } from "../components/ui/blur-reveal";
import { TypingAnimation } from "../components/typing-animation";
import {
  MapPin,
  ShieldCheck,
  Clock,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Smartphone,
  Users,
  Fingerprint,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

const videoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function WelcomePage() {
  const [headlinePart1Done, setHeadlinePart1Done] = useState(false);
  const [headlinePart2Done, setHeadlinePart2Done] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/30">
      {/* --- HEADER (Floating Pill Style) --- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-auto w-full max-w-5xl rounded-full border border-border/40 bg-background/80 backdrop-blur-xl shadow-lg px-6 h-14 flex items-center justify-between"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Watmean
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="hover:text-foreground transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Link>
            <ModeToggle />
          </div>
        </motion.header>
      </div>

      <main className="flex-1 pt-32">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden min-h-[50vh] flex items-center px-4 py-30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-12 lg:space-y-80">
              {/* 1. TEXT CONTAINER */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6 text-center max-w-3xl"
              >
                {/* HEADLINE */}
                {/* Note: min-h prevents layout shift while typing */}
                <motion.div
                  variants={itemVariants}
                  className="min-h-[140px] sm:min-h-[160px]"
                >
                  <h1 className="text-5xl lg:text-7xl font-bold text-muted-brand-dark leading-[1.1]">
                    {/* Line 1 */}
                    <TypingAnimation
                      text="Campus Attendance,"
                      delay={500}
                      onComplete={() => setHeadlinePart1Done(true)}
                    />
                    <br />

                    {/* Line 2 (Wait for Line 1) */}
                    <span className="text-brand-primary">
                      {headlinePart1Done && (
                        <TypingAnimation
                          text="Reimagined."
                          onComplete={() => setHeadlinePart2Done(true)}
                        />
                      )}
                    </span>
                  </h1>
                </motion.div>

                {/* PARAGRAPH (Wait for Line 2) */}
                <motion.div variants={itemVariants}>
                  <p className="text-lg text-muted-foreground leading-relaxed mx-auto max-w-2xl min-h-[84px]">
                    {headlinePart2Done && (
                      <TypingAnimation
                        text="The definitive geolocation platform for universities. Automate faculty reporting, validate student presence, and integrate seamlessly with your LMS."
                        delay={200}
                        minSpeed={5}
                        maxSpeed={25}
                      />
                    )}
                  </p>
                </motion.div>
              </motion.div>

              {/* 2. VIDEO CONTAINER (Standard) */}
              <motion.div
                variants={videoVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r"></div>
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-border pointer-events-none">
                  <video
                    className="w-full h-auto object-cover"
                    src="https://res.cloudinary.com/dg5grwcd5/video/upload/v1769858672/7683483-hd_1920_1080_30fps_fltbpn.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-16 md:text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Engineered for the Modern Campus
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                We bridge the gap between physical presence and digital records.
                Secure, reliable, and impossible to spoof.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-10 gap-6"
            >
              {/* 1. Faculty Analytics */}
              <motion.div
                variants={itemVariants}
                className="group rounded-3xl bg-card p-10 shadow-lg border border-border hover:border-border/80 transition-all md:col-span-4"
              >
                <h3 className="text-2xl font-bold text-card-foreground mb-4">
                  Faculty Analytics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant reports exported to CSV/PDF. Identify at-risk students
                  based on attendance trends automatically.
                </p>
              </motion.div>

              {/* 2. Device DNA Fingerprinting (Dark Highlighted Card) */}
              <motion.div
                variants={itemVariants}
                className="group rounded-3xl bg-brand-dark p-8 shadow-xl border border-border relative overflow-hidden md:col-span-6"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-brand-light mb-4">
                    Device DNA Fingerprinting
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Eliminate "buddy punching". We bind the student's identity
                    to their specific hardware ID. One student, one device, one
                    check-in.
                  </p>
                </div>
                {/* Subtle background glow for the dark card */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-primary/10 blur-3xl rounded-full"
                />
              </motion.div>

              {/* 3. Precision Geofencing V2.0 (With Graphic) */}
              <motion.div
                variants={itemVariants}
                className="group relative overflow-hidden rounded-3xl bg-card p-10 shadow-lg border border-border hover:border-gray-600 transition-all md:col-span-6"
              >
                <div className="relative z-10 max-w-md">
                  <h3 className="text-2xl font-bold text-card-foreground mb-4">
                    Precision Geofencing V2.0
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Define virtual classroom boundaries with 3-meter accuracy.
                    Our algorithm accounts for GPS drift and building
                    interference, ensuring students are physically in the seat,
                    not just near the building.
                  </p>
                </div>
                {/* Large Background Graphic */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20"></div>
                    <MapPin className="h-64 w-64 text-brand-primary" />
                  </div>
                </div>
              </motion.div>

              {/* 4. LMS Integration */}
              <motion.div
                variants={itemVariants}
                className=" p-8 hover:border-border transition-all flex flex-col justify-center md:col-span-4"
              >
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    LMS Integration
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Syncs directly with Canvas, Blackboard, and Moodle. No
                    manual gradebook entry required.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-background pt-20 pb-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-primary rounded-lg text-primary-foreground flex items-center justify-center font-bold">
                  G
                </div>
                <span className="text-xl font-bold text-foreground">
                  Watmean
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering universities with smart, secure, and seamless
                attendance solutions.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Sales
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Demo Request
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="font-medium text-foreground mb-6 text-[250px] overflow-hidden">
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Watmean
            </motion.h1>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Watmean Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}