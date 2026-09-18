import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, Priority, User, Project } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { StatusBadge, PriorityBadge, LabelBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { formatDate, isOverdue } from '../utils/formatters';
import {
  Plus,
  Search,
  Kanban,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    projects,
    users,
    setSelectedTaskId,
    setIsNewTaskOpen,
    updateTaskStatus,
  } = useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assigneeId === assigneeFilter;

      return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, projectFilter, statusFilter, priorityFilter, assigneeFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Track, assign, prioritize, and complete tasks across all workspace initiatives.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl border border-slate-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description, label..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
          />
        </div>

        {/* Multi-Filter Selects */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map((p: Project) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Assignees</option>
            {users.map((u: User) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View Mode */}
      {viewMode === 'board' ? (
        <KanbanBoard
          projectId={projectFilter === 'all' ? undefined : projectFilter}
          searchQuery={searchQuery}
          priorityFilter={priorityFilter}
        />
      ) : (
        /* List View */
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 w-10"></th>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Labels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No tasks found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t: Task) => {
                    const proj = projects.find((p: Project) => p.id === t.projectId);
                    const assignee = users.find((u: User) => u.id === t.assigneeId);
                    const overdue = isOverdue(t.dueDate) && t.status !== 'completed';

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-neutral-950/60 cursor-pointer transition-colors group"
                      >
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTaskStatus(
                                t.id,
                                t.status === 'completed' ? 'todo' : 'completed'
                              );
                            }}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              t.status === 'completed'
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-neutral-700 hover:border-blue-500'
                            }`}
                          >
                            {t.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                        </td>

                        <td
                          className="px-4 py-3 font-semibold text-slate-900 dark:text-white"
                          onClick={() => setSelectedTaskId(t.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={
                                t.status === 'completed'
                                  ? 'line-through text-slate-400 dark:text-neutral-500'
                                  : ''
                              }
                            >
                              {t.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400 font-bold">
                            {proj?.code}
                          </span>
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          <StatusBadge status={t.status} />
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          <PriorityBadge priority={t.priority} />
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          {assignee && (
                            <div className="flex items-center gap-1.5">
                              <Avatar user={assignee} size="xs" />
                              <span className="text-slate-700 dark:text-neutral-300">
                                {assignee.name}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          <span
                            className={
                              overdue
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-600 dark:text-neutral-300'
                            }
                          >
                            {formatDate(t.dueDate)}
                          </span>
                        </td>

                        <td className="px-4 py-3" onClick={() => setSelectedTaskId(t.id)}>
                          <div className="flex items-center gap-1 flex-wrap">
                            {t.labels.map((lbl) => (
                              <LabelBadge key={lbl} label={lbl} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
