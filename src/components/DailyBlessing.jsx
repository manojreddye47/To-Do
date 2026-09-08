import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Flame } from 'lucide-react';

const BLESSINGS = [
  {
    mantra: "जय श्री राम",
    quote: "Strength begins with discipline. Focus on what must be done.",
  },
  {
    mantra: "संकट मोचन",
    quote: "Start with courage. Conquer with unwavering devotion.",
  },
  {
    mantra: "पवनपुत्र",
    quote: "Action without hesitation. Effort without distraction.",
  },
  {
    mantra: "महावीर",
    quote: "The mind that conquers itself conquers every mountain.",
  },
  {
    mantra: "जय श्री राम",
    quote: "Devote your complete focus to today. Tomorrow builds on today's discipline.",
  }
];

export default function DailyBlessing({ currentDate }) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Compute a consistent blessing index based on the date string
  const dateHash = (currentDate || '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const blessing = BLESSINGS[dateHash % BLESSINGS.length];

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 dark:from-amber-950/30 dark:via-slate-900/60 dark:to-orange-950/20 border border-amber-500/20 dark:border-amber-500/20 backdrop-blur-md shadow-xs transition-colors duration-300"
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-sm shadow-amber-500/20 shrink-0">
              <Flame className="w-4 h-4 fill-slate-950/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide text-amber-700 dark:text-amber-400 font-sans">
                  {blessing.mantra}
                </span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-600/80 dark:text-amber-400/70 hidden sm:inline">
                  DAILY BLESSING & DISCIPLINE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed font-sans">
                "{blessing.quote}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
            title="Dismiss blessing"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
