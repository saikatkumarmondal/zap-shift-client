import React from "react";
import { NavLink } from "react-router";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const handleLogout = () => {
    logOut()
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const navItems = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/sendParcel">Send A Parcel</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          <ProFastLogo></ProFastLogo>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {/* Show Register and Login when no user is logged in */}
        {!user && (
          <>
            <a className="btn mr-2">
              <NavLink to="/register">Register</NavLink>
            </a>
            <a className="btn">
              <NavLink to="/login">Login</NavLink>
            </a>
          </>
        )}

        {/* Show Logout button only when a user is logged in */}
        {user && (
          <a className="btn" onClick={handleLogout}>
            Logout
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
