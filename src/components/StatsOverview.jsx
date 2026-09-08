import React from 'react';
import { Target, CheckCheck, Flame, Layers } from 'lucide-react';

export default function StatsOverview({ tasks = [] }) {
  const top3Tasks = tasks.filter((t) => t.category === 'top3');
  const secondaryTasks = tasks.filter((t) => t.category === 'secondary');
  const completedCount = tasks.filter((t) => t.completed).length;
  const top3CompletedCount = top3Tasks.filter((t) => t.completed).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Total Tasks</p>
          <p className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">{tasks.length}</p>
        </div>
      </div>

      <div className="p-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
          <CheckCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Completed</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</p>
        </div>
      </div>

      <div className="p-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Top 3 Done</p>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {top3CompletedCount} / {top3Tasks.length}
          </p>
        </div>
      </div>

      <div className="p-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Secondary</p>
          <p className="text-lg font-black text-slate-700 dark:text-slate-300 font-mono">{secondaryTasks.length}</p>
        </div>
      </div>
    </div>
  );
}
