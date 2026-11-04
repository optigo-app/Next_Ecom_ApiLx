'use client'
import React from 'react';
import PrintPageCard from './PrintCartPage';
import ElveeCartPage from './Cart/Cart';

const MainCart = ({ storeinit, visiterId }) => {
    return (
        <div style={{
            marginBottom: "3rem"
        }}>
            <ElveeCartPage storeinit={storeinit} visiterId={visiterId} />
            <PrintPageCard />
        </div>
    );
};

export default MainCart;
