import React from 'react';
import { Search, X, ArrowRightLeft } from 'lucide-react';

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
    <div className="glass-panel rounded-2xl p-3 sm:p-4 space-y-3 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === opt.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-amber-100/60 dark:bg-slate-800/80 text-stone-700 dark:text-slate-300 hover:bg-amber-200/70 dark:hover:bg-slate-700/80 border border-amber-300/30 dark:border-slate-700/60'
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
            className="px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 hover:bg-amber-200/90 dark:hover:bg-amber-900/80 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700/80 text-xs font-black flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs cursor-pointer"
            title="Migrate uncompleted tasks from past dates to Today"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Migrate Unfinished Tasks</span>
            <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-300 dark:bg-amber-800 text-amber-950 dark:text-amber-100">
              {unfinishedPastCount}
            </span>
          </button>
        )}
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-amber-600/70 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by keyword..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-amber-50/50 dark:bg-slate-800/60 text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-400 rounded-xl border border-amber-300/50 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
