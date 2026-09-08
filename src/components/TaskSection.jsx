import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Flame, ListTodo, PlusCircle, Sparkles } from 'lucide-react';
import TaskCard from './TaskCard';

export default function TaskSection({
  tasks,
  onToggleComplete,
  onUpdateTitle,
  onUpdateCategory,
  onDelete,
  onReorder,
  onQuickAddFocus
}) {
  const top3Tasks = tasks.filter((t) => t.category === 'top3');
  const secondaryTasks = tasks.filter((t) => t.category === 'secondary');

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const sourceList = sourceCategory === 'top3' ? [...top3Tasks] : [...secondaryTasks];
    const destList = destCategory === 'top3' ? [...top3Tasks] : [...secondaryTasks];

    if (sourceCategory === destCategory) {
      const [moved] = sourceList.splice(source.index, 1);
      sourceList.splice(destination.index, 0, moved);

      const remainingCategory = sourceCategory === 'top3' ? secondaryTasks : top3Tasks;
      const combined = sourceCategory === 'top3' ? [...sourceList, ...remainingCategory] : [...remainingCategory, ...sourceList];
      onReorder(combined);
    } else {
      if (destCategory === 'top3' && top3Tasks.length >= 3) {
        alert('Top 3 Non-Negotiables already reached maximum limit of 3 core priority tasks for this day!');
        return;
      }

      const [moved] = sourceList.splice(source.index, 1);
      moved.category = destCategory;
      destList.splice(destination.index, 0, moved);

      const newTop3 = destCategory === 'top3' ? destList : sourceList;
      const newSecondary = destCategory === 'secondary' ? destList : sourceList;

      onReorder([...newTop3, ...newSecondary]);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-8">
        {/* SECTION 1: TOP 3 NON-NEGOTIABLES (VIP PRIORITY CONTAINER) */}
        <section className="bg-gradient-to-b from-white/90 via-white/80 to-amber-500/5 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-amber-950/10 rounded-3xl border border-amber-500/30 dark:border-amber-500/30 shadow-xl p-5 sm:p-7 relative overflow-hidden backdrop-blur-2xl transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-amber-500/20 dark:border-amber-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20">
                <Flame className="w-5 h-5 fill-slate-950/20" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 font-serif sm:font-sans">
                  <span>TOP 3 NON-NEGOTIABLES</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must-complete high impact objectives for today
                </p>
              </div>
            </div>

            {/* Capacity Slot Counter Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-black font-mono border transition-colors ${
                top3Tasks.length === 3
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
              }`}
            >
              {top3Tasks.length} / 3 slots
            </span>
          </div>

          <Droppable droppableId="top3">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-3 min-h-[80px] rounded-2xl transition-colors p-1 ${
                  snapshot.isDraggingOver ? 'bg-amber-500/10 border-2 border-dashed border-amber-400' : ''
                }`}
              >
                {top3Tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(draggableProvided) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                      >
                        <TaskCard
                          task={task}
                          index={index}
                          onToggleComplete={onToggleComplete}
                          onUpdateTitle={onUpdateTitle}
                          onUpdateCategory={onUpdateCategory}
                          onDelete={onDelete}
                          dragHandleProps={draggableProvided.dragHandleProps}
                          top3Count={top3Tasks.length}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {top3Tasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-amber-500/5 border border-dashed border-amber-500/20 space-y-2"
                  >
                    <Flame className="w-8 h-8 text-amber-500/40" />
                    <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      Your Top 3 Non-Negotiables are unassigned
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed font-sans">
                      Select up to 3 core priority tasks that guarantee maximum impact today. ✨
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </Droppable>
        </section>

        {/* SECTION 2: SECONDARY TASKS */}
        <section className="bg-white/80 dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-5 sm:p-7 backdrop-blur-2xl transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 font-serif sm:font-sans">
                  <span>SECONDARY TASKS</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Flexible operational items & general execution queue
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {secondaryTasks.length} {secondaryTasks.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <Droppable droppableId="secondary">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-3 min-h-[90px] rounded-2xl transition-colors p-1 ${
                  snapshot.isDraggingOver ? 'bg-slate-100/60 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700' : ''
                }`}
              >
                {secondaryTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(draggableProvided) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                      >
                        <TaskCard
                          task={task}
                          index={index}
                          onToggleComplete={onToggleComplete}
                          onUpdateTitle={onUpdateTitle}
                          onUpdateCategory={onUpdateCategory}
                          onDelete={onDelete}
                          dragHandleProps={draggableProvided.dragHandleProps}
                          top3Count={top3Tasks.length}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {secondaryTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-extrabold text-slate-600 dark:text-slate-300">
                      Your secondary queue is clear
                    </p>
                    <button
                      onClick={onQuickAddFocus}
                      className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" /> Add a new secondary task
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </Droppable>
        </section>
      </div>
    </DragDropContext>
  );
}
