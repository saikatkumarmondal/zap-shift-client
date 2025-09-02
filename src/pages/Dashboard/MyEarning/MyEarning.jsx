import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineCash } from "react-icons/hi";
import { format, isToday, isThisWeek, isThisMonth, isThisYear } from "date-fns";

const MyEarning = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const [filter, setFilter] = useState("overall");

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/rider/completed-parcels?email=${email}`
      );
      return res.data.map((p) => ({
        ...p,
        delivered_at: p.delivered_at ? new Date(p.delivered_at) : null,
        picked_at: p.picked_at ? new Date(p.picked_at) : null,
        cashout_at: p.cashout_at ? new Date(p.cashout_at) : null,
      }));
    },
  });

  // Calculate earning per parcel
  const calculateEarning = (parcel) => {
    const cost = Number(parcel.cost);
    return parcel.sender_center === parcel.receiver_center
      ? cost * 0.8
      : cost * 0.3;
  };

  // Aggregate earnings
  const totalEarning = parcels.reduce((sum, p) => sum + calculateEarning(p), 0);
  const totalCashed = parcels
    .filter((p) => p.cashout_status === "cashed_out")
    .reduce((sum, p) => sum + calculateEarning(p), 0);
  const totalPending = totalEarning - totalCashed;

  // Filtered earnings
  const filteredEarnings = parcels
    .filter((p) => {
      if (!p.delivered_at) return false;
      const delivered = new Date(p.delivered_at);
      switch (filter) {
        case "today":
          return isToday(delivered);
        case "week":
          return isThisWeek(delivered);
        case "month":
          return isThisMonth(delivered);
        case "year":
          return isThisYear(delivered);
        default:
          return true;
      }
    })
    .reduce((sum, p) => sum + calculateEarning(p), 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <HiOutlineCash className="text-3xl text-green-600" />
        My Earnings
      </h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded shadow">
              <p className="text-gray-600">Total Earning</p>
              <p className="text-2xl font-bold text-green-700">
                ৳{totalEarning.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow">
              <p className="text-gray-600">Total Cashed Out</p>
              <p className="text-2xl font-bold text-blue-700">
                ৳{totalCashed.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow">
              <p className="text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-yellow-700">
                ৳{totalPending.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-4 flex gap-2 flex-wrap">
            {["today", "week", "month", "year", "overall"].map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded ${
                  filter === f
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="text-gray-600">Earnings ({filter}):</p>
            <p className="text-2xl font-bold text-green-700">
              ৳{filteredEarnings.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MyEarning;
