import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Activity as ActivityIcon,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Avatar, AvatarGroup } from '../components/common/Avatar';
import { formatDate, formatTimeAgo, formatINR, isOverdue } from '../utils/formatters';
import { Task, Project, User, ActivityLog } from '../types';

export const DashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const {
    currentUser,
    projects,
    tasks,
    activities,
    users,
    setSelectedTaskId,
    setIsNewTaskOpen,
    setIsNewProjectOpen,
  } = useApp();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const name = currentUser?.name?.split(' ')[0] || 'Member';

  // Metrics
  const totalProjects = projects.length;
  const activeTasks = tasks.filter((t: Task) => t.status !== 'completed').length;
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length;
  const overdueTasks = tasks.filter(
    (t: Task) => isOverdue(t.dueDate) && t.status !== 'completed'
  ).length;

  // My Tasks
  const myTasks = tasks
    .filter((t: Task) => t.assigneeId === currentUser?.id && t.status !== 'completed')
    .slice(0, 5);

  // Priority Tasks (Urgent & High)
  const priorityTasks = tasks
    .filter((t: Task) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed')
    .slice(0, 5);

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = tasks
    .filter((t: Task) => t.status !== 'completed' && t.dueDate)
    .sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, {name}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
            Here's what needs your attention today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
          <button
            type="button"
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-neutral-950 text-blue-700 dark:text-neutral-200 border border-blue-200 dark:border-neutral-800 hover:bg-blue-100/60 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>
        </div>
      </div>

      {/* Top 4 Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div
          onClick={() => onNavigate('/projects')}
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-neutral-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
            {totalProjects}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500">
            {projects.filter((p: Project) => p.status === 'active').length} actively running
          </p>
        </div>

        {/* Active Tasks */}
        <div
          onClick={() => onNavigate('/tasks')}
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Active Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-neutral-800 text-sky-600 dark:text-neutral-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
            {activeTasks}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500">
            In queue & in development
          </p>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => onNavigate('/tasks')}
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
            {completedTasks}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {Math.round((completedTasks / (tasks.length || 1)) * 100)}% completion rate
          </p>
        </div>

        {/* Overdue Tasks */}
        <div
          onClick={() => onNavigate('/tasks')}
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-neutral-800 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mb-1">
            {overdueTasks}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-neutral-500">
            Requires immediate focus
          </p>
        </div>
      </div>

      {/* Main Content Split: 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2-cols wide): My Tasks, Recent Projects, Project Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  My Tasks
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-neutral-800 text-blue-700 dark:text-neutral-300">
                  {myTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/tasks')}
                className="text-xs font-semibold text-blue-600 dark:text-neutral-300 hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myTasks.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-neutral-500 text-center py-6">
                No active tasks assigned to you right now. Great job!
              </p>
            ) : (
              <div className="space-y-2">
                {myTasks.map((t: Task) => {
                  const proj = projects.find((p: Project) => p.id === t.projectId);
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-colors group"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <PriorityBadge priority={t.priority} />
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
                            {proj?.code}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 truncate">
                          {t.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-medium block ${
                            isOverdue(t.dueDate)
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-500 dark:text-neutral-400'
                          }`}
                        >
                          Due {formatDate(t.dueDate)}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-neutral-500 capitalize">
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Projects
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('/projects')}
                className="text-xs font-semibold text-blue-600 dark:text-neutral-300 hover:underline flex items-center gap-1"
              >
                All Projects <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((proj: Project) => {
                const projMembers = users.filter((u: User) => proj.memberIds?.includes(u.id));
                const projTasks = tasks.filter((t: Task) => t.projectId === proj.id);
                const completedCount = projTasks.filter((t: Task) => t.status === 'completed').length;
                const progress =
                  projTasks.length > 0
                    ? Math.round((completedCount / projTasks.length) * 100)
                    : proj.progress || 0;

                return (
                  <div
                    key={proj.id}
                    onClick={() => onNavigate(`/projects/${proj.id}`)}
                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-neutral-500">
                          {proj.code}
                        </span>
                        <StatusBadge status={proj.status} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 mb-1 line-clamp-1">
                        {proj.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-neutral-900">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-neutral-400 font-medium">
                          {completedCount}/{projTasks.length} tasks completed
                        </span>
                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-white h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <AvatarGroup users={projMembers} max={3} size="xs" />
                        {proj.budgetINR !== undefined && (
                          <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-400">
                            {formatINR(proj.budgetINR)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Progress Overview */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Project Progress
            </h2>
            <div className="space-y-4">
              {projects.map((proj: Project) => {
                const projTasks = tasks.filter((t: Task) => t.projectId === proj.id);
                const done = projTasks.filter((t: Task) => t.status === 'completed').length;
                const pct =
                  projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : proj.progress || 0;

                return (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-neutral-200">
                        {proj.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 dark:text-neutral-500 font-mono">
                          {done}/{projTasks.length} tasks
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-white h-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Priority Tasks, Upcoming Deadlines, Team Activity */}
        <div className="space-y-6">
          {/* Priority Tasks */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Priority Tasks
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500">
                {priorityTasks.length} urgent
              </span>
            </div>

            <div className="space-y-2.5">
              {priorityTasks.map((t: Task) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="p-3 rounded-xl bg-slate-50/70 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 cursor-pointer hover:border-slate-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                      {formatDate(t.dueDate)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {t.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-neutral-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Upcoming Deadlines
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('/calendar')}
                className="text-xs font-semibold text-blue-600 dark:text-neutral-300 hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2">
              {upcomingDeadlines.map((t: Task) => {
                const overdue = isOverdue(t.dueDate);
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-neutral-200 truncate">
                        {t.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-neutral-500 capitalize">
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-bold shrink-0 ${
                        overdue ? 'text-rose-600' : 'text-slate-600 dark:text-neutral-300'
                      }`}
                    >
                      {formatDate(t.dueDate)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Activity */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <ActivityIcon className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Team Activity
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 5).map((act: ActivityLog) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <Avatar avatarUrl={act.userAvatar} name={act.userName} size="xs" />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 dark:text-neutral-200 leading-snug">
                      <span className="font-bold">{act.userName}</span>{' '}
                      <span className="text-slate-500 dark:text-neutral-400">{act.action}</span>
                    </p>
                    {act.details && (
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                        {act.details}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
