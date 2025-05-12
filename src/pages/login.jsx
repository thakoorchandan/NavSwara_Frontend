// src/pages/Login.jsx
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login"); // "Login" | "Sign Up" | "Forgot"
  const [forgotStep, setForgotStep]       = useState(1);     // 1=email → 2=otp → 3=reset
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [otp, setOtp]                     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme]                 = useState("light");
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.error(data.message);
        }
      } else if (currentState === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.error(data.message);
        }
      } else if (currentState === "Forgot") {
        if (forgotStep === 1) {
          // request OTP
          const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
          if (data.success) {
            toast.success("OTP sent! Check your email.");
            setForgotStep(2);
          } else {
            toast.error(data.message);
          }
        } else if (forgotStep === 2) {
          // verify OTP
          const { data } = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });
          if (data.success) {
            toast.success("OTP verified! Enter new password.");
            setForgotStep(3);
          } else {
            toast.error(data.message);
          }
        } else if (forgotStep === 3) {
          if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
          } else {
            const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
              email,
              otp,
              newPassword
            });
            if (data.success) {
              toast.success("Password reset! Please login.");
              // back to login
              setCurrentState("Login");
              setForgotStep(1);
              setPassword("");
            } else {
              toast.error(data.message);
            }
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark"
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-800"}`}>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className={`border-none h-[1.5px] w-8 ${theme === "dark"
            ? "bg-gray-300"
            : "bg-gray-800"}`} />
        </div>

        {/* Sign Up: Name */}
        {currentState === "Sign Up" && (
          <input
            onChange={e => setName(e.target.value)}
            value={name}
            type="text"
            className={`w-full px-3 py-2 ${theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-800"}`}
            placeholder="Name"
            required
          />
        )}

        {/* Always show Email */}
        <input
          onChange={e => setEmail(e.target.value)}
          value={email}
          type="email"
          className={`w-full px-3 py-2 ${theme === "dark"
            ? "bg-gray-700 border-gray-600 text-white"
            : "border-gray-800"}`}
          placeholder="Email"
          required
        />

        {/* Login & Sign Up: Password */}
        {(currentState === "Login" || currentState === "Sign Up") && (
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            className={`w-full px-3 py-2 ${theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-800"}`}
            placeholder="Password"
            required
          />
        )}

        {/* Forgot Step 2: OTP */}
        {currentState === "Forgot" && forgotStep === 2 && (
          <input
            onChange={e => setOtp(e.target.value)}
            value={otp}
            type="text"
            maxLength={6}
            className={`w-full px-3 py-2 ${theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "border-gray-800"}`}
            placeholder="Enter OTP"
            required
          />
        )}

        {/* Forgot Step 3: New & Confirm */}
        {currentState === "Forgot" && forgotStep === 3 && (
          <>
            <input
              onChange={e => setNewPassword(e.target.value)}
              value={newPassword}
              type="password"
              className={`w-full px-3 py-2 ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-800"}`}
              placeholder="New Password"
              required
            />
            <input
              onChange={e => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              className={`w-full px-3 py-2 ${theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "border-gray-800"}`}
              placeholder="Confirm Password"
              required
            />
          </>
        )}

        <div className="w-full flex justify-between text-sm -mt-2">
          {currentState === "Forgot" ? (
            <p
              onClick={() => {
                setCurrentState("Login");
                setForgotStep(1);
              }}
              className="cursor-pointer"
            >
              Back to Login
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Forgot")}
              className="cursor-pointer"
            >
              Forgot your password
            </p>
          )}

          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer"
            >
              Create account
            </p>
          ) : currentState === "Sign Up" ? (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer"
            >
              Login Here
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 font-light px-8 py-2 ${theme === "dark"
            ? "bg-gray-700 text-white"
            : "bg-black text-white"}`}
        >
          {loading
            ? "Please wait..."
            : currentState === "Sign Up"
            ? "Sign Up"
            : currentState === "Login"
            ? "Sign In"
            : forgotStep === 1
            ? "Send OTP"
            : forgotStep === 2
            ? "Verify OTP"
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Login;
