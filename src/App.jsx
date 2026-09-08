import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import DateNavigator from './components/DateNavigator';
import ProgressBar from './components/ProgressBar';
import StatsOverview from './components/StatsOverview';
import FilterSearchBar from './components/FilterSearchBar';
import TaskSection from './components/TaskSection';
import Top3ContributionGraph from './components/Top3ContributionGraph';
import QuickAddBar from './components/QuickAddBar';
import ReflectionBox from './components/ReflectionBox';
import FirebaseModal from './components/FirebaseModal';
import AnalyticsModal from './components/AnalyticsModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import FocusModeModal from './components/FocusModeModal';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

import {
  subscribeToTasks,
  addTask,
  toggleTaskCompleted,
  updateTaskTitle,
  updateTaskCategory,
  deleteTask,
  saveTaskOrders,
  fetchAllTasks,
  migrateUnfinishedTasks,
  calculateStreak
} from './services/taskService';

const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('daily_flow_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return true;
    }
  });

  const [currentDate, setCurrentDate] = useState(getTodayISO);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  const [fbError, setFbError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const quickAddInputRef = useRef(null);

  // Sync theme to root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('daily_flow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('daily_flow_theme', 'light');
    }
  }, [darkMode]);

  // Listen to custom firebase errors
  useEffect(() => {
    const handleFbErr = (e) => {
      if (e.detail) {
        setFbError(e.detail.message || String(e.detail));
      }
    };
    window.addEventListener('daily_flow_firebase_error', handleFbErr);
    return () => window.removeEventListener('daily_flow_firebase_error', handleFbErr);
  }, []);

  // Global Keyboard Shortcuts (Phase 15)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable;

      // Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInput) return; // Do not trigger shortcuts when typing inside inputs

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsFirebaseModalOpen(false);
        setIsFocusModeOpen(false);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        quickAddInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFocusModeOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentDate(getTodayISO());
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsAnalyticsModalOpen(true);
      } else if (e.key === 'ArrowLeft') {
        handlePrevDay();
      } else if (e.key === 'ArrowRight') {
        handleNextDay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDate]);

  const handlePrevDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setCurrentDate(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    setCurrentDate(`${year}-${month}-${day}`);
  };

  const refreshAllTasks = () => {
    fetchAllTasks().then((data) => setAllTasks(data));
  };

  useEffect(() => {
    refreshAllTasks();
  }, [tasks, currentDate]);

  // Subscribe to real-time tasks for currentDate
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTasks(currentDate, (updatedTasks) => {
      setTasks(updatedTasks);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentDate]);

  // Handler: Add task with optimistic update
  const handleAddTask = async (taskData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      title: taskData.title,
      category: taskData.category,
      completed: false,
      date: taskData.date,
      order: tasks.length
    };

    setTasks((prev) => [...prev, optimisticTask]);
    await addTask(taskData);
  };

  // Handler: Toggle complete with optimistic update
  const handleToggleComplete = async (taskId, currentCompletedState) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !currentCompletedState } : t))
    );
    await toggleTaskCompleted(taskId, currentCompletedState, currentDate);
  };

  // Handler: Edit Title with optimistic update
  const handleUpdateTitle = async (taskId, newTitle) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t))
    );
    await updateTaskTitle(taskId, newTitle, currentDate);
  };

  // Handler: Update Category with optimistic update
  const handleUpdateCategory = async (taskId, newCategory) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, category: newCategory } : t))
    );
    await updateTaskCategory(taskId, newCategory, currentDate);
  };

  // Handler: Delete task with optimistic update
  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId, currentDate);
  };

  // Handler: Reorder tasks
  const handleReorderTasks = async (reorderedTasks) => {
    setTasks(reorderedTasks);
    await saveTaskOrders(reorderedTasks, currentDate);
  };

  // Handler: Migrate Unfinished Tasks from past dates
  const handleMigrateTasks = async () => {
    const count = await migrateUnfinishedTasks(currentDate);
    if (count > 0) {
      setToastMessage(`Successfully migrated ${count} unfinished task(s) to Today!`);
      setTimeout(() => setToastMessage(null), 4000);
      refreshAllTasks();
    }
  };

  // Filtered task list
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery.trim()) {
      const match = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }
    if (activeFilter === 'top3') return task.category === 'top3';
    if (activeFilter === 'secondary') return task.category === 'secondary';
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'pending') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const top3TasksCount = tasks.filter((t) => t.category === 'top3').length;

  const unfinishedPastCount = allTasks.filter(
    (t) => t.date < currentDate && !t.completed
  ).length;

  const streakCount = calculateStreak(allTasks, currentDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      {/* Ambient Radial Background Mesh (Phase 1) */}
      <div className="ambient-glow w-[500px] h-[500px] bg-indigo-500 top-0 left-1/4" />
      <div className="ambient-glow w-[400px] h-[400px] bg-emerald-500 top-1/3 right-10" />

      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        streakCount={streakCount}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28 relative z-10">
        {/* Toast Alert */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-500/20"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Realtime DB Warning Banner */}
        {fbError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 rounded-2xl border border-rose-200 dark:border-rose-800 text-xs flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Realtime Database Sync Warning</p>
                <p className="mt-0.5 opacity-90 leading-relaxed">
                  {fbError.includes('permission_denied') || fbError.includes('PERMISSION_DENIED')
                    ? "Firebase denied permission! In your Firebase Console -> Realtime Database -> Rules tab, ensure '.read': true and '.write': true are set."
                    : fbError}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFbError(null)}
              className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-100 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Date Navigator */}
        <DateNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />

        {/* Visual Completion Progress Bar Hero */}
        <ProgressBar
          totalTasks={tasks.length}
          completedTasks={completedCount}
          streakCount={streakCount}
        />

        {/* Quick Executive Stats */}
        <StatsOverview tasks={tasks} />

        {/* Filter & Live Search Toolbar */}
        <FilterSearchBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unfinishedPastCount={unfinishedPastCount}
          onMigrateTasks={handleMigrateTasks}
        />

        {/* Day Content Transition Wrapper */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              <div className="py-12 text-center space-y-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Syncing with Realtime Database...</p>
              </div>
            ) : (
              <TaskSection
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onUpdateTitle={handleUpdateTitle}
                onUpdateCategory={handleUpdateCategory}
                onDelete={handleDeleteTask}
                onReorder={handleReorderTasks}
                onQuickAddFocus={() => quickAddInputRef.current?.focus()}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* GitHub / LeetCode Style Top 3 Activity Heat Map */}
        <Top3ContributionGraph allTasks={allTasks} currentDate={currentDate} />

        {/* Daily Reflection / Win Journal Box */}
        <ReflectionBox currentDate={currentDate} />
      </main>

      {/* Floating Command Dock */}
      <QuickAddBar
        ref={quickAddInputRef}
        onAddTask={handleAddTask}
        top3Count={top3TasksCount}
        currentDate={currentDate}
      />

      {/* Modals & Command Palette */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        currentDate={currentDate}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddTaskFocus={() => quickAddInputRef.current?.focus()}
        onGoToday={() => setCurrentDate(getTodayISO())}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenFirebase={() => setIsFirebaseModalOpen(true)}
        onToggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        setActiveFilter={setActiveFilter}
      />

      <FocusModeModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        currentDate={currentDate}
      />
    </div>
  );
}
