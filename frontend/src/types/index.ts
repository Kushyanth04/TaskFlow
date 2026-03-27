export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: string;
  assigneeName?: string;
  priority: string;
  dueDate?: string;
  boardId?: string;
  workspaceId?: string;
  createdBy?: string;
  startedAt?: string;
  timeTakenSeconds?: number;
  isPaused?: boolean;
  sessionCount?: number;
  completedAt?: string;
}

export interface Board {
  _id: string;
  name: string;
  workspaceId: string;
  columns: string[];
  members: string[];
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'reminder' | 'overdue';
  message: string;
  time: Date;
  read: boolean;
}
