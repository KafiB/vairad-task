'use client';

import { useEffect, useState } from 'react';
import { ListTodo, CheckCircle2, Image as ImageIcon, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';
import { getAllTasks, getAllImages } from '@/lib/dashboardApi';
import type { Task, ImageListItem } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [images, setImages] = useState<ImageListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllTasks(), getAllImages()])
      .then(([taskData, imageData]) => {
        setTasks(taskData);
        setImages(imageData);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'done').length;
  const totalImages = images.length;
  const annotatedImages = images.filter((img) => img.status === 'annotated').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'Images Uploaded', value: totalImages, icon: ImageIcon, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  const recentImages = [...images]
    .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
    .slice(0, 4);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="text-slate-400 text-sm">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{user ? `, ${user.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      {/* Stats grid — real numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Tasks</h2>
            <Link href="/tasks" className="text-xs text-brand font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No tasks yet.</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="min-w-0">
                    <p className={`text-sm text-slate-700 truncate ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400">{task.due_date}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent images */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Images</h2>
            <Link href="/images" className="text-xs text-brand font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentImages.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No images uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentImages.map((img) => (
                <div key={img.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <p className="text-sm text-slate-700 truncate">{img.original_filename}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      img.status === 'annotated' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {img.status === 'annotated' ? 'Annotated' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Annotation progress summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
        <h2 className="font-semibold text-slate-900 mb-3">Annotation Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-dark"
              style={{ width: totalImages > 0 ? `${(annotatedImages / totalImages) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
            {annotatedImages} / {totalImages} annotated
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const styles = {
    todo: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-50 text-blue-600',
    done: 'bg-green-50 text-green-600',
  };
  const labels = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>{labels[status]}</span>;
}