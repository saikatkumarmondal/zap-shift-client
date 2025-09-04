import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { HiTruck, HiCheckCircle, HiInbox } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Color palette for chart and cards
const COLORS = ["#4ade80", "#3b82f6", "#facc15", "#f87171", "#a78bfa"];

// Map status to icon
const statusIcons = {
  delivered: <HiCheckCircle className="text-4xl text-green-500" />,
  "in-transit": <HiTruck className="text-4xl text-blue-500" />,
  not_collected: <HiInbox className="text-4xl text-yellow-500" />,
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch delivery status counts
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcel-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      const responseData = res.data;

      // Normalize response to array
      if (Array.isArray(responseData)) return responseData;
      else if (typeof responseData === "object" && responseData !== null) {
        return Object.entries(responseData).map(([status, count]) => ({
          status,
          count,
        }));
      } else return [];
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading dashboard...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load data</p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Parcel Status Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Parcel Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.status.replace("_", " ")}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, "Count"]} />
              <Legend formatter={(value) => value.replace("_", " ")} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item, index) => {
            const icon = statusIcons[item.status] || null;
            const color = COLORS[index % COLORS.length];

            return (
              <div
                key={item.status}
                className={`flex items-center gap-4 p-6 rounded-xl shadow-lg transition transform hover:scale-105 bg-opacity-20`}
                style={{ backgroundColor: color + "33" }} // 33 for transparency
              >
                <div>{icon}</div>
                <div>
                  <p className="text-gray-700 font-semibold capitalize">
                    {item.status.replace("_", " ")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
