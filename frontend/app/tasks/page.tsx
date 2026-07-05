'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DateSelector from '@/components/tasks/DateSelector';
import Board from '@/components/tasks/Board';
import TaskModal from '@/components/tasks/TaskModal';
import { useDateStore } from '@/lib/store/useDateStore';
import { getTasksByDate, createTask, updateTask, deleteTask } from '@/lib/tasksApi';
import type { Task, TaskStatus } from '@/types';
import type { TaskFormValues } from '@/lib/schemas/task';

export default function TasksPage() {
  const selectedDate = useDateStore((s) => s.selectedDate);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasksByDate(selectedDate);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function openCreateModal(status: TaskStatus) {
    setEditingTask(null);
    setNewTaskStatus(status);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  const [saveError, setSaveError] = useState<string | null>(null);

async function handleSave(data: TaskFormValues) {
  setSaveError(null);
  const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  try {
    if (editingTask) {
      await updateTask(editingTask.id, { ...data, tags });
    } else {
      await createTask({ ...data, tags });
    }
    setModalOpen(false);
    fetchTasks();
  } catch (err) {
    console.error('Task save failed:', err);
    setSaveError(err instanceof Error ? err.message : 'Failed to save task.');
  }
}

  async function handleDelete() {
    if (!editingTask) return;
    await deleteTask(editingTask.id);
    setModalOpen(false);
    fetchTasks();
  }

  async function handleStatusChange(taskId: number, newStatus: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      fetchTasks();
    }
  }

  async function handleDirectDelete(task: Task) {
  if (!confirm(`Delete "${task.title}"?`)) return;
  await deleteTask(task.id);
  fetchTasks();
}

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your tasks efficiently with Kanban board.</p>
        </div>
        <button onClick={() => openCreateModal('todo')} className="flex items-center gap-1.5 bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:shadow-md transition-shadow">
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="mb-6">
        <DateSelector />
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm text-center py-12">Loading tasks...</div>
      ) : (
        <Board
  tasks={tasks}
  onAddTask={openCreateModal}
  onTaskClick={openEditModal}
  onTaskEdit={openEditModal}
  onTaskDelete={handleDirectDelete}
  onStatusChange={handleStatusChange}
/>
      )}

      <TaskModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={handleSave}
  onDelete={editingTask ? handleDelete : undefined}
  initialStatus={newTaskStatus}
  editingTask={editingTask}
  selectedDate={selectedDate}
  saveError={saveError}
/>
    </DashboardLayout>
  );
}