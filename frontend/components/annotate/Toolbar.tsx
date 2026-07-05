'use client';

import { MousePointer2, Hexagon, Undo2, Trash2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export type Tool = 'select' | 'polygon';

interface Props {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndoPoint: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export default function Toolbar({
  tool,
  onToolChange,
  onUndoPoint,
  onDeleteSelected,
  hasSelection,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: Props) {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1.5 w-fit">
      <ToolButton active={tool === 'select'} onClick={() => onToolChange('select')} title="Select">
        <MousePointer2 size={16} />
      </ToolButton>
      <ToolButton active={tool === 'polygon'} onClick={() => onToolChange('polygon')} title="Draw Polygon">
        <Hexagon size={16} />
      </ToolButton>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <ToolButton onClick={onUndoPoint} title="Undo last point">
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton onClick={onDeleteSelected} disabled={!hasSelection} title="Delete selected">
        <Trash2 size={16} />
      </ToolButton>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <ToolButton onClick={onZoomOut} title="Zoom out">
        <ZoomOut size={16} />
      </ToolButton>
      <span className="text-xs text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
      <ToolButton onClick={onZoomIn} title="Zoom in">
        <ZoomIn size={16} />
      </ToolButton>
      <ToolButton onClick={onZoomReset} title="Fit to screen">
        <Maximize size={16} />
      </ToolButton>
    </div>
  );
}

function ToolButton({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
        active ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}