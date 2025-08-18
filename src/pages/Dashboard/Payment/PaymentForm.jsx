import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isProcessing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
    enabled: !!parcelId,
  });

  const amount = parcelInfo.cost || 0;
  const amountInCent = amount * 100;

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-lg text-blue-500"></span>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet. Please try again.");
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card input not found.");
      setProcessing(false);
      return;
    }

    try {
      // ✅ 1. Ask backend to create PaymentIntent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCent,
        currency: "usd",
      });

      const clientSecret = res.data.clientSecret;

      // ✅ 2. Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName || "Unknown",
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        console.error("[Payment error]", result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("💳 Payment succeeded:", result.paymentIntent);

        // ✅ 3. Save payment to backend
        const paymentData = {
          parcelId,
          paymentIntentId: result.paymentIntent.id,
          userEmail: user.email,
          amount: parcelInfo.cost, // total parcel cost
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);
        const transitionId = result.paymentIntent.id;
        if (paymentRes.data.payment) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            html: `Transaction ID: <b>${transitionId}</b>`,
            confirmButtonText: "Go to My Parcels",
          }).then(() => {
            navigate("/dashboard/myParcels");
          });
        }
        setError("");
      }
    } catch (apiError) {
      setError("An unexpected error occurred. Please try again.");
      console.error("[API error]", apiError);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-form-container bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto my-10">
      <div className="form-header flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Details
        </h2>
        <span className="secure-badge flex items-center text-green-600 font-medium text-sm">
          🔒 Secure Checkout
        </span>
      </div>

      {parcelInfo && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Order Summary
          </h3>
          <p className="text-gray-700">
            Parcel: <span className="font-semibold">{parcelInfo.title}</span>
          </p>
          <p className="text-gray-700">
            Delivery Cost:{" "}
            <span className="font-semibold">
              ${parcelInfo.cost?.toFixed(2)}
            </span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
            <CardElement className="card-input" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </button>

        {error && (
          <div className="text-red-500 mt-4 text-center p-3 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
