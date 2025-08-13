import React from "react";
import ServiceCard from "./ServiceCard";
import {
  FaShippingFast,
  FaGlobe,
  FaBoxes,
  FaMoneyCheckAlt,
  FaBuilding,
  FaUndo,
} from "react-icons/fa";

const services = [
  {
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: FaShippingFast,
  },
  {
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: FaGlobe,
  },
  {
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: FaBoxes,
  },
  {
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    icon: FaMoneyCheckAlt,
  },
  {
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
    icon: FaBuilding,
  },
  {
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    icon: FaUndo,
  },
];

const Services = () => {
  return (
    <section className="bg-base-200 py-12 px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-primary">Our Services</h2>
      <p className="max-w-3xl mx-auto mb-12 text-gray-700">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </section>
  );
};

export default Services;
