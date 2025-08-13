import React from "react";
import Marquee from "react-fast-marquee";
import amazon from "../../../assets/brands/amazon.png";
import amazonVector from "../../../assets/brands/amazon_vector.png";
import casio from "../../../assets/brands/casio.png";
import moonstar from "../../../assets/brands/moonstar.png";
import philips from "../../../assets/brands/randstad.png";
import start from "../../../assets/brands/start.png";
import startPeople from "../../../assets/brands/start-people 1.png";
const logos = [
  amazon,
  amazonVector,
  casio,
  moonstar,
  philips,
  start,
  startPeople,
];

const ClientLogosMarquee = () => {
  return (
    <section className="py-10 bg-base-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-primary">
          We've helped thousands of sales teams
        </h2>

        <Marquee
          gradient={false} // disables fade edges
          speed={50} // adjust scrolling speed
          pauseOnHover={true} // stops when hovered
          direction="right" // change to "left" if needed
        >
          {logos.map((logo, i) => (
            <div key={i} className="mx-8">
              <img
                src={logo}
                alt={`Client ${i + 1}`}
                className="h-6 w-40 object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default ClientLogosMarquee;
