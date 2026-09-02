import React from 'react';
import { Target, CheckCheck, Flame, Layers } from 'lucide-react';

export default function StatsOverview({ tasks = [] }) {
  const top3Tasks = tasks.filter((t) => t.category === 'top3');
  const secondaryTasks = tasks.filter((t) => t.category === 'secondary');
  const completedCount = tasks.filter((t) => t.completed).length;
  const top3CompletedCount = top3Tasks.filter((t) => t.completed).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tasks</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{tasks.length}</p>
        </div>
      </div>

      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <CheckCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</p>
        </div>
      </div>

      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top 3 Done</p>
          <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {top3CompletedCount} / {top3Tasks.length}
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Secondary</p>
          <p className="text-lg font-extrabold text-slate-700 dark:text-slate-300 font-mono">{secondaryTasks.length}</p>
        </div>
      </div>
    </div>
  );
}
