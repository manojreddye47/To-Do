import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Sparkles, Calendar, Zap, CheckCircle2 } from 'lucide-react';

export default function Top3ContributionGraph({ allTasks = [], currentDate }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const formatISO = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date(currentDate || new Date());
  const dateMap = {};

  allTasks.forEach((t) => {
    if (t.category === 'top3' && t.completed && t.date) {
      dateMap[t.date] = (dateMap[t.date] || 0) + 1;
    }
  });

  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (52 * 7 - 1));

  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks = [];
  let curr = new Date(startDate);
  let totalTop3CompletedYear = 0;
  let activeDaysCount = 0;

  for (let w = 0; w < 52; w++) {
    const daysInWeek = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = formatISO(curr);
      const count = Math.min(dateMap[dateStr] || 0, 3);
      if (count > 0) {
        totalTop3CompletedYear += count;
        activeDaysCount += 1;
      }

      daysInWeek.push({
        date: dateStr,
        count,
        dateObj: new Date(curr)
      });

      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(daysInWeek);
  }

  let maxStreak = 0;
  let tempStreak = 0;
  let currentStreak = 0;

  let checkDate = new Date(startDate);
  while (checkDate <= today) {
    const dateStr = formatISO(checkDate);
    const count = dateMap[dateStr] || 0;
    if (count >= 3) {
      tempStreak += 1;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  let currStreakCheck = new Date(today);
  while (true) {
    const dateStr = formatISO(currStreakCheck);
    const count = dateMap[dateStr] || 0;
    if (count >= 3) {
      currentStreak += 1;
      currStreakCheck.setDate(currStreakCheck.getDate() - 1);
    } else {
      break;
    }
  }

  // Theme-aware color scale for Light & Dark modes
  const getCellClasses = (count) => {
    switch (count) {
      case 1:
        return 'bg-amber-200 border-amber-300 dark:bg-[#0e4429] dark:border-[#0e4429] text-amber-900 dark:text-emerald-300';
      case 2:
        return 'bg-emerald-400 border-emerald-500 dark:bg-[#006d32] dark:border-[#006d32] text-white dark:text-emerald-200';
      case 3:
        return 'bg-emerald-600 border-emerald-700 dark:bg-[#39d353] dark:border-[#39d353] text-white dark:text-slate-950 shadow-xs shadow-emerald-500/30';
      default:
        return 'bg-amber-100/40 border-amber-200/50 dark:bg-[#161b22] dark:border-[#30363d]/60 text-stone-400 dark:text-slate-600';
    }
  };

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wIdx) => {
    const firstDayOfWeek = week[0].dateObj;
    const month = firstDayOfWeek.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        name: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
        col: wIdx
      });
      lastMonth = month;
    }
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Elevated Metric Cards */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 pb-5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300/40">
            <Trophy className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black font-mono tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                CONSISTENCY ENGINE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white font-sans tracking-tight">
              ACTIVITY & CONSISTENCY
            </h3>
            <p className="text-xs text-stone-600 dark:text-slate-400 font-medium mt-0.5">
              Your consistency at a glance — <span className="text-amber-700 dark:text-amber-400 font-bold">{totalTop3CompletedYear}</span> Top 3 tasks completed in the past year
            </p>
          </div>
        </div>

        {/* 3 Mini Metric Glass Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-2xl bg-amber-100/60 dark:bg-slate-800/80 border border-amber-300/40 dark:border-slate-700/80 text-center transition-all hover:-translate-y-0.5 shadow-2xs">
            <span className="text-stone-500 dark:text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Active Days</span>
            <span className="font-mono font-black text-stone-900 dark:text-emerald-400 text-sm sm:text-base">{activeDaysCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-100/60 dark:bg-slate-800/80 border border-amber-300/40 dark:border-slate-700/80 text-center transition-all hover:-translate-y-0.5 shadow-2xs">
            <span className="text-stone-500 dark:text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Max Streak</span>
            <span className="font-mono font-black text-amber-700 dark:text-amber-400 text-sm sm:text-base">{maxStreak}</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-100/60 dark:bg-slate-800/80 border border-amber-300/40 dark:border-slate-700/80 text-center transition-all hover:-translate-y-0.5 shadow-2xs flex flex-col items-center justify-center">
            <span className="text-stone-500 dark:text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Current</span>
            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base flex items-center gap-1">
              {currentStreak} <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400/30 animate-pulse" />
            </span>
          </div>
        </div>
      </div>

      {/* Heat Map Matrix Grid Container */}
      <div className="overflow-x-auto pb-3 scrollbar-thin">
        <div className="min-w-[720px] space-y-1">
          {/* Month Header Row */}
          <div className="flex items-center text-[10px] font-mono text-slate-500 dark:text-slate-400 pl-8 mb-1 relative h-4 select-none">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute font-semibold"
                style={{ left: `${m.col * 13.5 + 32}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Container (Day Rows x Week Cols) */}
          <div className="flex gap-1 items-start">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-400 dark:text-slate-500 pr-1 select-none">
              <span className="h-2.5 leading-2.5">Mon</span>
              <span className="h-2.5 leading-2.5 mt-2.5">Wed</span>
              <span className="h-2.5 leading-2.5 mt-2.5">Fri</span>
            </div>

            {/* Weeks Matrix */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const isToday = day.date === currentDate;
                    return (
                      <div
                        key={day.date}
                        onMouseEnter={() => setHoveredCell(day)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-2.5 h-2.5 rounded-[2.5px] border transition-all duration-200 hover:scale-130 hover:z-20 cursor-pointer ${getCellClasses(
                          day.count
                        )} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip & Legend Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        {/* Rich Interactive Floating Tooltip */}
        <div className="h-6 flex items-center gap-1.5 font-mono text-xs">
          {hoveredCell ? (
            <motion.span
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-800 dark:text-slate-100 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <strong className="text-slate-900 dark:text-white">{hoveredCell.count}</strong> Top 3 tasks completed on{' '}
              <span className="text-indigo-600 dark:text-emerald-300 font-semibold">
                {new Date(hoveredCell.date.split('-').join('/')).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {hoveredCell.count === 3 && <span className="text-amber-500 font-bold ml-1">🎉 Target Met</span>}
            </motion.span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
              Explore your consistency day by day. Hover or tap any square to inspect details.
            </span>
          )}
        </div>

        {/* Premium Legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 select-none">
          <span className="font-bold">LESS</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-200 border border-slate-300 dark:bg-[#161b22] dark:border-[#30363d]" title="0 tasks" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300 border border-emerald-400 dark:bg-[#0e4429] dark:border-[#0e4429]" title="1 task" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-600 dark:bg-[#006d32] dark:border-[#006d32]" title="2 tasks" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-700 dark:bg-[#39d353] dark:border-[#39d353]" title="3 tasks (Target Met)" />
          <span className="font-bold">MORE</span>
        </div>
      </div>
    </motion.section>
  );
}
