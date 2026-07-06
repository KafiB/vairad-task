'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  );
}