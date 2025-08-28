import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AssignRider = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignedRiderId, setAssignedRiderId] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);

  // Fetch service centers from public folder
  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data))
      .catch((err) => console.error("ServiceCenter fetch error:", err));
  }, []);

  // Fetch unassigned parcels
  const { data: parcels = [], isLoading: parcelsLoading } = useQuery({
    queryKey: ["unassignedParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels?status=not_collected");
      return res.data;
    },
  });

  // Fetch riders
  const { data: allRiders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders");

      return res.data;
    },
  });

  // Mutation: assign rider
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId, riderEmail, riderName }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
        riderId,
        riderEmail,
        riderName,
      });
      console.log(res);
      return res.data;
    },

    onSuccess: (_, variables) => {
      const { riderId, riderName } = variables;
      setAssignedRiderId(riderId);
      queryClient.invalidateQueries(["unassignedParcels"]);
      Swal.fire(
        "Rider Assigned!",
        `Rider ${riderName} is now assigned to parcel "${selectedParcel.title}".`,
        "success"
      );
      setIsModalOpen(false);
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to assign rider.",
        "error"
      );
    },
  });

  const handleOpenModal = (parcel) => {
    setSelectedParcel(parcel);
    setAssignedRiderId(null);
    setIsModalOpen(true);
  };

  const handleAssign = (rider) => {
    if (!selectedParcel) return;
    assignRiderMutation.mutate({
      parcelId: selectedParcel._id,
      riderId: rider._id,
      riderEmail: rider.email,
      riderName: rider.name,
    });
  };

  // Filter riders based on service center for selected parcel
  const getAvailableRiders = () => {
    if (!selectedParcel || !serviceCenters.length) return [];
    const center = serviceCenters.find(
      (sc) =>
        sc.district === selectedParcel.sender_center ||
        sc.covered_area.includes(selectedParcel.sender_center)
    );
    if (!center) return [];
    return allRiders.filter(
      (rider) =>
        rider.status === "accepted" &&
        rider.district === center.district &&
        rider.region === center.region
    );
  };

  const availableRiders = getAvailableRiders();

  if (parcelsLoading) return <p>Loading parcels...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Unassigned Parcels</h2>
      <div className="space-y-3">
        {parcels.map((parcel) => (
          <div
            key={parcel._id}
            className="border p-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{parcel.title}</p>
              <p className="text-sm text-gray-600">
                Sender Center: {parcel.sender_center}
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(parcel)}
              className="btn btn-primary"
            >
              Assign Rider
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Assign Rider (District: {selectedParcel?.sender_center})
            </h3>

            {ridersLoading ? (
              <p>Loading riders...</p>
            ) : availableRiders.length === 0 ? (
              <p className="text-red-500">No riders available in this area.</p>
            ) : (
              <div className="space-y-3">
                {availableRiders.map((rider) => {
                  const isAssigned = assignedRiderId === rider._id;
                  const btnClass = isAssigned
                    ? "btn-disabled cursor-not-allowed"
                    : "btn-primary";

                  return (
                    <div
                      key={rider._id}
                      className="p-3 border rounded-lg shadow-sm bg-base-100 flex justify-between items-center"
                    >
                      <div>
                        <p>
                          <b>Name:</b> {rider.name}
                        </p>
                        <p>
                          <b>Region:</b> {rider.region}
                        </p>
                        <p>
                          <b>District:</b> {rider.district}
                        </p>
                        <p>
                          <b>Phone:</b> {rider.phone}
                        </p>
                        <p>
                          <b>Warehouse:</b> {rider.warehouse}
                        </p>
                      </div>

                      <button
                        className={`btn btn-sm mt-2 text-black ${btnClass}`}
                        onClick={() => handleAssign(rider)}
                        disabled={assignRiderMutation.isLoading || isAssigned}
                      >
                        {isAssigned
                          ? "Unavailable"
                          : assignRiderMutation.isLoading
                          ? "Assigning..."
                          : "Available"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedParcel(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssignRider;
