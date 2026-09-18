import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../utils/formatters';
import { Notification } from '../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';

export const NotificationsPage: React.FC<{ onNavigate: (path: string) => void }> = ({
  onNavigate,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    unreadNotificationCount,
  } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'deadline':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-purple-500" />;
      case 'task_assigned':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (id: string, linkUrl?: string) => {
    markNotificationRead(id);
    if (linkUrl) onNavigate(linkUrl);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notification Center
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black">
                {unreadNotificationCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Real-time updates regarding your tasks, team comments, and project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-slate-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-200">
              No notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              You're caught up with all tasks and team activities.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-neutral-800">
            {notifications.map((n: Notification) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.linkUrl)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !n.read
                    ? 'bg-blue-50/30 dark:bg-neutral-850/50 hover:bg-blue-50/60 dark:hover:bg-neutral-800'
                    : 'hover:bg-slate-50/80 dark:hover:bg-neutral-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-white" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-slate-400 dark:text-neutral-500 block">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                </div>

                {n.linkUrl && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 dark:text-neutral-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
