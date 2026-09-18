import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, TaskStatus, TaskLabel } from '../../types';
import { X, Plus, Calendar, Tag, CheckSquare, Layers } from 'lucide-react';

const AVAILABLE_LABELS: TaskLabel[] = [
  'Design',
  'Development',
  'Testing',
  'Documentation',
  'Bug',
  'Research',
  'Meeting',
];

export const CreateTaskModal: React.FC = () => {
  const {
    isNewTaskOpen,
    setIsNewTaskOpen,
    newTaskInitialStatus,
    newTaskInitialProjectId,
    createTask,
    tasks,
    projects,
    users,
    currentUser,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState<TaskStatus>(newTaskInitialStatus || 'todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dependsOnTaskId, setDependsOnTaskId] = useState('');
  const [labels, setLabels] = useState<TaskLabel[]>(['Development']);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNewTaskOpen) {
      setTitle('');
      setDescription('');
      setStatus(newTaskInitialStatus || 'todo');
      setPriority('medium');
      setProjectId(newTaskInitialProjectId || (projects[0]?.id ?? ''));
      setAssigneeId(currentUser?.id || (users[0]?.id ?? ''));
      setDependsOnTaskId('');
      // Default due date: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDueDate(d.toISOString().split('T')[0]);
      setLabels(['Development']);
      setSubtasks([]);
      setSubtaskInput('');
      setError('');
    }
  }, [isNewTaskOpen, newTaskInitialStatus, newTaskInitialProjectId, projects, users, currentUser]);

  if (!isNewTaskOpen) return null;

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks((prev) => [
        ...prev,
        { id: `st-${Date.now()}-${prev.length}`, title: subtaskInput.trim(), completed: false },
      ]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleLabel = (lbl: TaskLabel) => {
    setLabels((prev) =>
      prev.includes(lbl) ? prev.filter((l) => l !== lbl) : [...prev, lbl]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }
    if (!projectId) {
      setError('Please select a project for this task.');
      return;
    }

    createTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId: assigneeId || users[0]?.id || 'user-1',
      labels,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      dependsOnTaskId: dependsOnTaskId || undefined,
      subtasks,
    });

    setIsNewTaskOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      onClick={() => setIsNewTaskOpen(false)}
      id="create-task-modal-backdrop"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        id="create-task-modal"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-neutral-800 text-blue-600 dark:text-neutral-200 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Task</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Add a work item to your project board</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNewTaskOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design responsive landing hero mockup"
              className="w-full text-sm bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-neutral-500"
              autoFocus
            />
          </div>

          {/* Project & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Column / Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority, Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the scope, requirements, or acceptance criteria..."
              className="w-full text-xs bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg p-2.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Prerequisite Task Dependency */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Prerequisite Dependency (Optional)
            </label>
            <select
              value={dependsOnTaskId}
              onChange={(e) => setDependsOnTaskId(e.target.value)}
              className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">No Prerequisite (Independent Task)</option>
              {tasks
                .filter((t) => t.projectId === projectId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Depends on: {t.title} ({t.status.replace('_', ' ')})
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              This task will be marked as blocked until the chosen prerequisite task is completed.
            </p>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Labels
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_LABELS.map((lbl) => {
                const active = labels.includes(lbl);
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => handleToggleLabel(lbl)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                      active
                        ? 'bg-blue-600 dark:bg-white text-white dark:text-black border-blue-600 dark:border-white shadow-xs'
                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 hover:border-slate-300'
                    }`}
                  >
                    {active ? `✓ ${lbl}` : `+ ${lbl}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Subtasks
            </label>
            {subtasks.length > 0 && (
              <div className="space-y-1 mb-2">
                {subtasks.map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800"
                  >
                    <span className="text-slate-700 dark:text-neutral-300">
                      {idx + 1}. {st.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="+ Add checklist step (press Enter)"
                className="flex-1 text-xs bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
