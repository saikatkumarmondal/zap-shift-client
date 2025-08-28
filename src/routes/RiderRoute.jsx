import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, authLoading } = useUserRole();
  const location = useLocation();
  const from = location.pathname || "/";
  if (loading || authLoading) {
    return '<span className="loading loading-spinner loading-xl"></span>';
  }
  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" state={{ from }}></Navigate>;
  }

  return children;
};

export default RiderRoute;
