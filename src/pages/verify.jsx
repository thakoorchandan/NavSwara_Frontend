// src/pages/Verify.jsx

import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/shopcontext";
import Title from "../components/title";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);

  const [status, setStatus] = useState("loading"); // 'loading' | 'error' | 'success'
  const [error, setError]   = useState("");

  useEffect(() => {
    const orderId    = searchParams.get("orderId");
    const session_id = searchParams.get("session_id");

    if (!orderId || !session_id) {
      setError("Missing orderId or session_id in URL");
      setStatus("error");
      return;
    }

    axios
      .post(
        `${backendUrl}/api/order/verifyStripe`,
        { orderId, session_id },
        { headers: { token } }
      )
      .then((res) => {
        if (res.data.success) {
          // only clear cart once payment is truly confirmed
          setCartItems({});
          setStatus("success");
        } else {
          setError(res.data.message || "Verification failed");
          setStatus("error");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setStatus("error");
      });
  }, [backendUrl, token, searchParams, setCartItems]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Verifying payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => navigate("/cart")}
          className="px-6 py-3 bg-black text-white rounded"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  // success
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 px-4 text-center">
      <Title text1="PAYMENT" text2="SUCCESS" />
      <p className="text-lg">Your order has been placed successfully!</p>
      <button
        onClick={() => navigate("/orders")}
        className="px-6 py-3 bg-black text-white rounded"
      >
        View My Orders
      </button>
    </div>
  );
};

export default Verify;
