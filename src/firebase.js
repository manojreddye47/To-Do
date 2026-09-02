import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyARzyCoT4LPXWGwJfHYxeGmoKcwT-abn-8",
  authDomain: "to-do-7331a.firebaseapp.com",
  projectId: "to-do-7331a",
  storageBucket: "to-do-7331a.firebasestorage.app",
  messagingSenderId: "115541188948",
  appId: "1:115541188948:web:677867653947b960f028c1",
  measurementId: "G-Y316SDRSG7"
};

// Safely resolve environment variables from standard CRA (REACT_APP_) or Vite (VITE_)
const getEnvVar = (key, fallbackDefault = '') => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    const viteKey = `VITE_${key.replace('REACT_APP_', '')}`;
    if (process.env[viteKey]) return process.env[viteKey];
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[key]) return import.meta.env[key];
    const viteKey = `VITE_${key.replace('REACT_APP_', '')}`;
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  }
  // Try checking localStorage for dynamically configured credentials
  try {
    const customConfig = localStorage.getItem('daily_flow_firebase_config');
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed[key]) return parsed[key];
    }
  } catch (e) {
    // Ignore storage parse error
  }
  return fallbackDefault;
};

export const getFirebaseConfig = () => ({
  apiKey: getEnvVar('REACT_APP_FIREBASE_API_KEY', DEFAULT_FIREBASE_CONFIG.apiKey),
  authDomain: getEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN', DEFAULT_FIREBASE_CONFIG.authDomain),
  projectId: getEnvVar('REACT_APP_FIREBASE_PROJECT_ID', DEFAULT_FIREBASE_CONFIG.projectId),
  storageBucket: getEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET', DEFAULT_FIREBASE_CONFIG.storageBucket),
  messagingSenderId: getEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID', DEFAULT_FIREBASE_CONFIG.messagingSenderId),
  appId: getEnvVar('REACT_APP_FIREBASE_APP_ID', DEFAULT_FIREBASE_CONFIG.appId),
});

const config = getFirebaseConfig();

// Verify if required Firebase credentials exist
export const isFirebaseConfigured = Boolean(
  config.apiKey && 
  config.projectId && 
  config.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(config) : getApp();
    db = getFirestore(app);
    console.log('[Daily Flow] Connected to Firebase Firestore project:', config.projectId);
  } catch (error) {
    console.warn('[Daily Flow] Error initializing Firebase:', error);
    db = null;
  }
} else {
  console.info('[Daily Flow] Running in Local Storage Demo Mode.');
}

export { db };
export default app;
