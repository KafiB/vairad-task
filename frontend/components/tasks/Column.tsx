'use client';

import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';

const columnStyles: Record<TaskStatus, { header: string; bg: string }> = {
  todo: { header: 'text-slate-900', bg: 'bg-slate-50' },
  in_progress: { header: 'text-blue-700', bg: 'bg-blue-50/40' },
  done: { header: 'text-green-700', bg: 'bg-green-50/40' },
};

const columnLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
}

export default function Column({ status, tasks, onAddTask, onTaskClick, onTaskEdit, onTaskDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = columnStyles[status];

  return (
    <div ref={setNodeRef} className={`rounded-xl border border-slate-200 p-4 flex flex-col ${style.bg} ${isOver ? 'ring-2 ring-brand' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${style.header}`}>{columnLabels[status]}</span>
          <span className="text-xs font-medium bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-500">{tasks.length}</span>
        </div>
        <button onClick={onAddTask} className="text-slate-400 hover:text-brand transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-3 min-h-[100px]">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}