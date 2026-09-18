import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, LabelBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/formatters';
import {
  Plus,
  MessageSquare,
  CheckSquare,
  Calendar,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string; accent: string }[] = [
  { id: 'todo', title: 'TO DO', accent: 'border-slate-300 dark:border-neutral-700' },
  { id: 'in_progress', title: 'IN PROGRESS', accent: 'border-blue-500 dark:border-neutral-500' },
  { id: 'in_review', title: 'IN REVIEW', accent: 'border-purple-500 dark:border-neutral-600' },
  { id: 'completed', title: 'COMPLETED', accent: 'border-emerald-500 dark:border-neutral-700' },
];

interface KanbanBoardProps {
  projectId?: string;
  tasks?: Task[];
  searchQuery?: string;
  priorityFilter?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projectId,
  tasks: customTasks,
  searchQuery,
  priorityFilter,
}) => {
  const {
    tasks: allTasks,
    moveTaskStatus,
    setSelectedTaskId,
    setIsNewTaskOpen,
    setNewTaskInitialStatus,
    setNewTaskInitialProjectId,
    users,
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Filter tasks if projectId provided or custom tasks supplied
  let boardTasks = customTasks || (projectId ? allTasks.filter((t) => t.projectId === projectId) : allTasks);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    boardTasks = boardTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.labels.some((l) => l.toLowerCase().includes(q))
    );
  }

  if (priorityFilter && priorityFilter !== 'all') {
    boardTasks = boardTasks.filter((t) => t.priority === priorityFilter);
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, columnId);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleQuickAdd = (status: TaskStatus) => {
    setNewTaskInitialStatus(status);
    if (projectId) setNewTaskInitialProjectId(projectId);
    setIsNewTaskOpen(true);
  };

  // Helper for quick moving without drag (crucial for mobile touch devices)
  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'completed') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="w-full h-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1024px] xl:min-w-full items-start">
        {COLUMNS.map((col) => {
          const colTasks = boardTasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-1 min-w-[260px] max-w-sm rounded-xl bg-slate-50/70 dark:bg-neutral-900/60 border ${
                isOver
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-neutral-850'
                  : 'border-slate-200/80 dark:border-neutral-800'
              } flex flex-col transition-all`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/60 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 tracking-wider">
                    {col.title}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-200/80 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(col.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-neutral-800 transition-colors"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List Container */}
              <div className="p-3 space-y-3 min-h-[400px] flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-neutral-500 text-xs">
                    <p>Drop tasks here</p>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(col.id)}
                      className="mt-1.5 text-blue-600 dark:text-neutral-300 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add a task
                    </button>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = users.find((u) => u.id === task.assigneeId);
                    const completedSub = task.subtasks?.filter((st) => st.completed).length || 0;
                    const totalSub = task.subtasks?.length || 0;
                    const commentCount = task.commentIds?.length || 0;
                    const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

                    const prerequisite = task.dependsOnTaskId
                      ? allTasks.find((t) => t.id === task.dependsOnTaskId)
                      : null;
                    const isBlocked = Boolean(prerequisite && prerequisite.status !== 'completed');

                    const prevStatus = getPrevStatus(task.status);
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`group p-3.5 bg-white dark:bg-neutral-950 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-neutral-700 transition-all cursor-pointer select-none relative ${
                          draggedTaskId === task.id ? 'opacity-40' : ''
                        }`}
                      >
                        {/* Top Meta: Priority & Labels */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <PriorityBadge priority={task.priority} />
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex items-center gap-1 overflow-hidden">
                              <LabelBadge label={task.labels[0]} />
                              {task.labels.length > 1 && (
                                <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">
                                  +{task.labels.length - 1}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Blocked dependency badge */}
                        {isBlocked && prerequisite && (
                          <div className="mb-2 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-[10px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="truncate">Blocked by: {prerequisite.title}</span>
                          </div>
                        )}

                        {/* Task Title */}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-neutral-200 transition-colors mb-1 line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress Bar if subtasks exist */}
                        {totalSub > 0 && (
                          <div className="mb-3 space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400">
                              <span className="flex items-center gap-1 font-medium">
                                <CheckSquare className="w-3 h-3" /> Subtasks
                              </span>
                              <span className="font-mono">
                                {completedSub}/{totalSub}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-blue-600 dark:bg-white h-full transition-all"
                                style={{
                                  width: `${Math.round((completedSub / totalSub) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Card Footer: Due Date, Comments, Assignee */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-900 text-xs">
                          <div className="flex items-center gap-2 text-slate-400 dark:text-neutral-500">
                            {task.dueDate && (
                              <span
                                className={`flex items-center gap-1 text-[10px] font-medium ${
                                  overdue
                                    ? 'text-rose-600 dark:text-rose-400 font-bold'
                                    : 'text-slate-500 dark:text-neutral-400'
                                }`}
                                title={`Due: ${formatDate(task.dueDate)}`}
                              >
                                <Calendar className="w-3 h-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                            {commentCount > 0 && (
                              <span
                                className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-neutral-400"
                                title={`${commentCount} comments`}
                              >
                                <MessageSquare className="w-3 h-3" />
                                {commentCount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {assignee && (
                              <Avatar
                                user={assignee}
                                size="xs"
                                showStatus
                              />
                            )}

                            {/* Mobile/Accessibility Column Move Controls */}
                            <div
                              className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-1 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {prevStatus && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskStatus(task.id, prevStatus)}
                                  className="p-1 rounded bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 text-slate-600 dark:text-neutral-300"
                                  title={`Move to previous column`}
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                              {nextStatus && (
                                <button
                                  type="button"
                                  onClick={() => moveTaskStatus(task.id, nextStatus)}
                                  className="p-1 rounded bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 text-slate-600 dark:text-neutral-300"
                                  title={`Move to next column`}
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
