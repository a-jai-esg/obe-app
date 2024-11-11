import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component, isProtected, ...rest }) => {
  const token = localStorage.getItem("token") || Cookies.get("token");

  if (isProtected && !token) {
    return <Navigate to="/login" />;
  }

  if (!isProtected && token) {
    return <Navigate to="/dashboard" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
