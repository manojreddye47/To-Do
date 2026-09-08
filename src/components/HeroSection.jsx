import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Award, Zap, Flame, CheckCircle2, CircleDashed, ArrowUpRight, Sparkles } from 'lucide-react';
import hanumanArtwork from '../assets/hanuman_focus_artwork.jpg';

export default function HeroSection({
  totalTasks = 0,
  completedTasks = 0,
  streakCount = 0,
  currentDate,
  hanumanMode = false,
  onOpenBajrangMode
}) {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - completedTasks;

  // Spring animation for smooth percentage count up
  const springValue = useSpring(0, { stiffness: 50, damping: 15 });
  const [displayPercentage, setDisplayPercentage] = useState(0);

  // Parallax motion values for Hanuman artwork
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const artParallaxX = useSpring(useTransform(mouseX, [-200, 200], [-5, 5]), { stiffness: 180, damping: 22 });
  const artParallaxY = useSpring(useTransform(mouseY, [-200, 200], [-5, 5]), { stiffness: 180, damping: 22 });

  const handleMouseMove = (e) => {
    if (!hanumanMode || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    springValue.set(percentage);
  }, [percentage, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayPercentage(Math.round(latest));
    });
  }, [springValue]);

  // Format header date prominently
  const formatDateHeader = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  // SVG Circular Gauge Dimensions
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-6 sm:p-10 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300"
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      {hanumanMode && (
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Typography & Daily Headline */}
        <div className="space-y-3 text-center lg:text-left flex-1">
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border transition-colors ${
              hanumanMode
                ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                : 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
            }`}>
              {hanumanMode ? 'HANUMAN FOCUS PROTOCOL' : 'EXECUTIVE PROTOCOL'}
            </span>
            {streakCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-400/20 animate-pulse text-amber-500 dark:text-amber-400" />
                {streakCount} Day Streak
              </span>
            )}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-400 font-sans"
          >
            TODAY
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm font-bold font-mono tracking-widest text-indigo-600 dark:text-indigo-300/90"
          >
            {formatDateHeader(currentDate)}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed"
          >
            {percentage === 100
              ? '🎉 Outstanding execution! All planned items conquered.'
              : percentage >= 50
              ? 'Your day is moving fast. High momentum sustained.'
              : hanumanMode
              ? 'Strength begins with discipline. Tackle your Top 3 Non-Negotiables.'
              : 'Focus on your Top 3 Non-Negotiables to lock in today\'s win.'}
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            variants={itemVariants}
            className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-900 dark:text-white font-bold">{completedTasks}</span>
              <span className="text-slate-500 dark:text-slate-400">Completed</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <CircleDashed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-900 dark:text-white font-bold">{remainingTasks}</span>
              <span className="text-slate-500 dark:text-slate-400">Remaining</span>
            </div>

            {hanumanMode && onOpenBajrangMode && (
              <button
                onClick={onOpenBajrangMode}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>⚡ Enter Bajrang Mode</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Side: DOMINANT CIRCULAR PROGRESS RING & OPTIONAL HANUMAN FOCUS GUARDIAN */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 shrink-0">
          {/* Subtle Hanuman Artwork Presence with Parallax & Ambient Halo */}
          {hanumanMode && (
            <motion.div
              variants={itemVariants}
              style={{ x: artParallaxX, y: artParallaxY }}
              className="relative flex flex-col items-center group cursor-pointer"
              onClick={onOpenBajrangMode}
              title="Activate ⚡ Bajrang Mode"
            >
              {/* Subtle Breathing Halo */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 -m-2 rounded-3xl bg-amber-500/20 dark:bg-amber-500/25 blur-xl pointer-events-none"
              />

              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-1 ring-amber-400/40 dark:ring-amber-400/30 shadow-lg bg-slate-900 border border-amber-300/40">
                <img
                  src={hanumanArtwork}
                  alt="Lord Hanuman - Focus Guardian"
                  className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-115 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-amber-500/10 pointer-events-none" />
              </div>

              <div className="mt-2 text-center select-none">
                <span className="text-[10px] font-extrabold font-mono tracking-widest text-amber-700 dark:text-amber-300 uppercase block">
                  LORD HANUMAN
                </span>
                <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 block">
                  Strength • Focus
                </span>
              </div>
            </motion.div>
          )}

          {/* Progress Ring */}
        <motion.div
          variants={itemVariants}
          className="relative flex flex-col items-center justify-center shrink-0"
        >
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* Ambient Ring Glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-200 dark:text-slate-800/90"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />

              {/* Animated Progress Gradient Ring */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
                stroke="url(#progressGradient)"
                fill="transparent"
              />

              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
                {displayPercentage}%
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-300/80 font-mono mt-0.5">
                COMPLETE
              </span>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
