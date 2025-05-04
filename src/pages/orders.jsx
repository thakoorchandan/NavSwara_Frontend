import Title from "../components/title";
import { ShopContext } from "../context/shopcontext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [theme, setTheme] = useState("light"); // Default theme

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      // Handle errors if necessary
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div
      className={`border-t pt-16 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      {/* Theme Toggle Button */}
 

      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className={`py-4 border-t border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            } flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
          >
            {/* Order Details */}
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div
                  className={`flex items-center gap-3 mt-2 text-base ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {/* Status and Action */}
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    theme === "dark" ? "bg-green-400" : "bg-green-500"
                  }`}
                ></p>
                <p
                  className={`text-sm md:text-base ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.status}
                </p>
              </div>
              <button
                onClick={loadOrderData}
                className={`border px-4 py-2 text-sm font-medium rounded-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "hover:bg-gray-100"
                }`}
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
