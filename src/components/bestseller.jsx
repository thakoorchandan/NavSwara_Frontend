// src/components/Bestseller.jsx
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Bestseller = ({ theme }) => {
  const { products, loading } = useContext(ShopContext);
  const [bestseller, setBestseller] = useState([]);

  useEffect(() => {
    const best = products?.filter((p) => p.bestSeller).slice(0, 5);
    setBestseller(best);
  }, [products]);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"
      }`}
    >
      {/* Title */}
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLERS" />
        <p
          className={`w-3/4 mx-auto text-xs sm:text-sm md:text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore our top-selling products that everyone loves!
        </p>
      </div>

      {/* Spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div
            className={`w-12 h-12 border-4 rounded-full animate-spin ${
              theme === "dark"
                ? "border-t-gray-400 border-gray-600"
                : "border-t-blue-500 border-gray-200"
            }`}
          />
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {bestseller.length > 0 ? (
            bestseller.map((p) => (
              <Productitem
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                cover={p.coverImage?.url}
                gallery={p.images.map((i) => i.url)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-sm sm:text-base mt-4">
              No bestseller products available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Bestseller;
