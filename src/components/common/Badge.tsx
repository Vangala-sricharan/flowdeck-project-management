import React from 'react';
import { TaskPriority, TaskStatus, ProjectStatus, TaskLabel } from '../../types';

export const PriorityBadge: React.FC<{ priority: TaskPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const styles: Record<TaskPriority, { bg: string; dot: string; label: string }> = {
    low: {
      bg: 'bg-emerald-50 dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-neutral-700',
      dot: 'bg-emerald-500',
      label: 'Low',
    },
    medium: {
      bg: 'bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-neutral-300 border border-blue-200 dark:border-neutral-700',
      dot: 'bg-blue-500 dark:bg-neutral-400',
      label: 'Medium',
    },
    high: {
      bg: 'bg-amber-50 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-neutral-700',
      dot: 'bg-amber-500',
      label: 'High',
    },
    urgent: {
      bg: 'bg-rose-50 dark:bg-neutral-800 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-neutral-700',
      dot: 'bg-rose-500',
      label: 'Urgent',
    },
  };

  const current = styles[priority] || styles.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
};

export const StatusBadge: React.FC<{
  status: TaskStatus | ProjectStatus;
  size?: 'sm' | 'md';
}> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const getDetails = (s: string) => {
    switch (s) {
      case 'todo':
        return {
          label: 'To Do',
          style: 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          style: 'bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-neutral-200 border-blue-200 dark:border-neutral-700',
        };
      case 'in_review':
        return {
          label: 'In Review',
          style: 'bg-purple-50 dark:bg-neutral-800 text-purple-700 dark:text-neutral-300 border-purple-200 dark:border-neutral-700',
        };
      case 'completed':
        return {
          label: 'Completed',
          style: 'bg-emerald-50 dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-700',
        };
      case 'planning':
        return {
          label: 'Planning',
          style: 'bg-sky-50 dark:bg-neutral-800 text-sky-700 dark:text-neutral-300 border-sky-200 dark:border-neutral-700',
        };
      case 'active':
        return {
          label: 'Active',
          style: 'bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-neutral-200 border-blue-200 dark:border-neutral-700',
        };
      case 'on_hold':
        return {
          label: 'On Hold',
          style: 'bg-amber-50 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-neutral-700',
        };
      default:
        return {
          label: s,
          style: 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700',
        };
    }
  };

  const details = getDetails(status);

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${sizeClasses} ${details.style}`}
    >
      {details.label}
    </span>
  );
};

export const LabelBadge: React.FC<{ label: TaskLabel | string; onRemove?: () => void }> = ({
  label,
  onRemove,
}) => {
  const getStyle = (lbl: string) => {
    switch (lbl) {
      case 'Design':
        return 'bg-pink-50 dark:bg-neutral-800 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-neutral-700';
      case 'Development':
        return 'bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-neutral-700';
      case 'Testing':
        return 'bg-amber-50 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-neutral-700';
      case 'Documentation':
        return 'bg-teal-50 dark:bg-neutral-800 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-neutral-700';
      case 'Bug':
        return 'bg-rose-50 dark:bg-neutral-800 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-neutral-700';
      case 'Research':
        return 'bg-violet-50 dark:bg-neutral-800 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-neutral-700';
      case 'Meeting':
        return 'bg-emerald-50 dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-700';
      default:
        return 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getStyle(
        label
      )}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 ml-0.5 text-xs"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
