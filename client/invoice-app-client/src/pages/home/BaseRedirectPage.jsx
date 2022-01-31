import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { loginContext } from '../../contexts/LoginContextProvider';

export default function BaseRedirectPage() {

    const { isLoggedIn } = useContext(loginContext)


    return isLoggedIn ? <Navigate to='/home' /> : <Navigate to='/login' />
}
