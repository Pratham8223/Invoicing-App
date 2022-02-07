/* eslint-disable react-hooks/exhaustive-deps */
import { Center, Spinner } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import BaseAction from '../../actions/BaseAction';
import { loginContext } from '../../contexts/LoginContextProvider';
import { poDataContext } from '../../contexts/PODataProvider';
import { productDataContext } from '../../contexts/ProductDataProvider';
import { profileContext } from '../../contexts/ProfileContextProvider';

export default function ProtectedRoute() {

    const [isLoading, setIsLoading] = useState(true)
    const { isLoggedIn, setIsLoggedIn } = useContext(loginContext)

    // User Data Contexts
    const { setPoData } = useContext(poDataContext)
    const { setProductData } = useContext(productDataContext)
    const { setProfile } = useContext(profileContext)

    const setUserDataToContext = (data) => {
        console.log(data);

        const tmpPoData = {
            purchase_orders: data.purchase_orders,
            yearly_data: data.yearly_data
        }

        setPoData(tmpPoData)

        setProductData(data.products)
        setProfile(data.user)
    }

    const getUserData = async () => {
        await new BaseAction().getUserData((data) => {
            setUserDataToContext(data)
            setIsLoggedIn(true)
        }, (err) => {
            setIsLoggedIn(false)
        })
        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading === true) {
            getUserData()
        }
    }, []);


    if (isLoading) {
        return <Center p='12rem'>
            <Spinner size='lg' />
        </Center>
    } else {
        return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
    }
}
