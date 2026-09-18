import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ArrowRight, Lock, Mail, UserCheck, Sun, Moon } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, users, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState('aarav@flowdeck.dev');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      if (success) {
        onNavigate('/dashboard');
      } else {
        setError('Invalid credentials. You can also pick a demo profile below.');
      }
    }, 400);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo12345');
    login(demoEmail, 'demo12345');
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          aria-label="Toggle visual theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-4 shadow-md">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
          FLOWDECK
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium">
          Plan. Collaborate. Deliver.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl py-8 px-6 sm:px-10 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Access your project decks, assignments, and milestones.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@flowdeck.dev"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-950 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-neutral-200 transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-100 dark:border-neutral-800">
            <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider block mb-2 text-center">
              Or Instant Demo Sign In
            </span>
            <div className="grid grid-cols-1 gap-2">
              {users.slice(0, 3).map((u: User) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-white transition-colors text-left group"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 block truncate group-hover:text-blue-600 dark:group-hover:text-white">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 block truncate">
                      {u.role}
                    </span>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-neutral-400 pt-2">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="font-bold text-blue-600 dark:text-white hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
