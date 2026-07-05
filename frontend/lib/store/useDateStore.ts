import { create } from 'zustand';

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface DateStore {
  selectedDate: string | null; // null = no filter, show all tasks
  setSelectedDate: (date: string) => void;
  clearDate: () => void;
  goToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
}

export const useDateStore = create<DateStore>((set, get) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  clearDate: () => set({ selectedDate: null }),
  goToToday: () => set({ selectedDate: formatDateKey(new Date()) }),
  goToPreviousDay: () => {
    const current = get().selectedDate ?? formatDateKey(new Date());
    const d = parseDateKey(current);
    d.setDate(d.getDate() - 1);
    set({ selectedDate: formatDateKey(d) });
  },
  goToNextDay: () => {
    const current = get().selectedDate ?? formatDateKey(new Date());
    const d = parseDateKey(current);
    d.setDate(d.getDate() + 1);
    set({ selectedDate: formatDateKey(d) });
  },
}));