// src/components/Latestcollection.jsx
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Latestcollection = ({ theme }) => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Filter out best-sellers and take first 10
    const filtered = products?.filter((p) => !p.bestSeller) || [];
    setLatestProducts(filtered.slice(0, 10));
    setLoading(false);
  }, [products]);

  return (
    <div
      className={`pt-5 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-white text-gray-700"
      }`}
    >
      {/* Title Section */}
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p
          className={`w-3/4 mx-auto text-xs sm:text-sm md:text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore our latest arrivals, carefully curated to bring you the best
          in quality and style.
        </p>
      </div>

      {/* Loading Spinner */}
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
          {latestProducts.length > 0 ? (
            latestProducts.map((p) => (
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
              No products available at the moment. Check back later!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Latestcollection;
