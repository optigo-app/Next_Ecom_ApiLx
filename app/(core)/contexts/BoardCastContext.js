'use client'
// src/context/BroadcasterContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSyncStore } from '@/app/(core)/hooks/useStore';
import { useStore } from '@/app/(core)/contexts/StoreProvider';

const BroadcasterContext = createContext();

const CHANNEL_NAME = 'app_sync_channel';

export const BroadcasterProvider = ({ children }) => {
const setSyncData = useSyncStore((state) => state.setSyncData);
const { setCartCountNum, setWishCountNum } = useStore();

    const channelRef = useRef(null);

    const handleAction = (action, data, autocode, type, boolean, articleNo) => {
        if (autocode && type) {
            setSyncData({ autocode, type, status: boolean, ArticleNo: articleNo });
        }
        switch (action) {
            case 'UPDATE_CART_COUNT':
                if (data !== undefined && data !== null) {
                    if (typeof setCartCountNum === 'function') setCartCountNum(data);
                    sessionStorage.setItem('cartCount', data);
                }
                break;

            case 'UPDATE_WISH_COUNT':
                if (data !== undefined && data !== null) {
                    if (typeof setWishCountNum === 'function') setWishCountNum(data);
                }
                break;

            case 'LOGOUT_ALL_TABS':
                if (typeof setCartCountNum === 'function') setCartCountNum(0);
                if (typeof setWishCountNum === 'function') setWishCountNum(0);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        channelRef.current = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current.onmessage = (event) => {
            const { action, data, autocode, type, boolean, articleNo } = event.data;
            handleAction(action, data, autocode, type, boolean, articleNo);
        };

        return () => {
            if (channelRef.current) channelRef.current.close();
        };
    }, [setCartCountNum, setWishCountNum]);

    const broadcast = (action, data, autocode, type, boolean, articleNo) => {
        handleAction(action, data, autocode, type, boolean, articleNo);

        if (channelRef.current) {
            channelRef.current.postMessage({
                action,
                data,
                autocode,
                type,
                boolean,
                articleNo
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