import React, { createContext, useEffect, useState } from 'react';
import AuthAction from '../actions/AuthAction';

export const loginContext = createContext(null);

export default function LoginContextProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const checkLogin = async () => {
        await new AuthAction().checkSession(
            (res) => {
                setIsLoggedIn(true)
            },
            (err) => {
                setIsLoggedIn(false)
            }
        )
    }

    useEffect(() => {
        if (isLoggedIn === null) {
            checkLogin()
        }
    }, []);


    return <loginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {isLoggedIn === null ? <>
        </> : children}
    </loginContext.Provider>
}
