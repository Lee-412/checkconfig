// connectionStore.ts
import { create } from "zustand";

interface ConnectionStore {
  connectionString: string;
  setConnectionString: (value: string) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connectionString: "",
  setConnectionString: (value) => set({ connectionString: value }),
}));
