// Type definitions for User, Task, and Authentication Token

export interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Task {
  id: number;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dueDate?: string; // ISO date string, optional
}

export interface AuthToken {
  token: string;
  expiry: string; // ISO date string
  type: string;
}

// Frontend State Models
export interface CurrentUserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilter: 'all' | 'pending' | 'completed';
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  darkMode: boolean;
  showAddTaskModal: boolean;
  showTaskDetailModal: boolean;
  notifications: Notification[];
}