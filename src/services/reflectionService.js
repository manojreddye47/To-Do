import { ref, onValue, set } from 'firebase/database';
import { db, isFirebaseConfigured } from '../firebase';

const LOCAL_STORAGE_KEY = 'daily_flow_reflections_v1';

const getLocalReflections = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveLocalReflection = (date, winText) => {
  try {
    const reflections = getLocalReflections();
    reflections[date] = winText;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reflections));
  } catch (e) {
    console.error('Failed to save local reflection:', e);
  }
};

/**
 * Subscribe to reflection for a specific date via Realtime Database
 */
export const subscribeToReflection = (selectedDate, onUpdate) => {
  if (isFirebaseConfigured && db) {
    try {
      const reflectionRef = ref(db, `reflections/${selectedDate}`);
      const unsubscribe = onValue(
        reflectionRef,
        (snapshot) => {
          const val = snapshot.val();
          if (val && typeof val.winText === 'string') {
            onUpdate(val.winText);
          } else {
            onUpdate(getLocalReflections()[selectedDate] || '');
          }
        },
        (err) => {
          console.warn('Realtime DB reflection error, using local:', err);
          onUpdate(getLocalReflections()[selectedDate] || '');
        }
      );

      return () => unsubscribe();
    } catch (e) {
      onUpdate(getLocalReflections()[selectedDate] || '');
      return () => {};
    }
  } else {
    onUpdate(getLocalReflections()[selectedDate] || '');
    const handleStorage = () => {
      onUpdate(getLocalReflections()[selectedDate] || '');
    };
    window.addEventListener('daily_flow_reflection_updated', handleStorage);
    return () => window.removeEventListener('daily_flow_reflection_updated', handleStorage);
  }
};

/**
 * Save daily win / reflection
 */
export const saveReflection = async (selectedDate, winText) => {
  saveLocalReflection(selectedDate, winText);
  window.dispatchEvent(new Event('daily_flow_reflection_updated'));

  if (isFirebaseConfigured && db) {
    try {
      const reflectionRef = ref(db, `reflections/${selectedDate}`);
      await set(reflectionRef, {
        date: selectedDate,
        winText,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error('Realtime DB saveReflection error:', err);
    }
  }
};
