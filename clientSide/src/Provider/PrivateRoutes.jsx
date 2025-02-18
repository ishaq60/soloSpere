import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';


const PrivateRoutes = ({children}) => {
const location=useLocation()
    const {user,loading}=useContext(AuthContext)
    if(loading) return <p> Loading......</p>
    if(user) return children
    return  <Navigate to='/login' state={location.pathname} replace={true} ></Navigate>
};

export default PrivateRoutes;