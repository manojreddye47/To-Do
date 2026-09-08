import React from 'react';
import { motion } from 'framer-motion';
import { NotebookPen, Sun, Moon, Database, ShieldCheck, BarChart3, Target, Command } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase';
import StreakCounter from './StreakCounter';

export default function Header({
  darkMode,
  setDarkMode,
  onOpenFirebaseModal,
  onOpenAnalyticsModal,
  onOpenFocusMode,
  onOpenCommandPalette,
  streakCount = 0
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 dark:bg-[#090d16]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 dark:from-indigo-600 dark:to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 ring-1 ring-white/20">
            <NotebookPen className="w-5 h-5 text-indigo-300 dark:text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-serif sm:font-sans">
                Daily Flow
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                PRO OS
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Executive Task Architecture
            </p>
          </div>
        </div>

        {/* Action Controls & Features */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak Counter */}
          <StreakCounter streakCount={streakCount} />

          {/* Focus Mode Trigger */}
          <button
            onClick={onOpenFocusMode}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Enter Focus Mode (F)"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden lg:inline">Focus</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 text-xs font-medium cursor-pointer"
            title="Command Palette (Ctrl + K)"
          >
            <Command className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <kbd className="hidden md:inline px-1 text-[10px] font-mono text-slate-400">⌘K</kbd>
          </button>

          {/* Analytics Modal Trigger */}
          <button
            onClick={onOpenAnalyticsModal}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="View Historical Analytics & Insights (I)"
          >
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">Insights</span>
          </button>

          {/* Firebase Status Badge */}
          <button
            onClick={onOpenFirebaseModal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isFirebaseConfigured
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/50'
            }`}
            title={isFirebaseConfigured ? 'Connected to Realtime Database' : 'Click to setup credentials'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline">Realtime DB</span>
          </button>

          {/* ELEGANT FLOATING THEME TOGGLE PILL (☀️ ◉ 🌙) */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            className="relative flex items-center justify-between w-16 h-8 p-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-inner transition-colors duration-300"
            title={`Switch to ${darkMode ? 'Light' : 'Dark'} mode`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500 z-10 ml-0.5" />
            <Moon className="w-3.5 h-3.5 text-indigo-400 z-10 mr-0.5" />

            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-1 bottom-1 w-6 rounded-full bg-white dark:bg-slate-900 shadow-md ${
                darkMode ? 'right-1' : 'left-1'
              }`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
