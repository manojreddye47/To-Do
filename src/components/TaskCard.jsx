import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Trash2, Edit3, GripVertical, ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({
  task,
  onToggleComplete,
  onUpdateTitle,
  onUpdateCategory,
  onDelete,
  dragHandleProps,
  top3Count = 0,
  index = 0
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef(null);

  // 3D Motion Values for Cursor Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-50, 50], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-4, 4]), { stiffness: 300, damping: 30 });

  useEffect(() => {
    setEditedTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  const handleSaveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTitle(task.id, trimmed);
    } else {
      setEditedTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!task.completed) {
      confetti({
        particleCount: task.category === 'top3' ? 35 : 15,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
    onToggleComplete(task.id, task.completed);
  };

  const isTop3 = task.category === 'top3';

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4, scale: 1.005 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 ${
        task.completed
          ? 'bg-amber-50/40 dark:bg-slate-900/40 border-stone-200/60 dark:border-slate-800/60 text-stone-400 dark:text-slate-500 shadow-none backdrop-blur-md'
          : isTop3
          ? 'glass-card border-amber-400/40 dark:border-amber-500/35 hover:border-amber-500/80 shadow-md hover:shadow-xl dark:hover:shadow-amber-500/10 ring-1 ring-amber-400/20'
          : 'glass-card border-stone-200/80 dark:border-slate-800/80 hover:border-amber-400/50 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Number Badge for Top 3 Tasks */}
      {isTop3 && (
        <span className="shrink-0 font-mono font-black text-xs text-amber-600/70 dark:text-amber-400/70 w-5 text-center">
          0{index + 1}
        </span>
      )}

      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-stone-300 dark:text-slate-600 hover:text-amber-600 dark:hover:text-slate-400 transition-colors shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Signature Completion Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 border relative cursor-pointer ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
            : isTop3
            ? 'border-amber-400 dark:border-amber-500/60 hover:border-amber-500 bg-amber-100/60 dark:bg-amber-950/40 shadow-xs'
            : 'border-stone-300 dark:border-slate-600 hover:border-amber-500 bg-amber-50/40 dark:bg-slate-800/60 shadow-xs'
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: task.completed ? 1 : 0,
              opacity: task.completed ? 1 : 0
            }}
            transition={{
              pathLength: { type: 'spring', stiffness: 450, damping: 28 },
              opacity: { duration: 0.15 }
            }}
          />
        </svg>
      </button>

      {/* Title & Inline Edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 border border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-sans"
          />
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative inline-block max-w-full">
              <span
                onDoubleClick={() => setIsEditing(true)}
                className={`text-sm font-semibold leading-relaxed truncate block cursor-pointer select-none transition-colors duration-300 ${
                  task.completed
                    ? 'text-stone-400 dark:text-slate-500 font-normal'
                    : 'text-stone-800 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
                title="Double click to edit title"
              >
                {task.title}
              </span>
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ scaleX: task.completed ? 1 : 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                style={{ originX: 0 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-full bg-stone-400 dark:bg-slate-500 pointer-events-none rounded-full"
              />
            </div>

            {isTop3 && !task.completed && (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                <Flame className="w-3 h-3 mr-0.5 fill-amber-400/30" /> NON-NEGOTIABLE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Action Controls */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!task.completed && (
          <button
            onClick={() => {
              if (!isTop3 && top3Count >= 3) {
                alert('Top 3 Non-Negotiables already has 3 core priority tasks for today!');
                return;
              }
              onUpdateCategory(task.id, isTop3 ? 'secondary' : 'top3');
            }}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isTop3
                ? 'text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60'
            }`}
            title={isTop3 ? "Demote to Secondary Tasks" : "Promote to Top 3 Priority"}
          >
            {isTop3 ? (
              <ArrowDownRight className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
          </button>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Edit title"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
