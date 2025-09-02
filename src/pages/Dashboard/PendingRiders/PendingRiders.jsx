import React, { useState } from "react";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { HiEye, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const axiosSecure = useAxiosSecure();

  const {
    isPending,
    data: riders = [],
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  const handleView = (rider) => {
    setSelectedRider(rider);
    setModalOpen(true);
  };

  const handleApprove = async (id, email) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "accepted", email });
      Swal.fire("✅ Success", "Rider approved & assigned!", "success");
      refetch();
    } catch (err) {
      Swal.fire("❌ Error", "Failed to approve rider", "error");
      console.log(err);
    }
  };

  const handleCancel = async (id, email) => {
    try {
      await axiosSecure.patch(`/riders/${id}`, { status: "rejected", email });
      Swal.fire("✅ Success", "Rider rejected!", "success");
      refetch();
    } catch (err) {
      Swal.fire("❌ Error", "Failed to reject rider", "error");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 font-inter">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-blue-600 pb-2 inline-block">
          Pending Riders
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Region
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  District
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-6 text-center text-gray-500 text-lg"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      No pending riders found.
                    </div>
                  </td>
                </tr>
              ) : (
                riders.map((rider, index) => (
                  <tr
                    key={rider._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition duration-150 ease-in-out`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 sm:text-base">
                      {rider.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 sm:text-base">
                      {rider.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 sm:text-base">
                      {rider.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 sm:text-base hidden md:table-cell">
                      {rider.region}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 sm:text-base hidden lg:table-cell">
                      {rider.district}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2 sm:gap-3">
                        <button
                          onClick={() => handleView(rider)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white shadow-md
                                     hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                          title="View Rider"
                        >
                          <HiEye className="text-base sm:text-xl" />
                        </button>
                        <button
                          onClick={() => handleApprove(rider._id, rider.email)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white shadow-md
                                     hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          title="Approve Rider"
                        >
                          <HiCheckCircle className="text-base sm:text-xl" />
                        </button>
                        <button
                          onClick={() => handleCancel(rider._id, rider.email)}
                          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white shadow-md
                                     hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          title="Cancel Rider"
                        >
                          <HiXCircle className="text-base sm:text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && selectedRider && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
              Rider Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700 text-sm sm:text-base">
              <p>
                <strong className="font-semibold text-gray-900">Name:</strong>{" "}
                {selectedRider.name}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">Email:</strong>{" "}
                {selectedRider.email}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">Phone:</strong>{" "}
                {selectedRider.phone}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">Age:</strong>{" "}
                {selectedRider.age}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">Region:</strong>{" "}
                {selectedRider.region}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">
                  District:
                </strong>{" "}
                {selectedRider.district}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">NID:</strong>{" "}
                {selectedRider.nid}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">
                  Bike Brand:
                </strong>{" "}
                {selectedRider.bikeBrand}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">
                  Bike Model:
                </strong>{" "}
                {selectedRider.bikeModel}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">
                  Warehouse:
                </strong>{" "}
                {selectedRider.warehouse}
              </p>
              <p>
                <strong className="font-semibold text-gray-900">Status:</strong>{" "}
                <span className="font-semibold text-blue-600">
                  {selectedRider.status}
                </span>
              </p>
            </div>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold transition duration-200
                           focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
              onClick={() => setModalOpen(false)}
              title="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
