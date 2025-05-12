// src/components/Latestcollection.jsx
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Latestcollection = ({ theme }) => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // filter out bestsellers
    const nonBestSeller = products.filter((p) => !p.bestSeller);
    setLatestProducts(nonBestSeller.slice(0, 10));
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.length > 0 ? (
          latestProducts.map((p) => {
            return (
              <Productitem
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                cover={p.coverImage?.url}
                gallery={p.images.map((i) => i.url)}
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-sm sm:text-base mt-4">
            No products available at the moment. Check back later!
          </p>
        )}
      </div>
    </div>
  );
};

export default Latestcollection;
