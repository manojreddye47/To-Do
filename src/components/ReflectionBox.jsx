import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Sparkles, CheckCheck, Loader2 } from 'lucide-react';
import { subscribeToReflection, saveReflection } from '../services/reflectionService';

export default function ReflectionBox({ currentDate }) {
  const [winText, setWinText] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const debounceTimerRef = useRef(null);

  // Subscribe to reflection for current date
  useEffect(() => {
    const unsubscribe = subscribeToReflection(currentDate, (text) => {
      setWinText(text || '');
      setSaveStatus('saved');
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentDate]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setWinText(newText);
    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await saveReflection(currentDate, newText);
      setSaveStatus('saved');
    }, 800);
  };

  return (
    <section className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-serif sm:font-sans">
              <span>Daily Reflection & Wins</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              What was your biggest win, lesson, or highlight for this day?
            </p>
          </div>
        </div>

        {/* Live Save Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCheck className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={3}
          value={winText}
          onChange={handleChange}
          placeholder="Log your major win, progress insight, or gratitude entry before closing out the day..."
          className="w-full p-3.5 text-sm bg-slate-50/70 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-sans leading-relaxed resize-y"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Executive Journal Entry
          </span>
          <span>{winText.length} characters</span>
        </div>
      </div>
    </section>
  );
}
