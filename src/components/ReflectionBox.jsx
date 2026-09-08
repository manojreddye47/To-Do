import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Sparkles, CheckCheck, Loader2 } from 'lucide-react';
import { subscribeToReflection, saveReflection } from '../services/reflectionService';

export default function ReflectionBox({ currentDate }) {
  const [winText, setWinText] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved');
  const debounceTimerRef = useRef(null);

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
    <section className="glass-panel rounded-3xl p-4 sm:p-6 transition-all duration-300">
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-800/60">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-slate-100 flex items-center gap-2 font-sans tracking-tight">
              <span>Daily Reflection & Wins</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-slate-400 font-medium">
              What was your major breakthrough, lesson, or highlight for today?
            </p>
          </div>
        </div>

        {/* Live Save Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
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
          placeholder="Record your daily win, key progress metric, or reflection entry before closing out the day..."
          className="w-full p-4 text-sm bg-amber-50/40 dark:bg-slate-800/40 text-stone-900 dark:text-slate-100 placeholder-stone-400 dark:placeholder-slate-400 rounded-2xl border border-amber-300/40 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-sans leading-relaxed resize-y"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Executive Journal Log
          </span>
          <span>{winText.length} characters</span>
        </div>
      </div>
    </section>
  );
}
