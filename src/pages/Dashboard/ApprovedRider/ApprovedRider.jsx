import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApprovedRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["approvedRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/approved");
      return res.data;
    },
  });

  const handleDeactivate = async (id, email) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "rejected", email });
      Swal.fire("Success", "Rider rejected!", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to reject rider", "error");
      console.error(error);
    }
  };

  const filteredRiders = riders.filter((rider) =>
    rider.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <p>Loading approved riders...</p>;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b-2 sm:border-b-4 border-blue-600">
        Approved Riders
      </h2>

      <div className="flex items-center mb-4 max-w-sm sm:max-w-md bg-white px-3 py-2 rounded shadow-sm">
        <FaSearch className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sm:hidden">
        {" "}
        {/* Only for small screens */}
        {filteredRiders.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            No approved riders found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRiders.map((rider) => (
              <div
                key={rider._id}
                className="bg-white p-4 shadow-md rounded-lg border"
              >
                <h3 className="text-lg font-semibold">{rider.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Email: {rider.email}
                </p>
                <p className="text-sm text-gray-600">Phone: {rider.phone}</p>
                <p className="text-sm text-gray-600">
                  Vehicle: {rider.vehicle || "N/A"}
                </p>
                <button
                  onClick={() => handleDeactivate(rider._id, rider.email)}
                  className="mt-4 bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 text-sm"
                >
                  <FaUserSlash /> Deactivate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:block">
        {" "}
        {/* Hidden on small screens, shown on sm and up */}
        <div className="bg-white shadow-lg rounded-lg border overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Vehicle</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No approved riders found.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider._id} className="text-center hover:bg-blue-50">
                    <td className="px-4 py-2 border">{rider.name}</td>
                    <td className="px-4 py-2 border">{rider.email}</td>
                    <td className="px-4 py-2 border">{rider.phone}</td>
                    <td className="px-4 py-2 border">
                      {rider.vehicle || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleDeactivate(rider._id, rider.email)}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"
                      >
                        <FaUserSlash /> Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovedRiders;
