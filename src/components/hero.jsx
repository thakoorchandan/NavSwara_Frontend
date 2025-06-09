import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Carousel } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { assets } from "../assets/assets";

const slides = [
  {
    img: assets.saree_backdrop3,
    subtitle: "OUR BESTSELLER",
    title: "Latest Arrivals",
    button: "SHOP NOW",
  },
  {
    img:
      assets.saree_backdrop2 ||
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    subtitle: "SUMMER COLLECTION",
    title: "Cool & Comfy Styles",
    button: "EXPLORE",
  },
  {
    img:
      assets.saree_backdrop ||
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    subtitle: "TRADITIONAL CHARM",
    title: "Festive Sarees",
    button: "VIEW FESTIVE",
  },
];

const Hero = () => {
  const carouselRef = useRef();
  const [hover, setHover] = useState(false);

  return (
    <div className="relative w-full shadow-xl rounded-xl overflow-hidden my-4">
      <Carousel
        ref={carouselRef}
        autoplay
        dots
        effect="fade"
        speed={700}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <div key={i}>
            <div className="flex flex-col sm:flex-row w-full min-h-[230px] bg-white transition-all duration-700">
              {/* Text */}
              <div className="w-full sm:w-1/2 flex flex-col justify-center items-center px-8 py-12 z-10 relative min-h-[230px]">
                {/* <div className="w-full max-w-lg">
                  <Link to="/">
                    <img src={assets.logo} alt="" />
                  </Link>
                </div> */}
                <div className="w-full max-w-lg">
                  <h1 className="prata-regular text-4xl sm:py-3 lg:text-5xl font-extrabold leading-tight mb-2 text-black drop-shadow-md">
                    {slide.title}
                  </h1>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="block w-8 h-[2px] bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></span>
                    <span className="font-semibold text-yellow-700 uppercase tracking-wider text-xs sm:text-sm">
                      {slide.subtitle}
                    </span>
                  </div>
                  <button className="mt-4 px-8 py-3 rounded shadow font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white transition hover:scale-105 hover:from-yellow-500 hover:to-yellow-700">
                    {slide.button}
                  </button>
                </div>
              </div>
              {/* Image */}
              <div
                className="w-full sm:w-1/2 relative flex items-center justify-center bg-gray-50 group min-h-[230px]"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ minHeight: "500px" }}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                  draggable="false"
                  style={{
                    minHeight: "500px",
                    maxHeight: "650px",
                    maxWidth: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Arrows on hover */}
                {hover && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        carouselRef.current.prev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-yellow-100 rounded-full p-2 shadow-lg transition"
                      aria-label="Previous"
                    >
                      <ArrowLeftOutlined className="text-lg text-yellow-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        carouselRef.current.next();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-yellow-100 rounded-full p-2 shadow-lg transition"
                      aria-label="Next"
                    >
                      <ArrowRightOutlined className="text-lg text-yellow-700" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Custom dots style (optional) */}
      <style>{`
        .ant-carousel .slick-dots {
          bottom: 26px;
        }
        .ant-carousel .slick-dots li button {
          background: #e5e5e5;
        }
        .ant-carousel .slick-dots li.slick-active button {
          background: #ffd700;
        }
      `}</style>
    </div>
  );
};

export default Hero;
