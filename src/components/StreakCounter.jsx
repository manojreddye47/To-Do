import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakCounter({ streakCount = 0 }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
        streakCount > 0
          ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/20'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
      }`}
      title={`${streakCount} consecutive day streak with all Top 3 priorities completed!`}
    >
      <Flame
        className={`w-4 h-4 ${
          streakCount > 0
            ? 'text-amber-500 fill-amber-500 animate-pulse'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      />
      <span className="font-mono tracking-tight">{streakCount} Day Streak</span>
    </div>
  );
}
