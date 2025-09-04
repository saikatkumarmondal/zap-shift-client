// src/components/ParcelLoading.jsx
import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const ParcelLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Animated Parcels */}
      <div className="flex space-x-4 mb-6">
        <FaBoxOpen className="text-yellow-500 text-5xl animate-bounce" />
        <FaBoxOpen className="text-green-500 text-5xl animate-bounce delay-150" />
        <FaBoxOpen className="text-blue-500 text-5xl animate-bounce delay-300" />
      </div>

      {/* Loading text */}
      <p className="text-gray-700 text-xl font-semibold mb-4">
        Your parcels are on the way...
      </p>

      {/* DaisyUI spinner */}
      <div className="radial-progress animate-spin text-blue-500 border-4 border-blue-200 w-14 h-14"></div>
    </div>
  );
};

export default ParcelLoading;
