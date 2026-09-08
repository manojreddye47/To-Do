import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="space-y-6">
        {/* SECTION 1: Top 3 Non-Negotiables */}
        <section className="bg-white/80 dark:bg-slate-900/90 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-sm p-4 sm:p-6 relative overflow-hidden backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-indigo-100 dark:border-indigo-950">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Flame className="w-4 h-4 fill-amber-400/30" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-serif sm:font-sans">
                  <span>Top 3 Non-Negotiables</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your core high-leverage execution priorities for today
                </p>
              </div>
            </div>

            {/* Counter Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold font-mono border transition-colors ${
                top3Tasks.length === 3
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
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
                className={`space-y-3 min-h-[70px] rounded-2xl transition-colors p-1 ${
                  snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-dashed border-indigo-300 dark:border-indigo-700' : ''
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
                    className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <Flame className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      No Top 3 Non-Negotiables set for today
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
                      Define up to 3 non-negotiable tasks that guarantee a successful day. ✨
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </Droppable>
        </section>

        {/* SECTION 2: Secondary Tasks */}
        <section className="bg-white/80 dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <ListTodo className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-serif sm:font-sans">
                  <span>Secondary Tasks</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Flexible task queue for additional operations & errands
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {secondaryTasks.length} {secondaryTasks.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <Droppable droppableId="secondary">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-3 min-h-[80px] rounded-2xl transition-colors p-1 ${
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
                    className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <Sparkles className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Your secondary queue is clear
                    </p>
                    <button
                      onClick={onQuickAddFocus}
                      className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add a new secondary task
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
