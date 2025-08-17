import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import ClientLogosMarquee from "../ClientLogosMarquee/ClientLogosMarquee";
import Supports from "../../Supports/Supports";
import BeMerchant from "../BeMerchant/BeMerchant";
import ParticleBackground from "../../ParticleBackground";

const Home = () => {
  return (
    <div className="relative min-h-screen">
      {/* <ParticleBackground /> */}
      <Banner />
      <Services />
      <ClientLogosMarquee />
      <Supports />
      <BeMerchant />
    </div>
  );
};

export default Home;
