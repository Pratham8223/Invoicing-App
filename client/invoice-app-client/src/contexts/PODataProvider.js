import React, { createContext, useState } from 'react';

export const poDataContext = createContext(null);

export default function PODataProvider({ children }) {
    const [poData, setPoData] = useState({
        yearly_data: null,
        purchase_orders: null,
    });
    return <poDataContext.Provider value={{ poData, setPoData }}>
        {children}
    </poDataContext.Provider>
}