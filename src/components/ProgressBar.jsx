import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Award, Zap, Flame, CheckCircle2, CircleDashed } from 'lucide-react';

export default function ProgressBar({ totalTasks = 0, completedTasks = 0, streakCount = 0 }) {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remaining = totalTasks - completedTasks;

  // Animated counter spring
  const springValue = useSpring(0, { stiffness: 60, damping: 15 });
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    springValue.set(percentage);
  }, [percentage, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayCount(Math.round(latest));
    });
  }, [springValue]);

  const getMotivationMessage = () => {
    if (totalTasks === 0) return "No tasks scheduled for this day yet.";
    if (percentage === 100) return "Masterclass performance! Every priority conquered. 🎉";
    if (percentage >= 75) return "Incredible momentum! Almost across the finish line.";
    if (percentage >= 50) return "Over halfway there. Stay locked in!";
    if (percentage > 0) return "Off to a strong start. Keep building momentum.";
    return "Ready to execute? Start by tackling your Top 3.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden group"
    >
      {/* Ambient Radial Background Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        {/* Left Side: Stats & Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              YOUR DAY ARCHITECTURE
            </span>
            {streakCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                <Flame className="w-3.5 h-3.5 fill-amber-400/20" /> {streakCount} Day Streak
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{getMotivationMessage()}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200/80 font-mono pt-0.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {completedTasks} Completed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CircleDashed className="w-3.5 h-3.5 text-indigo-300" /> {remaining} Remaining
            </span>
          </div>
        </div>

        {/* Right Side: Animated Big Percentage */}
        <div className="flex items-baseline gap-1 shrink-0 self-end sm:self-center">
          <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-emerald-300">
            {displayCount}%
          </span>
          <span className="text-xs font-bold font-mono text-indigo-300 uppercase">Complete</span>
        </div>
      </div>

      {/* Animated Progress Bar Track */}
      <div className="mt-4 w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative z-10">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${
            percentage === 100
              ? 'from-emerald-500 via-teal-400 to-emerald-300'
              : 'from-indigo-500 via-indigo-400 to-emerald-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
