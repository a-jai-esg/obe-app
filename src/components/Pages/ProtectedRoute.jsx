// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, isProtected, ...rest }) => {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  if (isProtected && !token) {
    // If the route is protected and there's no token, redirect to login
    return <Navigate to="/login" />;
  } else if (!isProtected && token) {
    // If the route is not protected and there's a token, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, return the requested component
  return <Component {...rest} />;
};

export default ProtectedRoute;
