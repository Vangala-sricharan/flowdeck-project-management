import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  CheckCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatTimeAgo } from '../../utils/formatters';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onNavigate,
  currentPath,
}) => {
  const {
    theme,
    toggleTheme,
    unreadNotificationCount,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    currentUser,
    setIsSearchOpen,
    setIsNewTaskOpen,
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbTitle = () => {
    if (currentPath.startsWith('/projects/')) return 'Project Workspace';
    switch (currentPath) {
      case '/dashboard':
        return 'Overview';
      case '/projects':
        return 'Projects';
      case '/analytics':
        return 'Analytics & Reports';
      case '/tasks':
        return 'My Tasks';
      case '/calendar':
        return 'Schedule';
      case '/team':
        return 'Team Directory';
      case '/notifications':
        return 'Notifications';
      case '/profile':
        return 'Account Profile';
      case '/settings':
        return 'Workspace Settings';
      case '/admin':
        return 'Admin Portal';
      default:
        return 'FLOWDECK';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-30">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-neutral-500 font-medium">FLOWDECK</span>
          <span className="text-slate-300 dark:text-neutral-600">/</span>
          <span className="font-bold text-slate-800 dark:text-neutral-200">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Middle: Global Search Trigger Button */}
      <div className="flex-1 max-w-md mx-2">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200/70 dark:hover:bg-neutral-800/80 rounded-lg border border-slate-200/80 dark:border-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            <span className="truncate">Search projects, tasks, team...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Add Task Button */}
        <button
          type="button"
          onClick={() => setIsNewTaskOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Task</span>
        </button>

        {/* Theme Toggle (Blue+White vs Black+White) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark (Black + White)' : 'Light (Blue + White)'} theme`}
          aria-label="Toggle visual theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-neutral-200" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
            className="p-2 relative rounded-lg text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-white" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-blue-600 dark:text-neutral-300 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 dark:text-neutral-500 text-center">
                    You're all caught up!
                  </p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkUrl) onNavigate(n.linkUrl);
                        setIsNotifDropdownOpen(false);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors ${
                        !n.read ? 'bg-blue-50/40 dark:bg-neutral-850' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-800 dark:text-neutral-200">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-neutral-500 shrink-0">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-neutral-400 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/notifications');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 dark:text-white hover:underline flex items-center justify-center gap-1 w-full"
                >
                  View Notification Center <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate('/profile')}
          className="flex items-center gap-2 pl-2 cursor-pointer group"
          title="Go to profile"
        >
          <Avatar user={currentUser} size="sm" showStatus />
          <span className="hidden lg:block text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
            {currentUser?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};
