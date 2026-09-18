import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Task,
  User,
  Comment,
  Notification,
  Activity,
  ThemeMode,
  UserSettings,
  TaskStatus,
} from '../types';
import { storage } from '../utils/storage';

interface AppContextType {
  // Auth
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (
    nameOrData: string | { name: string; email: string; role?: string; bio?: string; status?: 'active' | 'away' | 'offline' },
    email?: string,
    password?: string
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User>) => void;
  addUser: (user: Partial<User>) => void;

  // Theme & Settings
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;

  // Projects
  projects: Project[];
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentIds' | 'order'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus, targetIndex?: number) => { success: boolean; blockedBy?: string; message?: string };
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => { success: boolean; blockedBy?: string; message?: string };
  checkTaskBlocked: (taskId: string) => { isBlocked: boolean; prerequisite?: Task };
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Comments
  comments: Comment[];
  addComment: (taskId: string, content: string) => void;
  editComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;

  // Activity
  activities: Activity[];
  logActivity: (action: string, details?: string, projectId?: string, taskId?: string) => void;

  // Workspace Operations
  resetWorkspace: () => void;

  // Global Toast & Alerts
  toast: { text: string; type: 'info' | 'error' | 'success'; id: number } | null;
  showToast: (text: string, type?: 'info' | 'error' | 'success') => void;

  // Modals & UI Triggers
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  isNewTaskOpen: boolean;
  setIsNewTaskOpen: (open: boolean) => void;
  newTaskInitialStatus: TaskStatus;
  setNewTaskInitialStatus: (status: TaskStatus) => void;
  newTaskInitialProjectId: string;
  setNewTaskInitialProjectId: (id: string) => void;
  isNewProjectOpen: boolean;
  setIsNewProjectOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from storage
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [comments, setComments] = useState<Comment[]>(() => storage.getComments());
  const [notifications, setNotifications] = useState<Notification[]>(() => storage.getNotifications());
  const [activities, setActivities] = useState<Activity[]>(() => storage.getActivities());
  const [theme, setThemeState] = useState<ThemeMode>(() => storage.getTheme());
  const [settings, setSettingsState] = useState<UserSettings>(() => storage.getSettings());

