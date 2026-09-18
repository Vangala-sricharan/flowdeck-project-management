import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/Avatar';
import { PriorityBadge } from '../components/common/Badge';
import { CheckSquare, Save, CheckCircle } from 'lucide-react';
import { Task, Project, ActivityLog } from '../types';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, tasks, projects, activities, setSelectedTaskId } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState(currentUser?.role || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [status, setStatus] = useState<'active' | 'away' | 'offline'>(
    currentUser?.status || 'active'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const myTasks = tasks.filter((t: Task) => t.assigneeId === currentUser.id);
  const completedCount = myTasks.filter((t: Task) => t.status === 'completed').length;
  const myProjects = projects.filter((p: Project) => p.memberIds?.includes(currentUser.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      role: role.trim() as any,
      bio: bio.trim(),
      status,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
          Manage your personal details, project assignments, and presence.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <Avatar user={currentUser} size="xl" showStatus />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-xs text-blue-600 dark:text-neutral-300 font-semibold">
                {currentUser.role}
              </p>
              <span className="text-xs text-slate-400 dark:text-neutral-500 block mt-0.5">
                {currentUser.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200/80 dark:border-neutral-800">
              <span className="text-base font-black text-slate-900 dark:text-white block">
                {completedCount}/{myTasks.length}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase font-semibold">
                Tasks Done
              </span>
            </div>
            <div className="text-center px-4 py-2 bg-slate-50 dark:bg-neutral-950 rounded-xl border border-slate-200/80 dark:border-neutral-800">
              <span className="text-base font-black text-slate-900 dark:text-white block">
                {myProjects.length}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase font-semibold">
                Projects
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Profile changes saved successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Role Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Email (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full text-xs px-3 py-2 bg-slate-100 dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Presence Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active (Online)</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Short Bio & Specializations
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Assigned Tasks Summary */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
          Active Assigned Tasks ({myTasks.filter((t: Task) => t.status !== 'completed').length})
        </h3>

        <div className="space-y-2">
          {myTasks.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No tasks assigned.</p>
          ) : (
            myTasks.slice(0, 5).map((t: Task) => (
              <div
                key={t.id}
                onClick={() => setSelectedTaskId(t.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <PriorityBadge priority={t.priority} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {t.title}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-neutral-400 capitalize">
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
