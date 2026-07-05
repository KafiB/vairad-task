'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ListTodo,
  PenTool,
  Images,
  Users,
  Tag,
  BarChart3,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  functional: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, functional: true },
  { label: 'Tasks', href: '/tasks', icon: <ListTodo size={18} />, functional: true },
  { label: 'Annotate', href: '/annotate', icon: <PenTool size={18} />, functional: true },
  { label: 'Images', href: '/images', icon: <Images size={18} />, functional: false },
  { label: 'Members', href: '/members', icon: <Users size={18} />, functional: false },
  { label: 'Tags', href: '/tags', icon: <Tag size={18} />, functional: false },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={18} />, functional: false },
  { label: 'Profile', href: '/profile', icon: <UserIcon size={18} />, functional: true },
  { label: 'Settings', href: '/settings', icon: <Settings size={18} />, functional: false },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">TaskAnnotate</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const content = (
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-light text-brand'
                    : item.functional
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            );

            return item.functional ? (
              <Link key={item.href} href={item.href}>
                {content}
              </Link>
            ) : (
              <div key={item.href} title="Coming soon">
                {content}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User card */}
        {user && (
          <div className="px-3 pb-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Coming soon">
            <Bell size={20} className="text-slate-500" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}