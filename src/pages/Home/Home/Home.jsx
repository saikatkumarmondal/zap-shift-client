import React from "react";
import Banner from "../Banner/Banner";
import Services from "../Services/Services";
import ClientLogosMarquee from "../ClientLogosMarquee/ClientLogosMarquee";
import Supports from "../../Supports/Supports";
import BeMerchant from "../BeMerchant/BeMerchant";

const Home = () => {
  return (
    <div>
      {/* <h2>Om Namah Shivaya</h2> */}

      <Banner></Banner>
      <Services></Services>
      <ClientLogosMarquee></ClientLogosMarquee>
      <Supports></Supports>
      <BeMerchant></BeMerchant>
    </div>
  );
};

export default Home;
