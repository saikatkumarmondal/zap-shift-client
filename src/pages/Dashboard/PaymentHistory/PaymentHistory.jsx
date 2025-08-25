import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch payment history
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email], // unique cache key
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  // Show loading spinner
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💳 Payment History</h2>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="table w-full">
          {/* Table Head */}
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Parcel ID</th>
              <th>Payment Intent</th>

              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {payments.map((p, index) => (
              <tr key={p._id} className="hover">
                <td>{index + 1}</td>
                <td>{p.parcelId}</td>
                <td className="truncate max-w-[150px]">{p.paymentIntentId}</td>

                <td>${(p.amount / 100).toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "success" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
