import { useState } from "react";
import { assets } from "../assets/assets";

const Hero = ({theme}) => {

  return (
    <div
      className={`flex flex-col sm:flex-row border ${
        theme === "dark" ? "border-gray-700 bg-gray-900 text-gray-200" : "border-gray-400 bg-white text-[#414141]"
      }`}
    >
      {/* Theme Toggle */}

      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div>
          <div className="flex items-center gap-2">
            <p
              className={`w-8 md:w-11 h-[2px] ${
                theme === "dark" ? "bg-gray-200" : "bg-[#414141]"
              }`}
            ></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLER</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p
              className={`w-8 md:w-11 h-[1px] ${
                theme === "dark" ? "bg-gray-200" : "bg-[#414141]"
              }`}
            ></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img
        className="w-full sm:w-1/2"
        src={assets.hero_img}
        alt="Hero"
      />
    </div>
  );
};

export default Hero;
