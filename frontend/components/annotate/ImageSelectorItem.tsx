'use client';

import Image from 'next/image';
import { Layers } from 'lucide-react';
import type { ImageListItem } from '@/types';

interface Props {
  image: ImageListItem;
  isActive: boolean;
  onClick: () => void;
}

export default function ImageSelectorItem({ image, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex gap-3 p-2 rounded-lg border text-left transition-colors ${
        isActive ? 'border-brand bg-brand-light/40' : 'border-transparent hover:bg-slate-50'
      }`}
    >
      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
        <Image src={image.file} alt={image.original_filename} fill className="object-cover" unoptimized />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">{image.original_filename}</p>
        <p className="text-xs text-slate-400">
          {new Date(image.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-xs text-brand font-medium flex items-center gap-1 mt-0.5">
          <Layers size={10} />
          {image.annotation_count} {image.annotation_count === 1 ? 'Annotation' : 'Annotations'}
        </p>
      </div>
    </button>
  );
}