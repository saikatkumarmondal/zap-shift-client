import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState("");
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("Error", error);
      setErrors(error.message);
    } else {
      setErrors("");
      console.log("Payment method:", paymentMethod);
    }
  };
  return (
    <div>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <CardElement className="p-2 border rounded"></CardElement>
        <button disabled={!stripe} className="btn btn-accent">
          {" "}
          Pay For Parcel
        </button>
        {errors && <p className="text-red-500">{errors}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
