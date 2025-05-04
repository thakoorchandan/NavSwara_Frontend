import { useState } from "react";
import { assets } from "../assets/assets";
import Newsletterbox from "../components/newsletterbox";
import Title from "../components/title";

const Contact = () => {
  const [theme, setTheme] = useState("light"); // Default theme is light

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-600"} min-h-screen`}>
      {/* Theme Toggle Button */}
 

      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img className="w-full md:max-w-[480px]" src={assets.contact_img} alt="Contact" />

        <div className="flex flex-col justify-center items-start gap-6">
          <div>
            <p className="font-semibold text-xl">
              {theme === "dark" ? "Our Store (Dark Mode)" : "Our Store"}
            </p>

            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} mb-4`}>
              54709 Near Railway Station <br />
              Suite 350, Vishakhaptnam, A.P, India
            </p>

            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} mb-4`}>
              Tel: (415) 555-0132 <br />
              Email: admin@forever.com
            </p>

            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} mb-2`}>
              Careers at Forever
            </p>

            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} mb-4`}>
              Learn more about our teams and job openings
            </p>

            <button
              className={`border px-8 py-4 text-sm transition-all duration-500 ${
                theme === "dark"
                  ? "border-white text-white hover:bg-white hover:text-gray-900"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <Newsletterbox />
    </div>
  );
};

export default Contact;
