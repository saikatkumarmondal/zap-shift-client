import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !authLoading,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/${user.email.toLowerCase()}/role`
      );
      return res.data; // { email, role }
    },
  });

  return {
    role: data?.role || "user",
    loading: isLoading || authLoading,
    error,
    refetch,
  };
};

export default useUserRole;
