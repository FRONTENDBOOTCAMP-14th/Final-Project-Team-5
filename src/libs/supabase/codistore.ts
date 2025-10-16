import { create } from 'zustand';

export interface Codi {
  id: number;
  imageUrl: string;
  liked: boolean;
  isMyCodi?: boolean;
}

interface CodiStore {
  codiList: Codi[];
  toggleLike: (id: number) => void;
  addCodi: (imageUrl: string) => void;
  removeCodi: (id: number) => void;
}

export const useCodiStore = create<CodiStore>((set) => ({
  codiList: [
    {
      id: 1,
      imageUrl: '/codi/casual_simple1.png',
      liked: true,
      isMyCodi: true,
    },
    { id: 2, imageUrl: '/codi/casual_simple2.png', liked: false },
    {
      id: 3,
      imageUrl: '/codi/casual_simple3.png',
      liked: true,
      isMyCodi: true,
    },
    { id: 4, imageUrl: '/codi/casual_simple4.png', liked: false },
    { id: 5, imageUrl: '/codi/kitch1.png', liked: true },
    {
      id: 6,
      imageUrl: '/codi/lovely1.png',
      liked: false,
      isMyCodi: true,
    },
  ],
  toggleLike: (id: number) =>
    set((state) => ({
      codiList: state.codiList.map((codi) =>
        codi.id === id
          ? {
              ...codi,
              liked: !codi.liked,
            }
          : codi
      ),
    })),
  addCodi: (imageUrl: string) =>
    set((state) => ({
      codiList: [
        ...state.codiList,
        { id: Date.now(), imageUrl, liked: false, isMyCodi: true },
      ],
    })),
  removeCodi: (id: number) =>
    set((state) => ({
      codiList: state.codiList.filter((codi) => codi.id !== id),
    })),
}));
