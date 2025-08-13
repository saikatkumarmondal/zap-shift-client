import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";
const ProFastLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end-safe">
        <img src={logo} alt="ProFast Logo " className="mb-2" />
        <p className="font-bold text-3xl -ml-4">ProFast</p>
      </div>
    </Link>
  );
};

export default ProFastLogo;
