// src/components/Productitem.jsx
import { useContext } from "react";
import { ShopContext } from "../context/shopcontext";
import { Link } from "react-router-dom";

const Productitem = ({ id, cover, gallery = [], name, price }) => {
  const { currency } = useContext(ShopContext);

  // prefer cover, else first gallery image, else empty string
  const thumb = cover || gallery[0] || "";

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="rounded overflow-hidden transition duration-300 flex flex-col h-full min-h-[400px]">
        <div className="w-full overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            src={thumb}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-4 flex flex-col justify-between">
          <p className="text-base font-medium mb-2">{name}</p>
          <p className="text-sm font-semibold">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Productitem;
