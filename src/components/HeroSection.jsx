import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Award, Zap, Flame, CheckCircle2, CircleDashed, ArrowUpRight } from 'lucide-react';

export default function HeroSection({
  totalTasks = 0,
  completedTasks = 0,
  streakCount = 0,
  currentDate
}) {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - completedTasks;

  // Spring animation for smooth percentage count up
  const springValue = useSpring(0, { stiffness: 50, damping: 15 });
  const [displayPercentage, setDisplayPercentage] = useState(0);

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
      className="relative p-6 sm:p-10 bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl shadow-slate-950/50 text-white overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side: Typography & Daily Headline */}
        <div className="space-y-3 text-center md:text-left flex-1">
          <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              EXECUTIVE PROTOCOL
            </span>
            {streakCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-400/20 animate-pulse text-amber-400" />
                {streakCount} Day Streak
              </span>
            )}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 font-sans"
          >
            TODAY
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm font-bold font-mono tracking-widest text-indigo-300/90"
          >
            {formatDateHeader(currentDate)}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed"
          >
            {percentage === 100
              ? '🎉 Outstanding execution! All planned items conquered.'
              : percentage >= 50
              ? 'Your day is moving fast. High momentum sustained.'
              : 'Focus on your Top 3 Non-Negotiables to lock in today\'s win.'}
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            variants={itemVariants}
            className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono"
          >
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-bold">{completedTasks}</span>
              <span className="text-slate-400">Completed</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <CircleDashed className="w-4 h-4 text-indigo-400" />
              <span className="text-white font-bold">{remainingTasks}</span>
              <span className="text-slate-400">Remaining</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: DOMINANT CIRCULAR PROGRESS RING */}
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
                className="text-slate-800/90"
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
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {displayPercentage}%
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300/80 font-mono mt-0.5">
                COMPLETE
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
