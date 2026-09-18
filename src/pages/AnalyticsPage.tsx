import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, Project, User, TaskPriority, TaskStatus } from '../types';
import { isOverdue, formatINR } from '../utils/formatters';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Users,
  Filter,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate?: (path: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { tasks, projects, users, setSelectedTaskId } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Filter tasks if project filter applied
  const scopedTasks = useMemo(() => {
    if (selectedProjectId === 'all') return tasks;
    return tasks.filter((t) => t.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Core metrics
  const totalTasks = scopedTasks.length;
  const completedTasks = scopedTasks.filter((t) => t.status === 'completed');
  const completedCount = completedTasks.length;
  const pendingTasks = scopedTasks.filter((t) => t.status !== 'completed');
  const pendingCount = pendingTasks.length;
  const overdueTasks = scopedTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'completed');
  const overdueCount = overdueTasks.length;

  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Status breakdown
  const statusCounts: Record<TaskStatus, number> = {
    todo: scopedTasks.filter((t) => t.status === 'todo').length,
    in_progress: scopedTasks.filter((t) => t.status === 'in_progress').length,
    in_review: scopedTasks.filter((t) => t.status === 'in_review').length,
    completed: completedCount,
  };

  // Priority breakdown
  const priorityCounts: Record<TaskPriority, number> = {
    low: scopedTasks.filter((t) => t.priority === 'low').length,
    medium: scopedTasks.filter((t) => t.priority === 'medium').length,
    high: scopedTasks.filter((t) => t.priority === 'high').length,
    urgent: scopedTasks.filter((t) => t.priority === 'urgent').length,
  };

  // Project progress breakdown
  const projectStats = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const pCompleted = pTasks.filter((t) => t.status === 'completed').length;
      const pOverdue = pTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'completed').length;
      const pRate = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;
      return {
        project: p,
        total: pTasks.length,
        completed: pCompleted,
        overdue: pOverdue,
        rate: pRate,
      };
    });
  }, [projects, tasks]);

  // Team Workload calculation
  const teamWorkload = useMemo(() => {
    return users.map((u) => {
      const uTasks = scopedTasks.filter((t) => t.assigneeId === u.id);
      const uCompleted = uTasks.filter((t) => t.status === 'completed').length;
      const uPending = uTasks.filter((t) => t.status !== 'completed').length;
      const uOverdue = uTasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'completed').length;
      const uRate = uTasks.length > 0 ? Math.round((uCompleted / uTasks.length) * 100) : 0;
      return {
        user: u,
        total: uTasks.length,
        completed: uCompleted,
        pending: uPending,
        overdue: uOverdue,
        rate: uRate,
      };
    });
  }, [users, scopedTasks]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Project Analytics
            </h1>
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 dark:bg-neutral-800 text-blue-700 dark:text-neutral-300 border border-blue-200 dark:border-neutral-700">
              Real-time local data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Workforce throughput, status distributions, velocity, and delivery reliability metrics.
          </p>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">Entire Workspace (All Projects)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Completion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completionRate}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-white rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            {completedCount} of {totalTasks} tasks resolved
          </span>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            Delivered successfully
          </span>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Tasks</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {pendingCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (pendingCount / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            Active in sprint workflow
          </span>
        </div>

        {/* Overdue Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {overdueCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (overdueCount / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            Requires immediate triage
          </span>
        </div>
      </div>

      {/* Breakdown Grid: Tasks by Status & Tasks by Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-white" />
              Tasks by Status
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {totalTasks} Total Tasks
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { status: 'todo', label: 'To Do', count: statusCounts.todo, color: 'bg-slate-400 dark:bg-neutral-500' },
              { status: 'in_progress', label: 'In Progress', count: statusCounts.in_progress, color: 'bg-blue-500' },
              { status: 'in_review', label: 'In Review', count: statusCounts.in_review, color: 'bg-purple-500' },
              { status: 'completed', label: 'Completed', count: statusCounts.completed, color: 'bg-emerald-500' },
            ].map((item) => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-neutral-300">
                      {item.label}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-neutral-400">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-white" />
              Tasks by Priority
            </h3>
            <span className="text-xs text-slate-400 font-medium">Urgency Breakdown</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { priority: 'urgent', label: 'Urgent', count: priorityCounts.urgent, color: 'bg-rose-500' },
              { priority: 'high', label: 'High', count: priorityCounts.high, color: 'bg-amber-500' },
              { priority: 'medium', label: 'Medium', count: priorityCounts.medium, color: 'bg-blue-500' },
              { priority: 'low', label: 'Low', count: priorityCounts.low, color: 'bg-emerald-500' },
            ].map((item) => {
              const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.priority} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={item.priority as TaskPriority} size="sm" />
                    </div>
                    <span className="font-mono text-slate-500 dark:text-neutral-400">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks by Project */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-white" />
            Project Performance & Delivery Rates
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {projects.length} Active Initiatives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {projectStats.map((stat) => (
            <div
              key={stat.project.id}
              onClick={() => onNavigate && onNavigate(`/projects/${stat.project.id}`)}
              className="p-4 rounded-xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-950/50 hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-neutral-500 block">
                    {stat.project.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 transition-colors">
                    {stat.project.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-blue-600 dark:text-neutral-200">
                    {stat.rate}%
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden my-2.5">
                <div
                  className="h-full bg-blue-600 dark:bg-white rounded-full transition-all duration-500"
                  style={{ width: `${stat.rate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
                <span>
                  Done: {stat.completed}/{stat.total}
                </span>
                {stat.overdue > 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    {stat.overdue} overdue
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    On track
                  </span>
                )}
                {stat.project.budgetINR !== undefined && (
                  <span className="font-mono font-semibold text-slate-700 dark:text-neutral-300">
                    {formatINR(stat.project.budgetINR)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Workload Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-white" />
            Team Workload & Capacity Allocation
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {users.length} Team Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Team Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-center">Assigned</th>
                <th className="px-4 py-3 text-center">Completed</th>
                <th className="px-4 py-3 text-center">Pending</th>
                <th className="px-4 py-3 text-center">Overdue</th>
                <th className="px-4 py-3">Capacity & Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {teamWorkload.map((member) => (
                <tr
                  key={member.user.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-neutral-950/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <Avatar user={member.user} size="sm" showStatus />
                      <span>{member.user.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-500 dark:text-neutral-400">
                    {member.user.role}
                  </td>

                  <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-neutral-200">
                    {member.total}
                  </td>

                  <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {member.completed}
                  </td>

                  <td className="px-4 py-3 text-center font-bold text-amber-600 dark:text-amber-400">
                    {member.pending}
                  </td>

                  <td className="px-4 py-3 text-center font-bold">
                    {member.overdue > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">{member.overdue}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>

                  <td className="px-4 py-3 w-48">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 dark:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${member.rate}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-neutral-300 shrink-0 w-8">
                        {member.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
