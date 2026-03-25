import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks access unless logged in
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-wrapper"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Blocks access unless user is ADMIN
export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading-wrapper"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/menu" replace />;
  return children;
};
