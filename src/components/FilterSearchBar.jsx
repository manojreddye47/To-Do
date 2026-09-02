import React from 'react';
import { Search, X, Filter, ArrowRightLeft, Clock } from 'lucide-react';

export default function FilterSearchBar({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  unfinishedPastCount = 0,
  onMigrateTasks
}) {
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'top3', label: 'Top 3' },
    { id: 'secondary', label: 'Secondary' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === opt.id
                  ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Migrate Unfinished Tasks Trigger */}
        {unfinishedPastCount > 0 && (
          <button
            onClick={onMigrateTasks}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-2xs"
            title="Migrate uncompleted tasks from past dates to Today"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Migrate Unfinished Tasks</span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
              {unfinishedPastCount}
            </span>
          </button>
        )}
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by keyword..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
