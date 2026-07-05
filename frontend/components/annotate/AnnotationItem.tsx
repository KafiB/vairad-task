'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, Trash2, Check, X } from 'lucide-react';
import type { AnnotationDraft } from '@/types/annotate';

interface Props {
  annotation: AnnotationDraft;
  isSelected: boolean;
  isHidden: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRename: (newLabel: string) => void;
  onDelete: () => void;
}

export default function AnnotationItem({
  annotation,
  isSelected,
  isHidden,
  onSelect,
  onToggleVisibility,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(annotation.label);

  function saveLabel() {
    if (draftLabel.trim()) onRename(draftLabel.trim());
    setEditing(false);
  }

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border p-3 cursor-pointer transition-colors ${
        isSelected ? 'border-brand bg-brand-light/30' : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: annotation.color }} />
          {editing ? (
            <input
              autoFocus
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === 'Enter' && saveLabel()}
              className="text-sm font-medium text-slate-900 border border-brand rounded px-1.5 py-0.5 w-28 focus:outline-none"
            />
          ) : (
            <span className="text-sm font-semibold text-slate-900 truncate">{annotation.label}</span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); saveLabel(); }} className="text-green-600 hover:bg-green-50 p-1 rounded">
              <Check size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setEditing(false); setDraftLabel(annotation.label); }} className="text-slate-400 hover:bg-slate-100 p-1 rounded">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="text-slate-400 hover:text-slate-600 p-1">
              {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setEditing(true); }} className="text-slate-400 hover:text-slate-600 p-1">
              <Pencil size={14} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">{annotation.points.length} points</p>
    </div>
  );
}