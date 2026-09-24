'use client'
import React from 'react';
import MainCartContent from "./B2bCart/CartServer";
import PrintPageCard from './PrintCartPage';

const MainCart = ({ storeinit, visiterId }) => {
    return (
        <div style={{ marginBottom: "3rem" }}>
            <MainCartContent storeinit={storeinit} visiterId={visiterId} />
            <PrintPageCard />
        </div>
    );
};

export default MainCart;
