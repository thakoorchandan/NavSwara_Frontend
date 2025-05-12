// src/pages/Collection.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { ShopContext } from "../context/shopcontext";
import Title from "../components/title";
import Productitem from "../components/productitem";
import { Drawer, Collapse, Slider, Checkbox } from "antd";

const { Panel } = Collapse;

const Collection = () => {
  const { products, search, loading } = useContext(ShopContext);

  // ─── Filter state ─────────────────────────────────────
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCats, setSelectedSubCats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [sortType, setSortType] = useState("relevant");

  // ─── Fade controller ──────────────────────────────────
  const [fade, setFade] = useState(true);

  // ─── Sidebar (desktop) & Drawer (mobile) visibility ───
  const [showSidebar, setShowSidebar] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // ─── Dynamic options from products ────────────────────
  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map(
        (c) => ({ label: c, value: c })
      ),
    [products]
  );

  const subCategoryOptions = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.subCategory).filter(Boolean))
      ).map((s) => ({ label: s, value: s })),
    [products]
  );

  const brandOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).map(
        (b) => ({ label: b, value: b })
      ),
    [products]
  );

  const tagsOptions = useMemo(() => {
    const allTags = products.flatMap((p) => p.tags || []);
    return Array.from(new Set(allTags)).map((t) => ({ label: t, value: t }));
  }, [products]);

  // ─── Global min/max price ─────────────────────────────
  const [minPrice, maxPrice] = useMemo(() => {
    if (!products.length) return [0, 0];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  useEffect(() => {
    if (maxPrice > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  // ─── Core filtering + fade effect ─────────────────────
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    // start fade-out
    setFade(false);

    const handle = setTimeout(() => {
      let cp = [...products];

      if (search?.trim()) {
        const q = search.toLowerCase();
        cp = cp.filter((p) => p.name.toLowerCase().includes(q));
      }
      if (selectedCategories.length) {
        cp = cp.filter((p) => selectedCategories.includes(p.category));
      }
      if (selectedSubCats.length) {
        cp = cp.filter((p) => selectedSubCats.includes(p.subCategory));
      }
      if (selectedBrands.length) {
        cp = cp.filter((p) => selectedBrands.includes(p.brand));
      }
      if (selectedTags.length) {
        cp = cp.filter((p) =>
          (p.tags || []).some((tag) => selectedTags.includes(tag))
        );
      }
      cp = cp.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
      if (sortType === "low-high") {
        cp.sort((a, b) => a.price - b.price);
      } else if (sortType === "high-low") {
        cp.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(cp);
      // fade back in
      setFade(true);
    }, 200);

    return () => clearTimeout(handle);
  }, [
    products,
    search,
    selectedCategories,
    selectedSubCats,
    selectedBrands,
    selectedTags,
    priceRange,
    sortType,
  ]);

  // ─── Shared filter panels ─────────────────────────────
  const FilterPanels = (
    <Collapse
      ghost
      defaultActiveKey={["1", "2", "3", "4", "5"]}
      expandIconPosition="right"
    >
      <Panel header="Categories" key="1" className="pt-0">
        <Checkbox.Group
          options={categoryOptions}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </Panel>
      <Panel header="Sub-Categories" key="2">
        <Checkbox.Group
          options={subCategoryOptions}
          value={selectedSubCats}
          onChange={setSelectedSubCats}
        />
      </Panel>
      <Panel header="Brand" key="3">
        <Checkbox.Group
          options={brandOptions}
          value={selectedBrands}
          onChange={setSelectedBrands}
        />
      </Panel>
      <Panel header="Tags" key="4">
        <Checkbox.Group
          options={tagsOptions}
          value={selectedTags}
          onChange={setSelectedTags}
        />
      </Panel>
      <Panel header="Price Range" key="5">
        <div className="px-2">
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
          />
          <div className="flex justify-between text-sm mt-1">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </Panel>
    </Collapse>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t">
      {/* ── Sidebar (desktop only, toggleable) ──────────── */}
      <aside
        className={`
    hidden sm:flex
    transform transition-transform duration-300 ease-in-out
    ${showSidebar ? "translate-x-0 w-64" : "-translate-x-full w-0"}
    flex-shrink-0 overflow-hidden
  `}
      >
        {FilterPanels}
      </aside>

      {/* ── Drawer (mobile only) ────────────────────────── */}
      <Drawer
        title="Filters"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        {FilterPanels}
      </Drawer>

      {/* ── Main Content ────────────────────────────────── */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <div className="flex items-center gap-2">
            {/* Desktop toggle */}
            <button
              className="hidden sm:inline-block px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded transition hover:bg-gray-300"
              onClick={() => setShowSidebar((v) => !v)}
            >
              {showSidebar ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Mobile drawer trigger */}
            <button
              className="sm:hidden px-3 py-1 bg-blue-500 text-white text-sm rounded transition hover:bg-blue-600"
              onClick={() => setDrawerVisible(true)}
            >
              Filters
            </button>

            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              className="border px-2 py-1 text-sm rounded transition hover:border-blue-500"
            >
              <option value="relevant">Relevant</option>
              <option value="low-high">Price: Low–High</option>
              <option value="high-low">Price: High–Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 rounded-full border-t-blue-500 animate-spin" />
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {filteredProducts.length ? (
              filteredProducts.map((p) => (
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
              <p className="col-span-full text-center mt-10 text-gray-500">
                No products match those filters.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
