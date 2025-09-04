import React, { use } from "react";
import useUserRole from "../../../hooks/useUserRole";
import ParcelLoading from "../../../component/ParcelLoading";
import UserDashboard from "./Userdashboard";
import RiderDashboard from "./RiderDashboard";
import AdminDashboard from "./AdminDashboard";
import Forbidden from "../../Forbidden/Forbidden";

const DashboardHome = () => {
  const { role, loading } = useUserRole();
  if (loading) {
    return <ParcelLoading></ParcelLoading>;
  }
  if (role === "user") {
    return <UserDashboard></UserDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;
