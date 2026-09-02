import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  writeBatch
} from 'firebase/firestore';
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

// Default seed data for brand-new users in demo mode
const seedInitialDataIfNeeded = () => {
  const existing = getLocalTasks();
  if (existing.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    const initialTasks = [
      {
        id: 'seed-1',
        title: 'Review quarterly strategy document',
        category: 'top3',
        completed: false,
        date: today,
        order: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'seed-2',
        title: 'Conduct team sync meeting',
        category: 'top3',
        completed: true,
        date: today,
        order: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 'seed-3',
        title: 'Finalize UI design mockup for mobile',
        category: 'top3',
        completed: false,
        date: today,
        order: 2,
        createdAt: new Date().toISOString()
      },
      {
        id: 'seed-4',
        title: 'Clear email inbox & reply to clients',
        category: 'secondary',
        completed: true,
        date: today,
        order: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'seed-5',
        title: '30-minute afternoon workout',
        category: 'secondary',
        completed: false,
        date: today,
        order: 1,
        createdAt: new Date().toISOString()
      }
    ];
    saveLocalTasks(initialTasks);
  }
};

/**
 * Subscribe to tasks for a specific date (YYYY-MM-DD).
 * Returns an unsubscribe function.
 */
export const subscribeToTasks = (selectedDate, onUpdate, onError) => {
  if (isFirebaseConfigured && db) {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('date', '==', selectedDate)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tasksList = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          // Sort in memory by order or createdAt
          tasksList.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
          });

          onUpdate(tasksList);
        },
        (error) => {
          console.warn('Firestore snapshot error, falling back to local storage:', error);
          if (onError) onError(error);
          fallbackLocalSubscribe(selectedDate, onUpdate);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Error subscribing to Firestore, falling back to local:', err);
      return fallbackLocalSubscribe(selectedDate, onUpdate);
    }
  } else {
    return fallbackLocalSubscribe(selectedDate, onUpdate);
  }
};

const fallbackLocalSubscribe = (selectedDate, onUpdate) => {
  seedInitialDataIfNeeded();
  const notify = () => {
    const allTasks = getLocalTasks();
    const filtered = allTasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    onUpdate(filtered);
  };

  notify();

  // Listen to window custom storage events
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
 * Add a new task
 */
export const addTask = async ({ title, category, date }) => {
  const cleanedTitle = title.trim();
  if (!cleanedTitle) return null;

  if (isFirebaseConfigured && db) {
    try {
      // Calculate highest order
      const tasksRef = collection(db, 'tasks');
      const docRef = await addDoc(tasksRef, {
        title: cleanedTitle,
        category, // 'top3' or 'secondary'
        completed: false,
        date, // YYYY-MM-DD
        order: Date.now(),
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id, title: cleanedTitle, category, completed: false, date };
    } catch (err) {
      console.error('Firestore addTask failed, writing locally:', err);
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
    createdAt: new Date().toISOString(),
  };

  localTasks.push(newTask);
  saveLocalTasks(localTasks);
  triggerLocalUpdateEvent();
  return newTask;
};

/**
 * Toggle completed state
 */
export const toggleTaskCompleted = async (taskId, currentCompletedState) => {
  const newStatus = !currentCompletedState;

  if (isFirebaseConfigured && db && !taskId.startsWith('local-') && !taskId.startsWith('seed-')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { completed: newStatus });
      return;
    } catch (err) {
      console.error('Firestore toggleTaskCompleted error:', err);
    }
  }

  // Fallback / Local
  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: newStatus } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Update task title inline
 */
export const updateTaskTitle = async (taskId, newTitle) => {
  const cleaned = newTitle.trim();
  if (!cleaned) return;

  if (isFirebaseConfigured && db && !taskId.startsWith('local-') && !taskId.startsWith('seed-')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { title: cleaned });
      return;
    } catch (err) {
      console.error('Firestore updateTaskTitle error:', err);
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, title: cleaned } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Move task between categories ('top3' <-> 'secondary')
 */
export const updateTaskCategory = async (taskId, newCategory) => {
  if (isFirebaseConfigured && db && !taskId.startsWith('local-') && !taskId.startsWith('seed-')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { category: newCategory });
      return;
    } catch (err) {
      console.error('Firestore updateTaskCategory error:', err);
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, category: newCategory } : t));
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Delete task
 */
export const deleteTask = async (taskId) => {
  if (isFirebaseConfigured && db && !taskId.startsWith('local-') && !taskId.startsWith('seed-')) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      return;
    } catch (err) {
      console.error('Firestore deleteTask error:', err);
    }
  }

  const tasks = getLocalTasks();
  const updated = tasks.filter((t) => t.id !== taskId);
  saveLocalTasks(updated);
  triggerLocalUpdateEvent();
};

/**
 * Save reordered list of tasks
 */
export const saveTaskOrders = async (reorderedTasks) => {
  if (isFirebaseConfigured && db) {
    try {
      const batch = writeBatch(db);
      reorderedTasks.forEach((task, index) => {
        if (!task.id.startsWith('local-') && !task.id.startsWith('seed-')) {
          const ref = doc(db, 'tasks', task.id);
          batch.update(ref, { order: index, category: task.category });
        }
      });
      await batch.commit();
    } catch (err) {
      console.error('Firestore batch reorder error:', err);
    }
  }

  // Sync to local as well
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
