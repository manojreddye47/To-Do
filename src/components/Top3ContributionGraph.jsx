import React, { useState } from 'react';
import { Flame, Trophy, Calendar, Info, Sparkles } from 'lucide-react';

export default function Top3ContributionGraph({ allTasks = [], currentDate }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Helper to format ISO date YYYY-MM-DD
  const formatISO = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Build map of Top 3 completion counts per date for past 365 days
  const today = new Date(currentDate || new Date());
  const dateMap = {};

  allTasks.forEach((t) => {
    if (t.category === 'top3' && t.completed && t.date) {
      dateMap[t.date] = (dateMap[t.date] || 0) + 1;
    }
  });

  // Generate 52 weeks (364/365 days) matrix starting 52 weeks ago
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (52 * 7 - 1));

  // Align start date to Sunday or Monday
  const dayOfWeek = startDate.getDay(); // 0 = Sun
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks = [];
  let curr = new Date(startDate);
  let totalTop3CompletedYear = 0;
  let activeDaysCount = 0;

  for (let w = 0; w < 52; w++) {
    const daysInWeek = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = formatISO(curr);
      const count = Math.min(dateMap[dateStr] || 0, 3); // Max 3 per day
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

  // Calculate Max Streak & Current Streak for All 3 Top 3 completed
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

  // Calculate current active streak backwards from today
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

  // Color intensity scale
  const getColorClass = (count) => {
    switch (count) {
      case 1:
        return 'bg-[#0e4429] border-[#0e4429] text-emerald-300';
      case 2:
        return 'bg-[#006d32] border-[#006d32] text-emerald-200';
      case 3:
        return 'bg-[#39d353] border-[#39d353] text-slate-950 shadow-xs shadow-emerald-500/20';
      default:
        return 'bg-[#161b22] border-[#30363d]/60 text-slate-600';
    }
  };

  // Month labels
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
    <section className="bg-slate-900/95 dark:bg-slate-900/95 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl text-slate-100 relative overflow-hidden transition-colors">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Metrics Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif sm:font-sans flex items-center gap-2">
                <span>Top 3 Activity Heat Map</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">{totalTop3CompletedYear}</span> Top 3 tasks completed in the past year
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Days</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{activeDaysCount} Days</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Streak</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{maxStreak} Days</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs flex items-center gap-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Streak</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{currentStreak} Days</span>
            </div>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[720px] space-y-1">
          {/* Month Header Row */}
          <div className="flex items-center text-[10px] font-mono text-slate-400 pl-8 mb-1 relative h-4">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${m.col * 13.5 + 32}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Container (Day Rows x Week Cols) */}
          <div className="flex gap-1 items-start">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-500 pr-1 select-none">
              <span className="h-2.5 leading-2.5">Mon</span>
              <span className="h-2.5 leading-2.5 mt-2.5">Wed</span>
              <span className="h-2.5 leading-2.5 mt-2.5">Fri</span>
            </div>

            {/* Weeks Matrix */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-2.5 h-2.5 rounded-[2px] border transition-transform hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(
                        day.count
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip & Legend Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        {/* Tooltip Hover Info */}
        <div className="h-5 flex items-center gap-1.5 font-mono text-xs">
          {hoveredCell ? (
            <span className="text-slate-200 flex items-center gap-1.5 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-white">{hoveredCell.count}</strong> Top 3 tasks on{' '}
              <span className="text-emerald-300">
                {new Date(hoveredCell.date.split('-').join('/')).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {hoveredCell.count === 3 && <span className="text-amber-400 font-bold ml-1">🎉 Target Met</span>}
            </span>
          ) : (
            <span className="text-slate-500 italic">Hover over any day square to inspect completion details</span>
          )}
        </div>

        {/* Intensity Scale Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 select-none">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#161b22] border border-[#30363d]" title="0 tasks" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#0e4429] border border-[#0e4429]" title="1 task" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#006d32] border border-[#006d32]" title="2 tasks" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353] border border-[#39d353]" title="3 tasks (Target Met)" />
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
