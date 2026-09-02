import React, { useState } from 'react';
import { X, Database, Key, ShieldCheck, CheckCircle, Save, RotateCcw } from 'lucide-react';
import { getFirebaseConfig, isFirebaseConfigured } from '../firebase';

export default function FirebaseModal({ isOpen, onClose }) {
  const currentConfig = getFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveCustomCredentials = (e) => {
    e.preventDefault();
    const configObj = {
      REACT_APP_FIREBASE_API_KEY: apiKey,
      REACT_APP_FIREBASE_AUTH_DOMAIN: authDomain,
      REACT_APP_FIREBASE_PROJECT_ID: projectId,
      REACT_APP_FIREBASE_STORAGE_BUCKET: storageBucket,
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
      REACT_APP_FIREBASE_APP_ID: appId,
    };

    localStorage.setItem('daily_flow_firebase_config', JSON.stringify(configObj));
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClearCustomConfig = () => {
    localStorage.removeItem('daily_flow_firebase_config');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Firebase Firestore Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure environment variables or local credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Alert */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              isFirebaseConfigured
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {isFirebaseConfigured
                  ? 'Firebase Firestore is Active'
                  : 'Running in Local Storage Demo Mode'}
              </p>
              <p className="mt-0.5 opacity-90 leading-relaxed">
                {isFirebaseConfigured
                  ? 'Real-time database sync is connected via environment variables.'
                  : 'You can set env variables in src/firebase.js or `.env` file, or input test credentials below.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveCustomCredentials} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                REACT_APP_FIREBASE_API_KEY
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  REACT_APP_FIREBASE_PROJECT_ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-task-app"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  REACT_APP_FIREBASE_AUTH_DOMAIN
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="my-task-app.firebaseapp.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  REACT_APP_FIREBASE_STORAGE_BUCKET
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="my-task-app.appspot.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  REACT_APP_FIREBASE_APP_ID
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456:web:abcd"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Credentials saved! Reloading application...
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClearCustomConfig}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Demo Mode
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save & Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
