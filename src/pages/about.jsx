import { useState } from "react";
import { assets } from "../assets/assets";
import Newsletterbox from "../components/newsletterbox";
import Title from "../components/title";

const About = () => {
  const [theme, setTheme] = useState("light"); // Default theme is light

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} min-h-screen`}>
 
      <div className="text-2xl text-center pt-8 order-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
        <div className={`flex flex-col justify-center gap-6 md:w-2/4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <p>
            NavSwara is your go-to destination for timeless styles and quality essentials. We’re dedicated to bringing you fashion that lasts, crafted with care and designed to fit your lifestyle effortlessly.
          </p>
          <p>
            Our mission is to inspire confidence through fashion, offering versatile pieces that celebrate your unique style every day.
          </p>
          <b className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>Our Mission</b>
          <p>
            We put our customers at the heart of everything we do, ensuring each piece brings comfort, style, and joy to your wardrobe.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className={`bordr px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <b>Quality Assurance</b>
          <p>
            We are committed to delivering quality that lasts, with every item crafted from carefully selected materials to ensure durability and style. Each piece is thoughtfully designed and rigorously tested to meet our high standards, so you can trust it will look great and feel even better.
          </p>
        </div>
        <div className={`bordr px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <b>Convenience</b>
          <p>
            Our goal is to make shopping as convenient as possible, offering seamless online experiences and fast, reliable delivery. Whether you're browsing from home or on the go, we ensure that your shopping journey is effortless and enjoyable.
          </p>
        </div>
        <div className={`bordr px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <b>Exceptional Customer Service</b>
          <p>
            We are committed to providing exceptional customer service, always ready to assist you with any questions or concerns. Your satisfaction is our priority, and we strive to exceed your expectations at every interaction.
          </p>
        </div>
      </div>
      <Newsletterbox />
    </div>
  );
};

export default About;
