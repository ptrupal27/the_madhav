import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Admin Protection Wrapper
export const AdminRoute = () => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUser = JSON.parse(localStorage.getItem('admin_user'));
    
    if (!adminToken || adminUser?.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }
    
    return <Outlet />;
};

// User Protection Wrapper
export const UserRoute = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
};

// Public Route (Redirect if already logged in)
export const PublicRoute = () => {
    const adminToken = localStorage.getItem('admin_token');
    const token = localStorage.getItem('token');

    if (adminToken) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    if (token) {
        return <Navigate to="/user/dashboard" replace />;
    }

    return <Outlet />;
};
