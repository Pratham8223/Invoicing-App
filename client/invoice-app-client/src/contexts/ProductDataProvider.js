import React, { createContext, useState } from 'react';


export const productDataContext = createContext()

export default function ProductDataProvider({ children }) {
    const [productData, setProductData] = useState(null);
    return <productDataContext.Provider value={{ productData, setProductData }}>
        {children}
    </productDataContext.Provider>
}
