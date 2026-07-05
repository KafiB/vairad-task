import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-indigo-900">
        {/* Full-cover illustration */}
        <Image
          src="/auth/auth.jpg"
          alt="Task management illustration"
          fill
          className="object-cover opacity-90"
          priority
        />

        {/* Gradient overlay so text stays readable on top of the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand/80 via-brand-dark/70 to-indigo-950/90" />

        {/* Decorative floating glow */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">TaskAnnotate</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Manage tasks.
              <br />
              Annotate better.
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              A powerful workspace for task management and image annotation,
              built for teams who move fast.
            </p>
          </div>

          {/* Footer */}
          <div className="text-white/40 text-sm">
            © 2026 TaskAnnotate. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}