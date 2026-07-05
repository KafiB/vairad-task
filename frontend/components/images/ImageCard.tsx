'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MoreVertical, Trash2, Eye, X } from 'lucide-react';
import type { ImageListItem } from '@/types';

interface Props {
  image: ImageListItem;
  onDelete: () => void;
}

export default function ImageCard({ image, onDelete }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const uploadedDate = new Date(image.uploaded_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const uploadedTime = new Date(image.uploaded_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="relative aspect-video bg-slate-100">
          <Image src={image.file} alt={image.original_filename} fill className="object-cover" unoptimized />

          <div className="absolute top-2 right-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-10 bg-white rounded-lg border border-slate-200 shadow-lg py-1 w-32">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-3">
          <p className="text-sm font-semibold text-slate-900 truncate">{image.original_filename}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {uploadedDate} · {uploadedTime}
          </p>
          <p className="text-xs text-slate-400">
            {image.width} × {image.height} · {(image.file_size / 1024).toFixed(0)} KB
          </p>
          <p className="text-xs text-brand font-medium mt-1">
            {image.annotation_count} {image.annotation_count === 1 ? 'Annotation' : 'Annotations'}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg py-2 hover:bg-slate-50 transition-colors"
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={() => router.push(`/annotate?image=${image.id}`)}
              className="flex-1 bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-semibold rounded-lg py-2 hover:shadow-md transition-shadow"
            >
              Annotate
            </button>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setPreviewOpen(false)}
        >
          <button
            onClick={() => setPreviewOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-slate-300"
          >
            <X size={28} />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={image.file}
              alt={image.original_filename}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}