import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectStatus, Task, User } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskCalendar } from '../components/calendar/TaskCalendar';
import { StatusBadge, PriorityBadge, LabelBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { formatDate, formatINR, isOverdue } from '../utils/formatters';
import {
  ArrowLeft,
  Plus,
  Kanban,
  ListFilter,
  Calendar,
  Users,
  Trash2,
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onNavigate }) => {
  const {
    projects,
    tasks,
    users,
    updateProject,
    deleteProject,
    setSelectedTaskId,
    setIsNewTaskOpen,
    setNewTaskInitialProjectId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'calendar' | 'team'>('board');

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-4">
          The requested project workspace may have been deleted or does not exist.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/projects')}
          className="px-4 py-2 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black rounded-lg"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const projectTasks = tasks.filter((t: Task) => t.projectId === project.id);
  const projectMembers = users.filter((u: User) => project.memberIds?.includes(u.id));

  const completedCount = projectTasks.filter((t: Task) => t.status === 'completed').length;
  const progressPct =
    projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProject(project.id, { status: newStatus });
  };

  const handleAddTask = () => {
    setNewTaskInitialProjectId(project.id);
    setIsNewTaskOpen(true);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${project.name}" and all its tasks?`)) {
      deleteProject(project.id);
      onNavigate('/projects');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 text-xs text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          title="Delete project workspace"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete Project</span>
        </button>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                {project.code}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {project.name}
              </h1>
              <PriorityBadge priority={project.priority} />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Action & Status picker */}
          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="text-xs font-semibold bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="planning">Status: Planning</option>
              <option value="active">Status: Active</option>
              <option value="on_hold">Status: On Hold</option>
              <option value="completed">Status: Completed</option>
            </select>

            <button
              type="button"
              onClick={handleAddTask}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Project Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 dark:text-neutral-500 font-medium block mb-0.5">
              Timeline
            </span>
            <span className="font-bold text-slate-800 dark:text-neutral-200">
              {formatDate(project.startDate)} → {formatDate(project.dueDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-neutral-500 font-medium block mb-0.5">
              Budget (INR)
            </span>
            <span className="font-bold text-slate-800 dark:text-neutral-200">
              {formatINR(project.budgetINR)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-neutral-500 font-medium block mb-0.5">
              Work Items
            </span>
            <span className="font-bold text-slate-800 dark:text-neutral-200">
              {projectTasks.length} tasks ({completedCount} done)
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-neutral-500 font-medium block mb-0.5">
              Completion Rate
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-neutral-200">
                {progressPct}%
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 dark:bg-white h-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'board'
                ? 'border-blue-600 dark:border-white text-blue-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Kanban className="w-4 h-4" />
            Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'list'
                ? 'border-blue-600 dark:border-white text-blue-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            List ({projectTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'calendar'
                ? 'border-blue-600 dark:border-white text-blue-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'team'
                ? 'border-blue-600 dark:border-white text-blue-600 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Team ({projectMembers.length})
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'board' && <KanbanBoard projectId={project.id} />}

      {activeTab === 'list' && (
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Labels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {projectTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No tasks in this project yet.
                    </td>
                  </tr>
                ) : (
                  projectTasks.map((task: Task) => {
                    const assignee = users.find((u: User) => u.id === task.assigneeId);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="hover:bg-slate-50/80 dark:hover:bg-neutral-950/60 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-4 py-3">
                          {assignee && (
                            <div className="flex items-center gap-1.5">
                              <Avatar user={assignee} size="xs" />
                              <span className="text-slate-700 dark:text-neutral-300">
                                {assignee.name}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              isOverdue(task.dueDate) && task.status !== 'completed'
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-600 dark:text-neutral-300'
                            }
                          >
                            {formatDate(task.dueDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {task.labels?.map((lbl) => (
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

      {activeTab === 'calendar' && <TaskCalendar projectId={project.id} />}

      {activeTab === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projectMembers.map((member: User) => (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center gap-3"
            >
              <Avatar user={member} size="md" showStatus />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {member.name}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 truncate">
                  {member.role}
                </p>
                <span className="text-[10px] text-slate-500 dark:text-neutral-400 block truncate mt-1">
                  {member.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
