'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { useDateStore } from '@/lib/store/useDateStore';

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function DateSelector() {
  const { selectedDate, goToPreviousDay, goToNextDay, goToToday, setSelectedDate, clearDate } = useDateStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const dateObj = selectedDate ? parseDateKey(selectedDate) : null;
  const formatted = dateObj
    ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'All Tasks';
  const weekday = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'long' }) : null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-2">
        <button
          onClick={() => inputRef.current?.showPicker?.()}
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500"
        >
          <Calendar size={16} />
        </button>

        {selectedDate && (
          <button onClick={goToPreviousDay} className="p-1.5 hover:bg-slate-100 rounded-md">
            <ChevronLeft size={16} className="text-slate-500" />
          </button>
        )}

        <span className="text-sm font-semibold text-slate-900 whitespace-nowrap px-1">
          {formatted} {weekday && <span className="text-slate-400 font-normal">({weekday})</span>}
        </span>

        {selectedDate && (
          <>
            <button onClick={goToNextDay} className="p-1.5 hover:bg-slate-100 rounded-md">
              <ChevronRight size={16} className="text-slate-500" />
            </button>
            <button onClick={clearDate} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400" title="Show all tasks">
              <X size={14} />
            </button>
          </>
        )}

        <input
          ref={inputRef}
          type="date"
          value={selectedDate ?? ''}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sr-only"
        />
      </div>

      <button
        onClick={goToToday}
        className="px-4 py-2 rounded-lg border border-brand text-brand text-sm font-medium hover:bg-brand-light transition-colors"
      >
        Today
      </button>
    </div>
  );
}