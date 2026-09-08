import React from 'react';
import { Target, CheckCheck, Flame, Layers } from 'lucide-react';

export default function StatsOverview({ tasks = [] }) {
  const top3Tasks = tasks.filter((t) => t.category === 'top3');
  const secondaryTasks = tasks.filter((t) => t.category === 'secondary');
  const completedCount = tasks.filter((t) => t.completed).length;
  const top3CompletedCount = top3Tasks.filter((t) => t.completed).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 glass-card rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-slate-800/80 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-slate-700">
          <Target className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <p className="text-[10px] font-black text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">Total Tasks</p>
          <p className="text-lg font-black text-stone-900 dark:text-slate-100 font-mono">{tasks.length}</p>
        </div>
      </div>

      <div className="p-4 glass-card rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-800/50">
          <CheckCheck className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div>
          <p className="text-[10px] font-black text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">Completed</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{completedCount}</p>
        </div>
      </div>

      <div className="p-4 glass-card rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-800/50">
          <Flame className="w-4 h-4 fill-amber-500/20 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-[10px] font-black text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">Top 3 Done</p>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {top3CompletedCount} / {top3Tasks.length}
          </p>
        </div>
      </div>

      <div className="p-4 glass-card rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-slate-800/80 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-black text-stone-500 dark:text-slate-400 uppercase tracking-wider font-mono">Secondary</p>
          <p className="text-lg font-black text-stone-700 dark:text-slate-300 font-mono">{secondaryTasks.length}</p>
        </div>
      </div>
    </div>
  );
}
