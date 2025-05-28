// src/pages/Product.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import Relatedproducts from "../components/relatedproducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [size, setSize] = useState("");

  // Zoom lens state
  const [lensVisible, setLensVisible] = useState(false);
  const [lensStyle, setLensStyle] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    const prod = products.find((p) => p._id === productId);
    if (prod) {
      setProductData(prod);
      const cover = prod.coverImage?.url;
      const firstOther = prod.images?.[0]?.url;
      setMainImage(cover || firstOther || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId, products]);

  if (!productData) return null;

  const thumbs = [
    ...(productData.coverImage ? [productData.coverImage.url] : []),
    ...(productData.images?.map((i) => i.url) || []),
  ];

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // prevent lens going out
    const px = Math.max(0, Math.min((x / width) * 100, 100));
    const py = Math.max(0, Math.min((y / height) * 100, 100));

    setLensStyle({
      display: "block",
      backgroundImage: `url(${mainImage})`,
      backgroundSize: `${width * 1.2}px ${height * 1.2}px`,
      backgroundPosition: `${px}% ${py}%`,
      left: x - 75,
      top: y - 75,
    });
  };

  // -- NEW DATA --
  const {
    bestSeller,
    inStock,
    averageRating,
    reviewCount,
    tags = [],
    brand,
    category,
    subCategory,
    color = [],
    sizes = [],
  } = productData;

  return (
    <div className="border-t-2 pt-10">
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3 min-h-[20rem] max-h-[56rem]">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {thumbs.map((url, idx) => (
              <img
                key={idx}
                onClick={() => setMainImage(url)}
                src={url}
                alt={`${productData.name} ${idx}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>

          {/* Main image + zoom */}
          <div
            ref={containerRef}
            className="w-full sm:w-[80%] relative flex items-center justify-center"
            onMouseEnter={() => setLensVisible(true)}
            onMouseLeave={() => setLensVisible(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={mainImage}
              alt={productData.name}
              className="w-full h-full object-contain"
            />
            {lensVisible && (
              <div
                className="absolute w-[150px] h-[150px] border border-gray-300 rounded-full pointer-events-none"
                style={lensStyle}
              />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">

          {/* --- NEW: Badges for stock & bestseller --- */}
          <div className="flex gap-2 mb-2">
            {bestSeller && (
              <span className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-2 py-0.5 text-xs rounded font-bold tracking-wide">
                Best Seller
              </span>
            )}
            <span
              className={`px-2 py-0.5 text-xs rounded font-bold border ${
                inStock
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* --- NEW: Brand, Category, SubCategory Badges --- */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {brand && (
              <span className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-2 py-0.5 text-xs rounded">
                {brand}
              </span>
            )}
            {category && (
              <span className="bg-blue-50 border border-blue-300 text-blue-700 px-2 py-0.5 text-xs rounded">
                {category}
              </span>
            )}
            {subCategory && (
              <span className="bg-pink-50 border border-pink-300 text-pink-700 px-2 py-0.5 text-xs rounded">
                {subCategory}
              </span>
            )}
          </div>

          {/* --- NEW: Tags --- */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-yellow-50 border border-yellow-300 text-yellow-600 px-2 py-0.5 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {/* Show rating as stars and value */}
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star_icon}
                className={`w-3.5 ${i < Math.round(averageRating) ? "" : "opacity-30"}`}
                alt="star"
              />
            ))}
            <span className="text-yellow-800 font-bold ml-1">
              {averageRating ? averageRating.toFixed(1) : "0"}
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500 ml-2">
                ({reviewCount} review{reviewCount > 1 ? "s" : ""})
              </span>
            )}
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Size selector */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    s === size ? "border-orange-500" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product</p>
            <p>Cash on Delivery</p>
            <p>Easy return and exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
        </div>
        <div className="border px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      </div>

      {/* Related */}
      <Relatedproducts product={productData} />
    </div>
  );
};

export default Product;
