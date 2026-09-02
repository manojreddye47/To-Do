import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
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
 * Subscribe to reflection for a specific date
 */
export const subscribeToReflection = (selectedDate, onUpdate) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'reflections', selectedDate);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data().winText || '');
        } else {
          // Check fallback query if doc ID wasn't date formatted
          onUpdate(getLocalReflections()[selectedDate] || '');
        }
      }, (err) => {
        console.warn('Reflection snapshot error, using local:', err);
        onUpdate(getLocalReflections()[selectedDate] || '');
      });
      return unsubscribe;
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
      const docRef = doc(db, 'reflections', selectedDate);
      await setDoc(docRef, {
        date: selectedDate,
        winText,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Firestore saveReflection error:', err);
    }
  }
};
