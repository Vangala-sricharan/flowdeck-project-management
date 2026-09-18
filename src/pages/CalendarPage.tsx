import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCalendar } from '../components/calendar/TaskCalendar';
import { Plus } from 'lucide-react';
import { Project } from '../types';

export const CalendarPage: React.FC = () => {
  const { projects, setIsNewTaskOpen } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Schedule & Deadlines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            View milestones, deliverables, and upcoming work by calendar date.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="all">All Projects</option>
            {projects.map((p: Project) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Calendar Component */}
      <TaskCalendar
        projectId={selectedProjectId === 'all' ? undefined : selectedProjectId}
      />
    </div>
  );
};
