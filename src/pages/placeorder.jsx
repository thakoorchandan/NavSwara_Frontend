// frontend/src/pages/placeorder.jsx

import { useState, useContext, useEffect } from "react";
import CartTotal from "../components/carttotal";
import { assets } from "../assets/assets";
import Title from "../components/title";
import { ShopContext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Placeorder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    addresses,
    fetchAddresses,
    addAddress,
  } = useContext(ShopContext);

  // payment method
  const [method, setMethod] = useState("cod");

  // address selection: index or -1=new
  const [selectedAddr, setSelectedAddr] = useState(-1);

  // form data
  const [formData, setFormData] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  // address type for new
  const [addressType, setAddressType] = useState("Home");
  const [customType, setCustomType] = useState("");

  // load saved addresses
  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  // populate form from saved or clear
  useEffect(() => {
    if (selectedAddr >= 0) {
      const a = addresses[selectedAddr];
      setFormData({
        fullName: a.fullName,
        line1: a.line1,
        line2: a.line2 || "",
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country,
        phone: a.phone || "",
      });
    } else {
      setFormData({
        fullName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      setAddressType("Home");
      setCustomType("");
    }
  }, [selectedAddr, addresses]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "NavSwara Order",
      description: "Payment for order",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorPay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
          }
        } catch (err) {
          toast.error(err.message || "Verification failed");
        }
      },
    };
    new window.Razorpay(options).open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { fullName, line1, city, state, postalCode, country } = formData;
    if (!fullName || !line1 || !city || !state || !postalCode || !country) {
      toast.error("Fill all required address fields.");
      return;
    }

    // build items with selectedSize & selectedColor
    const orderItems = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        const qty = cartItems[pid][size];
        if (qty > 0) {
          const prod = products.find((p) => p._id === pid);
          if (prod) {
            orderItems.push({
              product: pid,
              name: prod.name,
              selectedSize: size, // renamed
              selectedColor: null, // placeholder, if you add color UI use prod/color state
              quantity: qty,
              unitPrice: prod.price,
              totalPrice: prod.price * qty,
            });
          }
        }
      }
    }
    if (!orderItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

    let shippingAddress = { ...formData };
    if (selectedAddr === -1) {
      const used = addresses.map((a) => a.type);
      if (used.includes(addressType) && addressType !== "Other") {
        toast.error(`${addressType} address already exists.`);
        return;
      }
      const typeLabel =
        addressType === "Other" ? customType.trim() || "Other" : addressType;
      if (used.includes(typeLabel)) {
        toast.error(`An address of type "${typeLabel}" already exists.`);
        return;
      }
      try {
        await addAddress({ ...shippingAddress, type: typeLabel });
        await fetchAddresses();
      } catch {
        return;
      }
    } else {
      shippingAddress.type = addresses[selectedAddr].type;
    }

    const payload = {
      shippingAddress,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };

    try {
      if (method === "cod") {
        const { data } = await axios.post(
          `${backendUrl}/api/order/place`,
          payload,
          { headers: { token } }
        );
        if (data.success) navigate("/orders");
        else toast.error(data.message);
      } else if (method === "razorpay") {
        const { data } = await axios.post(
          `${backendUrl}/api/order/razorpay`,
          payload,
          { headers: { token } }
        );
        if (data.success) initPay(data.order);
        else toast.error(data.message);
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/order/stripe`,
          payload,
          { headers: { token } }
        );
        if (data.success && data.sessionUrl) {
          window.location.href = data.sessionUrl;
        } else throw new Error(data.message || "Stripe checkout failed");
      }
    } catch (err) {
      toast.error(err.message || "Order failed");
    }
  };

  return (
    <div className="min-h-[80vh] border-t bg-white text-gray-700">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col lg:flex-row gap-6 py-8 px-4 lg:px-12"
      >
        {/* Left */}
        <div className="w-full lg:w-1/2 space-y-6">
          <Title text1="DELIVERY" text2="INFORMATION" />

          {addresses.length > 0 && (
            <div>
              <p className="font-medium mb-2">
                Select saved address or add new:
              </p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {addresses.map((addr, i) => (
                  <label
                    key={i}
                    className={`block p-3 border rounded-lg cursor-pointer ${
                      selectedAddr === i
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved"
                      className="hidden"
                      checked={selectedAddr === i}
                      onChange={() => setSelectedAddr(i)}
                    />
                    <div>
                      <div className="font-semibold">{addr.fullName}</div>
                      <div className="text-sm">{addr.type}</div>
                      <div className="text-sm">
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}
                      </div>
                      <div className="text-sm">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </div>
                      <div className="text-sm">{addr.country}</div>
                      {addr.phone && (
                        <div className="text-sm">📞 {addr.phone}</div>
                      )}
                    </div>
                  </label>
                ))}
                <label
                  className={`block p-3 border rounded-lg cursor-pointer ${
                    selectedAddr === -1
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="saved"
                    className="hidden"
                    checked={selectedAddr === -1}
                    onChange={() => setSelectedAddr(-1)}
                  />
                  <div className="text-sm text-gray-600">
                    Enter a new address
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* New / edit form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={onChangeHandler}
              required
              placeholder="Full name"
              className="border rounded-lg py-2 px-3 w-full"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={onChangeHandler}
              placeholder="Phone"
              className="border rounded-lg py-2 px-3 w-full"
            />
          </div>
          <input
            name="line1"
            value={formData.line1}
            onChange={onChangeHandler}
            required
            placeholder="Address line 1"
            className="border rounded-lg py-2 px-3 w-full"
          />
          <input
            name="line2"
            value={formData.line2}
            onChange={onChangeHandler}
            placeholder="Address line 2"
            className="border rounded-lg py-2 px-3 w-full"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="city"
              value={formData.city}
              onChange={onChangeHandler}
              required
              placeholder="City"
              className="border rounded-lg py-2 px-3 w-full"
            />
            <input
              name="state"
              value={formData.state}
              onChange={onChangeHandler}
              required
              placeholder="State"
              className="border rounded-lg py-2 px-3 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={onChangeHandler}
              required
              placeholder="Postal code"
              className="border rounded-lg py-2 px-3 w-full"
            />
            <input
              name="country"
              value={formData.country}
              onChange={onChangeHandler}
              required
              placeholder="Country"
              className="border rounded-lg py-2 px-3 w-full"
            />
          </div>

          {/* Type selection for new */}
          {selectedAddr === -1 && (
            <div className="space-y-2">
              <p className="font-medium">Address type (unique):</p>
              <div className="flex gap-4">
                {["Home", "Work", "Other"].map((t) => (
                  <label
                    key={t}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
                      addressType === t
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    } ${
                      t !== "Other" && addresses.some((a) => a.type === t)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="addrType"
                      value={t}
                      checked={addressType === t}
                      disabled={
                        t !== "Other" && addresses.some((a) => a.type === t)
                      }
                      onChange={() => setAddressType(t)}
                      className="hidden"
                    />
                    {t}
                  </label>
                ))}
              </div>
              {addressType === "Other" && (
                <input
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  required
                  placeholder="Custom label"
                  className="border rounded-lg py-2 px-3 w-full"
                />
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/2 space-y-6">
          <CartTotal />

          <div>
            <Title text1="PAYMENT" text2="METHOD" />
            <div className="flex gap-3 flex-col sm:flex-row mt-4">
              {[
                {
                  key: "cod",
                  label: "Cash on Delivery",
                  icon:
                    assets.cod_icon ||
                    "https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png",
                },
                {
                  key: "razorpay",
                  label: "Razorpay",
                  icon: assets.razorpay_logo,
                },
                {
                  key: "stripe",
                  label: "Stripe",
                  icon: assets.stripe_logo,
                },
              ].map(({ key, label, icon }) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer ${
                    method === key
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={key}
                    checked={method === key}
                    onChange={() => setMethod(key)}
                    className="hidden"
                  />
                  <img src={icon} alt={key} className="h-6" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            PLACE ORDER
          </button>
        </div>
      </form>
    </div>
  );
};

export default Placeorder;
