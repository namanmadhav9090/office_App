// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element }) => {
  const token = Cookies.get('access_token');
  
  // If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/"/>;
  }

  // If there is a token, render the component
//   return element;
return <>
   {element}
   {/* <Outlet /> */}
</>
};

export default ProtectedRoute;
