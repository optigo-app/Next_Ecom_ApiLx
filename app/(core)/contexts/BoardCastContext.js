'use client'
// src/context/BroadcasterContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSyncStore } from '@/app/(core)/hooks/useStore';

const BroadcasterContext = createContext();

const CHANNEL_NAME = 'app_sync_channel';

export const BroadcasterProvider = ({ children }) => {
    const {
        setCartCount,
        setWishCount,
        setSyncData,
        resetAll
    } = useSyncStore();

    const channelRef = useRef(null);

    useEffect(() => {
        channelRef.current = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current.onmessage = (event) => {
            const { action, data, autocode, type, boolean } = event.data;
            if (autocode && type) {
                setSyncData({ autocode, type, status: boolean });
            }
            switch (action) {
                case 'UPDATE_CART_COUNT':
                    setCartCount(data); // Sync Recoil Atom
                    sessionStorage.setItem('cartCount', data);
                    break;

                case 'UPDATE_WISH_COUNT':
                    setWishCount(data); // Sync Recoil Atom
                    break;

                case 'LOGOUT_ALL_TABS':
                    setCartCount(0);
                    setWishCount(0);
                    break;

                default:
                    break;
            }
        };

        return () => {
            if (channelRef.current) channelRef.current.close();
        };
    }, [setCartCount, setWishCount]);

    // 4. Expose a generic "send" function 
    //  autocode : 78977979 type : "wish" || "cart" boolean : false || true
    const broadcast = (action, data, autocode, type, boolean) => {
        if (channelRef.current) {
            channelRef.current.postMessage({
                action,
                data,
                autocode,
                type,
                boolean
            });

        }
    };

    return (
        <BroadcasterContext.Provider value={{ broadcast }}>
            {children}
        </BroadcasterContext.Provider>
    );
};

export const useBroadcaster = () => useContext(BroadcasterContext);