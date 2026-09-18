import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { exportWorkspaceData, importWorkspaceData, clearWorkspaceData } from '../utils/storage';
import {
  Settings,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  IndianRupee,
  Database,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      const dataStr = exportWorkspaceData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowdeck-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Workspace JSON exported successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to export workspace data.' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importWorkspaceData(content);
        if (success) {
          setMessage({ type: 'success', text: 'Workspace restored successfully! Reloading...' });
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setMessage({ type: 'error', text: 'Invalid workspace backup file.' });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data back to the default demo state? Custom tasks and projects will be reset.')) {
      clearWorkspaceData();
      setMessage({ type: 'success', text: 'Workspace reset to default. Reloading...' });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
          Configure preferences, visual appearance, currency standards, and backup controls.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Theme & Visual Appearance */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
          Theme & Display
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20 dark:bg-neutral-800/40'
                : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Light Theme</span>
              {theme === 'light' && (
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Clean Blue & White aesthetic optimized for high daytime readability.
            </p>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-white ring-2 ring-white/20 bg-neutral-800/40'
                : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Dark Theme</span>
              {theme === 'dark' && (
                <span className="text-[10px] font-bold text-slate-900 dark:text-black bg-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Minimalist Black & White high-contrast interface designed for night-time focus.
            </p>
          </div>
        </div>
      </div>

      {/* Currency & Localization */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Currency & Localization
        </h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
          FLOWDECK formats all project budgets and cost metrics strictly using the Indian Rupee (₹) and Indian Numbering System (Lakhs & Crores).
        </p>
        <div className="p-3 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs text-slate-700 dark:text-neutral-300 flex items-center justify-between">
          <span>Active Currency Standard:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            ₹ INR (Indian Rupee)
          </span>
        </div>
      </div>

      {/* Data Management & Persistence */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
          Data Backup & Persistence (Serverless-First)
        </h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
          Your FLOWDECK workspace is preserved in high-speed browser local storage with zero server dependency. Export backup files to migrate between computers or keep your data safe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Backup JSON
          </button>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import Backup JSON
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Demo State
          </button>
        </div>
      </div>
    </div>
  );
};
