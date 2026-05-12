// src/store/useStore.js
import { create } from 'zustand';

export const useSyncStore = create((set) => ({
    // 🔹 Equivalent of syncDataAtom
    syncData: {
        autocode: "",
        type: "",
        status: false
    },

    // 🔹 Equivalent of syncProductListAtom
    syncProductList: {
        ProductType: "",
        Source: "",
        ts: 0
    },

    // 🔹 Setters
    setSyncData: (data) =>
        set({
            syncData: {
                autocode: data.autocode || "",
                type: data.type || "",
                status: data.status ?? false
            }
        }),

    setSyncProductList: (data) =>
        set({
            syncProductList: {
                ProductType: data.ProductType || "",
                Source: data.Source || "",
                ts: Date.now() // 👈 always trigger update
            }
        }),

    // Optional reset
    resetSync: () =>
        set({
            syncData: { autocode: "", type: "", status: false },
            syncProductList: { ProductType: "", Source: "", ts: 0 }
        })
}));



export const useSyncDataStore = create((set) => ({
    syncData: {
        autocode: "",
        type: "",
        status: false,
    },

    setSyncData: (data) =>
        set({
            syncData: {
                autocode: data.autocode || "",
                type: data.type || "",
                status: data.status ?? false,
            },
        }),
}));
