import React, { useState, useEffect } from 'react';
import apiService from '../ApiService';

export const GeneralContext = React.createContext({
    cartCount: 0,
    setCartCount() { },
});

export function GeneralContextProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await apiService.get("cart");
                setCartCount(response.length);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setCartCount(0);
            }
        };
        fetchCartItems()
    }, [])


    return (
        <GeneralContext.Provider
            value={{
                cartCount,
                setCartCount
            }}
        >
            {children}
        </GeneralContext.Provider>
    );
}
