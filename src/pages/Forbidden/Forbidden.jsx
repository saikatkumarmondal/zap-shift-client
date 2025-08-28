import React from "react";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Background container with a subtle pulse animation */}
      <div className="relative p-8 md:p-12 rounded-xl text-center max-w-lg w-full bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="absolute inset-0 z-0 bg-red-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>

        {/* Content container to layer above the glowing background */}
        <div className="relative z-10 space-y-4">
          <h1 className="text-7xl md:text-8xl font-extrabold text-red-500 mb-2">
            🚫 403
          </h1>

          <h2 className="text-4xl font-bold text-gray-200">Access Denied</h2>

          <p className="text-gray-400 mb-6 text-lg">
            You don't have the necessary permissions to view this page.
          </p>

          <Link
            to="/"
            className="inline-block px-8 py-3 text-lg font-semibold bg-red-600 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-110 shadow-lg"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
