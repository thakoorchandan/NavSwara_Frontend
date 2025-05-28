import { useContext } from "react";
import { ShopContext } from "../context/shopcontext";
import { Link } from "react-router-dom";

// Luxe Gold (glittery)
const GOLD = "linear-gradient(90deg, #FFD700 20%, #FFA500 80%)";
const GOLD_SOLID = "#E6B800";

const Star = ({ filled }) => (
  <svg
    className={`w-4 h-4 inline-block ${filled ? "text-yellow-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.2c.969 0 1.371 1.24.588 1.81l-3.4 2.466a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.4-2.467a1 1 0 00-1.175 0l-3.4 2.466c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.225 9.386c-.783-.57-.38-1.81.588-1.81h4.2a1 1 0 00.95-.69l1.286-3.958z" />
  </svg>
);

const Productitem = ({
  id,
  cover,
  gallery = [],
  name,
  price,
  tags = [],
  averageRating = 0,
  reviewCount = 0,
  inStock = true,
  category,
  brand,
  bestSeller,
}) => {
  const { currency } = useContext(ShopContext);
  const thumb = cover || gallery[0] || "";

  const showTags = tags.slice(0, 2);
  const extraTags = tags.length > 2 ? tags.length - 2 : 0;

  return (
    <Link to={`/product/${id}`} className="focus:outline-none">
      <div
        className={`
          relative flex flex-col h-full bg-white
          rounded-xl shadow-lg hover:shadow-2xl transition duration-300
          border border-gray-100
          group overflow-hidden
        `}
        style={{ borderRadius: 14 }}
      >
        {/* Badges */}
        {bestSeller && (
          <span
            className="absolute top-2 left-2 z-10 text-[11px] font-semibold px-2 py-0.5 rounded shadow-lg"
            style={{
              background: GOLD,
              color: "#fff8e1",
              letterSpacing: 0.5,
              fontWeight: 700,
              boxShadow: "0 2px 8px 0 rgba(255,215,0,0.15)",
            }}
          >
            {/* <span role="img" aria-label="star" style={{ marginRight: 3 }}>
              ⭐
            </span> */}
            Best Seller
          </span>
        )}
        {!inStock && (
          <span className="absolute top-2 right-2 z-10 bg-gray-700 text-white text-xs px-2 py-0.5 rounded shadow">
            Out of Stock
          </span>
        )}

        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full bg-gray-50 overflow-hidden rounded-t-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center" style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
          <img
            src={thumb}
            alt={name}
            className="object-cover w-full h-full"
            style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14 }}
            loading="lazy"
          />
        </div>
        {/* Card Body */}
        <div className="flex flex-col flex-1 p-3 justify-between">
          {/* Name */}
          <h3 className="font-semibold text-base mb-1 text-gray-900 line-clamp-2">
            {name}
          </h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={averageRating >= star} />
            ))}
            <span className="ml-1 text-xs text-gray-400">({reviewCount})</span>
          </div>
          {/* Tags */}
           <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
            {showTags.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium">
                +{extraTags} more
              </span>
            )}
          </div>
          {/* Price + Info */}
          <div className="flex items-end justify-between mt-auto">
            <span
              className="text-lg font-extrabold"
              style={{
                background: GOLD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              {currency}
              {price}
            </span>
            <div className="text-xs text-right flex flex-col items-end" style={{ color: "#B89C43" }}>
              {category && <span>{category}</span>}
              {brand && <span className="font-bold">{brand}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

Productitem.defaultProps = {
  tags: [],
  averageRating: 0,
  reviewCount: 0,
  inStock: true,
  category: "",
  brand: "",
  bestSeller: false,
};

export default Productitem;
