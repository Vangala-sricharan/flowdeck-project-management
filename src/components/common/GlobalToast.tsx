import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const GlobalToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
          toast.type === 'error'
            ? 'bg-rose-50 dark:bg-neutral-900 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
            : toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-neutral-900 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100'
            : 'bg-blue-50 dark:bg-neutral-900 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-neutral-300" />}
        </div>
        <div className="text-xs sm:text-sm font-medium leading-relaxed">
          {toast.text}
        </div>
      </div>
    </div>
  );
};
