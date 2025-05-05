import { useContext } from "react";
import { ShopContext } from "../context/shopcontext";
import { Link } from "react-router-dom";

const Productitem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
        {/* Image container with fixed height */}
        <div className="h-60 w-full overflow-hidden flex items-center justify-center bg-gray-100">
          <img
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            src={image[0]}
            alt={name}
          />
        </div>

        {/* Product details */}
        <div className="p-3 flex-grow flex flex-col justify-between">
          <p className="text-sm mb-1">{name}</p>
          <p className="text-sm font-medium">
            {currency}
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Productitem;
