import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const TrackById = () => {
  const { trackingId } = useParams(); // get trackingId from route
  const axiosSecure = useAxiosSecure();
  const [timeline, setTimeline] = useState([]);
  const [parcelId, setParcelId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        if (!trackingId) return;
        const res = await axiosSecure.get(`/trackings/${trackingId}`);
        setParcelId(res.data.parcelId);
        setTimeline(res.data.timeline || []);
      } catch (error) {
        console.error("Error fetching tracking:", error);
        Swal.fire("Error!", "Failed to load tracking data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingId, axiosSecure]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading tracking information...
      </p>
    );

  if (!timeline.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        No tracking updates available for this parcel.
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto my-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        📍 Parcel Tracking History
      </h2>
      <p className="text-center mb-6 text-gray-700">
        Parcel ID: <b>{parcelId}</b>
      </p>

      <ul className="space-y-4">
        {timeline
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((event, index) => (
            <li
              key={index}
              className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-lg"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-indigo-700">
                  {event.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">
                Updated by: <b>{event.updatedBy}</b>
              </p>
              {event.location && (
                <p className="text-gray-600">
                  Location: <b>{event.location}</b>
                </p>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TrackById;
