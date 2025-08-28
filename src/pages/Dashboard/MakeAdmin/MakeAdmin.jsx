import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiSearch, HiUser, HiShieldCheck } from "react-icons/hi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const [query, setQuery] = useState("");
  const [loadingUserId, setLoadingUserId] = useState(null); // track which button is loading
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch users with partial email match
  const { data: users = [], isFetching } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await axiosSecure.get("/users/search", {
        params: { email: query },
      });
      return res.data;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to toggle admin/user role
  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      return axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
    },
    onMutate: async ({ userId, newRole }) => {
      // Cool confirmation popup
      const result = await Swal.fire({
        title: "⚡ Are you sure?",
        html: `Do you want to <b style="color: ${
          newRole === "admin" ? "#2563EB" : "#DC2626"
        }">${newRole === "admin" ? "PROMOTE" : "DEMOTE"}</b> this user?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
        width: 360,
        padding: "1.5rem",
        background: "#1F2937", // dark background
        color: "#F9FAFB", // text color
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        customClass: {
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
          cancelButton:
            "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg",
          title: "text-xl font-bold",
          htmlContainer: "text-center",
        },
      });

      if (!result.isConfirmed) {
        throw new Error("Cancelled by user");
      }
    },
    onSuccess: async (_, { userId, newRole }) => {
      Swal.fire({
        title: "✅ Success!",
        html: `User role updated to <b>${newRole}</b>`,
        icon: "success",
        width: 320,
        padding: "1.2rem",
        background: "#1E293B",
        color: "#F8FAFC",
        customClass: {
          confirmButton:
            "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg",
          title: "text-lg font-semibold",
          htmlContainer: "text-center",
        },
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      queryClient.setQueryData(["searchUsers", query], (old = []) =>
        old.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      setLoadingUserId(null);
    },
    onError: (err) => {
      if (err.message === "Cancelled by user") {
        setLoadingUserId(null);
        return;
      }

      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.error || "Failed",
        icon: "error",
        width: 320,
        padding: "1.2rem",
        background: "#1F2937",
        color: "#F8FAFC",
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg",
          title: "text-lg font-semibold",
          htmlContainer: "text-center",
        },
      });

      setLoadingUserId(null);
    },
  });

  // Handle role toggle
  const handleToggleRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setLoadingUserId(user._id); // set loading for this button
    toggleRoleMutation.mutate({ userId: user._id, newRole });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-700">
        <HiShieldCheck className="text-4xl" /> Make Admin
      </h2>

      {/* Search Input */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search user by email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-4 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        />
        <HiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
      </div>

      {isFetching && <p className="text-gray-500 mb-4">Searching users...</p>}

      {/* Users List */}
      <ul className="space-y-5">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            {/* Left side: user info */}
            <div className="flex items-center gap-4">
              <HiUser className="text-3xl text-gray-600" />
              <div className="flex flex-col">
                <p className="font-semibold text-lg text-gray-800 hover:text-blue-600 transform hover:scale-105 transition duration-300">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                  <span>
                    Role:{" "}
                    <span
                      className={
                        user.role === "admin" ? "text-blue-600 font-medium" : ""
                      }
                    >
                      {user.role}
                    </span>
                  </span>
                  <span>
                    Created At: {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Toggle Role button */}
            <div className="ml-13">
              <button
                onClick={() => handleToggleRole(user)}
                disabled={loadingUserId === user._id}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-medium shadow-md transition ${
                  user.role === "admin"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } ${
                  loadingUserId === user._id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <HiShieldCheck className="text-2xl" />
                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {query && users.length === 0 && !isFetching && (
        <p className="text-gray-500 mt-6 text-center text-lg">No users found</p>
      )}
    </div>
  );
};

export default MakeAdmin;
