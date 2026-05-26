import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReadingsStore = create(
  persist(
    (set) => ({
      readings: [],
      addReading: (reading) =>
        set((state) => ({
          readings: [{ ...reading, id: crypto.randomUUID() }, ...state.readings],
        })),
      deleteReading: (id) =>
        set((state) => ({
          readings: state.readings.filter((r) => r.id !== id),
        })),
      hydrate: () => {
        // Hydration logic handled by persist middleware
      },
    }),
    {
      name: 'glucose-readings-storage',
    }
  )
);

export default useReadingsStore;
