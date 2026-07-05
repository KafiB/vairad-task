'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageSelectorList from '@/components/annotate/ImageSelectorList';
import Toolbar, { type Tool } from '@/components/annotate/Toolbar';
import AnnotationCanvas from '@/components/annotate/AnnotationCanvas';
import AnnotationsPanel from '@/components/annotate/AnnotationsPanel';
import { getImages } from '@/lib/imagesApi';
import { getImageDetail, bulkSaveAnnotations } from '@/lib/annotationApi';
import { ANNOTATION_COLORS, type AnnotationDraft } from '@/types/annotate';
import type { ImageListItem, ImageDetail } from '@/types';

function AnnotatePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [images, setImages] = useState<ImageListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [imageDetail, setImageDetail] = useState<ImageDetail | null>(null);
  const [annotations, setAnnotations] = useState<AnnotationDraft[]>([]);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [tool, setTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(1);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    getImages().then((imgs) => {
      setImages(imgs);
      const paramId = searchParams.get('image');
      if (paramId) {
        setSelectedId(Number(paramId));
      } else if (imgs.length > 0) {
        setSelectedId(imgs[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImage = useCallback(async (id: number) => {
    const detail = await getImageDetail(id);
    setImageDetail(detail);
    setAnnotations(
      detail.annotations.map((a) => ({
        clientId: `existing-${a.id}`,
        label: a.label,
        color: a.color,
        points: a.points,
      }))
    );
    setSelectedAnnotationId(null);
    setDrawingPoints([]);
    setZoom(1);
    setLastSaved(null);
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      loadImage(selectedId);
      router.replace(`/annotate?image=${selectedId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function handleSelectImage(id: number) {
    setSelectedId(id);
  }

  function handleAddPoint(point: [number, number]) {
    setDrawingPoints((prev) => [...prev, point]);
  }

  function handleFinishPolygon() {
    const nextColor = ANNOTATION_COLORS[annotations.length % ANNOTATION_COLORS.length];
    const newAnnotation: AnnotationDraft = {
      clientId: `new-${Date.now()}`,
      label: `Object ${annotations.length + 1}`,
      color: nextColor,
      points: drawingPoints,
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    setDrawingPoints([]);
    setTool('select');
    setSelectedAnnotationId(newAnnotation.clientId);
  }

  function handleUndoPoint() {
    setDrawingPoints((prev) => prev.slice(0, -1));
  }

  function handleDeleteSelected() {
    if (!selectedAnnotationId) return;
    setAnnotations((prev) => prev.filter((a) => a.clientId !== selectedAnnotationId));
    setSelectedAnnotationId(null);
  }

  function handleRename(clientId: string, label: string) {
    setAnnotations((prev) => prev.map((a) => (a.clientId === clientId ? { ...a, label } : a)));
  }

  function handleToggleVisibility(clientId: string) {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  }

  async function handleSave() {
    if (!imageDetail) return;
    setIsSaving(true);
    try {
      await bulkSaveAnnotations(
        imageDetail.id,
        annotations.map((a) => ({ label: a.label, color: a.color, points: a.points }))
      );
      setLastSaved(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
      setImages((prev) =>
        prev.map((img) => (img.id === imageDetail.id ? { ...img, annotation_count: annotations.length } : img))
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (selectedId) loadImage(selectedId);
  }

  function goToAdjacent(direction: 1 | -1) {
    const idx = images.findIndex((img) => img.id === selectedId);
    const nextIdx = idx + direction;
    if (nextIdx >= 0 && nextIdx < images.length) setSelectedId(images[nextIdx].id);
  }

  const visibleAnnotations = annotations.filter((a) => !hiddenIds.has(a.clientId));

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem-4rem)] -m-8">
        <ImageSelectorList images={images} selectedId={selectedId} onSelect={handleSelectImage} />

        <div className="flex-1 flex flex-col min-w-0">
          {imageDetail ? (
            <>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div>
                  <h2 className="font-semibold text-slate-900">{imageDetail.original_filename}</h2>
                  <p className="text-xs text-slate-500">
                    {imageDetail.width} x {imageDetail.height} · {(imageDetail.file_size / 1024).toFixed(0)} KB ·{' '}
                    {annotations.length} Annotations
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => goToAdjacent(-1)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => goToAdjacent(1)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="p-3 border-b border-slate-200 bg-white">
                <Toolbar
                  tool={tool}
                  onToolChange={setTool}
                  onUndoPoint={handleUndoPoint}
                  onDeleteSelected={handleDeleteSelected}
                  hasSelection={!!selectedAnnotationId}
                  zoom={zoom}
                  onZoomIn={() => setZoom((z) => Math.min(z + 0.25, 3))}
                  onZoomOut={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                  onZoomReset={() => setZoom(1)}
                />
              </div>

              <div className="flex-1 overflow-auto p-6 bg-slate-100 flex items-center justify-center">
                <AnnotationCanvas
                  image={imageDetail}
                  annotations={visibleAnnotations}
                  drawingPoints={drawingPoints}
                  tool={tool}
                  zoom={zoom}
                  selectedId={selectedAnnotationId}
                  onAddPoint={handleAddPoint}
                  onFinishPolygon={handleFinishPolygon}
                  onSelectAnnotation={setSelectedAnnotationId}
                />
              </div>

              <div className="px-4 py-2 border-t border-slate-200 bg-white text-xs text-slate-400">
                Click to start drawing a polygon. Double-click to close the polygon. Press Escape to deselect.
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select an image to start annotating
            </div>
          )}
        </div>

        {imageDetail && (
          <AnnotationsPanel
            annotations={annotations}
            selectedId={selectedAnnotationId}
            hiddenIds={hiddenIds}
            onSelect={setSelectedAnnotationId}
            onToggleVisibility={handleToggleVisibility}
            onRename={handleRename}
            onDelete={(id) => setAnnotations((prev) => prev.filter((a) => a.clientId !== id))}
            onAddAnnotation={() => setTool('polygon')}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AnnotatePage() {
  return (
    <Suspense fallback={null}>
      <AnnotatePageInner />
    </Suspense>
  );
}