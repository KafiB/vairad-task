export interface AnnotationDraft {
  clientId: string;
  label: string;
  color: string;
  points: [number, number][];
}

export const ANNOTATION_COLORS = [
  '#6D28D9', // purple
  '#16A34A', // green
  '#EA580C', // orange
  '#2563EB', // blue
  '#DB2777', // pink
  '#64748B', // slate
];