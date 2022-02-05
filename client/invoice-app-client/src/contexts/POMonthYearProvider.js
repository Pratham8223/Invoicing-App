import React, { createContext, useState } from 'react';

export const poMonthYearContext = createContext(null)

export default function POMonthYearProvider({ children }) {

    const dt = new Date(Date.now())
    const formatted = (dt.getFullYear() + '-' + ((dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)))
    const [poMonthYear, setPoMonthYear] = useState(formatted);

    return <poMonthYearContext.Provider value={{ poMonthYear, setPoMonthYear }}>
        {children}
    </poMonthYearContext.Provider>
}
