import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

import useAxiosSecure from "../../hooks/useAxiosSecure";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const serviceCenters = useLoaderData();
  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];
  // Get districts by region
  const getDistrictsByRegion = (region) =>
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const parcelType = watch("type");
  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  // on submit
  const onSubmit = async (data) => {
    const weight = parseFloat(data.weight) || 0;
    const isSameDistrict = data.sender_center === data.receiver_center;

    let baseCost = 0;
    let extraCost = 0;
    let breakdownDetails = "";

    // Pricing logic
    if (data.type === "document") {
      baseCost = isSameDistrict ? 60 : 80;
      breakdownDetails = `<p>Base Price: <strong>৳${baseCost}</strong> (${
        isSameDistrict ? "within district" : "outside district"
      })</p>`;
    } else {
      if (weight <= 3) {
        baseCost = isSameDistrict ? 110 : 150;
        breakdownDetails = `<p>Base Price (up to 3kg): <strong>৳${baseCost}</strong> (${
          isSameDistrict ? "within district" : "outside district"
        })</p>`;
      } else {
        const extraKg = weight - 3;
        const perKgCharge = extraKg * 40;
        const districtExtra = isSameDistrict ? 0 : 40;
        baseCost = isSameDistrict ? 110 : 150;
        extraCost = perKgCharge + districtExtra;

        breakdownDetails = `
        <p>Base Price (first 3kg): <strong>৳${baseCost}</strong></p>
        <p>Extra Weight: <strong>৳40 x ${extraKg.toFixed(
          1
        )}kg = ৳${perKgCharge}</strong></p>
        ${
          districtExtra
            ? `<p>Outside District Extra: <strong>৳${districtExtra}</strong></p>`
            : ""
        }
      `;
      }
    }

    const totalCost = baseCost + extraCost;

    // Show pricing alert
    const result = await Swal.fire({
      title: "Delivery Cost",
      icon: "info",
      html: `
      <div class="text-left text-base space-y-2 max-w-[420px] mx-auto">
        <p><strong>Parcel Type:</strong> ${data.type}</p>
        <p><strong>Weight:</strong> ${weight} kg</p>
        <p><strong>Delivery Zone:</strong> ${
          isSameDistrict ? "Within Same District" : "Outside District"
        }</p>
        <hr class="my-3"/>
        <details class="bg-yellow-50 border border-yellow-300 rounded-lg p-2">
          <summary class="cursor-pointer font-bold text-yellow-700">See Pricing Breakdown</summary>
          <div class="mt-2 text-sm space-y-1">
            ${breakdownDetails}
          </div>
        </details>
        <hr class="my-3"/>
        <p class="text-lg font-bold text-green-600 text-center">Total Cost: ৳${totalCost}</p>
      </div>
    `,
      width: 450,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "#d3d3d3",
      customClass: { popup: "rounded-xl shadow-lg px-6 py-6" },
    });

    if (!result.isConfirmed) return;

    try {
      // 1️⃣ Generate single tracking ID
      const trackingId = generateTrackingID();

      // 2️⃣ Prepare parcel data
      const parcelData = {
        ...data,
        cost: totalCost,
        created_by: user.email,
        payment_status: "unpaid",
        delivery_status: "not_collected",
        creation_date: new Date().toISOString(),
        tracking_id: trackingId, // same ID
      };

      // 3️⃣ Save parcel
      const parcelRes = await axiosSecure.post("/parcels", parcelData);
      const parcelId = parcelRes.data.insertedId; // updated backend returns insertedId
      if (!parcelId) throw new Error("Parcel ID not returned from backend");

      // 4️⃣ Save initial tracking info
      await axiosSecure.post("/trackings", {
        parcelId: parcelId.toString(), // must be string for backend ObjectId
        tracking_id: trackingId, // same tracking ID
        status: "submitted",
        location: data.sender_center, // pickup location
        updatedBy: user.email || "system",
      });

      // 5️⃣ Success alert
      await Swal.fire({
        title: "Parcel Added Successfully!",
        icon: "success",
        html: `
        <p>Your parcel has been created.</p>
        <p><strong>Tracking ID:</strong> ${trackingId}</p>
        <p><strong>Total Cost:</strong> ৳${totalCost}</p>
        <p><strong>Parcel ID:</strong> ${parcelId}</p>
      `,
        confirmButtonText: "OK",
        width: 400,
        customClass: { popup: "rounded-xl shadow-lg px-4 py-4" },
      });

      navigate("/dashboard/myParcels");
    } catch (err) {
      console.error("Error creating parcel or tracking:", err);
      Swal.fire({
        title: "Error",
        text:
          err.message ||
          "Failed to create parcel or tracking info. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Send a Parcel</h2>
          <p className="text-gray-500">Fill in the details below</p>
        </div>

        {/* Parcel Info */}
        <div className="border p-4 rounded-xl shadow-md space-y-4">
          <h3 className="font-semibold text-xl">Parcel Info</h3>
          <div className="space-y-4">
            {/* Parcel Name */}
            <div>
              <label className="label">Parcel Name</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
                placeholder="Describe your parcel"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Parcel name is required</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="label">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="document"
                    {...register("type", { required: true })}
                    className="radio"
                  />
                  Document
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("type", { required: true })}
                    className="radio"
                  />
                  Non-Document
                </label>
              </div>
              {errors.type && (
                <p className="text-red-500 text-sm">Type is required</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register("weight")}
                disabled={parcelType !== "non-document"}
                className={`input input-bordered w-full ${
                  parcelType !== "non-document"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
                placeholder="Enter weight"
              />
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div className="border p-4 rounded-xl shadow-md space-y-4">
            <h3 className="font-semibold text-xl">Sender Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("sender_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Name"
                defaultValue={user?.displayName} // ✅ pre-fill with logged in user's name
                readOnly // ✅ makes it uneditable
              />
              <input
                {...register("sender_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Contact"
              />
              <select
                {...register("sender_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("sender_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(senderRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("sender_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Address"
              />
              <textarea
                {...register("pickup_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Pickup Instruction"
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border p-4 rounded-xl shadow-md space-y-4">
            <h3 className="font-semibold text-xl">Receiver Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("receiver_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Name"
              />
              <input
                {...register("receiver_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Contact"
              />
              <select
                {...register("receiver_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("receiver_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(receiverRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("receiver_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Address"
              />
              <textarea
                {...register("delivery_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Delivery Instruction"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button className="btn btn-primary text-black">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
