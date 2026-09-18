import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from 'lucide-react';

export const TaskCalendar: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { tasks: allTasks, setSelectedTaskId, setIsNewTaskOpen, users, projects } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const tasks = projectId ? allTasks.filter((t) => t.projectId === projectId) : allTasks;

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month view calculations
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if a task falls on a specific YYYY-MM-DD
  const getTasksForDate = (dateStr: string): Task[] => {
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  // Format date helper
  const formatDateISO = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Check if same day as today
  const isCurrentDay = (d: Date): boolean => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const cells = [];
    // Blank days before start
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(
        <div
          key={`blank-${i}`}
          className="min-h-[110px] bg-slate-50/40 dark:bg-neutral-950/40 border-b border-r border-slate-200/60 dark:border-neutral-800/60 p-2"
        />
      );
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const isoStr = formatDateISO(dateObj);
      const dayTasks = getTasksForDate(isoStr);
      const isTodayDate = isCurrentDay(dateObj);

      cells.push(
        <div
          key={`day-${d}`}
          className={`min-h-[110px] border-b border-r border-slate-200/60 dark:border-neutral-800/60 p-2 transition-colors flex flex-col justify-between group ${
            isTodayDate
              ? 'bg-blue-50/20 dark:bg-neutral-900/40'
              : 'hover:bg-slate-50/60 dark:hover:bg-neutral-900/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isTodayDate
                  ? 'bg-blue-600 dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-slate-700 dark:text-neutral-300'
              }`}
            >
              {d}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500">
                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            )}
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto max-h-24">
            {dayTasks.slice(0, 3).map((task) => {
              const priorityColors: Record<string, string> = {
                urgent: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
                high: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                medium: 'bg-blue-100 dark:bg-neutral-800 text-blue-800 dark:text-neutral-200 border-blue-200 dark:border-neutral-700',
                low: 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-300 border-slate-200 dark:border-neutral-700',
              };

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`text-[11px] font-medium px-2 py-1 rounded border truncate cursor-pointer hover:shadow-2xs transition-all ${
                    priorityColors[task.priority] || priorityColors.medium
                  }`}
                  title={`${task.title} (${task.status})`}
                >
                  {task.title}
                </div>
              );
            })}
            {dayTasks.length > 3 && (
              <div
                onClick={() => setSelectedTaskId(dayTasks[3].id)}
                className="text-[10px] text-blue-600 dark:text-neutral-400 font-semibold cursor-pointer pl-1 hover:underline"
              >
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-l border-slate-200/60 dark:border-neutral-800/60 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
        <div className="grid grid-cols-7 bg-slate-100/70 dark:bg-neutral-950 border-b border-slate-200/60 dark:border-neutral-800/60 text-center text-xs font-bold text-slate-600 dark:text-neutral-400 py-2">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">{cells}</div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    // Determine 7 days surrounding currentDate
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const iso = formatDateISO(day);
          const dayTasks = getTasksForDate(iso);
          const isTodayDate = isCurrentDay(day);

          return (
            <div
              key={iso}
              className={`rounded-xl border p-3 flex flex-col min-h-[350px] ${
                isTodayDate
                  ? 'bg-blue-50/20 dark:bg-neutral-900/50 border-blue-400 dark:border-white'
                  : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-neutral-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                  {daysOfWeek[day.getDay()]}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isTodayDate
                      ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                      : 'text-slate-800 dark:text-neutral-200'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center py-8">
                    No deadlines
                  </p>
                ) : (
                  dayTasks.map((t) => {
                    const assignee = users.find((u) => u.id === t.assigneeId);
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 cursor-pointer hover:border-slate-300 transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <PriorityBadge priority={t.priority} />
                          {assignee && <Avatar user={assignee} size="xs" />}
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-neutral-200 truncate">
                          {t.title}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const iso = formatDateISO(currentDate);
    const dayTasks = getTasksForDate(iso);

    return (
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {daysOfWeek[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]}{' '}
              {currentDate.getDate()}, {currentDate.getFullYear()}
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              {dayTasks.length} {dayTasks.length === 1 ? 'task scheduled' : 'tasks scheduled'} for this date
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-neutral-500 text-xs">
            No tasks due on this date.
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((t) => {
              const proj = projects.find((p) => p.id === t.projectId);
              const assignee = users.find((u) => u.id === t.assigneeId);
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                        {proj?.name}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1">
                      {t.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {assignee && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300">
                        <Avatar user={assignee} size="sm" />
                        <span className="hidden sm:inline">{assignee.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-neutral-950">
            <button
              type="button"
              onClick={goToPrevious}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 border-x border-slate-200 dark:border-neutral-700 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-600 dark:text-neutral-300 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-white pl-2">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950 p-1 rounded-lg border border-slate-200 dark:border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'month'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'week'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'day'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  );
};
