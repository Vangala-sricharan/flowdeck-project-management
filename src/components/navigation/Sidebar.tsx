import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Users,
  Bell,
  Settings,
  User,
  ShieldCheck,
  LogOut,
  Layers,
  Plus,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, onCloseMobile }) => {
  const {
    currentUser,
    unreadNotificationCount,
    logout,
    setIsNewTaskOpen,
    setIsNewProjectOpen,
    theme,
    toggleTheme,
  } = useApp();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/team', icon: Users },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
  ];

  const bottomItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Admin Workspace', path: '/admin', icon: ShieldCheck },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-100 dark:border-neutral-800">
          <div
            onClick={() => handleNav('/dashboard')}
            className="cursor-pointer group flex items-center gap-2.5"
          >
            {/* Minimalist Geometric Logo */}
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-white uppercase font-mono">
                  FLOWDECK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.2 bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-neutral-400 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                Plan. Collaborate. Deliver.
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </button>
            <button
              type="button"
              onClick={() => setIsNewProjectOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-neutral-300 border border-blue-200 dark:border-neutral-800 hover:bg-blue-100/60 dark:hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Project
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path === '/projects' && currentPath.startsWith('/projects'));
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-white border border-blue-200/80 dark:border-neutral-700'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600 dark:text-white' : 'text-slate-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 dark:bg-white text-white dark:text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-3 border-t border-slate-100 dark:border-neutral-800 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
          System
        </div>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-white border border-blue-200/80 dark:border-neutral-700'
                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-neutral-200'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-blue-600 dark:text-white' : 'text-slate-400 dark:text-neutral-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Theme quick switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-neutral-200 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          <div className="flex items-center gap-2.5">
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400">
            {theme}
          </span>
        </button>

        {/* User Card & Logout */}
        {currentUser ? (
          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-neutral-950">
            <div
              onClick={() => handleNav('/profile')}
              className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
            >
              <Avatar user={currentUser} size="xs" showStatus />
              <div className="min-w-0 flex-1 truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-neutral-500 truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
              title="Logout demo session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleNav('/login')}
            className="w-full text-center py-2 text-xs font-semibold text-blue-600 dark:text-white hover:underline"
          >
            Demo Sign In
          </button>
        )}
      </div>
    </aside>
  );
};
