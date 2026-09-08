import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, ListTodo } from 'lucide-react';

const QuickAddBar = forwardRef(function QuickAddBar(
  { onAddTask, top3Count = 0, currentDate },
  ref
) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(top3Count < 3 ? 'top3' : 'secondary');
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const lastScrollY = useRef(0);

  const isTop3Full = top3Count >= 3;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;
      const isNearBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 60;

      if (isInputFocused || isNearBottom || currentScrollY < 60) {
        setIsVisible(true);
      } else if (scrollDiff > 14 && currentScrollY > 120) {
        setIsVisible(false);
      } else if (scrollDiff < -8) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInputFocused]);

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
    <motion.form
      onSubmit={handleSubmit}
      onMouseEnter={() => setIsVisible(true)}
      animate={{
        y: isVisible ? 0 : 54,
        opacity: isVisible ? 1 : 0.3
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="sticky bottom-4 z-20 max-w-5xl mx-auto px-4 sm:px-0 safe-bottom"
    >
      <div className="glass-dock p-2.5 sm:p-3 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 transition-all duration-300">
        {/* Category Pills Selector */}
        <div className="flex items-center bg-amber-100/70 dark:bg-slate-800/80 p-1 rounded-2xl border border-amber-300/40 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setCategory('top3')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              category === 'top3'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
            title={isTop3Full ? "Top 3 capacity reached (3/3)" : "Add to Top 3 Non-Negotiables"}
          >
            <Flame className={`w-3.5 h-3.5 ${category === 'top3' ? 'fill-slate-950/30' : ''}`} />
            <span>Top 3</span>
            {isTop3Full && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[9px] font-black rounded bg-amber-600/30 text-amber-900 dark:text-amber-200">
                FULL
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCategory('secondary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              category === 'secondary'
                ? 'bg-stone-800 dark:bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
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
            onFocus={() => {
              setIsInputFocused(true);
              setIsVisible(true);
            }}
            onBlur={() => setIsInputFocused(false)}
            placeholder={`Add a new ${category === 'top3' ? 'Top 3 priority' : 'secondary task'} for ${currentDate}...`}
            className="w-full px-4 py-2 text-sm bg-amber-50/50 dark:bg-slate-800/60 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-slate-400 rounded-2xl border border-amber-300/40 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-sans"
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
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/30 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Task</span>
        </motion.button>
      </div>
    </motion.form>
  );
});

export default QuickAddBar;
