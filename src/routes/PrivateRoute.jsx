import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // The console.log statement should be placed here, before the return statements.
  console.log("Current location:", location);

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user) {
    // This return statement stops the component from executing the rest of the code.
    return (
      <Navigate to="/login" state={{ from: location.pathname }}></Navigate>
    );
  }

  return children;
};

export default PrivateRoute;
