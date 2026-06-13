// src/pages/Login.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

/* ── Reusable input with leading icon ───────────────────── */
const Field = ({ icon, trailing, ...props }) => (
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      {...props}
      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-800 outline-none transition-all focus:border-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-800/10"
    />
    {trailing && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        {trailing}
      </span>
    )}
  </div>
);

/* ── Segmented 6-digit OTP input ────────────────────────── */
const OtpInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  const setAt = (i, char) => {
    const arr = value.padEnd(6, " ").slice(0, 6).split("");
    arr[i] = char || " ";
    onChange(arr.join("").replace(/\s+$/g, "").trimEnd());
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    setAt(i, char);
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i].trim()) {
        setAt(i, "");
      } else if (i > 0) {
        setAt(i - 1, "");
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 w-full" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-semibold text-gray-800 outline-none transition-all focus:border-gray-800 focus:bg-white focus:ring-2 focus:ring-gray-800/10"
        />
      ))}
    </div>
  );
};

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("Login"); // "Login" | "Sign Up" | "Forgot"
  const [forgotStep, setForgotStep] = useState(1); // 1=email → 2=otp → 3=reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const goToState = (state) => {
    setCurrentState(state);
    setForgotStep(1);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentState === "Forgot" && forgotStep === 2 && otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      if (currentState === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
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
          password,
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
          const { data } = await axios.post(
            `${backendUrl}/api/user/forgot-password`,
            { email }
          );
          if (data.success) {
            toast.success("OTP sent! Check your email.");
            setForgotStep(2);
          } else {
            toast.error(data.message);
          }
        } else if (forgotStep === 2) {
          // verify OTP
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-otp`,
            { email, otp }
          );
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
            const { data } = await axios.post(
              `${backendUrl}/api/user/reset-password`,
              { email, otp, newPassword }
            );
            if (data.success) {
              toast.success("Password reset! Please login.");
              goToState("Login");
              setPassword("");
              setOtp("");
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

  /* ── Heading / subtitle per screen ──────────────────── */
  const heading =
    currentState === "Sign Up"
      ? "Create your account"
      : currentState === "Login"
      ? "Welcome back"
      : forgotStep === 1
      ? "Forgot password"
      : forgotStep === 2
      ? "Verify your email"
      : "Set a new password";

  const subtitle =
    currentState === "Sign Up"
      ? "Join NavSwara and start shopping"
      : currentState === "Login"
      ? "Sign in to continue to NavSwara"
      : forgotStep === 1
      ? "Enter your email to receive a one-time code"
      : forgotStep === 2
      ? `We sent a 6-digit code to ${email || "your email"}`
      : "Choose a strong password you'll remember";

  const buttonLabel =
    currentState === "Sign Up"
      ? "Create account"
      : currentState === "Login"
      ? "Sign in"
      : forgotStep === 1
      ? "Send OTP"
      : forgotStep === 2
      ? "Verify OTP"
      : "Reset password";

  /* ── Forgot-flow step indicator ─────────────────────── */
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 w-full">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              forgotStep >= s
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`h-[2px] w-8 rounded ${
                forgotStep > s ? "bg-gray-900" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60 sm:p-10">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img src={assets.logo} alt="NavSwara" className="h-10 w-auto" />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="prata-regular text-2xl font-semibold text-gray-900">
              {heading}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          {currentState === "Forgot" && (
            <div className="mb-6">
              <StepIndicator />
            </div>
          )}

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {/* Sign Up: Name */}
            {currentState === "Sign Up" && (
              <Field
                icon={<UserOutlined />}
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full name"
                required
              />
            )}

            {/* Email — shown everywhere except OTP & reset steps */}
            {!(currentState === "Forgot" && forgotStep >= 2) && (
              <Field
                icon={<MailOutlined />}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email address"
                required
              />
            )}

            {/* Login & Sign Up: Password */}
            {(currentState === "Login" || currentState === "Sign Up") && (
              <>
                <Field
                  icon={<LockOutlined />}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </button>
                  }
                />
                {currentState === "Login" && (
                  <div className="-mt-1 text-right">
                    <button
                      type="button"
                      onClick={() => goToState("Forgot")}
                      className="text-xs font-medium text-gray-500 hover:text-gray-900"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Forgot Step 2: OTP */}
            {currentState === "Forgot" && forgotStep === 2 && (
              <OtpInput value={otp} onChange={setOtp} />
            )}

            {/* Forgot Step 3: New & Confirm */}
            {currentState === "Forgot" && forgotStep === 3 && (
              <>
                <Field
                  icon={<LockOutlined />}
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  required
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-gray-400 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )}
                    </button>
                  }
                />
                <Field
                  icon={<LockOutlined />}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                />
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <LoadingOutlined spin />}
              {loading ? "Please wait…" : buttonLabel}
            </button>

            {/* Resend OTP */}
            {currentState === "Forgot" && forgotStep === 2 && (
              <button
                type="button"
                disabled={loading}
                onClick={() => setForgotStep(1)}
                className="text-center text-xs text-gray-500 hover:text-gray-900"
              >
                Didn&apos;t get a code? Resend
              </button>
            )}
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center text-sm">
            {currentState === "Login" && (
              <p className="text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => goToState("Sign Up")}
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Create one
                </button>
              </p>
            )}
            {currentState === "Sign Up" && (
              <p className="text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => goToState("Login")}
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {currentState === "Forgot" && (
              <button
                onClick={() => goToState("Login")}
                className="inline-flex items-center gap-1 font-medium text-gray-500 hover:text-gray-900"
              >
                <ArrowLeftOutlined /> Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
