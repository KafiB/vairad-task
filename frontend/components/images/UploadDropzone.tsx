'use client';

import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface Props {
  onFilesSelected: (files: FileList) => void;
}

export default function UploadDropzone({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) onFilesSelected(e.dataTransfer.files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors ${
        isDragging ? 'border-brand bg-brand-light/40' : 'border-slate-300 bg-slate-50'
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mb-4">
        <UploadCloud size={28} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Drag & Drop Images</h3>
      <p className="text-sm text-slate-400 mb-4">or</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:shadow-md transition-shadow"
      >
        Browse Files
      </button>
      <p className="text-xs text-slate-400 mt-4">Supported: PNG, JPG, JPEG · Maximum size: 20 MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
      />
    </div>
  );
}