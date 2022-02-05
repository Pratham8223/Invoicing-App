import { Center, Spinner } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useState } from 'react';

import BaseAction from '../actions/BaseAction';
import { poDataContext } from './PODataProvider';

export const loginContext = createContext(null);

export default function LoginContextProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const { poData, setPoData } = useContext(poDataContext);

    const checkLogin = async () => {
        console.log("triggered");
        await new BaseAction().getUserData((data) => {
            setIsLoggedIn(true)
            setPoData({ ...poData, yearly_data: data.yearly_data })
            setPoData({ ...poData, purchase_orders: data.purchase_orders })
        }, (err) => {
            setIsLoggedIn(false)
        })
    }

    useEffect(() => {
        if (isLoggedIn === null) {
            checkLogin()
        }
    }, []);


    return <loginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {isLoggedIn === null ? <>
            <Center m='48' display='flex' flexDir='column'>
                <Spinner size='lg' />
            </Center>
        </> : children}
    </loginContext.Provider>
}
