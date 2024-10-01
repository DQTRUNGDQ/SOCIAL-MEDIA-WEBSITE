import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, isAuthenticated, ...rest }) => {
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;