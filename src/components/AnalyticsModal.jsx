import React, { useState, useEffect } from 'react';
import { X, BarChart3, TrendingUp, Calendar, CheckCircle2, Award, Zap, Flame } from 'lucide-react';
import { fetchAllTasks, calculateStreak } from '../services/taskService';

export default function AnalyticsModal({ isOpen, onClose, currentDate }) {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAllTasks().then((data) => {
        setAllTasks(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate 7-day and 30-day stats
  const getDaysAgoISO = (days) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const date7Ago = getDaysAgoISO(7);
  const date30Ago = getDaysAgoISO(30);

  const tasks7Days = allTasks.filter((t) => t.date >= date7Ago && t.date <= currentDate);
  const tasks30Days = allTasks.filter((t) => t.date >= date30Ago && t.date <= currentDate);

  const rate7Days =
    tasks7Days.length > 0
      ? Math.round((tasks7Days.filter((t) => t.completed).length / tasks7Days.length) * 100)
      : 0;

  const rate30Days =
    tasks30Days.length > 0
      ? Math.round((tasks30Days.filter((t) => t.completed).length / tasks30Days.length) * 100)
      : 0;

  // Compute 7-day daily breakdown for bar chart
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const dayISO = getDaysAgoISO(i);
    const dayTasks = allTasks.filter((t) => t.date === dayISO);
    const completed = dayTasks.filter((t) => t.completed).length;
    const total = dayTasks.length;
    const dateObj = new Date(dayISO.split('-').join('/'));
    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    weeklyData.push({
      date: dayISO,
      label: dayLabel,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    });
  }

  const streak = calculateStreak(allTasks, currentDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Historical Performance Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Execution velocity, completion rates & weekly trends
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-400">Loading historical data...</p>
            </div>
          ) : (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 7-Day Completion Rate */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/60">
                  <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">7-Day Rate</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                    {rate7Days}%
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {tasks7Days.filter((t) => t.completed).length} of {tasks7Days.length} tasks done
                  </p>
                </div>

                {/* 30-Day Completion Rate */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/60">
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">30-Day Rate</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                    {rate30Days}%
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {tasks30Days.filter((t) => t.completed).length} of {tasks30Days.length} tasks done
                  </p>
                </div>

                {/* Active Streak */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/60">
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Top 3 Streak</span>
                    <Flame className="w-4 h-4 fill-amber-500/20" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
                    {streak} {streak === 1 ? 'Day' : 'Days'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Consecutive execution streak
                  </p>
                </div>
              </div>

              {/* 7-Day Visual Bar Visualizer */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Past 7-Day Completion Visualizer
                </h4>

                <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
                  {weeklyData.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.completed}/{d.total}
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-t-lg h-28 relative flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            d.date === currentDate
                              ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                              : 'bg-gradient-to-t from-slate-700 to-indigo-500 dark:from-slate-600 dark:to-indigo-400'
                          }`}
                          style={{ height: `${d.total > 0 ? d.percentage : 0}%` }}
                        />
                      </div>

                      <span className={`text-xs font-semibold ${d.date === currentDate ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
