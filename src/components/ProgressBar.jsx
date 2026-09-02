import React from 'react';
import { CheckCircle2, Award, Zap, Sparkles } from 'lucide-react';

export default function ProgressBar({ totalTasks = 0, completedTasks = 0 }) {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getMotivationMessage = () => {
    if (totalTasks === 0) return "No tasks scheduled for this day yet.";
    if (percentage === 100) return "Masterclass performance! Every priority conquered. 🎉";
    if (percentage >= 75) return "Incredible momentum! Almost across the finish line.";
    if (percentage >= 50) return "Over halfway there. Stay locked in!";
    if (percentage > 0) return "Off to a strong start. Keep building momentum.";
    return "Ready to execute? Start by tackling your Top 3.";
  };

  return (
    <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-indigo-950/80 dark:to-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {percentage === 100 ? (
              <Award className="w-4 h-4 text-emerald-400" />
            ) : (
              <Zap className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <span>Daily Progress</span>
              <span className="text-xs font-mono font-normal text-indigo-200/70">
                ({completedTasks}/{totalTasks} done)
              </span>
            </h3>
            <p className="text-xs text-indigo-200/80 hidden sm:block">
              {getMotivationMessage()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-emerald-400">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60 relative z-10">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${
            percentage === 100
              ? 'from-emerald-500 via-teal-400 to-emerald-300'
              : 'from-indigo-500 via-indigo-400 to-emerald-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
