import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import { auth } from "../../../firebase/firebase.init";
import { deleteUser } from "firebase/auth"; // ✅ import deleteUser

const Register = () => {
  const [profilePic, setProfilePic] = useState("");
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ helper to rollback Firebase user if DB/profile fails
  const handleDeleteUser = async () => {
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
        console.log("⛔ Rolled back user from Firebase");
      } catch (err) {
        console.error("Failed to delete user during rollback:", err);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      // 1️⃣ Try to create Firebase Auth user
      const result = await createUser(data.email, data.password);
      const user = result.user;

      // 2️⃣ Save extra info in DB
      const userInfo = {
        email: data.email,
        role: "user",
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await axiosInstance.post("/users", userInfo);

      // 3️⃣ Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic,
      });

      // ✅ Success feedback
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Registered!",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: "#CAEB66",
        color: "#000",
      });

      setTimeout(() => {
        navigate(from);
      }, 1500);
    } catch (error) {
      console.error("Registration failed:", error);

      // 4️⃣ Rollback user if Firebase Auth created but DB/profile failed
      await handleDeleteUser();

      // 5️⃣ Show user-friendly Firebase error messages
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please log in instead.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address. Please enter a valid one.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters long.";
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        confirmButtonColor: "#d33",
        width: "300px",
        customClass: { popup: "rounded-2xl shadow-lg" },
      });
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_upload_key
        }`,
        formData
      );
      setProfilePic(res.data.data.url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: "#F0F8E8" }}
    >
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="card-body p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-[#CAEB66]">
            Register Now!
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label font-semibold">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered w-full rounded-lg border-gray-300 focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]"
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1">Name is required</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="label font-semibold">Profile Image</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full rounded-lg border-gray-300 focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered w-full rounded-lg border-gray-300 focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]"
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 mt-1">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label font-semibold">Password</label>
              <input
                type="password"
                {...register("password", { required: true, minLength: 6 })}
                className="input input-bordered w-full rounded-lg border-gray-300 focus:border-[#CAEB66] focus:ring-1 focus:ring-[#CAEB66]"
                placeholder="Password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 mt-1">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a className="link link-hover text-[#6B6B6B] hover:text-gray-800">
                Forgot password?
              </a>
            </div>

            {/* Register Button */}
            <button
              className="btn w-full text-black rounded-xl shadow-md mt-2"
              style={{ backgroundColor: "#CAEB66" }}
            >
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#CAEB66] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <div className="mt-6">
            <SocialLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
