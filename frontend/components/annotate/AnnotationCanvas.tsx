'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import type { ImageDetail } from '@/types';
import type { AnnotationDraft } from '@/types/annotate';
import type { Tool } from './Toolbar';

interface Props {
  image: ImageDetail;
  annotations: AnnotationDraft[];
  drawingPoints: [number, number][];
  tool: Tool;
  zoom: number;
  selectedId: string | null;
  onAddPoint: (point: [number, number]) => void;
  onFinishPolygon: () => void;
  onSelectAnnotation: (clientId: string | null) => void;
}

export default function AnnotationCanvas({
  image,
  annotations,
  drawingPoints,
  tool,
  zoom,
  selectedId,
  onAddPoint,
  onFinishPolygon,
  onSelectAnnotation,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mousePos, setMousePos] = useState<[number, number] | null>(null);

  function getNativePoint(clientX: number, clientY: number): [number, number] {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * image.width;
    const y = ((clientY - rect.top) / rect.height) * image.height;
    return [Math.round(x), Math.round(y)];
  }

  function handleClick(e: React.MouseEvent) {
    if (tool !== 'polygon') return;
    onAddPoint(getNativePoint(e.clientX, e.clientY));
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (tool === 'polygon' && drawingPoints.length >= 3) {
      onFinishPolygon();
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (tool === 'polygon' && drawingPoints.length > 0) {
      setMousePos(getNativePoint(e.clientX, e.clientY));
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onSelectAnnotation(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectAnnotation]);

  const pointRadius = Math.max(image.width, image.height) * 0.006;

  return (
    <div
      className="relative bg-slate-900 rounded-lg overflow-hidden mx-auto"
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
        width: `${zoom * 100}%`,
        maxWidth: '100%',
      }}
    >
      <Image src={image.file} alt={image.original_filename} fill className="object-contain" unoptimized />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${image.width} ${image.height}`}
        className={`absolute inset-0 w-full h-full ${tool === 'polygon' ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Completed annotations */}
        {annotations.map((ann) => (
          <polygon
            key={ann.clientId}
            points={ann.points.map((p) => p.join(',')).join(' ')}
            fill={ann.color}
            fillOpacity={selectedId === ann.clientId ? 0.35 : 0.2}
            stroke={ann.color}
            strokeWidth={selectedId === ann.clientId ? 3 : 2}
            vectorEffect="non-scaling-stroke"
            onClick={(e) => {
              e.stopPropagation();
              if (tool === 'select') onSelectAnnotation(ann.clientId);
            }}
            className={tool === 'select' ? 'cursor-pointer' : ''}
          />
        ))}

        {/* Points on selected annotation */}
        {selectedId &&
          annotations
            .find((a) => a.clientId === selectedId)
            ?.points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={pointRadius} fill="white" stroke="#6D28D9" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            ))}

        {/* In-progress polygon being drawn */}
        {drawingPoints.length > 0 && (
          <>
            <polyline
              points={[...drawingPoints, ...(mousePos ? [mousePos] : [])].map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke="#6D28D9"
              strokeWidth={2}
              strokeDasharray="6,4"
              vectorEffect="non-scaling-stroke"
            />
            {drawingPoints.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={pointRadius} fill="#6D28D9" stroke="white" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}