import React from 'react';
import { Navigate } from 'react-router-dom';

export default function BaseRedirectPage() {
    return <Navigate to='/home' />
}
