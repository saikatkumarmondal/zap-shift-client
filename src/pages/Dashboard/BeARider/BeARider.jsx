"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const serviceCenters = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const [districts, setDistricts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      age: "",
      region: "",
      district: "",
      phone: "",
      nid: "",
      bikeBrand: "",
      bikeModel: "",
      warehouse: "",
      status: "pending",
    },
  });

  const watchRegion = watch("region");
  const watchDistrict = watch("district");

  // Update districts when region changes
  useEffect(() => {
    if (!serviceCenters.length) return;
    const filteredDistricts = serviceCenters
      .filter((c) => c.region === watchRegion)
      .map((c) => c.district);
    setDistricts(filteredDistricts);
    setValue("district", "");
    setWarehouses([]);
    setValue("warehouse", "");
  }, [watchRegion, serviceCenters, setValue]);

  // Update warehouses when district changes
  useEffect(() => {
    if (!serviceCenters.length) return;
    const center = serviceCenters.find(
      (c) => c.region === watchRegion && c.district === watchDistrict
    );
    setWarehouses(center?.covered_area || []);
    setValue("warehouse", "");
  }, [watchDistrict, watchRegion, serviceCenters, setValue]);

  const onSubmit = async (data) => {
    try {
      const riderData = {
        ...data,
        name: user?.displayName || "",
        email: user?.email || "",
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // Use await properly without .then()
      const response = await axiosSecure.post("/riders", riderData);

      if (response.data.insertedId || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your rider application has been submitted successfully!",
          confirmButtonColor: "#CAEB66",
        });

        // Reset the form after success
        reset({
          name: user?.displayName || "",
          email: user?.email || "",
          age: "",
          region: "",
          district: "",
          phone: "",
          nid: "",
          bikeBrand: "",
          bikeModel: "",
          warehouse: "",
          status: "pending",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Be A Rider Application</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name & Age */}
        <div className="flex gap-10">
          <div className="flex-1">
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Age</label>
            <input
              type="number"
              {...register("age", {
                required: "Age is required",
                min: { value: 18, message: "Minimum age is 18" },
                max: { value: 55, message: "Maximum age is 55" },
              })}
              className="w-full border border-gray-300 rounded p-2"
            />
            {errors.age && (
              <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>
        </div>

        {/* Email & Region */}
        <div className="flex gap-10">
          <div className="flex-1">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Region</label>
            <select
              {...register("region", { required: "Region is required" })}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select Region</option>
              {[...new Set(serviceCenters.map((c) => c.region))].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-600 text-sm mt-1">
                {errors.region.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone & NID */}
        <div className="flex gap-10">
          <div className="flex-1">
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: "Phone is required" })}
              className="w-full border border-gray-300 rounded p-2"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">National ID</label>
            <input
              type="text"
              {...register("nid", { required: "NID is required" })}
              className="w-full border border-gray-300 rounded p-2"
            />
            {errors.nid && (
              <p className="text-red-600 text-sm mt-1">{errors.nid.message}</p>
            )}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block font-medium mb-1">District</label>
          <select
            {...register("district", { required: "District is required" })}
            className="w-full border border-gray-300 rounded p-2"
            disabled={!districts.length}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-600 text-sm mt-1">
              {errors.district.message}
            </p>
          )}
        </div>

        {/* Bike Brand & Model */}
        <div>
          <label className="block font-medium mb-1">Bike Brand</label>
          <input
            type="text"
            {...register("bikeBrand", { required: "Bike brand is required" })}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.bikeBrand && (
            <p className="text-red-600 text-sm mt-1">
              {errors.bikeBrand.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Bike Model</label>
          <input
            type="text"
            {...register("bikeModel", { required: "Bike model is required" })}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.bikeModel && (
            <p className="text-red-600 text-sm mt-1">
              {errors.bikeModel.message}
            </p>
          )}
        </div>

        {/* Warehouse */}
        <div>
          <label className="block font-medium mb-1">Warehouse</label>
          <select
            {...register("warehouse", { required: "Warehouse is required" })}
            className="w-full border border-gray-300 rounded p-2"
            disabled={!warehouses.length}
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {errors.warehouse && (
            <p className="text-red-600 text-sm mt-1">
              {errors.warehouse.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-[#CAEB66] text-black p-2 rounded hover:bg-[#52690f]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
