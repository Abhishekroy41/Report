import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      unit: 'mg/dL',
      patientName: 'Mom',
      theme: 'dark',
      setUnit: (unit) => set({ unit }),
      setPatientName: (name) => set({ patientName: name }),
      setTheme: (theme) => set({ theme }),
      hydrate: () => {},
    }),
    {
      name: 'glucose-settings-storage',
    }
  )
);

export default useSettingsStore;
