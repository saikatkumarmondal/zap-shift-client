import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        if (!user?.email) return;
        const res = await axiosSecure.get(
          `/parcels/rider?riderEmail=${user.email}`
        );
        setParcels(res.data.parcels || []);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [axiosSecure, user?.email]);

  const handleToggleDelivery = async (parcelId) => {
    try {
      // 1️⃣ Toggle delivery status
      const res = await axiosSecure.patch(
        `/parcels/${parcelId}/toggle-delivery`
      );
      const { newStatus } = res.data;

      // 2️⃣ Update UI
      setParcels((prev) =>
        prev.map((parcel) =>
          parcel._id === parcelId
            ? { ...parcel, delivery_status: newStatus }
            : parcel
        )
      );

      // 3️⃣ Add tracking if status is 'in-transit'
      if (newStatus === "in-transit") {
        const parcel = parcels.find((p) => p._id === parcelId);

        await axiosSecure.post("/trackings", {
          parcelId: parcel._id,
          tracking_id: parcel.tracking_id,
          status: newStatus,
          updatedBy: user.email || "system",
          timestamp: new Date().toISOString(),
          location: parcel.sender_center || "Unknown",
          riderId: parcel.assigned_rider || null,
        });

        Swal.fire(
          "Success!",
          `Parcel "${parcel.title}" is now In-Transit and tracking has been saved.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to toggle delivery status:", error);
      Swal.fire("Error!", "Failed to update delivery status.", "error");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading parcels...</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
        📦 Pending Deliveries
      </h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending deliveries assigned to you.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="table w-full text-sm md:text-base">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Sender</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Instruction</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr
                  key={parcel._id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="p-3 font-semibold text-center">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-semibold">{parcel.sender_name}</div>
                    <div className="text-gray-500">{parcel.sender_contact}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{parcel.receiver_name}</div>
                    <div className="text-gray-500">
                      {parcel.receiver_contact}
                    </div>
                  </td>
                  <td className="p-3">{parcel.delivery_instruction || "—"}</td>
                  <td className="p-3 font-bold text-green-600">
                    ৳{parcel.cost || 0}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs md:text-sm rounded-full ${
                        parcel.delivery_status === "picked-up"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {parcel.delivery_status || "in-transit"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleDelivery(parcel._id)}
                      className={`px-3 py-1 rounded-lg text-white transition ${
                        parcel.delivery_status === "delivered"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {parcel.delivery_status === "delivered"
                        ? "Cancel Delivery"
                        : "Picked Up"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;
