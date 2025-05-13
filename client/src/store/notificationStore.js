import { create } from "zustand";

import { API_URL } from "../services/api.js";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await API_URL.get("/users/notification");
    set({ number: res.data });
  },
  decrease: () => set((prev) => ({ number: prev.number - 1 })),
  reset: () => set({ number: 0 }),
}));
