import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Flame,
  BarChart3,
  Sun,
  Moon,
  Database,
  Target,
  X,
  Command,
  CheckCircle2,
  ListTodo,
  Zap
} from 'lucide-react';

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onAddTaskFocus,
  onGoToday,
  onPrevDay,
  onNextDay,
  onOpenFocusMode,
  onOpenAnalytics,
  onOpenFirebase,
  onToggleTheme,
  onOpenBajrangMode,
  hanumanMode,
  setHanumanMode,
  darkMode,
  setActiveFilter
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    ...(hanumanMode && onOpenBajrangMode ? [{
      id: 'bajrang-mode',
      label: '⚡ Enter Bajrang Mode (High Focus)',
      shortcut: 'B',
      icon: Zap,
      action: () => {
        onOpenBajrangMode();
        onClose();
      }
    }] : []),
    ...(setHanumanMode ? [{
      id: 'toggle-hanuman',
      label: hanumanMode ? 'Disable Hanuman Focus Experience' : 'Enable Hanuman Focus Experience (🔱)',
      shortcut: 'H',
      icon: Flame,
      action: () => {
        setHanumanMode(!hanumanMode);
        onClose();
      }
    }] : []),
    {
      id: 'add-task',
      label: 'Add New Task',
      shortcut: 'N',
      icon: PlusCircle,
      action: () => {
        onAddTaskFocus();
        onClose();
      }
    },
    {
      id: 'focus-mode',
      label: 'Enter Focus Mode',
      shortcut: 'F',
      icon: Target,
      action: () => {
        onOpenFocusMode();
        onClose();
      }
    },
    {
      id: 'go-today',
      label: 'Navigate to Today',
      shortcut: 'T',
      icon: RotateCcw,
      action: () => {
        onGoToday();
        onClose();
      }
    },
    {
      id: 'prev-day',
      label: 'Previous Day',
      shortcut: '←',
      icon: ChevronLeft,
      action: () => {
        onPrevDay();
        onClose();
      }
    },
    {
      id: 'next-day',
      label: 'Next Day',
      shortcut: '→',
      icon: ChevronRight,
      action: () => {
        onNextDay();
        onClose();
      }
    },
    {
      id: 'analytics',
      label: 'View Insights & Analytics',
      shortcut: 'I',
      icon: BarChart3,
      action: () => {
        onOpenAnalytics();
        onClose();
      }
    },
    {
      id: 'filter-top3',
      label: 'Filter: Top 3 Non-Negotiables',
      icon: Flame,
      action: () => {
        setActiveFilter('top3');
        onClose();
      }
    },
    {
      id: 'filter-secondary',
      label: 'Filter: Secondary Tasks',
      icon: ListTodo,
      action: () => {
        setActiveFilter('secondary');
        onClose();
      }
    },
    {
      id: 'filter-completed',
      label: 'Filter: Completed Tasks',
      icon: CheckCircle2,
      action: () => {
        setActiveFilter('completed');
        onClose();
      }
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${darkMode ? 'Light' : 'Dark'} Mode`,
      icon: darkMode ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      }
    },
    {
      id: 'firebase-settings',
      label: 'Firebase Database Settings',
      icon: Database,
      action: () => {
        onOpenFirebase();
        onClose();
      }
    }
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Command Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <Command className="w-5 h-5 text-indigo-500 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search action..."
              className="w-full text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Commands List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filtered.length > 0 ? (
              filtered.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          isSelected
                            ? 'bg-indigo-700/60 border-indigo-400/40 text-indigo-100'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching commands found.
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Use ↑ ↓ to navigate, Enter to select</span>
            <span>Esc to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
