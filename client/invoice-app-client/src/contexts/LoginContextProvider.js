import React, { createContext, useState } from 'react';

export const loginContext = createContext(null);

export default function LoginContextProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    return <loginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {children}
    </loginContext.Provider>
}
