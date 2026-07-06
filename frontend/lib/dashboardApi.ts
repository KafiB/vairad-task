import { api } from '@/lib/api';
import type { Task, ImageListItem, PaginatedResponse } from '@/types';

export async function getAllTasks(): Promise<Task[]> {
  const data = await api.get<PaginatedResponse<Task> | Task[]>('/tasks/');
  return Array.isArray(data) ? data : data.results;
}

export async function getAllImages(): Promise<ImageListItem[]> {
  const data = await api.get<PaginatedResponse<ImageListItem> | ImageListItem[]>('/annotation/images/');
  return Array.isArray(data) ? data : data.results;
}