// src/pages/Collection.jsx
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "../components/title";
import Productitem from "../components/productitem";

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [theme, setTheme] = useState("light");

  // toggle helpers
  const toggleCategory = (v) =>
    setCategory((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]));
  const toggleSubCategory = (v) =>
    setSubCategory((c) =>
      c.includes(v) ? c.filter((x) => x !== v) : [...c, v]
    );

  // 1️⃣ Whenever products change, or any filter/search/sort changes, recompute the list:
  useEffect(() => {
    let cp = [...products];

    // search
    if (search?.trim()) {
      const q = search.toLowerCase();
      cp = cp.filter((p) => p.name.toLowerCase().includes(q));
    }

    // category
    if (category.length) {
      cp = cp.filter((p) => category.includes(p.category));
    }

    // sub-category
    if (subCategory.length) {
      cp = cp.filter((p) => subCategory.includes(p.subCategory));
    }

    // sort
    if (sortType === "low-high") {
      cp.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      cp.sort((a, b) => b.price - a.price);
    }
    // else "relevant" = no extra sort

    setFilterProducts(cp);
  }, [products, search, category, subCategory, sortType]);

  return (
    <div
      className={`
        flex flex-col sm:flex-row gap-4 pt-10 border-t
        ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
        }
      `}
    >
      {/* ── FILTERS ───────────────────────────────────────── */}
      <aside className="min-w-[200px]">
        <h2
          onClick={() => setShowFilter((f) => !f)}
          className="cursor-pointer flex items-center gap-2 text-xl mb-4"
        >
          FILTERS
        </h2>
        <div className={`${showFilter ? "" : "hidden"} sm:block`}>
          <div className="border p-4 mb-4">
            <p className="font-medium mb-2">Categories</p>
            {["Men", "Women", "Kids"].map((c) => (
              <label key={c} className="block text-sm">
                <input
                  type="checkbox"
                  value={c}
                  checked={category.includes(c)}
                  onChange={() => toggleCategory(c)}
                  className="mr-2"
                />
                {c}
              </label>
            ))}
          </div>
          <div className="border p-4">
            <p className="font-medium mb-2">Sub-Categories</p>
            {["Topwear", "Bottomwear", "Winterwear"].map((s) => (
              <label key={s} className="block text-sm">
                <input
                  type="checkbox"
                  value={s}
                  checked={subCategory.includes(s)}
                  onChange={() => toggleSubCategory(s)}
                  className="mr-2"
                />
                {s}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── PRODUCTS GRID ──────────────────────────────── */}
      <section className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border px-2 py-1 text-sm"
            value={sortType}
          >
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low–High</option>
            <option value="high-low">Price: High–Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.length ? (
            filterProducts.map((p) => (
              <Productitem
                key={p._id}
                id={p._id}
                name={p.name}
                price={p.price}
                cover={p.coverImage?.url}
                gallery={p.images.map((i) => i.url)}
              />
            ))
          ) : (
            <p className="col-span-full text-center">No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collection;
