import React from 'react';
import { User } from '../../types';

interface AvatarProps {
  user?: User | null;
  name?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'active' | 'away' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  name,
  avatarUrl,
  size = 'md',
  showStatus = false,
  status,
  className = '',
}) => {
  const displayName = user?.name || name || 'User';
  const url = user?.avatar || avatarUrl;
  const userStatus = status || user?.status || 'offline';

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusDotSizes: Record<string, string> = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColors = {
    active: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400 dark:bg-neutral-500',
  };

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {url ? (
        <img
          src={url}
          alt={displayName}
          referrerPolicy="no-referrer"
          className={`${sizeClasses[size]} rounded-full object-cover border border-slate-200 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-blue-100 dark:bg-neutral-800 text-blue-700 dark:text-neutral-200 border border-blue-200 dark:border-neutral-700 font-semibold flex items-center justify-center`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white dark:ring-neutral-900 ${
            statusDotSizes[size]
          } ${statusColors[userStatus]}`}
          title={`Status: ${userStatus}`}
        />
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{
  users: User[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}> = ({ users, max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
  };

  return (
    <div className="inline-flex items-center -space-x-2 overflow-hidden py-0.5">
      {visible.map((user) => (
        <Avatar
          key={user.id}
          user={user}
          size={size}
          className="ring-2 ring-white dark:ring-neutral-900 shadow-xs"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 font-medium flex items-center justify-center ring-2 ring-white dark:ring-neutral-900 text-[11px] border border-slate-200 dark:border-neutral-700`}
          title={`${remaining} more team members`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
