import { create } from 'zustand';

export const useWeatherStore = create<{
  currentLat: number | undefined;
  currentLon: number | undefined;
  selectedLocation: string | undefined;
  setLocation: (
    currentLat: number | undefined,
    currentLon: number | undefined,
    selectedLocation: string | undefined
  ) => void;
}>((set) => {
  return {
    currentLat: undefined,
    currentLon: undefined,
    selectedLocation: undefined,
    setLocation: (lat, lon, address) =>
      set({
        currentLat: lat,
        currentLon: lon,
        selectedLocation: address,
      }),
  };
});
