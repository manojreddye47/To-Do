import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, Flame, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import hanumanArtwork from '../assets/hanuman_focus_artwork.jpg';

export default function HanumanFocusCard({
  tasks = [],
  onToggleComplete,
  onClose,
  isBajrangMode = false,
}) {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const [selectedTaskId, setSelectedTaskId] = useState(pendingTasks[0]?.id || null);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 min timer
  const [isActive, setIsActive] = useState(false);

  // 3D Motion Parallax for Desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const artX = useSpring(useTransform(x, [-100, 100], [-6, 6]), { stiffness: 200, damping: 25 });
  const artY = useSpring(useTransform(y, [-100, 100], [-6, 6]), { stiffness: 200, damping: 25 });

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

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || pendingTasks[0];

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleCompleteCurrentTask = async () => {
    if (currentTask) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#6366f1']
      });
      await onToggleComplete(currentTask.id, false);
      const remaining = pendingTasks.filter((t) => t.id !== currentTask.id);
      if (remaining.length > 0) {
        setSelectedTaskId(remaining[0].id);
      } else if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center text-center space-y-5"
    >
      {/* HANUMAN GUARDIAN ARTWORK WITH CELESTIAL BREATHING HALO */}
      <div className="relative flex flex-col items-center justify-center pt-2">
        {/* Breathing Celestial Halo Light */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-400/25 to-amber-300/40 dark:from-amber-500/25 dark:via-orange-500/20 dark:to-indigo-500/20 blur-2xl pointer-events-none"
        />

        {/* Artwork Frame with Subtle Parallax */}
        <motion.div
          style={{ x: artX, y: artY }}
          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-amber-500/30 dark:ring-amber-400/30 bg-slate-900 border border-amber-300/40"
        >
          <img
            src={hanumanArtwork}
            alt="Lord Hanuman in Meditation - Focus Guardian"
            className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-700"
            loading="eager"
          />

          {/* Theme-aware Ambient Soft Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-500/10 dark:from-slate-950/60 pointer-events-none" />
        </motion.div>

        {/* Spiritual Focus Virtues Banner */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold font-mono tracking-widest text-amber-700 dark:text-amber-300 uppercase"
        >
          <span>COURAGE</span>
          <span className="text-amber-400/60">•</span>
          <span>DISCIPLINE</span>
          <span className="text-amber-400/60">•</span>
          <span>FOCUS</span>
        </motion.div>
      </div>

      {/* TASK EXECUTION CONTAINER */}
      {currentTask ? (
        <div className="w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-50/90 via-amber-500/5 to-slate-100/90 dark:from-slate-800/80 dark:via-slate-900/90 dark:to-slate-950/90 border border-amber-500/20 dark:border-amber-500/20 shadow-xl space-y-4 transition-all">
          {/* Task Dropdown Selector if multiple pending tasks exist */}
          {pendingTasks.length > 1 && (
            <div className="relative text-left">
              <select
                value={selectedTaskId || ''}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer appearance-none truncate"
              >
                {pendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.category === 'top3' ? '🔥 ' : ''}{t.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Current Task Priority Badge */}
          <div className="flex items-center justify-center gap-2">
            {isBajrangMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs">
                ⚡ BAJRANG FOCUS
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold font-mono uppercase tracking-wide ${
                currentTask.category === 'top3'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                  : 'bg-amber-50 dark:bg-slate-800/80 text-stone-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700'
              }`}
            >
              {currentTask.category === 'top3' ? <Flame className="w-3.5 h-3.5" /> : null}
              {currentTask.category === 'top3' ? 'Top 3 Priority' : 'Secondary Task'}
            </span>
          </div>

          {/* Large Task Headline */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed font-sans px-2">
            {currentTask.title}
          </h2>

          {/* Large Pomodoro Countdown Clock */}
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-amber-900 to-amber-600 dark:from-white dark:via-amber-100 dark:to-amber-400 py-1">
            {formatTimer(secondsLeft)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/25'
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
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Reset Timer to 25:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Action Complete Button */}
          <button
            onClick={handleCompleteCurrentTask}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Conquer & Mark as Completed</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
          ✨ All tasks conquered for today with strength and discipline!
        </div>
      )}
    </div>
  );
}
