import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApprovedRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  // 🔹 Fetch Approved Riders
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["approvedRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/approved"); // fixed path
      return res.data;
    },
  });

  // 🔹 Deactivate Rider
  const handleDeactivate = async (id) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "rejected" });
      Swal.fire("Success", "Rider rejected!", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to reject rider", "error");
      console.error(error);
    }
  };

  // 🔹 Filter Riders by Search
  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading approved riders...
      </p>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-inter">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b-4 border-blue-600 pb-2 text-gray-800">
        Approved Riders
      </h2>

      {/* Search Box */}
      <div className="flex items-center border rounded-lg px-3 py-2 mb-4 max-w-md bg-white shadow-sm">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Riders Table */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Vehicle</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider) => (
                <tr
                  key={rider._id}
                  className="text-center hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-4 py-2 border">{rider.name}</td>
                  <td className="px-4 py-2 border">{rider.email}</td>
                  <td className="px-4 py-2 border">{rider.phone}</td>
                  <td className="px-4 py-2 border">{rider.vehicle || "N/A"}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition shadow-md"
                    >
                      <FaUserSlash /> Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No approved riders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedRiders;
