import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus, Priority, User, Task } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AvatarGroup } from '../components/common/Avatar';
import { formatDate, formatINR } from '../utils/formatters';
import { Plus, Search } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { projects, tasks, users, setIsNewProjectOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'progress' | 'name'>('dueDate');

  const filteredProjects = projects
    .filter((p: Project) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a: Project, b: Project) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Manage, organize, and monitor progress across all team and client initiatives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewProjectOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description, code..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
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
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="progress">Sort by Progress</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl">
          <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">
            No projects match your current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="mt-3 text-xs text-blue-600 dark:text-white font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p: Project) => {
            const projMembers = users.filter((u: User) => p.memberIds?.includes(u.id));
            const projTasks = tasks.filter((t: Task) => t.projectId === p.id);
            const completedCount = projTasks.filter((t: Task) => t.status === 'completed').length;
            const progress =
              projTasks.length > 0
                ? Math.round((completedCount / projTasks.length) * 100)
                : p.progress || 0;

            return (
              <div
                key={p.id}
                onClick={() => onNavigate(`/projects/${p.id}`)}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                      {p.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={p.priority} />
                      <StatusBadge status={p.status} />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 mb-1.5 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-neutral-400 font-medium">
                      {completedCount}/{projTasks.length} tasks completed
                    </span>
                    <span className="font-bold text-slate-800 dark:text-neutral-200">
                      {progress}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-white h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <AvatarGroup users={projMembers} max={3} size="xs" />
                    <div className="text-right">
                      {p.budgetINR !== undefined && (
                        <span className="text-[11px] font-bold text-slate-700 dark:text-neutral-300 block">
                          {formatINR(p.budgetINR)}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-neutral-500 block">
                        Due {formatDate(p.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
