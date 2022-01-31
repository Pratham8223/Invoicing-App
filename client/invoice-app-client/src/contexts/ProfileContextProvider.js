import React, { createContext, useState } from "react";

export const profileContext = createContext(null)

export default function ProfileContextProvider({ children }) {
    const [profile, setProfile] = useState(null)

    return <profileContext.Provider value={{ profile, setProfile }}>
        {children}
    </profileContext.Provider>
}
