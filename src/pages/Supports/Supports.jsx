import React from "react";
import liveTrackingImg from "../../assets/live-tracking.png";
import safeDeliveryImg from "../../assets/safe-delivery.png";
import callCenterImg from "../../assets/big-deliveryman.png";

const data = [
  {
    title: "Live Parcel Tracking",
    subtitle:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey.\nInstant status updates for complete peace of mind.",

    imgSrc: liveTrackingImg,
    alt: "Live Parcel Tracking",
  },
  {
    title: "100% Safe Delivery",
    subtitle:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    imgSrc: safeDeliveryImg,
    alt: "Safe Delivery",
  },
  {
    title: "24/7 Call Center Support",
    subtitle:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    imgSrc: callCenterImg,
    alt: "Call Center Support",
  },
];

const Supports = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-6">
      {data.map(({ title, subtitle, imgSrc, alt }, i) => (
        <div
          key={i}
          className="flex items-center bg-gray-50 rounded-lg p-6"
          style={{ minHeight: "200px" }}
        >
          {/* Left image */}
          <div className="flex-shrink-0">
            <img src={imgSrc} alt={alt} className="h-20 w-20 object-contain" />
          </div>

          {/* Divider */}
          <div className="mx-6 h-20 border-l-2 border-gray-300 border-dotted"></div>

          {/* Text content */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            <p
              className="text-gray-600 mt-1 max-w-xl"
              style={{ whiteSpace: "pre-line" }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Supports;
