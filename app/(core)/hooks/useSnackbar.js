import { create } from 'zustand';

export const useSnackbarStore = create((set) => ({
  open: false,
  message: '',
  showSnackbar: (msg) => set({ open: true, message: msg }),
  closeSnackbar: () => set({ open: false }),
}));