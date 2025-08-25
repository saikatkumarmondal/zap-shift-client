import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

// Create axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:7777",
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Add interceptor
    const interceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup: remove interceptor when user/logs out or component unmounts
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
