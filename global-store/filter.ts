import { create } from "zustand";

interface FilterStoreState {
  productVariant: string;
  updateProductVariant: (value: string) => void;
}

const useFilterStore = create<FilterStoreState>((set) => ({
  productVariant: "1",
  updateProductVariant: (value) => set({ productVariant: value }),
}));

export default useFilterStore;
