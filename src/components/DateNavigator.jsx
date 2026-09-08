import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

export default function DateNavigator({ currentDate, setCurrentDate, onPrevDay, onNextDay }) {
  const dateInputRef = useRef(null);

  const formatDateString = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = currentDate === getTodayStr();

  const handlePrev = () => {
    if (onPrevDay) {
      onPrevDay();
    } else {
      const [y, m, d] = currentDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() - 1);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setCurrentDate(`${year}-${month}-${day}`);
    }
  };

  const handleNext = () => {
    if (onNextDay) {
      onNextDay();
    } else {
      const [y, m, d] = currentDate.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() + 1);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setCurrentDate(`${year}-${month}-${day}`);
    }
  };

  const handleTodayClick = () => {
    setCurrentDate(getTodayStr());
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 glass-panel rounded-3xl">
      {/* Date Title & Calendar Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
            className="p-2.5 rounded-2xl bg-amber-100/70 dark:bg-slate-800/80 hover:bg-amber-200/80 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 transition-colors border border-amber-300/50 dark:border-slate-700 flex items-center gap-2 group cursor-pointer shadow-xs"
            title="Choose specific date"
          >
            <CalendarIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && setCurrentDate(e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-slate-100 font-sans tracking-tight">
              {formatDateString(currentDate)}
            </h2>
            {isToday && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30">
                Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {!isToday && (
          <button
            onClick={handleTodayClick}
            className="px-3 py-1.5 rounded-2xl text-xs font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-500/10 hover:bg-amber-200/90 dark:hover:bg-amber-500/20 transition-colors border border-amber-300/70 dark:border-amber-500/30 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
        )}

        <div className="flex items-center rounded-2xl bg-amber-100/60 dark:bg-slate-800/80 p-1 border border-amber-300/40 dark:border-slate-700/80">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-xl text-stone-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
            title="Previous Day (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl text-stone-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
            title="Next Day (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
