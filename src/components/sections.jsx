import { useContext } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Sections = ({ theme }) => {
  const { sections, loading } = useContext(ShopContext);

  if (loading)
    return (
      <div className="py-12 text-center text-lg">
        <div className="w-12 h-12 border-4 rounded-full animate-spin border-t-blue-500 border-gray-200 mx-auto" />
      </div>
    );

  console.log("products --- ", sections);

  if (!sections.length)
    return (
      <div className="py-12 text-center text-lg">No sections to display</div>
    );

  return (
    <div>
      {sections.map((section) => (
        <div
          key={section._id}
          className={`pt-5 mb-16 ${
            theme === "dark"
              ? "bg-gray-900 text-gray-200"
              : "bg-white text-gray-700"
          }`}
        >
          <div className="text-center py-8 text-3xl">
            {/* Split title if you want colored "text1"/"text2" */}
            {section.title.includes(" ") ? (
              <Title
                text1={section.title.split(" ")[0]}
                text2={section.title.split(" ").slice(1).join(" ")}
              />
            ) : (
              <Title text1={section.title} text2="" />
            )}
            {section.description && (
              <p
                className={`w-3/4 mx-auto text-xs sm:text-sm md:text-base ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {section.description}
              </p>
            )}
          </div>

          {/* Section Banner */}
          {section.image && (
            <img
              src={section.image}
              alt={section.title}
              className="w-full max-h-64 object-cover rounded-xl mb-5"
            />
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {section.products?.length > 0 ? (
              section.products.map((p) => (
                <Productitem
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={p.price}
                  cover={p.coverImage?.url}
                  gallery={p.images?.map((i) => i.url)}
                  tags={p.tags}
                  averageRating={p.averageRating}
                  reviewCount={p.reviewCount}
                  inStock={p.inStock}
                  category={p.category}
                  brand={p.brand}
                  bestSeller={p.bestSeller}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-sm sm:text-base mt-4">
                No products available in this section.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sections;
