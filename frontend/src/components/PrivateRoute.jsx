import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

 
const PrivateRoute = ({ role, allowBoth = false, allowAnyLoggedIn = false }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  if (!userInfo) {
     return <Navigate to="/login" replace />;
  }

   if (allowAnyLoggedIn) {
     return <Outlet />;
  }

   if (allowBoth && (userInfo.role === 'User' || userInfo.role === 'Technician')) {
    return <Outlet />;
  }

   if (role && userInfo.role === role) {
    return <Outlet />;
  }

   if (userInfo.isAdmin) {
      return <Navigate to="/admin" replace />;
  } else if (userInfo.role === 'Technician') {
    return <Navigate to="/tech-dashboard" replace />;
  } else {  
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;