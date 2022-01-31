import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { loginContext } from '../../contexts/LoginContextProvider';

export default function ProtectedRoute() {
    const { isLoggedIn } = useContext(loginContext)
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
}
