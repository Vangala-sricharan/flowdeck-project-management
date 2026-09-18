export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Priority = TaskPriority;

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';

export type TaskLabel =
  | 'Design'
  | 'Development'
  | 'Testing'
  | 'Documentation'
  | 'Bug'
  | 'Research'
  | 'Meeting';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  labels: TaskLabel[];
  dueDate: string;
  subtasks: Subtask[];
  commentIds: string[];
  dependsOnTaskId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  priority: TaskPriority;
  status: ProjectStatus;
  startDate: string;
  dueDate: string;
  memberIds: string[];
  budgetINR?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Project Lead' | 'Developer' | 'Designer' | 'Tester' | 'Documentation';
  avatar: string;
  status: 'active' | 'away' | 'offline';
  bio?: string;
  department?: string;
  joinedDate: string;
}

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_moved'
  | 'comment_added'
  | 'deadline_approaching'
  | 'project_created'
  | 'project_updated'
  | 'project_status_changed'
  | 'task_blocked';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkUrl?: string;
  relatedId?: string;
}

export interface Activity {
  id: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  details?: string;
  timestamp: string;
}
export type ActivityLog = Activity;

export type ThemeMode = 'light' | 'dark';

export interface UserSettings {
  theme: ThemeMode;
  emailNotifications: boolean;
  taskAlerts: boolean;
  commentAlerts: boolean;
  deadlineReminders: boolean;
  compactView: boolean;
}
