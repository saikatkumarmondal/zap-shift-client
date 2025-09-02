import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const queryClient = useQueryClient();

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/rider/completed-parcels?email=${email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const cost = Number(parcel.cost);
    return cost * 0.3;
  };

  // ✅ mutation for cashout
  const { mutateAsync: cashout } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/api/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completedDeliveries"] });
    },
  });

  const handleCashout = async (parcelId) => {
    const result = await Swal.fire({
      title: "Confirm Cashout",
      text: "You are about to cash out this delivery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await cashout(parcelId);
      const cashoutTime = res.parcel?.cashout_at
        ? new Date(res.parcel.cashout_at).toLocaleString()
        : "N/A";

      Swal.fire("Success", `Cashout completed at ${cashoutTime}`, "success");
      return res;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-lg">
          <table className="table table-zebra w-full min-w-[1200px] text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>From</th>
                <th>To</th>
                <th>Picked At</th>
                <th>Delivered At</th>
                <th>Fee (৳)</th>
                <th>Your Earning (৳)</th>
                <th className="text-center">Cashout</th>
                <th>Cashout Time</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.sender_center}</td>
                  <td>{parcel.receiver_center}</td>
                  <td>
                    {parcel.picked_at
                      ? new Date(parcel.picked_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {parcel.delivered_at
                      ? new Date(parcel.delivered_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>৳{parcel.cost}</td>
                  <td className="font-semibold text-green-600">
                    ৳{calculateEarning(parcel).toFixed(2)}
                  </td>
                  <td className="text-center">
                    {parcel.cashout_status === "cashed_out" ? (
                      <span className="badge badge-success text-xs px-2 py-1">
                        Cashed Out
                      </span>
                    ) : (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={async () => {
                          try {
                            const res = await handleCashout(parcel._id);
                            console.log("Cashout response:", res);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        Cashout
                      </button>
                    )}
                  </td>
                  <td>
                    {parcel.cashout_at
                      ? new Date(parcel.cashout_at).toLocaleString()
                      : "-"}
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

export default CompletedDeliveries;
