import { api } from '@/lib/api';
import type { Task, TaskInput, PaginatedResponse } from '@/types';

export async function getTasksByDate(date: string | null): Promise<Task[]> {
  const url = date ? `/tasks/?due_date=${date}` : '/tasks/';
  const data = await api.get<PaginatedResponse<Task> | Task[]>(url);
  return Array.isArray(data) ? data : data.results;
}

export async function createTask(input: TaskInput): Promise<Task> {
  return api.post<Task>('/tasks/', input);
}

export async function updateTask(id: number, input: Partial<TaskInput>): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}/`, input);
}

export async function deleteTask(id: number): Promise<void> {
  return api.delete<void>(`/tasks/${id}/`);
}