'use client';

import { ListTodo, CheckCircle2, Image as ImageIcon, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';

const stats = [
  { label: 'Total Tasks', value: '24', icon: ListTodo, color: 'bg-blue-50 text-blue-600' },
  { label: 'Completed', value: '18', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  { label: 'Images Uploaded', value: '12', icon: ImageIcon, color: 'bg-purple-50 text-purple-600' },
  { label: 'Pending Review', value: '6', icon: Clock, color: 'bg-orange-50 text-orange-600' },
];

const recentActivity = [
  { text: 'Completed "Design landing page UI"', time: '2 hours ago' },
  { text: 'Uploaded 3 new images for annotation', time: '5 hours ago' },
  { text: 'Added polygon annotation to car_001.jpg', time: 'Yesterday' },
  { text: 'Created task "Write API documentation"', time: 'Yesterday' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
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

      {/* Stats grid */}
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

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <p className="text-sm text-slate-700">{item.text}</p>
              <span className="text-xs text-slate-400 flex-shrink-0 ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}