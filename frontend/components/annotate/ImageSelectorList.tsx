'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { ImageListItem } from '@/types';
import ImageSelectorItem from './ImageSelectorItem';

interface Props {
  images: ImageListItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ImageSelectorList({ images, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('');

  const filtered = images.filter((img) =>
    img.original_filename.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Select Image</h2>
        <p className="text-xs text-slate-500 mt-0.5">Choose an uploaded image to annotate.</p>
      </div>

      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search images..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No images found</p>
        ) : (
          filtered.map((img) => (
            <ImageSelectorItem key={img.id} image={img} isActive={img.id === selectedId} onClick={() => onSelect(img.id)} />
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-200 text-xs text-slate-400 text-center">
        {images.length} Images
      </div>
    </div>
  );
}