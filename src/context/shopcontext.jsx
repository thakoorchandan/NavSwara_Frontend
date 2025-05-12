// frontend/src/context/shopcontext.jsx

import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // — GLOBAL LOADING STATE —
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  // combined flag
  const loading =
    loadingProducts ||
    loadingCart ||
    loadingAddresses ||
    loadingPayments ||
    loadingOrders;

  // Load token from localStorage, if any
  const [token, _setToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);

  // Helper to build auth headers
  const authHeaders = (tok) => {
    const t = tok || token;
    return t ? { headers: { token: t } } : {};
  };

  // Persist token + fetch user data when setting
  const setToken = (t) => {
    _setToken(t);
    if (t) {
      localStorage.setItem("token", t);
      getUserCart(t);
      fetchAddresses(t);
      fetchPayments(t);
      fetchOrders(t);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
      setAddresses([]);
      setPayments([]);
      setOrders([]);
      setProfile(null);
    }
  };

  // — PROFILE —
  const fetchProfile = async (tok = token) => {
    if (!tok) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/me`, {
        headers: { token: tok },
      });
      if (data.success) setProfile(data.user);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  // — PRODUCTS —
  const getProductsData = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // — CART —
  const getUserCart = async (tok) => {
    const headers = authHeaders(tok);
    if (!headers.headers) return;
    setLoadingCart(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        headers
      );
      if (data.success) {
        setCartItems(data.cartData || {});
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // Local update
    setCartItems((prev) => {
      const c = { ...prev };
      c[itemId] = c[itemId] || {};
      c[itemId][size] = (c[itemId][size] || 0) + 1;
      return c;
    });
    // Server sync
    setLoadingCart(true);
    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        authHeaders()
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not sync cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    // Local update
    setCartItems((prev) => {
      const c = { ...prev };
      if (quantity <= 0) {
        delete c[itemId][size];
        if (!Object.keys(c[itemId] || {}).length) {
          delete c[itemId];
        }
      } else {
        c[itemId] = c[itemId] || {};
        c[itemId][size] = quantity;
      }
      return c;
    });
    // Server update
    setLoadingCart(true);
    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        authHeaders()
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not update cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce(
      (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + b, 0),
      0
    );

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((sum, [pid, sizes]) => {
      const prod = products.find((p) => p._id === pid);
      if (!prod) return sum;
      return (
        sum +
        Object.entries(sizes).reduce((s, [, qty]) => s + prod.price * qty, 0)
      );
    }, 0);

  // — ADDRESSES —
  const fetchAddresses = async (tok) => {
    setLoadingAddresses(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/me/addresses`,
        authHeaders(tok)
      );
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const addAddress = async (address) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/me/addresses`,
        address,
        authHeaders()
      );
      if (data.success) {
        setAddresses((prev) => [...prev, data.address]);
        toast.success("Address added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not add address");
    }
  };

  const updateAddress = async (index, updates) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/me/addresses/${index}`,
        updates,
        authHeaders()
      );
      if (data.success) {
        setAddresses((prev) =>
          prev.map((a, i) => (i === +index ? data.address : a))
        );
        toast.success("Address updated");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update address");
    }
  };

  const deleteAddress = async (index) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/me/addresses/${index}`,
        authHeaders()
      );
      if (data.success) {
        setAddresses((prev) => prev.filter((_, i) => i !== +index));
        toast.success("Address removed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not delete address");
    }
  };

  // — PAYMENT METHODS —
  const fetchPayments = async (tok) => {
    setLoadingPayments(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/me/payments`,
        authHeaders(tok)
      );
      if (data.success) {
        setPayments(data.paymentMethods);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment methods");
    } finally {
      setLoadingPayments(false);
    }
  };

  const addPaymentMethod = async (method) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/me/payments`,
        method,
        authHeaders()
      );
      if (data.success) {
        setPayments((prev) => [...prev, data.paymentMethod]);
        toast.success("Payment method added");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not add payment method");
    }
  };

  const deletePaymentMethod = async (index) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/me/payments/${index}`,
        authHeaders()
      );
      if (data.success) {
        setPayments((prev) => prev.filter((_, i) => i !== +index));
        toast.success("Payment method removed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not delete payment method");
    }
  };

  // — ORDERS —
  const fetchOrders = async (tok) => {
    setLoadingOrders(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/me/orders`,
        authHeaders(tok)
      );
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Effects
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
      fetchAddresses();
      fetchPayments();
      fetchOrders();
      fetchProfile();
    }
  }, [token]);

  return (
    <ShopContext.Provider
      value={{
        backendUrl,
        currency,
        delivery_fee,
        token,
        setToken,
        profile,
        fetchProfile,
        products,
        cartItems,
        addToCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        addresses,
        addAddress,
        fetchAddresses,
        updateAddress,
        deleteAddress,
        payments,
        addPaymentMethod,
        deletePaymentMethod,
        orders,
        fetchOrders,
        navigate,
        // expose combined loading flag
        loading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
