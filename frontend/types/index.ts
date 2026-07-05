// Matches apps/authentication/serializers.py -> UserProfileSerializer
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Matches apps/tasks/models.py
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Tag {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  owner: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string; // ISO date string, e.g. "2025-05-21"
  tag_details: Tag[];
  created_at: string;
  updated_at: string;
}

// For creating/updating tasks — tags sent as names, not full objects
export interface TaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  tags?: string[];
}

// Matches apps/annotation/models.py
export type ImageStatus = 'pending' | 'annotated';

export interface ImageTag {
  id: number;
  name: string;
}

export interface Annotation {
  id: number;
  image: number;
  label: string;
  color: string;
  points: [number, number][];
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AnnotationInput {
  label: string;
  color: string;
  points: [number, number][];
}

export interface ImageListItem {
  id: number;
  file: string;
  original_filename: string;
  status: ImageStatus;
  width: number;
  file_size: number;
  height: number;
  annotation_count: number;
  uploaded_at: string;
}

export interface ImageDetail extends ImageListItem {
  owner: number;
  file_format: string;
  tag_details: ImageTag[];
  annotations: Annotation[];
  updated_at: string;
}

// Generic paginated response shape (DRF's default pagination)
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}