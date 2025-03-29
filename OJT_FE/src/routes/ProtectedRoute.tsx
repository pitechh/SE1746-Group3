// File: ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";
import { Account } from "../types/DataTypes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user: Account | null = AuthService.getUserInfo();
  const isTokenExpired = AuthService.isTokenExpired();

  // console.log("User info:", user);
  // console.log("Token expired:", isTokenExpired);

  if (!user || isTokenExpired) {
    // Lưu lại đường dẫn hiện tại vào localStorage để redirect lại sau khi đăng nhập
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403-forbidden" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
