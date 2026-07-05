'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, Flag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '@/types';

const priorityStyles: Record<string, { badge: string; border: string }> = {
  high: { badge: 'bg-purple-100 text-purple-700', border: 'border-l-purple-500' },
  medium: { badge: 'bg-orange-100 text-orange-700', border: 'border-l-orange-500' },
  low: { badge: 'bg-green-100 text-green-700', border: 'border-l-green-500' },
};

interface Props {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onClick, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const priority = priorityStyles[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`relative bg-white rounded-lg border border-slate-200 border-l-4 ${priority.border} p-4 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{task.title}</h3>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-10 bg-white rounded-lg border border-slate-200 shadow-lg py-1 w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {task.tag_details.length > 0 && <p className="text-xs text-slate-500 mb-2">{task.tag_details[0].name}</p>}

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <Calendar size={12} />
          {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${priority.badge}`}>
          <Flag size={10} />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
    </div>
  );
}