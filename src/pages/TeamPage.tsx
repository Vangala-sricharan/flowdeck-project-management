import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Project, Task } from '../types';
import { Avatar } from '../components/common/Avatar';
import {
  Users,
  UserPlus,
  Mail,
  Briefcase,
  CheckCircle2,
  FolderKanban,
  Search,
  X,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { users, projects, tasks, addUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Developer');
  const [inviteBio, setInviteBio] = useState('');

  const filteredUsers = users.filter(
    (u: User) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    addUser({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole.trim() as any,
      bio: inviteBio.trim(),
      status: 'active',
    });

    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteBio('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Team Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            Collaborators, roles, workload distributions, and project assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add Team Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team by name, title, email..."
          className="w-full text-xs pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs placeholder-slate-400"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((member: User) => {
          const memberProjects = projects.filter((p: Project) => p.memberIds?.includes(member.id));
          const memberTasks = tasks.filter((t: Task) => t.assigneeId === member.id);
          const completedTasks = memberTasks.filter((t: Task) => t.status === 'completed').length;

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <Avatar user={member} size="lg" showStatus />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-neutral-300 truncate">
                      {member.role}
                    </p>
                    <span className="text-[11px] text-slate-400 dark:text-neutral-500 truncate block mt-0.5">
                      {member.email}
                    </span>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {member.bio}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200/60 dark:border-neutral-850">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {memberProjects.length}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Projects
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200/60 dark:border-neutral-850">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {completedTasks}/{memberTasks.length}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Done / Total
                    </span>
                  </div>
                </div>

                {memberProjects.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {memberProjects.slice(0, 3).map((p) => (
                      <span
                        key={p.id}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300"
                      >
                        {p.code}
                      </span>
                    ))}
                    {memberProjects.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{memberProjects.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-white" />
                Add Team Member
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Diya Sharma"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="diya@flowdeck.dev"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  placeholder="e.g. Product Designer, QA Specialist"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Short Bio / Skills
                </label>
                <textarea
                  rows={2}
                  value={inviteBio}
                  onChange={(e) => setInviteBio(e.target.value)}
                  placeholder="Expert in UI design systems and user research."
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 dark:bg-white text-white dark:text-black rounded-lg hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs"
                >
                  Add Collaborator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
