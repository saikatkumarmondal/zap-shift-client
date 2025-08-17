import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

// Heroicons for actions
import {
  EyeIcon,
  CreditCardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

const MyParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // Handlers
  const handleView = (parcel) => {
    Swal.fire({
      title: `<span class="font-bold text-lg text-gray-800">Parcel Details</span>`,
      html: `
      <div class="text-left leading-relaxed">
        <p class="mb-1"><span class="font-semibold text-gray-700">Title:</span> ${parcel.title}</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Type:</span> ${parcel.type}</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Sender:</span> ${parcel.sender_name} (${parcel.sender_contact})</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Receiver:</span> ${parcel.receiver_name} (${parcel.receiver_contact})</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Pickup Instruction:</span> ${parcel.pickup_instruction}</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Delivery Instruction:</span> ${parcel.delivery_instruction}</p>
        <p class="mb-1"><span class="font-semibold text-gray-700">Tracking ID:</span> ${parcel.tracking_id}</p>
      </div>
    `,
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Ok",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mt-4",
        popup: "p-6 rounded-xl shadow-lg border border-gray-200",
      },
    });
  };

  const handlePay = (id) => {
    Swal.fire({
      title: "Confirm Payment",
      text: `Mark parcel ${id} as paid?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center gap-4 mt-4",
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/payment/${id}`);

        Swal.fire({
          title: "Payment Successful!",
          text: "The parcel has been marked as paid.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
          },
        });
        refetch();
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. The parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center gap-3 mt-4",
        confirmButton:
          "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton:
          "bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);

          if (res.data.deletedCount > 0) {
            refetch(); // Refresh the parcels list
            Swal.fire({
              title: "Deleted!",
              text: "The parcel has been deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
              buttonsStyling: false,
              customClass: {
                confirmButton:
                  "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
              },
            });
          } else {
            Swal.fire("Error", "Parcel not found or already deleted.", "error");
          }
        } catch (error) {
          console.error("Error deleting parcel:", error);
          Swal.fire(
            "Error",
            "Failed to delete parcel. Try again later.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          My Parcels
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          Showing{" "}
          <span className="font-bold text-indigo-600">{parcels.length}</span>{" "}
          parcels associated with your account.
        </p>

        {parcels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
            <p className="text-xl text-gray-500 font-medium">
              No Parcels Found 📦
            </p>
            <p className="text-gray-400 mt-2">
              You haven't created any parcels yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr className="uppercase text-sm font-medium">
                    <th className="py-4 px-4">Title</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Created At</th>
                    <th className="py-4 px-4">Payment Status</th>
                    <th className="py-4 px-4">Cost</th>
                    <th className="hidden md:table-cell py-4 px-4">
                      Sender Contact
                    </th>
                    <th className="hidden md:table-cell py-4 px-4">
                      Receiver Contact
                    </th>
                    <th className="py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((parcel, idx) => (
                    <tr
                      key={parcel._id}
                      className={`transition duration-150 ease-in-out hover:bg-gray-50 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {parcel.title}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-700">
                        {parcel.type === "document"
                          ? "Document"
                          : "Non-Document"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(parcel.creation_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                            parcel.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {parcel.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800">
                        ${parcel.cost}
                      </td>
                      <td className="hidden md:table-cell py-4 px-4 text-sm text-gray-500">
                        {parcel.sender_contact}
                      </td>
                      <td className="hidden md:table-cell py-4 px-4 text-sm text-gray-500">
                        {parcel.receiver_contact}
                      </td>
                      <td className="py-4 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleView(parcel)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white shadow-md transform hover:scale-110 transition-all duration-200"
                          title="View Parcel"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePay(parcel._id)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-600 hover:bg-green-500 hover:text-white shadow-md transform hover:scale-110 transition-all duration-200"
                          title="Mark as Paid"
                        >
                          <CreditCardIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(parcel._id)}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white shadow-md transform hover:scale-110 transition-all duration-200"
                          title="Delete Parcel"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcel;
