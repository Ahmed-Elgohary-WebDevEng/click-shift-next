import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City, Country } from "@/types/global";

interface AddressState {
  country: Country | null;
  city: City | null;
  updateCountry: (country: Country) => void;
  updateCity: (city: City | null) => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      country: null,
      city: null,
      updateCountry: (country) => set({ country }),
      updateCity: (city) => set({ city }),
    }),
    { name: "address" }
  )
);

export default useAddressStore;
