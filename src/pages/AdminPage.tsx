import React from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/common/Avatar';
import { formatTimeAgo, formatINR } from '../utils/formatters';
import { ActivityLog } from '../types';
import {
  ShieldCheck,
  Users,
  Activity,
  Server,
  Layers,
  Database,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { users, projects, tasks, activities } = useApp();

  const totalBudget = projects.reduce((acc: number, p) => acc + (p.budgetINR || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-neutral-300" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Admin Workspace & System Status
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
          Superuser monitoring portal, team role permissions, and system architecture audit.
        </p>
      </div>

      {/* System Architecture Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            <Server className="w-4 h-4 text-emerald-500" />
            Runtime Mode
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Serverless SPA
          </div>
          <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
            Zero external server dependency. Ready for instant static hosting.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            <Database className="w-4 h-4 text-blue-500" />
            Persistence Layer
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Browser LocalStorage
          </div>
          <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
            Encrypted client-side storage with automated JSON synchronization.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4 text-purple-500" />
            Allocated Budgets
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(totalBudget)}
          </div>
          <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">
            Across {projects.length} managed project initiatives.
          </p>
        </div>
      </div>

      {/* Team Roster & Permission Control */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
          Team Roster & Access Controls ({users.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase font-bold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-950">
                  <td className="px-4 py-3 flex items-center gap-2.5">
                    <Avatar user={u} size="xs" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {u.name}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                        {u.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-neutral-300 font-medium">
                    {u.role}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 capitalize">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                      {u.role.toLowerCase().includes('lead') || u.role.toLowerCase().includes('manager')
                        ? 'Full Workspace Admin'
                        : 'Standard Contributor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Audit Trail */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-neutral-300" />
          Activity Audit Log
        </h2>

        <div className="space-y-3">
          {activities.slice(0, 10).map((act: ActivityLog) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <Avatar avatarUrl={act.userAvatar} name={act.userName} size="xs" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{act.userName}</span>{' '}
                  <span className="text-slate-600 dark:text-neutral-400">{act.action}</span>
                  {act.details && (
                    <span className="text-slate-400 dark:text-neutral-500 block text-[11px]">
                      {act.details}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-neutral-500 shrink-0">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
