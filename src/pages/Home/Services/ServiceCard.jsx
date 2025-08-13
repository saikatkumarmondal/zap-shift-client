import React from "react";

const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="group bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:bg-primary hover:shadow-lg transition-all duration-300">
      <div className="text-5xl text-primary mb-4 transition-colors duration-300 group-hover:text-white">
        <Icon />
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2 transition-colors duration-300 group-hover:text-white">
        {title}
      </h3>
      <p className="text-gray-600 transition-colors duration-300 group-hover:text-white">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
