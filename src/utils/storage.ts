import {
  Project,
  Task,
  User,
  Comment,
  Notification,
  Activity,
  ThemeMode,
  UserSettings,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_USERS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS,
} from '../data/mockData';

export const STORAGE_KEYS = {
  PROJECTS: 'flowdeck_projects',
  TASKS: 'flowdeck_tasks',
  USERS: 'flowdeck_users',
  CURRENT_USER: 'flowdeck_current_user',
  COMMENTS: 'flowdeck_comments',
  NOTIFICATIONS: 'flowdeck_notifications',
  THEME: 'flowdeck-theme',
  SETTINGS: 'flowdeck_settings',
  ACTIVITY: 'flowdeck_activity',
} as const;

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[FLOWDECK Storage] Error reading ${key} from localStorage, resetting to fallback.`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`[FLOWDECK Storage] Failed to write ${key} to localStorage`, err);
  }
}

export const storage = {
  getProjects: (): Project[] => safeGetItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
  setProjects: (projects: Project[]) => safeSetItem(STORAGE_KEYS.PROJECTS, projects),

  getTasks: (): Task[] => safeGetItem<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  setTasks: (tasks: Task[]) => safeSetItem(STORAGE_KEYS.TASKS, tasks),

  getUsers: (): User[] => safeGetItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => safeSetItem(STORAGE_KEYS.USERS, users),

  getCurrentUser: (): User | null => safeGetItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]),
  setCurrentUser: (user: User | null) => safeSetItem(STORAGE_KEYS.CURRENT_USER, user),

  getComments: (): Comment[] => safeGetItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS),
  setComments: (comments: Comment[]) => safeSetItem(STORAGE_KEYS.COMMENTS, comments),

  getNotifications: (): Notification[] =>
    safeGetItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (notifs: Notification[]) => safeSetItem(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getTheme: (): ThemeMode => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem('flowdeck_theme');
      if (!val) return 'light';
      const clean = val.replace(/['"]/g, '').trim().toLowerCase();
      if (clean === 'dark') return 'dark';
      return 'light';
    } catch {
      return 'light';
    }
  },
  setTheme: (theme: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (err) {
      console.error('[FLOWDECK Storage] Failed to write theme to localStorage', err);
    }
  },

  getSettings: (): UserSettings => safeGetItem<UserSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  setSettings: (settings: UserSettings) => safeSetItem(STORAGE_KEYS.SETTINGS, settings),

  getActivities: (): Activity[] => safeGetItem<Activity[]>(STORAGE_KEYS.ACTIVITY, INITIAL_ACTIVITIES),
  setActivities: (activities: Activity[]) => safeSetItem(STORAGE_KEYS.ACTIVITY, activities),

  resetAll: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITIES));
    } catch (err) {
      console.error('Failed to reset localStorage data', err);
    }
  },

  exportWorkspaceJSON: (): string => {
    const data = {
      projects: storage.getProjects(),
      tasks: storage.getTasks(),
      users: storage.getUsers(),
      comments: storage.getComments(),
      notifications: storage.getNotifications(),
      activities: storage.getActivities(),
      settings: storage.getSettings(),
      exportedAt: new Date().toISOString(),
      app: 'FLOWDECK',
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  },

  importWorkspaceJSON: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.projects)) storage.setProjects(parsed.projects);
      if (Array.isArray(parsed.tasks)) storage.setTasks(parsed.tasks);
      if (Array.isArray(parsed.users)) storage.setUsers(parsed.users);
      if (Array.isArray(parsed.comments)) storage.setComments(parsed.comments);
      if (Array.isArray(parsed.notifications)) storage.setNotifications(parsed.notifications);
      if (Array.isArray(parsed.activities)) storage.setActivities(parsed.activities);
      if (parsed.settings) storage.setSettings(parsed.settings);
      return true;
    } catch (err) {
      console.error('Failed to import JSON data', err);
      return false;
    }
  },

  getStorageSizeKB: (): number => {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (key.startsWith('flowdeck_')) {
          total += (localStorage.getItem(key)?.length || 0) * 2;
        }
      }
      return Math.round((total / 1024) * 10) / 10;
    } catch {
      return 0;
    }
  },
};

export const exportWorkspaceData = storage.exportWorkspaceJSON;
export const importWorkspaceData = storage.importWorkspaceJSON;
export const clearWorkspaceData = storage.resetAll;
