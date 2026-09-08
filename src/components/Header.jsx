import React from 'react';
import { motion } from 'framer-motion';
import { NotebookPen, Sun, Moon, Database, ShieldCheck, BarChart3, Target, Command, Zap } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase';
import StreakCounter from './StreakCounter';

export default function Header({
  darkMode,
  setDarkMode,
  onOpenFirebaseModal,
  onOpenAnalyticsModal,
  onOpenFocusMode,
  onOpenCommandPalette,
  onOpenBajrangMode,
  hanumanMode,
  setHanumanMode,
  streakCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-[var(--bg-glass)] border-b border-[var(--border-color)] transition-colors duration-300 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300/40 dark:ring-amber-500/30">
            <NotebookPen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white font-sans">
                Daily Flow
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30">
                PRO OS
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400 hidden sm:block font-medium">
              Executive Task Architecture
            </p>
          </div>
        </div>

        {/* Action Controls & Features */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak Counter */}
          <StreakCounter streakCount={streakCount} />

          {/* ⚡ Bajrang Mode Trigger (when Hanuman Focus is active) */}
          {hanumanMode && (
            <button
              onClick={onOpenBajrangMode}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Activate ⚡ Bajrang Mode (B)"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">Bajrang</span>
            </button>
          )}

          {/* Focus Mode Trigger */}
          <button
            onClick={onOpenFocusMode}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-700/80 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Enter Focus Mode (F)"
          >
            <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden lg:inline">Focus</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-amber-50/80 dark:hover:bg-slate-800 transition-colors border border-[var(--border-color)] flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Command Palette (Ctrl + K)"
          >
            <Command className="w-3.5 h-3.5 text-amber-600 dark:text-slate-400" />
            <kbd className="hidden md:inline px-1 text-[10px] font-mono text-stone-400 dark:text-slate-400">⌘K</kbd>
          </button>

          {/* Analytics Modal Trigger */}
          <button
            onClick={onOpenAnalyticsModal}
            className="p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-amber-50/80 dark:hover:bg-slate-800 transition-colors border border-[var(--border-color)] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="View Historical Analytics & Insights (I)"
          >
            <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Insights</span>
          </button>

          {/* Firebase Status Badge */}
          <button
            onClick={onOpenFirebaseModal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isFirebaseConfigured
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/60 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/60 hover:bg-amber-100'
            }`}
            title={isFirebaseConfigured ? 'Connected to Realtime Database' : 'Click to setup credentials'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline">Realtime DB</span>
          </button>

          {/* 🔱 HANUMAN FOCUS EXPERIENCE TOGGLE */}
          <button
            onClick={() => setHanumanMode(!hanumanMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              hanumanMode
                ? 'bg-amber-100/90 text-amber-950 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs'
                : 'bg-stone-100 dark:bg-slate-800/80 text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200 border border-stone-200 dark:border-slate-700'
            }`}
            title={hanumanMode ? "Hanuman Focus Experience: Enabled (Click to disable)" : "Enable Hanuman Focus Experience"}
          >
            <span className="text-xs">🔱</span>
            <span className="hidden xl:inline">{hanumanMode ? "Hanuman ON" : "Hanuman OFF"}</span>
          </button>

          {/* ELEGANT FLOATING THEME TOGGLE PILL (☀️ ◉ 🌙) */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="relative flex items-center justify-between w-16 h-8 p-1 rounded-full bg-amber-100/80 dark:bg-slate-900 border border-amber-300/70 dark:border-amber-500/30 cursor-pointer shadow-inner transition-colors duration-300 shrink-0"
            title={`Switch to ${darkMode ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Light and Dark Mode"
          >
            <Sun className={`w-3.5 h-3.5 z-10 ml-0.5 transition-colors ${!darkMode ? 'text-amber-600' : 'text-slate-500'}`} />
            <Moon className={`w-3.5 h-3.5 z-10 mr-0.5 transition-colors ${darkMode ? 'text-amber-400' : 'text-stone-400'}`} />

            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-1 bottom-1 w-6 rounded-full shadow-md ${
                darkMode ? 'right-1 bg-amber-500' : 'left-1 bg-white'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
