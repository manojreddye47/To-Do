import {
  ref,
  onValue,
  push,
  set,
  update,
  remove
} from 'firebase/database';
import { db, isFirebaseConfigured } from '../firebase';

const LOCAL_STORAGE_KEY = 'daily_flow_tasks_v1';

// Helpers for Local Storage fallback
const getLocalTasks = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse local tasks:', e);
    return [];
  }
};

const saveLocalTasks = (tasks) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save local tasks:', e);
  }
};

/**
 * Subscribe to tasks for a specific date (YYYY-MM-DD) via Firebase Realtime Database.
 * Returns an unsubscribe function.
 */
export const subscribeToTasks = (selectedDate, onUpdate, onError) => {
  if (isFirebaseConfigured && db) {
    try {
      const dateTasksRef = ref(db, `tasks/${selectedDate}`);

      const unsubscribe = onValue(
        dateTasksRef,
        (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            onUpdate([]);
            return;
          }

          const tasksList = Object.keys(val).map((key) => ({
            id: key,
            ...val[key],
          }));

          // Sort in memory by order or createdAt
          tasksList.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return (a.createdAt || 0) - (b.createdAt || 0);
          });

          onUpdate(tasksList);
        },
        (error) => {
          console.error('[Daily Flow] Realtime Database error:', error);
          window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: error }));
          if (onError) onError(error);
          fallbackLocalSubscribe(selectedDate, onUpdate);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('[Daily Flow] Error subscribing to Realtime Database:', err);
      return fallbackLocalSubscribe(selectedDate, onUpdate);
    }
  } else {
    return fallbackLocalSubscribe(selectedDate, onUpdate);
  }
};

const fallbackLocalSubscribe = (selectedDate, onUpdate) => {
  const notify = () => {
    const allTasks = getLocalTasks();
    const filtered = allTasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    onUpdate(filtered);
  };

  notify();

  const handleStorage = () => notify();
  window.addEventListener('daily_flow_tasks_updated', handleStorage);

  return () => {
    window.removeEventListener('daily_flow_tasks_updated', handleStorage);
  };
};

const triggerLocalUpdateEvent = () => {
  window.dispatchEvent(new Event('daily_flow_tasks_updated'));
};

/**
 * Add a new task directly to Firebase Realtime Database
 */
export const addTask = async ({ title, category, date }) => {
  const cleanedTitle = title.trim();
  if (!cleanedTitle) return null;

  if (isFirebaseConfigured && db) {
    try {
      const dateTasksRef = ref(db, `tasks/${date}`);
      const newTaskRef = push(dateTasksRef);
      const newTaskObj = {
        title: cleanedTitle,
        category, // 'top3' or 'secondary'
        completed: false,
        date, // YYYY-MM-DD
        order: Date.now(),
        createdAt: Date.now(),
      };
      await set(newTaskRef, newTaskObj);
      return { id: newTaskRef.key, ...newTaskObj };
    } catch (err) {
      console.error('[Daily Flow] Realtime DB addTask failed:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  // Fallback / Local
  const localTasks = getLocalTasks();
  const newTask = {
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: cleanedTitle,
    category,
    completed: false,
    date,
    order: Date.now(),
    createdAt: Date.now(),
  };

  localTasks.push(newTask);
  saveLocalTasks(localTasks);
  triggerLocalUpdateEvent();
  return newTask;
};

/**
 * Toggle completed state in Realtime Database
 */
export const toggleTaskCompleted = async (taskId, currentCompletedState, date) => {
  const newStatus = !currentCompletedState;

  if (isFirebaseConfigured && db) {
    try {
      const taskRef = ref(db, `tasks/${date}/${taskId}`);
      await update(taskRef, { completed: newStatus });
      return;
    } catch (err) {
      console.error('[Daily Flow] Realtime DB toggleTaskCompleted error:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  // Fallback / Local
  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: newStatus } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Update task title inline in Realtime Database
 */
export const updateTaskTitle = async (taskId, newTitle, date) => {
  const cleaned = newTitle.trim();
  if (!cleaned) return;

  if (isFirebaseConfigured && db) {
    try {
      const taskRef = ref(db, `tasks/${date}/${taskId}`);
      await update(taskRef, { title: cleaned });
      return;
    } catch (err) {
      console.error('[Daily Flow] Realtime DB updateTaskTitle error:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, title: cleaned } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Move task between categories ('top3' <-> 'secondary') in Realtime Database
 */
export const updateTaskCategory = async (taskId, newCategory, date) => {
  if (isFirebaseConfigured && db) {
    try {
      const taskRef = ref(db, `tasks/${date}/${taskId}`);
      await update(taskRef, { category: newCategory });
      return;
    } catch (err) {
      console.error('[Daily Flow] Realtime DB updateTaskCategory error:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, category: newCategory } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Delete task from Realtime Database (removes key completely under tasks/date/taskId)
 */
export const deleteTask = async (taskId, date) => {
  if (isFirebaseConfigured && db) {
    try {
      const taskRef = ref(db, `tasks/${date}/${taskId}`);
      await remove(taskRef);
      return;
    } catch (err) {
      console.error('[Daily Flow] Realtime DB deleteTask error:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.filter((t) => t.id !== taskId);
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Save reordered list of tasks in Realtime Database
 */
export const saveTaskOrders = async (reorderedTasks, date) => {
  if (isFirebaseConfigured && db && date) {
    try {
      const updates = {};
      reorderedTasks.forEach((task, index) => {
        updates[`tasks/${date}/${task.id}/order`] = index;
        updates[`tasks/${date}/${task.id}/category`] = task.category;
      });
      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (err) {
      console.error('[Daily Flow] Realtime DB batch reorder error:', err);
      window.dispatchEvent(new CustomEvent('daily_flow_firebase_error', { detail: err }));
    }
  }

  // Sync to local
  const allTasks = getLocalTasks();
  const reorderedMap = new Map(reorderedTasks.map((t, idx) => [t.id, { order: idx, category: t.category }]));

  const updatedAll = allTasks.map((t) => {
    if (reorderedMap.has(t.id)) {
      const info = reorderedMap.get(t.id);
      return { ...t, order: info.order, category: info.category };
    }
    return t;
  });

  saveLocalTasks(updatedAll);
  triggerLocalUpdateEvent();
};
