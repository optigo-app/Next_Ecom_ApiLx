"use client"

import React, { useEffect, useState } from 'react';
import B2bCart from "./B2bCart/Cart";
import B2cCart from "./CartPageB2c/Cart";
import CartPage3 from "./CartPage3/Cart";
import PrintPageCard from './PrintCartPage';

const MainCart = ({ params, searchParams, storeinit, visiterId }) => {
    console.log("TCL: MainCart -> storeinit", storeinit)
    const [cartComponent, setCartComponent] = useState(null);

    useEffect(() => {
        const cartNo = storeinit?.CartNo ?? 1;
        // const cartNo = 2;

        switch (cartNo) {
            case 1:
                setCartComponent(<B2bCart storeinit={storeinit} visiterId={visiterId} />);
                break;
            case 2:
                setCartComponent(<B2cCart storeinit={storeinit} visiterId={visiterId} />);
                break;
            case 3:
                setCartComponent(<CartPage3 storeinit={storeinit} visiterId={visiterId} />);
                break;
            default:
                setCartComponent(<B2bCart storeinit={storeinit} visiterId={visiterId} />);
                break;
        }
    }, []);

    return (
        <div style={{
            marginBottom: "3rem"
        }}>
            {cartComponent}
            <PrintPageCard storeinit={storeinit} />
        </div>
    );
};

export default MainCart;
