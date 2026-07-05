'use client';

import { Plus } from 'lucide-react';
import type { AnnotationDraft } from '@/types/annotate';
import AnnotationItem from './AnnotationItem';

interface Props {
  annotations: AnnotationDraft[];
  selectedId: string | null;
  hiddenIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRename: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onAddAnnotation: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  lastSaved: string | null;
}

export default function AnnotationsPanel({
  annotations,
  selectedId,
  hiddenIds,
  onSelect,
  onToggleVisibility,
  onRename,
  onDelete,
  onAddAnnotation,
  onSave,
  onCancel,
  isSaving,
  lastSaved,
}: Props) {
  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Annotations</h2>
          <p className="text-xs text-slate-500">{annotations.length} Annotations</p>
        </div>
        <button
          onClick={onAddAnnotation}
          className="flex items-center gap-1 text-xs font-semibold bg-brand text-white px-2.5 py-1.5 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {annotations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            No annotations yet. Click &quot;Add&quot; and draw a polygon on the image.
          </p>
        ) : (
          annotations.map((ann) => (
            <AnnotationItem
              key={ann.clientId}
              annotation={ann}
              isSelected={selectedId === ann.clientId}
              isHidden={hiddenIds.has(ann.clientId)}
              onSelect={() => onSelect(ann.clientId)}
              onToggleVisibility={() => onToggleVisibility(ann.clientId)}
              onRename={(label) => onRename(ann.clientId, label)}
              onDelete={() => onDelete(ann.clientId)}
            />
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 space-y-2">
        {lastSaved && <p className="text-xs text-green-600 text-center">Last saved {lastSaved}</p>}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-semibold rounded-lg py-2.5 hover:shadow-md transition-shadow disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save Annotations'}
        </button>
        <button onClick={onCancel} className="w-full text-sm font-medium text-slate-600 border border-slate-200 rounded-lg py-2.5 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}