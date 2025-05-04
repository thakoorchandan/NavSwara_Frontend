import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Bestseller = ({theme}) => {
  const { products } = useContext(ShopContext);
  const [bestseller, setBestseller] = useState([]);

  useEffect(() => {
    const bestproduct = products.filter((item) => item.bestseller);
    setBestseller(bestproduct.slice(0, 5));
  }, [products]);

  return (
    <div
      className={`my-10 ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-700"
      }`}
    >

      {/* Title Section */}
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p
          className={`w-3/4 mx-auto text-xs sm:text-sm md:text-base ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore our top-selling products that everyone loves!
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestseller.length > 0 ? (
          bestseller.map((item, index) => (
            <Productitem
              key={index}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-sm sm:text-base mt-4">
            No bestseller products available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Bestseller;
