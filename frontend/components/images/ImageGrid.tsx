'use client';

import type { ImageListItem } from '@/types';
import ImageCard from './ImageCard';

interface Props {
  images: ImageListItem[];
  onDelete: (image: ImageListItem) => void;
}

export default function ImageGrid({ images, onDelete }: Props) {
  if (images.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-12">No images uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onDelete={() => onDelete(image)} />
      ))}
    </div>
  );
}