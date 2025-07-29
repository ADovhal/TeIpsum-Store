import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ element: Element }) {
  const isAuth = useSelector(s => s.auth.isAuthenticated);
  return isAuth ? <Element /> : <Navigate to="/login" />;
}
