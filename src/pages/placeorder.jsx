import { useState, useContext } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/carttotal";
import Title from "../components/title";
import { ShopContext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Placeorder = () => {
  const [method, setMethod] = useState("cod");
  const [theme, setTheme] = useState("light"); // Default theme
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorPay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      },
    };

    console.rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "razorpay":
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`min-h-[80vh] border-t ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="flex gap-4 sm:gap-6">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className={`border rounded-lg py-2 px-4 w-full ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              type="text"
              placeholder="First name"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className={`border rounded-lg py-2 px-4 w-full ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              type="text"
              placeholder="Last name"
            />
          </div>

          {/* Additional inputs follow the same conditional styling */}
        </div>
        {/* Right Side */}
        <div className="mt-8">
          <CartTotal />
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row mt-4">
              <label
                className={`flex items-center gap-3 border px-4 py-3 rounded-md cursor-pointer transition ${
                  method === "cod"
                    ? "border-blue-500 bg-blue-100"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  className="hidden"
                />
                <img
                  src={
                    assets.cod_icon ||
                    "https://img.icons8.com/ios-filled/50/000000/cash-on-delivery.png"
                  }
                  alt="COD"
                  className="w-6 h-6"
                />
                <span>Cash on Delivery</span>
              </label>
              <label
                className={`flex justify-center items-center border px-6 py-4 rounded-md cursor-pointer transition ${
                  method === "razorpay"
                    ? "border-blue-500 bg-blue-100"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={method === "razorpay"}
                  onChange={() => setMethod("razorpay")}
                  className="hidden"
                />
                <img
                  src={
                    assets.razorpay_logo ||
                    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Razorpay_logo.svg"
                  }
                  alt="Razorpay"
                  className="h-6"
                />
              </label>

              <label
                className={`flex justify-center items-center border px-6 py-4 rounded-md cursor-pointer transition ${
                  method === "stripe"
                    ? "border-blue-500 bg-blue-100"
                    : theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={method === "stripe"}
                  onChange={() => setMethod("stripe")}
                  className="hidden"
                />
                <img
                  src={
                    assets.stripe_logo ||
                    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.svg"
                  }
                  alt="Stripe"
                  className="h-6"
                />
              </label>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className={`px-16 py-3 text-sm ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-black text-white"
              }`}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Placeorder;
