'use client';

import { User as UserIcon, Mail, Calendar, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="text-slate-400 text-sm">Loading...</div>
      </DashboardLayout>
    );
  }

  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information.</p>
      </div>

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {user.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
          <p className="text-slate-500">{user.email}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Calendar size={12} />
            Joined on {joinedDate}
          </p>
        </div>
      </div>

      {/* Personal information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-5">Personal Information</h2>
        <div className="space-y-5">
          <InfoRow icon={<UserIcon size={18} />} label="Full Name" value={user.full_name} />
          <InfoRow icon={<Mail size={18} />} label="Email Address" value={user.email} />
          <InfoRow
            icon={<ShieldCheck size={18} />}
            label="Account Status"
            value={user.is_active ? 'Active' : 'Inactive'}
          />
          <InfoRow icon={<Calendar size={18} />} label="Member Since" value={joinedDate} />
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}