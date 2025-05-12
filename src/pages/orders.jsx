// frontend/src/pages/orders.jsx

import Title from "../components/title";
import { ShopContext } from "../context/shopcontext";
import { useContext, useEffect, useState } from "react";

const Orders = () => {
  const { token, currency, products, orders, fetchOrders } =
    useContext(ShopContext);



  // On mount or when token changes, reload orders
  useEffect(() => {
    handleFetchOrders();
  }, [token]);

  const handleFetchOrders = async () => {
    if (token) {
    await fetchOrders();
    }
  }



  // Build a flat list of order items:
  const orderItems = orders
    .flatMap((order) =>
      order.items.map((item) => ({
        // original item fields
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice,
        // find product cover image
        image:
          products.find((p) => p._id === item.product)?.coverImage?.url || "",
        // from order
        status: order.status,
        paymentMethod: order.paymentDetail.method,
        date: order.createdAt,
      }))
    )
    .reverse();

  return (
    <div
      className={`border-t pt-16 ${
         "bg-white text-gray-700"
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-8">
        <div className="text-2xl">
          <Title text1="MY" text2="ORDERS" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {orderItems.map((item, idx) => (
          <div
            key={idx}
            className={`py-4 border-t border-b px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
               "border-gray-300"
            }`}
          >
            {/* Left: Image & details */}
            <div className="flex items-start gap-6 text-sm">
              {item.image && (
                <img
                  className="w-16 sm:w-20 object-cover"
                  src={item.image}
                  alt={item.name}
                />
              )}
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base">
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Status & refresh */}
            <div className="md:w-1/2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`block w-2 h-2 rounded-full ${
                    item.status === "Delivered"
                      ? "bg-green-500"
                      : item.status === "Shipped"
                      ? "bg-yellow-400"
                      : "bg-blue-400"
                  }`}
                />
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={handleFetchOrders}
                className={`border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100`}
              >
                Refresh
              </button>
            </div>
          </div>
        ))}

        {orderItems.length === 0 && (
          <p className="text-center text-gray-500">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
