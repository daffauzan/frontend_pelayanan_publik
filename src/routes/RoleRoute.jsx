import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/modelMapper';

const RoleRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (getUserRole(user) !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;