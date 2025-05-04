import { useState } from "react";

const Newsletterbox = ({theme}) => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className={`text-2xl font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
        Subscribe now and get 20% off
      </p>
      <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-400"} mt-3`}>
        Lorem ipsum is simply dummy text of the printing and typesetting industry.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className={`w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 ${theme === "dark" ? "dark:border-gray-700" : "border-gray-400"}`}
      >
        <input
          className={`w-full sm:flex-1 outline-none ${theme === "dark" ? "dark:bg-gray-800 dark:text-gray-200" : "bg-white text-gray-800"}`}
          type="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className={`text-xs px-10 py-4 ${theme === "dark" ? "bg-gray-600 text-gray-100" : "bg-black text-white"}`}
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default Newsletterbox;
