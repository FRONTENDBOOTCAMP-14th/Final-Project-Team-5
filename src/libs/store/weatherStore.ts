import { create } from 'zustand';

export const useWeatherStore = create<{
  currentLat: number | undefined;
  currentLon: number | undefined;
  setLocation: (
    currentLat: number | undefined,
    currentLon: number | undefined
  ) => void;
}>((set) => {
  return {
    currentLat: undefined,
    currentLon: undefined,
    setLocation: (lat, lon) => set({ currentLat: lat, currentLon: lon }),
  };
});
