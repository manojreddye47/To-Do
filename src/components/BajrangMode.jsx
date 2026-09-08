import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, Shield, ArrowLeft } from 'lucide-react';
import HanumanFocusCard from './HanumanFocusCard';

export default function BajrangMode({
  isOpen,
  onClose,
  tasks = [],
  onToggleComplete,
  currentDate
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Ceremonial Ambient Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 dark:bg-slate-950/92 backdrop-blur-2xl transition-colors"
        />

        {/* Subtle Warm Saffron & Gold Radial Ambient Lights */}
        <div className="fixed -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ceremonial Focus Sanctuary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-amber-500/30 dark:border-amber-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden my-auto transition-colors duration-300"
        >
          {/* Top Bar: Title & Exit Controls */}
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-amber-500/20 dark:border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25">
                <Zap className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-serif sm:font-sans">
                    BAJRANG MODE
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono uppercase">
                    HIGH FOCUS
                  </span>
                </div>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-mono">
                  जय श्री राम • Unwavering strength and deep work sanctuary
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Exit Bajrang Mode (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
              <kbd className="hidden md:inline px-1 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">Esc</kbd>
            </button>
          </div>

          {/* Core Reusable Hanuman Focus Card */}
          <HanumanFocusCard
            tasks={tasks}
            onToggleComplete={onToggleComplete}
            onClose={onClose}
            isBajrangMode={true}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
