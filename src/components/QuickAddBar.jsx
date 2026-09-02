import React, { useState, forwardRef } from 'react';
import { Plus, Flame, ListTodo, AlertCircle } from 'lucide-react';

const QuickAddBar = forwardRef(function QuickAddBar(
  { onAddTask, top3Count = 0, currentDate },
  ref
) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(top3Count < 3 ? 'top3' : 'secondary');

  const isTop3Full = top3Count >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    // Check top 3 restriction
    let targetCategory = category;
    if (category === 'top3' && isTop3Full) {
      alert('Top 3 Non-Negotiables already has 3 items. Adding as Secondary Task.');
      targetCategory = 'secondary';
    }

    onAddTask({
      title: trimmed,
      category: targetCategory,
      date: currentDate
    });

    setTitle('');
    // Auto switch category if top3 became full
    if (targetCategory === 'top3' && top3Count + 1 >= 3) {
      setCategory('secondary');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-4 z-20 max-w-5xl mx-auto px-4 sm:px-0"
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-xl shadow-slate-950/20 text-white flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all">
        {/* Category Pills Selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setCategory('top3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              category === 'top3'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={isTop3Full ? "Top 3 capacity reached (3/3)" : "Add to Top 3 Non-Negotiables"}
          >
            <Flame className={`w-3.5 h-3.5 ${category === 'top3' ? 'fill-slate-950/30' : ''}`} />
            <span>Top 3</span>
            {isTop3Full && (
              <span className="ml-0.5 px-1 py-0.2 text-[9px] font-bold rounded bg-amber-600/30 text-amber-300">
                FULL
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCategory('secondary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              category === 'secondary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Secondary</span>
          </button>
        </div>

        {/* Input Field */}
        <div className="relative flex-1">
          <input
            ref={ref}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Add a new ${category === 'top3' ? 'Top 3 priority' : 'secondary task'} for ${currentDate}...`}
            className="w-full px-4 py-2 text-sm bg-slate-800/60 text-white placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
});

export default QuickAddBar;
