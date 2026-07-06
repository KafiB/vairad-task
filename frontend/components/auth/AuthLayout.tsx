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
        {/* Full-cover illustration - Using the provided background image */}
        <Image
          src="/auth/auth3.jpg" // Referenced provided image
          alt="Geometric pastel gradient background"
          fill
          className="object-cover opacity-90"
          priority
        />
        
        {/* Decorative floating glow (retained from original for depth) */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Branding Container - Centered and larger logo */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-white w-full text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Logo Image - Enlarged and organized */}
            <div className="w-48 h-48 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 overflow-hidden shadow-2xl p-6">
              <img 
                src="/logo.png" 
                alt="TaskAnnotate Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            
            {/* Text and Tagline */}
            <div className="space-y-3">
              <span className="text-4xl font-extrabold tracking-tighter">
                TaskAnnotate
              </span>
              <p className="text-xl text-indigo-100 font-medium max-w-sm">
                Streamline your workflow. Annotate with precision.
              </p>
            </div>
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