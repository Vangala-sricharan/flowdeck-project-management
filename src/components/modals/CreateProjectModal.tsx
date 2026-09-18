import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskPriority, ProjectStatus } from '../../types';
import { X, FolderPlus, Users } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const CreateProjectModal: React.FC = () => {
  const { isNewProjectOpen, setIsNewProjectOpen, createProject, users, currentUser } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [budgetINR, setBudgetINR] = useState<number>(150000);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() =>
    currentUser ? [currentUser.id] : ['user-1']
  );
  const [error, setError] = useState('');

  if (!isNewProjectOpen) return null;

  const handleToggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }

    createProject({
      name: name.trim(),
      code: code.trim().toUpperCase() || name.slice(0, 3).toUpperCase(),
      description: description.trim(),
      priority,
      status,
      startDate,
      dueDate,
      memberIds: selectedMemberIds.length > 0 ? selectedMemberIds : ['user-1'],
      budgetINR: Number(budgetINR) || 0,
    });

    setIsNewProjectOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      onClick={() => setIsNewProjectOpen(false)}
      id="create-project-modal-backdrop"
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
        id="create-project-modal"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-neutral-800 text-blue-600 dark:text-neutral-200 flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Project</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Set up a dedicated project workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNewProjectOpen(false)}
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

          {/* Project Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Study Companion"
                className="w-full text-sm bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-neutral-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Project Key
              </label>
              <input
                type="text"
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AISC"
                className="w-full text-sm font-mono uppercase bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
              placeholder="What are the key goals, deliverables, and team objectives?"
              className="w-full text-xs bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg p-2.5 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Status, Priority & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

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
                Budget (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={budgetINR}
                  onChange={(e) => setBudgetINR(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg pl-7 pr-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Team Members Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Assign Team Members ({selectedMemberIds.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-neutral-950 rounded-lg border border-slate-200 dark:border-neutral-800 max-h-36 overflow-y-auto">
              {users.map((user) => {
                const checked = selectedMemberIds.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                      checked
                        ? 'bg-blue-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-700'
                        : 'hover:bg-slate-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleMember(user.id)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                    />
                    <Avatar user={user} size="xs" />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="font-medium text-slate-800 dark:text-neutral-200 block truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-neutral-500 block truncate">
                        {user.role}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsNewProjectOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-sm"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
