import { api } from '@/lib/api';
import type { ImageListItem, ImageDetail, PaginatedResponse } from '@/types';

export async function getImages(): Promise<ImageListItem[]> {
  const data = await api.get<PaginatedResponse<ImageListItem> | ImageListItem[]>('/annotation/images/');
  return Array.isArray(data) ? data : data.results;
}

export async function uploadImage(file: File): Promise<ImageDetail> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('original_filename', file.name);
  return api.post<ImageDetail>('/annotation/images/', formData);
}

export async function deleteImage(id: number): Promise<void> {
  return api.delete(`/annotation/images/${id}/`);
}