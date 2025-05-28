import { useContext, useMemo } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const RelatedProducts = ({ product }) => {
  const { products, loading } = useContext(ShopContext);

  // Related: at least one tag matches, and not the same product
  const related = useMemo(() => {
    if (!product?._id || !Array.isArray(product?.tags) || product?.tags.length === 0) return [];
    if (!Array.isArray(products)) return [];

    return products?.filter((p) =>
      p?._id !== product._id &&
      Array.isArray(p?.tags) &&
      p.tags.some((tag) => product.tags.includes(tag))
    );
  }, [product, products]);

  if (!product) return null;

  if (loading || !products) {
    return (
      <div className="py-12 text-center text-lg">
        <div className="w-12 h-12 border-4 rounded-full animate-spin border-t-yellow-400 border-gray-300 mx-auto" />
        <div className="mt-4">Loading related products...</div>
      </div>
    );
  }

  return (
    <div className={`pt-6 ${"bg-white text-gray-700"}`}>
      <div className="text-center py-6 text-2xl">
        <Title text1="RELATED" text2="PRODUCTS" />
        { related?.length > 0 && <p className={`w-3/4 mx-auto text-xs sm:text-sm md:text-base ${"text-gray-600"}`}>
          You might also like these styles based on your selection.
        </p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related?.length > 0 ? (
          related.map((p) => (
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
            No related products found. Try browsing more categories!
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
