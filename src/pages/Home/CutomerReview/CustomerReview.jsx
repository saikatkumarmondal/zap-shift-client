import React, { useState } from "react";
import logo from "../../../assets/reviewQuote.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
const CustomerReview = () => {
  const developerReviews = [
    {
      name: "Aisha Rahman",
      position: "Frontend Developer (React)",
      review:
        "Delivers pixel-perfect UIs and writes clean, reusable components. Great at breaking down complex tasks and communicating progress.",
    },
    {
      name: "Rifat Chowdhury",
      position: "Full-Stack Developer (MERN)",
      review:
        "Owns features end-to-end. Strong API design, thoughtful MongoDB schemas, and solid test coverage. Reliable under tight deadlines.",
    },
    {
      name: "Nadia Karim",
      position: "UI/UX-Focused Engineer",
      review:
        "Balances accessibility with performance. Prototypes fast, iterates based on feedback, and consistently improves Lighthouse scores.",
    },
    {
      name: "Zahin Ahmed",
      position: "Backend Engineer (Node.js/Express)",
      review:
        "Builds scalable services with clear separation of concerns. Excellent logging/monitoring setup and thorough error handling.",
    },
    {
      name: "Priya Sen",
      position: "Mobile & Web Developer (React/React Native)",
      review:
        "Bridges web and mobile efficiently. Great state management choices and maintains excellent code readability across platforms.",
    },
  ];

  return (
    <div className="my-5">
      <h2 className="text-4xl font-bold text-center text-gray-700">
        What our customers are sayings
      </h2>
      <p className="text-[#606060] text-center mt-4">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce
        <br /> pain, and strengthen your body with ease!
      </p>
      <div className="my-5">
        <Carousel>
          <div className="w-[300px] h-[300px] bg-gray-700"></div>
          <div className="w-[300px] h-[300px] bg-gray-700"></div>
          <div className="w-[300px] h-[300px] bg-gray-700"></div>
        </Carousel>
      </div>
    </div>
  );
};

export default CustomerReview;
