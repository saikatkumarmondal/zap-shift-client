import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-no-repeat bg-[#33929D] bg-[url('assets/be-a-merchant-bg.png')] rounded-4xl p-20"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={location}
          alt="Merchant Location"
          className="max-w-sm rounded-lg shadow-2xl bg-white p-4 border-4 border-white"
        />
        <div>
          <h1 className="text-5xl font-bold text-black">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6 text-black">
            We offer the lowest delivery charge with
            <br /> the highest value along with 100% safety of your product.
            Pathao courier delivers your parcels in every
            <br /> corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary rounded-full text-black">
            Become a Merchant
          </button>
          <button className="btn btn-primary btn-outline rounded-full ms-4 text-primary">
            Become a Merchant
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
