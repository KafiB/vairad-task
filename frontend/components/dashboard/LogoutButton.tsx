'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <div className="px-3 py-4 border-t border-slate-200">
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}