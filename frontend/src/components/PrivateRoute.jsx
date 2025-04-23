import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.jsx';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuth();

  return loggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
