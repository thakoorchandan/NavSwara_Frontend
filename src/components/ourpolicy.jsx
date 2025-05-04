import { useState } from "react";
import { assets } from "../assets/assets";

const Ourpolicy = ({theme}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"
      }`}
    >

      {/* Easy Exchange Policy */}
      <div>
        <img
          src={assets.exchange_icon}
          className="w-12 m-auto mb-5"
          alt="Exchange Policy"
        />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          We offer hassle-free exchange policy
        </p>
      </div>

      {/* 7 Days Return Policy */}
      <div>
        <img
          src={assets.quality_icon}
          className="w-12 m-auto mb-5"
          alt="Return Policy"
        />
        <p className="font-semibold">7 Days Return Policy</p>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          We provide 7 days free return policy
        </p>
      </div>

      {/* Best Customer Support */}
      <div>
        <img
          src={assets.support_img}
          className="w-12 m-auto mb-5"
          alt="Customer Support"
        />
        <p className="font-semibold">Best Customer Support</p>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          We provide 24/7 customer support
        </p>
      </div>
    </div>
  );
};

export default Ourpolicy;
