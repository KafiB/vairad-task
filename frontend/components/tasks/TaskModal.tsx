'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Trash2 } from 'lucide-react';
import { taskSchema, type TaskFormValues } from '@/lib/schemas/task';
import type { Task, TaskStatus } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormValues) => void;
  onDelete?: () => void;
  initialStatus?: TaskStatus;
  editingTask?: Task | null;
  selectedDate: string | null; // Updated to handle nullable date
  saveError?: string | null;
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialStatus,
  editingTask,
  selectedDate,
  saveError,
}: Props) {
  // Safe fallback to today's date if selectedDate is null
  const fallbackDate = selectedDate ?? new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: initialStatus ?? 'todo',
      priority: 'medium',
      due_date: fallbackDate,
      tags: '',
    },
  });

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        due_date: editingTask.due_date,
        tags: editingTask.tag_details.map((t) => t.name).join(', '),
      });
    } else {
      reset({
        title: '',
        description: '',
        status: initialStatus ?? 'todo',
        priority: 'medium',
        due_date: fallbackDate,
        tags: '',
      });
    }
  }, [editingTask, initialStatus, fallbackDate, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          {saveError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input {...register('title')} placeholder="Task title" className={inputClass} />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Optional details"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select {...register('status')} className={inputClass}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select {...register('priority')} className={inputClass}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
            <input type="date" {...register('due_date')} className={inputClass} />
            {errors.due_date && <p className="text-xs text-red-600 mt-1">{errors.due_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tags <span className="text-slate-400 font-normal">(comma separated)</span>
            </label>
            <input {...register('tags')} placeholder="Design, Frontend" className={inputClass} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-semibold rounded-lg py-2.5 hover:shadow-md transition-shadow"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
            {editingTask && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}