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
  const [mainImage, setMainImage]     = useState("");
  const [size, setSize]               = useState("");

  // Zoom lens state
  const [lensVisible, setLensVisible] = useState(false);
  const [lensStyle, setLensStyle]     = useState({});
  const containerRef                  = useRef(null);

  useEffect(() => {
    const prod = products.find((p) => p._id === productId);
    if (prod) {
      setProductData(prod);
      const cover     = prod.coverImage?.url;
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
    const px = Math.max(0, Math.min(x / width * 100, 100));
    const py = Math.max(0, Math.min(y / height * 100, 100));

    setLensStyle({
      display: "block",
      backgroundImage: `url(${mainImage})`,
      backgroundSize: `${width * 1.2}px ${height * 1.2}px`,
      backgroundPosition: `${px}% ${py}%`,
      left: x - 75,
      top: y - 75,
    });
  };

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
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-3.5" alt="star" />
            ))}
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Size selector */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((s) => (
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
      <Relatedproducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
