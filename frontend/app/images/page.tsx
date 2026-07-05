'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UploadDropzone from '@/components/images/UploadDropzone';
import ImageGrid from '@/components/images/ImageGrid';
import { getImages, uploadImage, deleteImage } from '@/lib/imagesApi';
import type { ImageListItem } from '@/types';

export default function ImagesPage() {
  const [images, setImages] = useState<ImageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getImages();
      setImages(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleFilesSelected(files: FileList) {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadImage(file);
      }
      fetchImages();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: ImageListItem) {
    if (!confirm(`Delete "${image.original_filename}"?`)) return;
    await deleteImage(image.id);
    fetchImages();
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Images</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and organize uploaded images for annotation.</p>
        </div>
      </div>

      <div className="mb-8">
        <UploadDropzone onFilesSelected={handleFilesSelected} />
        {uploading && <p className="text-sm text-brand mt-2">Uploading...</p>}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900">
          Recent Uploads <span className="text-slate-400 font-normal">({images.length} images)</span>
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-12">Loading images...</p>
      ) : (
        <ImageGrid images={images} onDelete={handleDelete} />
      )}
    </DashboardLayout>
  );
}