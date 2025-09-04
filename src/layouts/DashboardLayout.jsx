import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../pages/shared/ProFastLogo/ProFastLogo";
import useUserRole from "../hooks/useUserRole";
import { MdSpatialTracking, MdTwoWheeler } from "react-icons/md";

import {
  HiHome,
  HiCube,
  HiCreditCard,
  HiOutlineClipboardList,
  HiUserCircle,
  HiUser,
  HiClock,
  HiShieldCheck,
  HiTruck,
  HiOutlineClipboardCheck,
  HiOutlineCash,
} from "react-icons/hi";
import { FaMotorcycle } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        if (!user?.email) return;

        const res = await useAxiosSecure.get(`/parcels/user/${user.email}`);
        setParcels(res.data); // store array of parcels
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };

    fetchParcels();
  }, [user?.email, useAxiosSecure]);
  // console.log(role);
  console.log("role1", role);
  const linkStyle = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md"
      : "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all";

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar (mobile only) */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden font-bold text-lg">
            Dashboard
          </div>
        </div>
        {/* page content */}
        <Outlet></Outlet>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2">
          {/* Logo */}
          <ProFastLogo />

          {/* Nav Links */}
          <li>
            <NavLink to="/" className={linkStyle}>
              <HiHome className="text-xl" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/myParcels" className={linkStyle}>
              <HiCube className="text-xl" />
              My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/paymentHistory" className={linkStyle}>
              <HiCreditCard className="text-xl" />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/track" className={linkStyle}>
              <HiTruck className="text-xl" />
              Track a Package
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" className={linkStyle}>
              <HiUserCircle className="text-xl" />
              Update Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/trackById/${parcels.tracking_id}`}
              className={linkStyle}
            >
              <MdSpatialTracking className="text-xl" />
              Track By Id
            </NavLink>
          </li>

          {/* rider links */}
          {!roleLoading && role === "rider" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pending-deliveries"
                  className={linkStyle}
                >
                  <HiOutlineClipboardList className="text-xl" />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/completed-deliveries"
                  className={linkStyle}
                >
                  <HiOutlineClipboardCheck className="text-xl" />
                  Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-earnings" className={linkStyle}>
                  <HiOutlineCash className="text-xl" />
                  My Earnings
                </NavLink>
              </li>
            </>
          )}

          {/* admin links */}
          {!roleLoading && role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/makeAdmin" className={linkStyle}>
                  <HiShieldCheck className="text-xl" />
                  Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/approved-riders" className={linkStyle}>
                  <HiUser className="text-xl" />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/pending-riders" className={linkStyle}>
                  <HiClock className="text-xl" />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/assign-rider" className={linkStyle}>
                  <MdTwoWheeler className="text-xl" />
                  Assign Rider
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
