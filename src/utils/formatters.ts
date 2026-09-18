/**
 * Indian Rupee (INR) formatting helper adhering to user guidelines:
 * Display all prices using the ₹ symbol and Indian numbering system.
 * E.g., ₹299, ₹1,499, ₹12,999, ₹1,85,000.
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `₹${formatted}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(dateString);
}

export function isOverdue(dueDateString: string): boolean {
  if (!dueDateString) return false;
  const due = new Date(dueDateString);
  if (isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

export function isToday(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isTomorrow(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

export type DueClassification = 'overdue' | 'due_today' | 'due_tomorrow' | 'upcoming' | 'completed';

export function getDueClassification(dueDateString: string, status?: string): DueClassification {
  if (status === 'completed') return 'completed';
  if (!dueDateString) return 'upcoming';

  const due = new Date(dueDateString);
  if (isNaN(due.getTime())) return 'upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'due_today';
  if (diffDays === 1) return 'due_tomorrow';
  return 'upcoming';
}

export function getDueLabel(classification: DueClassification): { label: string; color: string; bg: string } {
  switch (classification) {
    case 'completed':
      return { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-neutral-800' };
    case 'overdue':
      return { label: 'Overdue', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-neutral-800' };
    case 'due_today':
      return { label: 'Due Today', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-neutral-800' };
    case 'due_tomorrow':
      return { label: 'Due Tomorrow', color: 'text-blue-600 dark:text-neutral-300', bg: 'bg-blue-50 dark:bg-neutral-800' };
    case 'upcoming':
    default:
      return { label: 'Upcoming', color: 'text-slate-600 dark:text-neutral-400', bg: 'bg-slate-50 dark:bg-neutral-800' };
  }
}
