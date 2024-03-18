import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikedProduct {
  productId: number;
  sent: boolean;
}

interface LikeStoreState {
  list: LikedProduct[];
  likeOrDislike: (productId: number, sent?: boolean) => void;
  markEveryItemToSent: () => void;
  clear: () => void;
  setMeny: (products: LikedProduct[]) => void;
}

const useLikeStore = create<LikeStoreState>()(
  persist(
    (set) => ({
      list: [],
      likeOrDislike: (productId, sent = false) =>
        set((oldState) => ({
          list: oldState.list.some((item) => item.productId === productId)
            ? oldState.list.filter((item) => item.productId !== productId)
            : [...oldState.list, { productId, sent }],
        })),
      markEveryItemToSent: () =>
        set((oldState) => ({
          list: oldState.list.map((listItem) => ({ ...listItem, sent: true })),
        })),
      clear: () => set((oldState) => ({ ...oldState, list: [] })),
      setMeny: (products) => set(() => ({ list: products })),
    }),
    { name: "like" }
  )
);

export default useLikeStore;
