import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import DateNavigator from './components/DateNavigator';
import HeroSection from './components/HeroSection';
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
import BajrangMode from './components/BajrangMode';
import DailyBlessing from './components/DailyBlessing';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import hanumanEnvLight from './assets/hanuman_environment_light.jpg';
import hanumanEnvDark from './assets/hanuman_environment_dark.jpg';

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

  const [hanumanMode, setHanumanMode] = useState(() => {
    try {
      const saved = localStorage.getItem('daily_flow_hanuman_mode');
      if (saved !== null) return saved === 'true';
      return true; // Default ON for the Hanuman Focus Experience
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
  const [isBajrangModeOpen, setIsBajrangModeOpen] = useState(false);

  const [fbError, setFbError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ambient Cursor Tracking Position (Desktop Only)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  const quickAddInputRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync theme to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('daily_flow_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('daily_flow_theme', 'light');
    }
  }, [darkMode]);

  // Sync theme across multi-window or tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'daily_flow_theme') {
        setDarkMode(e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist hanumanMode preference
  useEffect(() => {
    localStorage.setItem('daily_flow_hanuman_mode', String(hanumanMode));
  }, [hanumanMode]);

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

  const [navDirection, setNavDirection] = useState(0);

  const handlePrevDay = useCallback(() => {
    setNavDirection(-1);
    setCurrentDate((prev) => {
      const [y, m, d] = prev.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() - 1);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setNavDirection(1);
    setCurrentDate((prev) => {
      const [y, m, d] = prev.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setDate(dateObj.getDate() + 1);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
  }, []);

  const handleSetDate = useCallback((newDate) => {
    if (!newDate) return;
    setCurrentDate((prev) => {
      if (newDate === prev) return prev;
      setNavDirection(newDate > prev ? 1 : -1);
      return newDate;
    });
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAnalyticsModalOpen(false);
        setIsFirebaseModalOpen(false);
        setIsFocusModeOpen(false);
        setIsBajrangModeOpen(false);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        quickAddInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (hanumanMode) {
          setIsBajrangModeOpen(true);
        }
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFocusModeOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleSetDate(getTodayISO());
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
  }, [hanumanMode, handlePrevDay, handleNextDay, handleSetDate]);

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

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const rawOffsetX = cursorPos.x > 0 && !isMobile ? (cursorPos.x - (typeof window !== 'undefined' ? window.innerWidth : 1200) / 2) * 0.012 : 0;
  const rawOffsetY = cursorPos.y > 0 && !isMobile ? (cursorPos.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * 0.012 : 0;
  const boundedParallaxX = Math.max(-18, Math.min(18, rawOffsetX));
  const boundedParallaxY = Math.max(-18, Math.min(18, rawOffsetY));

  const dayVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 32 : direction < 0 ? -32 : 0,
      y: direction === 0 ? 12 : 0,
      opacity: 0,
      filter: 'blur(2px)'
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 340,
        damping: 28
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -32 : direction < 0 ? 32 : 0,
      y: direction === 0 ? -12 : 0,
      opacity: 0,
      filter: 'blur(2px)',
      transition: {
        duration: 0.18,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="min-h-screen text-stone-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      {/* CINEMATIC ENVIRONMENTAL BACKGROUND SYSTEM */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Light Mode: Warm Golden Sunrise with Lord Hanuman, Himalayas, and Sacred Temples */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            darkMode ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: `translate3d(${boundedParallaxX}px, ${boundedParallaxY}px, 0)`
          }}
        >
          <img
            src={hanumanEnvLight}
            alt="Lord Hanuman Golden Sunrise Environment"
            className="w-full h-full object-cover object-right lg:object-[center_right] scale-105 animate-cloud-drift"
          />
          {/* Contrast-enhancing gradients for high readability of productivity panels */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0]/95 via-[#faf6f0]/80 to-[#faf6f0]/25 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf6f0]/85 via-transparent to-[#faf6f0]/40" />
        </div>

        {/* Dark Mode: Celestial Moonlit Midnight with Lord Hanuman, Stars, and Glowing Temples */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            darkMode ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate3d(${boundedParallaxX}px, ${boundedParallaxY}px, 0)`
          }}
        >
          <img
            src={hanumanEnvDark}
            alt="Lord Hanuman Celestial Midnight Environment"
            className="w-full h-full object-cover object-right lg:object-[center_right] scale-105 animate-cloud-drift"
          />
          {/* Contrast-enhancing gradients for deep midnight immersion and high readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/96 via-[#070b14]/85 to-[#070b14]/25 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-transparent to-[#070b14]/50" />
        </div>

        {/* Dynamic Divine Radial Aura following cursor on desktop */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl transition-transform duration-500 -translate-x-1/2 -translate-y-1/2 hidden md:block opacity-60"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            background: darkMode
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, rgba(251, 191, 36, 0.06) 50%, transparent 75%)'
          }}
        />
      </div>

      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenBajrangMode={() => setIsBajrangModeOpen(true)}
        hanumanMode={hanumanMode}
        setHanumanMode={setHanumanMode}
        streakCount={streakCount}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8 pb-32 relative z-10">
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

        {/* Optional Spiritual Focus Daily Blessing */}
        {hanumanMode && (
          <DailyBlessing currentDate={currentDate} />
        )}

        {/* Date Navigator */}
        <DateNavigator
          currentDate={currentDate}
          setCurrentDate={handleSetDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />

        {/* CINEMATIC TODAY PROGRESS HERO CENTERPIECE */}
        <HeroSection
          totalTasks={tasks.length}
          completedTasks={completedCount}
          streakCount={streakCount}
          currentDate={currentDate}
          hanumanMode={hanumanMode}
          onOpenBajrangMode={() => setIsBajrangModeOpen(true)}
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
        <AnimatePresence mode="wait" custom={navDirection}>
          <motion.div
            key={currentDate}
            custom={navDirection}
            variants={dayVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {loading ? (
              <div className="py-16 text-center space-y-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="inline-block w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
        onOpenBajrangMode={() => setIsBajrangModeOpen(true)}
        hanumanMode={hanumanMode}
        setHanumanMode={setHanumanMode}
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
        hanumanMode={hanumanMode}
      />

      {/* ⚡ Signature Bajrang Mode */}
      <BajrangMode
        isOpen={isBajrangModeOpen}
        onClose={() => setIsBajrangModeOpen(false)}
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        currentDate={currentDate}
      />
    </div>
  );
}
