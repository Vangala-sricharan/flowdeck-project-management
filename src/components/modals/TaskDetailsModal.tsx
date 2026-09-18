import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, TaskStatus, TaskLabel } from '../../types';
import { PriorityBadge, LabelBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, formatTimeAgo, isOverdue } from '../../utils/formatters';
import {
  X,
  Calendar,
  User as UserIcon,
  Tag,
  CheckSquare,
  MessageSquare,
  Trash2,
  Send,
  Edit2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Link2,
  Folder,
} from 'lucide-react';

const AVAILABLE_LABELS: TaskLabel[] = [
  'Design',
  'Development',
  'Testing',
  'Documentation',
  'Bug',
  'Research',
  'Meeting',
];

export const TaskDetailsModal: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    users,
    projects,
    comments,
    addComment,
    editComment,
    deleteComment,
    currentUser,
    activities,
  } = useApp();

  const task = tasks.find((t) => t.id === selectedTaskId);
  const project = projects.find((p) => p.id === task?.projectId);
  const assignee = users.find((u) => u.id === task?.assigneeId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descInput, setDescInput] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity'>('details');

  useEffect(() => {
    if (task) {
      setTitleInput(task.title);
      setDescInput(task.description || '');
    }
  }, [task]);

  if (!selectedTaskId || !task) return null;

  const taskComments = comments
    .filter((c) => task.commentIds.includes(c.id) || c.taskId === task.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const taskActivities = activities.filter((a) => a.taskId === task.id);

  const prerequisiteTask = task.dependsOnTaskId
    ? tasks.find((t) => t.id === task.dependsOnTaskId)
    : null;
  const isBlocked = Boolean(prerequisiteTask && prerequisiteTask.status !== 'completed');
  const candidatePrerequisites = tasks.filter(
    (t) => t.projectId === task.projectId && t.id !== task.id
  );

  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      updateTask(task.id, { title: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = () => {
    updateTask(task.id, { description: descInput.trim() });
    setIsEditingDesc(false);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(task.id, commentInput.trim());
      setCommentInput('');
    }
  };

  const handleSaveEditedComment = (commentId: string) => {
    if (editingCommentText.trim()) {
      editComment(commentId, editingCommentText.trim());
    }
    setEditingCommentId(null);
  };

  const handleToggleLabel = (label: TaskLabel) => {
    const current = task.labels || [];
    const exists = current.includes(label);
    const updated = exists ? current.filter((l) => l !== label) : [...current, label];
    updateTask(task.id, { labels: updated });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      onClick={() => setSelectedTaskId(null)}
      id="task-details-modal-backdrop"
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        id="task-details-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
            <Folder className="w-3.5 h-3.5 text-blue-600 dark:text-neutral-300" />
            <span className="font-semibold text-slate-800 dark:text-neutral-200">
              {project?.name || 'Project'}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400 dark:text-neutral-500">
              {project?.code || 'TSK'}-{task.id.replace('task-', '')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  deleteTask(task.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title row */}
          <div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="flex-1 text-xl font-bold bg-white dark:bg-neutral-950 border border-blue-500 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="group flex items-start justify-between gap-3">
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-neutral-200 transition-colors"
                >
                  {task.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 p-1"
                  title="Edit title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Dependency Blocked Alert Banner */}
          {isBlocked && prerequisiteTask && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-amber-900 dark:text-amber-300">
                    Blocked by: {prerequisiteTask.title}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 uppercase">
                    Incomplete Prerequisite
                  </span>
                </div>
                <p className="text-amber-800/90 dark:text-amber-400/90 mt-1 leading-relaxed">
                  FLOWDECK dependency rule: This task cannot be marked completed until "{prerequisiteTask.title}" is complete.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTaskId(prerequisiteTask.id)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-neutral-300 hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Jump to Prerequisite Task &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Prerequisite Complete Alert */}
          {!isBlocked && prerequisiteTask && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                <span className="font-bold">Prerequisite resolved:</span>
                <span>"{prerequisiteTask.title}" is completed. This task can now proceed.</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTaskId(prerequisiteTask.id)}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                View
              </button>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/70 dark:border-neutral-800">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1.5">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed" disabled={isBlocked}>
                  {isBlocked ? 'Completed (Blocked by Prerequisite)' : 'Completed'}
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1.5">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  updateTask(task.id, { priority: e.target.value as TaskPriority })
                }
                className="w-full text-xs font-medium bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1.5">
                Assignee
              </label>
              <select
                value={task.assigneeId}
                onChange={(e) => updateTask(task.id, { assigneeId: e.target.value })}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={task.dueDate || ''}
                  onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                  className={`w-full text-xs font-medium bg-white dark:bg-neutral-900 border rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    isOverdue(task.dueDate) && task.status !== 'completed'
                      ? 'border-rose-300 dark:border-rose-800 text-rose-600'
                      : 'border-slate-200 dark:border-neutral-700'
                  }`}
                />
              </div>
            </div>

            {/* Prerequisite Dependency Dropdown */}
            <div className="sm:col-span-2 lg:col-span-4 border-t border-slate-200/60 dark:border-neutral-800/80 pt-3 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Prerequisite Dependency
                </label>
                <span className="text-[11px] text-slate-400">
                  Must be marked completed before this task can be completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.dependsOnTaskId || ''}
                  onChange={(e) =>
                    updateTask(task.id, { dependsOnTaskId: e.target.value || undefined })
                  }
                  className="text-xs font-medium bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">No Prerequisite (Independent)</option>
                  {candidatePrerequisites.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      Depends on: {cand.title} ({cand.status.replace('_', ' ')})
                    </option>
                  ))}
                </select>
                {task.dependsOnTaskId && (
                  <button
                    type="button"
                    onClick={() => updateTask(task.id, { dependsOnTaskId: undefined })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove dependency"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                Description
              </span>
              {!isEditingDesc && (
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs text-blue-600 dark:text-neutral-300 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-neutral-950 border border-blue-500 dark:border-neutral-700 rounded-lg p-3 text-slate-800 dark:text-neutral-200 focus:outline-none leading-relaxed"
                  placeholder="Add a detailed description for this task..."
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDesc}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200"
                  >
                    Save Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingDesc(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                onClick={() => setIsEditingDesc(true)}
                className="text-sm text-slate-600 dark:text-neutral-300 whitespace-pre-line bg-slate-50/70 dark:bg-neutral-950/40 p-3 rounded-lg border border-dashed border-slate-200 dark:border-neutral-800 hover:border-slate-300 cursor-pointer min-h-[70px] leading-relaxed"
              >
                {task.description || (
                  <span className="text-slate-400 dark:text-neutral-500 italic">
                    Click to add a task description...
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Labels Selector */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
              Labels
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_LABELS.map((lbl) => {
                const selected = task.labels?.includes(lbl);
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => handleToggleLabel(lbl)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
                      selected
                        ? 'bg-blue-600 dark:bg-white text-white dark:text-black border-blue-600 dark:border-white shadow-xs'
                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 hover:border-slate-300'
                    }`}
                  >
                    {selected ? `✓ ${lbl}` : `+ ${lbl}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                  Subtasks
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 font-mono">
                {completedSubtasks}/{totalSubtasks} completed ({subtaskPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-neutral-100 h-full transition-all duration-300"
                style={{ width: `${subtaskPercent}%` }}
              />
            </div>

            {/* Subtask list */}
            <div className="space-y-1.5">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-950 border border-transparent hover:border-slate-200 dark:hover:border-neutral-800 transition-colors"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(task.id, st.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-900 border-slate-300 dark:border-neutral-700"
                    />
                    <span
                      className={`text-sm ${
                        st.completed
                          ? 'line-through text-slate-400 dark:text-neutral-500'
                          : 'text-slate-700 dark:text-neutral-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteSubtask(task.id, st.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1"
                    title="Delete subtask"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add a subtask (press Enter)"
                className="flex-1 text-xs bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 dark:focus:border-neutral-600"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          {/* Comments & Activity Tabs */}
          <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-neutral-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`text-xs font-semibold flex items-center gap-1.5 pb-2 -mb-2 border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600 dark:border-white dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Comments ({taskComments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activity')}
                className={`text-xs font-semibold flex items-center gap-1.5 pb-2 -mb-2 border-b-2 transition-colors ${
                  activeTab === 'activity'
                    ? 'border-blue-600 text-blue-600 dark:border-white dark:text-white'
                    : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Activity ({taskActivities.length})
              </button>
            </div>

            {/* Comments Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* New Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-3 items-start">
                  <Avatar user={currentUser} size="sm" />
                  <div className="flex-1 space-y-2">
                    <textarea
                      rows={2}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment or mention team members..."
                      className="w-full text-xs bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg p-2.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 dark:focus:border-neutral-600 leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        Comment
                      </button>
                    </div>
                  </div>
                </form>

                {/* Comment list */}
                <div className="space-y-3 pt-2">
                  {taskComments.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-neutral-500 text-center py-4">
                      No comments on this task yet. Start the conversation!
                    </p>
                  ) : (
                    taskComments.map((comm) => {
                      const isOwn = comm.userId === currentUser?.id;
                      return (
                        <div
                          key={comm.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/60 dark:bg-neutral-950/60 border border-slate-100 dark:border-neutral-800"
                        >
                          <Avatar
                            avatarUrl={comm.userAvatar}
                            name={comm.userName}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                                {comm.userName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                                  {formatTimeAgo(comm.createdAt)}
                                </span>
                                {isOwn && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(comm.id);
                                        setEditingCommentText(comm.content);
                                      }}
                                      className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 p-0.5"
                                      title="Edit comment"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteComment(comm.id)}
                                      className="text-slate-400 hover:text-rose-500 p-0.5"
                                      title="Delete comment"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {editingCommentId === comm.id ? (
                              <div className="mt-1 space-y-2">
                                <textarea
                                  rows={2}
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  className="w-full text-xs bg-white dark:bg-neutral-900 border border-blue-500 rounded p-2 text-slate-800 dark:text-neutral-200"
                                />
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditedComment(comm.id)}
                                    className="text-xs px-2.5 py-1 bg-blue-600 dark:bg-white text-white dark:text-black rounded font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCommentId(null)}
                                    className="text-xs px-2.5 py-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed break-words whitespace-pre-line">
                                {comm.content}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab Content */}
            {activeTab === 'activity' && (
              <div className="space-y-2.5">
                {taskActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-neutral-500 text-center py-4">
                    No recent activity recorded for this task.
                  </p>
                ) : (
                  taskActivities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          avatarUrl={act.userAvatar}
                          name={act.userName}
                          size="xs"
                        />
                        <span className="font-semibold text-slate-800 dark:text-neutral-200">
                          {act.userName}
                        </span>
                        <span className="text-slate-500 dark:text-neutral-400">
                          {act.action}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 text-xs text-slate-500 dark:text-neutral-400">
          <span>Created {formatDate(task.createdAt)}</span>
          <button
            type="button"
            onClick={() => setSelectedTaskId(null)}
            className="px-4 py-1.5 font-medium bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 rounded-lg hover:bg-slate-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