  // Global modals
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<TaskStatus>('todo');
  const [newTaskInitialProjectId, setNewTaskInitialProjectId] = useState<string>('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<{ text: string; type: 'info' | 'error' | 'success'; id: number } | null>(null);

  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    const id = Date.now();
    setToast({ text, type, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const checkTaskBlocked = (taskId: string): { isBlocked: boolean; prerequisite?: Task } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.dependsOnTaskId) return { isBlocked: false };
    const prerequisite = tasks.find((t) => t.id === task.dependsOnTaskId);
    if (prerequisite && prerequisite.status !== 'completed') {
      return { isBlocked: true, prerequisite };
    }
    return { isBlocked: false, prerequisite };
  };

  // Sync theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.setTheme(theme);
  }, [theme]);

  // Sync theme across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'flowdeck-theme' || e.key === 'flowdeck_theme') {
        const val = storage.getTheme();
        setThemeState(val);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      storage.setSettings(next);
      return next;
    });
  };

  // Activity logging
  const logActivity = (action: string, details?: string, projectId?: string, taskId?: string) => {
    const newAct: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      action,
      details,
      projectId,
      taskId,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => {
      const next = [newAct, ...prev].slice(0, 100);
      storage.setActivities(next);
      return next;
    });
  };

  // Notifications
  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      storage.setNotifications(next);
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      storage.setNotifications(next);
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      storage.setNotifications(next);
      return next;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    storage.setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Auth
  const login = (email: string, _password?: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const found = users.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      storage.setCurrentUser(found);
      logActivity('logged in', `Welcome back, ${found.name}`);
      return { success: true };
    }
    // Create new demo user on the fly if not in list
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      email: trimmed,
      role: 'Developer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      department: 'Engineering',
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    setCurrentUser(newUser);
    storage.setCurrentUser(newUser);
    logActivity('logged in', `New demo session for ${newUser.name}`);
    return { success: true };
  };

  const register = (
    nameOrData: string | { name: string; email: string; role?: string; bio?: string; status?: 'active' | 'away' | 'offline' },
    emailParam?: string,
    _password?: string
  ) => {
    let name = '';
    let email = '';
    let role = 'Developer';
    let bio = 'Collegiate project team member on FLOWDECK.';
    let status: 'active' | 'away' | 'offline' = 'active';

    if (typeof nameOrData === 'object') {
      name = nameOrData.name || '';
      email = nameOrData.email || '';
      if (nameOrData.role) role = nameOrData.role;
      if (nameOrData.bio) bio = nameOrData.bio;
      if (nameOrData.status) status = nameOrData.status;
    } else {
      name = nameOrData;
      email = emailParam || '';
    }

    if (!name.trim()) return { success: false, error: 'Full name is required.' };
    if (!email.trim() || !email.includes('@')) return { success: false, error: 'A valid email is required.' };

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: (role as any),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status,
      bio,
      joinedDate: new Date().toISOString().split('T')[0],
      department: 'Product Development',
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    setCurrentUser(newUser);
    storage.setCurrentUser(newUser);
    logActivity('registered account', `Created demo user profile for ${newUser.name}`);
    addNotification({
      type: 'task_assigned',
      title: 'Welcome to FLOWDECK',
      message: `Hi ${newUser.name}, your workspace is ready. Plan. Collaborate. Deliver.`,
    });
    return { success: true };
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name || 'New Member',
      email: userData.email || 'user@flowdeck.dev',
      role: (userData.role as any) || 'Developer',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: userData.status || 'active',
      bio: userData.bio || '',
      joinedDate: new Date().toISOString().split('T')[0],
      department: userData.department || 'Engineering',
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storage.setUsers(updatedUsers);
    logActivity('added team member', `Added ${newUser.name} (${newUser.role}) to workspace`);
  };

  const logout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    storage.setCurrentUser(updated);
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === updated.id ? updated : u));
      storage.setUsers(next);
      return next;
    });
    logActivity('updated profile', 'Saved user preferences and role details');
  };

  // Projects
  const createProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Project => {
    const code =
      data.code?.trim().toUpperCase() ||
      data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 4)
        .toUpperCase() ||
      'PROJ';

    const newProj: Project = {
      ...data,
      code,
      id: `proj-${Date.now()}`,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => {
      const next = [newProj, ...prev];
      storage.setProjects(next);
      return next;
    });

    logActivity('created project', `Created project workspace "${newProj.name}"`, newProj.id);
    addNotification({
      type: 'project_created',
      title: 'Project Created',
      message: `Project "${newProj.name}" was successfully initialized.`,
      linkUrl: `#/projects/${newProj.id}`,
      relatedId: newProj.id,
    });

    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      storage.setProjects(next);
      return next;
    });
    logActivity('updated project', `Modified project details for ${id}`, id);
  };

  const deleteProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      storage.setProjects(next);
      return next;
    });
    // Remove linked tasks
    setTasks((prev) => {
      const next = prev.filter((t) => t.projectId !== id);
      storage.setTasks(next);
      return next;
    });
    logActivity('deleted project', `Removed project "${proj?.name || id}"`);
  };

  // Helper to recompute project progress dynamically based on completed tasks
  const updateProjectProgressFromTasks = (allTasks: Task[]) => {
    setProjects((prev) => {
      const next = prev.map((proj) => {
        const projTasks = allTasks.filter((t) => t.projectId === proj.id);
        if (projTasks.length === 0) return proj;
        const completed = projTasks.filter((t) => t.status === 'completed').length;
        const computedProgress = Math.round((completed / projTasks.length) * 100);
        return { ...proj, progress: computedProgress };
      });
      storage.setProjects(next);
      return next;
    });
  };

  // Tasks
  const createTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentIds' | 'order'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      commentIds: [],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextTasks = [newTask, ...tasks];
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
    updateProjectProgressFromTasks(nextTasks);

    logActivity('created task', `Added "${newTask.title}"`, newTask.projectId, newTask.id);

    // Notify assigned member
    if (newTask.assigneeId && newTask.assigneeId !== currentUser?.id) {
      const assignee = users.find((u) => u.id === newTask.assigneeId);
      addNotification({
        type: 'task_assigned',
        title: 'New Task Assignment',
        message: `${currentUser?.name || 'A team member'} assigned you to "${newTask.title}".`,
        linkUrl: `#/tasks`,
        relatedId: newTask.id,
      });
    }

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const nextTasks = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, ...updates, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
    updateProjectProgressFromTasks(nextTasks);
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const nextTasks = tasks.filter((t) => t.id !== id);
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
    updateProjectProgressFromTasks(nextTasks);
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
    logActivity('deleted task', `Deleted "${task?.title || id}"`, task?.projectId);
  };

  const moveTaskStatus = (
    taskId: string,
    newStatus: TaskStatus,
    targetIndex?: number
  ): { success: boolean; blockedBy?: string; message?: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found' };
    if (task.status === newStatus && targetIndex === undefined) return { success: true };

    // Dependency check: Cannot mark as completed if prerequisite is not completed
    if (newStatus === 'completed' && task.dependsOnTaskId) {
      const prerequisite = tasks.find((t) => t.id === task.dependsOnTaskId);
      if (prerequisite && prerequisite.status !== 'completed') {
        const errorMsg = `Cannot complete "${task.title}". Blocked by prerequisite task: "${prerequisite.title}". Complete it first.`;
        showToast(errorMsg, 'error');
        addNotification({
          type: 'task_blocked',
          title: 'Task Completion Blocked',
          message: `"${task.title}" is blocked by "${prerequisite.title}".`,
          linkUrl: `#/tasks`,
          relatedId: task.id,
        });
        logActivity('task blocked', `Attempted to complete "${task.title}", but blocked by "${prerequisite.title}"`, task.projectId, task.id);
        return {
          success: false,
          blockedBy: prerequisite.title,
          message: errorMsg,
        };
      }
    }

    const prevStatus = task.status;
    const isNowCompleted = newStatus === 'completed' && prevStatus !== 'completed';

    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          order: targetIndex !== undefined ? targetIndex : t.order,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    setTasks(nextTasks);
    storage.setTasks(nextTasks);
    updateProjectProgressFromTasks(nextTasks);

    const readableStatus = newStatus.replace('_', ' ').toUpperCase();
    logActivity('moved task status', `Moved "${task.title}" to ${readableStatus}`, task.projectId, task.id);

    if (isNowCompleted) {
      addNotification({
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${task.title}" was marked as completed.`,
        linkUrl: `#/tasks`,
        relatedId: task.id,
      });
      showToast(`Task "${task.title}" marked as completed!`, 'success');
    } else {
      addNotification({
        type: 'task_moved',
        title: 'Task Moved',
        message: `Task "${task.title}" moved to ${readableStatus}.`,
        linkUrl: `#/tasks`,
        relatedId: task.id,
      });
    }

    return { success: true };
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
  };

  const addSubtask = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newSub: { id: string; title: string; completed: boolean } = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false,
    };
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, subtasks: [...t.subtasks, newSub], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    setTasks(nextTasks);
    storage.setTasks(nextTasks);
  };

  // Comments
  const addComment = (taskId: string, content: string) => {
    if (!content.trim()) return;
    const newComm: Comment = {
      id: `comm-${Date.now()}`,
      taskId,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextComments = [newComm, ...comments];
    setComments(nextComments);
    storage.setComments(nextComments);

    // Link to task
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, commentIds: [...t.commentIds, newComm.id], updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setTasks(nextTasks);
    storage.setTasks(nextTasks);

    logActivity('commented on task', content.slice(0, 50) + (content.length > 50 ? '...' : ''), undefined, taskId);
  };

  const editComment = (commentId: string, content: string) => {
    if (!content.trim()) return;
    const nextComments = comments.map((c) =>
      c.id === commentId ? { ...c, content: content.trim(), updatedAt: new Date().toISOString() } : c
    );
    setComments(nextComments);
    storage.setComments(nextComments);
  };

  const deleteComment = (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    const nextComments = comments.filter((c) => c.id !== commentId);
    setComments(nextComments);
    storage.setComments(nextComments);

    if (target) {
      const nextTasks = tasks.map((t) => {
        if (t.id === target.taskId) {
          return { ...t, commentIds: t.commentIds.filter((cid) => cid !== commentId) };
        }
        return t;
      });
      setTasks(nextTasks);
      storage.setTasks(nextTasks);
    }
  };

  const resetWorkspace = () => {
    storage.resetAll();
    setCurrentUser(storage.getCurrentUser());
    setUsers(storage.getUsers());
    setProjects(storage.getProjects());
    setTasks(storage.getTasks());
    setComments(storage.getComments());
    setNotifications(storage.getNotifications());
    setActivities(storage.getActivities());
    setThemeState(storage.getTheme());
    setSettingsState(storage.getSettings());
    setSelectedTaskId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateCurrentUserProfile,
        updateProfile: updateCurrentUserProfile,
        addUser,
        theme,
        toggleTheme,
        setTheme,
        settings,
        updateSettings,
        projects,
        createProject,
        updateProject,
        deleteProject,
        tasks,
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        updateTaskStatus: (id: string, newStatus: TaskStatus) => moveTaskStatus(id, newStatus),
        checkTaskBlocked,
        toggleSubtask,
        addSubtask,
        deleteSubtask,
        comments,
        addComment,
        editComment,
        deleteComment,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        clearAllNotifications: clearNotifications,
        addNotification,
        activities,
        logActivity,
        resetWorkspace,
        toast,
        showToast,
        selectedTaskId,
        setSelectedTaskId,
        isNewTaskOpen,
        setIsNewTaskOpen,
        newTaskInitialStatus,
        setNewTaskInitialStatus,
        newTaskInitialProjectId,
        setNewTaskInitialProjectId,
        isNewProjectOpen,
        setIsNewProjectOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
