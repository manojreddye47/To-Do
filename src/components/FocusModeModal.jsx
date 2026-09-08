import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Play, Pause, RotateCcw, CheckCircle2, X, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FocusModeModal({
  isOpen,
  onClose,
  tasks = [],
  onToggleComplete,
  currentDate
}) {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const [selectedTaskId, setSelectedTaskId] = useState(pendingTasks[0]?.id || null);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 min timer
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (pendingTasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(pendingTasks[0].id);
    }
  }, [pendingTasks, selectedTaskId]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || pendingTasks[0];

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCompleteCurrentTask = async () => {
    if (currentTask) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      await onToggleComplete(currentTask.id, false);
      const remaining = pendingTasks.filter((t) => t.id !== currentTask.id);
      if (remaining.length > 0) {
        setSelectedTaskId(remaining[0].id);
      } else {
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
        {/* Subtle Ambient Glow */}
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl bg-white/95 dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden transition-colors duration-300"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs uppercase tracking-widest font-semibold">
              <Target className="w-4 h-4 animate-pulse" /> Focus Mode Architecture
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Task Selector Dropdown if multiple pending tasks exist */}
          {pendingTasks.length > 0 ? (
            <div className="space-y-2 text-left">
              <label className="block text-xs text-slate-600 dark:text-slate-400 font-medium">Select Task to Execute</label>
              <select
                value={selectedTaskId || ''}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-sans"
              >
                {pendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.category === 'top3' ? '🔥 ' : ''}{t.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
              ✨ All tasks completed for today!
            </div>
          )}

          {/* Primary Focus Card Display */}
          {currentTask && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-xl">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                currentTask.category === 'top3'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                  : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30'
              }`}>
                {currentTask.category === 'top3' ? <Flame className="w-3.5 h-3.5" /> : null}
                {currentTask.category === 'top3' ? 'Top 3 Priority' : 'Secondary Task'}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans">
                {currentTask.title}
              </h2>

              {/* Timer Display */}
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 py-2">
                {formatTimer(secondsLeft)}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-md ${
                    isActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isActive ? 'Pause Timer' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsActive(false);
                    setSecondsLeft(25 * 60);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Complete Button */}
          {currentTask && (
            <button
              onClick={handleCompleteCurrentTask}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Mark Task as Completed</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
