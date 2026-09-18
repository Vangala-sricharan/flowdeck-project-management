import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Folder,
  CheckSquare,
  Users,
  ArrowRight,
  Plus,
  FolderKanban,
  BarChart3,
  LayoutDashboard,
  Calendar,
  Sun,
  Moon,
  Download,
  Zap,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { storage } from '../../utils/storage';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    projects,
    tasks,
    users,
    setSelectedTaskId,
    setIsNewTaskOpen,
    setIsNewProjectOpen,
    theme,
    toggleTheme,
    showToast,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'projects' | 'team' | 'actions'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const quickActions = [
    {
      id: 'act-new-task',
      title: 'Create New Task',
      description: 'Add a new work item with priority, due date, and assignees',
      icon: Plus,
      category: 'Quick Action',
      action: () => {
        setIsSearchOpen(false);
        setIsNewTaskOpen(true);
      },
    },
    {
      id: 'act-new-project',
      title: 'Create New Project',
      description: 'Launch a new project workspace with budget & timeline',
      icon: FolderKanban,
      category: 'Quick Action',
      action: () => {
        setIsSearchOpen(false);
        setIsNewProjectOpen(true);
      },
    },
    {
      id: 'act-analytics',
      title: 'Open Analytics & Metrics',
      description: 'Review task completion rates, workload distribution & velocity',
      icon: BarChart3,
      category: 'Navigation',
      action: () => {
        setIsSearchOpen(false);
        window.location.hash = '#/analytics';
      },
    },
    {
      id: 'act-dashboard',
      title: 'Go to Dashboard',
      description: 'Overview of all active projects, priority tasks, and progress',
      icon: LayoutDashboard,
      category: 'Navigation',
      action: () => {
        setIsSearchOpen(false);
        window.location.hash = '#/dashboard';
      },
    },
    {
      id: 'act-projects',
      title: 'Go to Projects',
      description: 'Browse all project workspaces and boards',
      icon: FolderKanban,
      category: 'Navigation',
      action: () => {
        setIsSearchOpen(false);
        window.location.hash = '#/projects';
      },
    },
    {
      id: 'act-calendar',
      title: 'Go to Schedule & Calendar',
      description: 'Timeline and calendar view of project deadlines and milestones',
      icon: Calendar,
      category: 'Navigation',
      action: () => {
        setIsSearchOpen(false);
        window.location.hash = '#/calendar';
      },
    },
    {
      id: 'act-team',
      title: 'Go to Team Directory',
      description: 'View members, workload, roles, and profiles',
      icon: Users,
      category: 'Navigation',
      action: () => {
        setIsSearchOpen(false);
        window.location.hash = '#/team';
      },
    },
    {
      id: 'act-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      description: `Toggle application visual theme to ${theme === 'dark' ? 'Light' : 'Dark'}`,
      icon: theme === 'dark' ? Sun : Moon,
      category: 'Preferences',
      action: () => {
        toggleTheme();
        showToast(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} mode`, 'info');
      },
    },
    {
      id: 'act-export',
      title: 'Export Workspace JSON',
      description: 'Download full backup of projects, tasks, comments, and members',
      icon: Download,
      category: 'Workspace',
      action: () => {
        const jsonStr = storage.exportWorkspaceJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flowdeck-workspace-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Workspace backup exported successfully!', 'success');
        setIsSearchOpen(false);
      },
    },
  ];

  const matchingActions = quickActions.filter(
    (act) =>
      act.title.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query) ||
      act.category.toLowerCase().includes(query)
  );

  const matchingProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  );

  const matchingTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.labels.some((lbl) => lbl.toLowerCase().includes(query))
  );

  const matchingUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.role.toLowerCase().includes(query)
  );

  const totalResults =
    (filterType === 'all' || filterType === 'actions' ? matchingActions.length : 0) +
    (filterType === 'all' || filterType === 'projects' ? matchingProjects.length : 0) +
    (filterType === 'all' || filterType === 'tasks' ? matchingTasks.length : 0) +
    (filterType === 'all' || filterType === 'team' ? matchingUsers.length : 0);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsSearchOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    window.location.hash = `#/projects/${projectId}`;
    setIsSearchOpen(false);
  };

  const handleSelectUser = () => {
    window.location.hash = `#/team`;
    setIsSearchOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-24"
      onClick={() => setIsSearchOpen(false)}
      id="global-search-modal-backdrop"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
        id="global-search-modal"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900">
          <Search className="w-5 h-5 text-slate-400 dark:text-neutral-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command or search projects, tasks, members..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 mr-2"
            >
              Clear
            </button>
          )}
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/70 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400">
            ESC
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterType === 'all'
                ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('actions')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filterType === 'actions'
                ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            <Zap className="w-3 h-3" /> Actions ({matchingActions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tasks')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterType === 'tasks'
                ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            Tasks ({matchingTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('projects')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterType === 'projects'
                ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            Projects ({matchingProjects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('team')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
              filterType === 'team'
                ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900'
            }`}
          >
            Team ({matchingUsers.length})
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
                No results found
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                We couldn't find any matches for "{searchQuery}". Try a different keyword or action.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Actions / Commands */}
              {(filterType === 'all' || filterType === 'actions') && matchingActions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    <Zap className="w-3.5 h-3.5 text-blue-500 dark:text-neutral-400" />
                    <span>Quick Actions ({matchingActions.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingActions.map((act) => {
                      const IconComponent = act.icon;
                      return (
                        <div
                          key={act.id}
                          onClick={act.action}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/50 dark:hover:bg-neutral-850 border border-transparent hover:border-blue-100 dark:hover:border-neutral-800 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-700 dark:text-neutral-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors shrink-0">
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 truncate">
                                  {act.title}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400">
                                  {act.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                                {act.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks Results */}
              {(filterType === 'all' || filterType === 'tasks') && matchingTasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks ({matchingTasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingTasks.map((t) => {
                      const proj = projects.find((p) => p.id === t.projectId);
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTask(t.id)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 cursor-pointer transition-colors group"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 truncate">
                                {t.title}
                              </span>
                              <PriorityBadge priority={t.priority} />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-neutral-500">
                              <span>{proj?.name || 'Project'}</span>
                              <span>•</span>
                              <span className="capitalize">{t.status.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Projects Results */}
              {(filterType === 'all' || filterType === 'projects') && matchingProjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    <Folder className="w-3.5 h-3.5" />
                    <span>Projects ({matchingProjects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProject(p.id)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 truncate">
                              {p.name}
                            </span>
                            <StatusBadge status={p.status} />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                            {p.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members Results */}
              {(filterType === 'all' || filterType === 'team') && matchingUsers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Members ({matchingUsers.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={handleSelectUser}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 cursor-pointer transition-colors"
                      >
                        <Avatar user={u} size="sm" showStatus />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-neutral-500 truncate">
                            {u.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 text-[11px] text-slate-500 dark:text-neutral-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>FLOWDECK Command Palette</span>
            <span className="hidden sm:inline-block text-slate-300 dark:text-neutral-700">•</span>
            <span className="hidden sm:inline-block">Type to filter actions & resources</span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
