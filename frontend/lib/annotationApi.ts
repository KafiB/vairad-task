import { api } from '@/lib/api';
import type { ImageDetail, AnnotationInput, Annotation } from '@/types';

export async function getImageDetail(id: number): Promise<ImageDetail> {
  return api.get<ImageDetail>(`/annotation/images/${id}/`);
}

export async function bulkSaveAnnotations(
  imageId: number,
  annotations: AnnotationInput[]
): Promise<Annotation[]> {
  return api.post<Annotation[]>(`/annotation/images/${imageId}/annotations/bulk-save/`, {
    annotations,
  });
}