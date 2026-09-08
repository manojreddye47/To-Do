import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3, GripVertical, ArrowUpRight, ArrowDownRight, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TaskCard({
  task,
  onToggleComplete,
  onUpdateTitle,
  onUpdateCategory,
  onDelete,
  dragHandleProps,
  top3Count = 0
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditedTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
      // Small celebratory particle burst for top3 tasks
      if (task.category === 'top3') {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.7 }
        });
      }
    }
    onToggleComplete(task.id, task.completed);
  };

  const isTop3 = task.category === 'top3';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 shadow-none'
          : isTop3
          ? 'bg-white dark:bg-slate-900/90 border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5'
          : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-lg'
      }`}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Completion Checkbox with Smooth Animation */}
      <button
        onClick={handleToggle}
        className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 border relative ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
            : isTop3
            ? 'border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800'
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.div
          initial={false}
          animate={{ scale: task.completed ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </motion.div>
      </button>

      {/* Title / Inline Edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            className="w-full px-2.5 py-1 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span
              onDoubleClick={() => setIsEditing(true)}
              className={`text-sm font-medium leading-relaxed truncate cursor-pointer select-none transition-all duration-300 ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title="Double click to edit title"
            >
              {task.title}
            </span>

            {isTop3 && !task.completed && (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                <Flame className="w-3 h-3 mr-0.5 fill-amber-400/30" /> Priority
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {/* Toggle Category Button */}
        {!task.completed && (
          <button
            onClick={() => {
              if (!isTop3 && top3Count >= 3) {
                alert('Top 3 Non-Negotiables already has 3 core priority tasks for today!');
                return;
              }
              onUpdateCategory(task.id, isTop3 ? 'secondary' : 'top3');
            }}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              isTop3
                ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60'
            }`}
            title={isTop3 ? "Demote to Secondary Tasks" : "Promote to Top 3 Priority"}
          >
            {isTop3 ? (
              <ArrowDownRight className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
            )}
          </button>
        )}

        {/* Edit Title Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Edit title"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
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
