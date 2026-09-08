import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, ListTodo } from 'lucide-react';

const QuickAddBar = forwardRef(function QuickAddBar(
  { onAddTask, top3Count = 0, currentDate },
  ref
) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(top3Count < 3 ? 'top3' : 'secondary');
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });

  const isTop3Full = top3Count >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

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
    if (targetCategory === 'top3' && top3Count + 1 >= 3) {
      setCategory('secondary');
    }
  };

  // Subtle magnetic hover effect on desktop button
  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Disable on touch
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    setMagneticPos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagneticPos({ x: 0, y: 0 });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-4 z-20 max-w-5xl mx-auto px-4 sm:px-0"
    >
      <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl p-2.5 sm:p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xl shadow-slate-300/40 dark:shadow-slate-950/40 text-slate-900 dark:text-white flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all duration-300">
        {/* Category Pills Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setCategory('top3')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              category === 'top3'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={isTop3Full ? "Top 3 capacity reached (3/3)" : "Add to Top 3 Non-Negotiables"}
          >
            <Flame className={`w-3.5 h-3.5 ${category === 'top3' ? 'fill-slate-950/30' : ''}`} />
            <span>Top 3</span>
            {isTop3Full && (
              <span className="ml-0.5 px-1 py-0.2 text-[9px] font-extrabold rounded bg-amber-600/20 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300">
                FULL
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCategory('secondary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              category === 'secondary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
            className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-sans"
          />
        </div>

        {/* Magnetic Submit Button */}
        <motion.button
          type="submit"
          disabled={!title.trim()}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ x: magneticPos.x, y: magneticPos.y }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </motion.button>
      </div>
    </form>
  );
});

export default QuickAddBar;
