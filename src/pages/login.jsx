import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("light"); // Light theme by default

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
 
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className={`border-none h-[1.5px] w-8 ${theme === "dark" ? "bg-gray-300" : "bg-gray-800"}`} />
        </div>
        {currentState === "Login" ? (
          ""
        ) : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className={`w-full px-3 py-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "border-gray-800"}`}
            placeholder="Name"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className={`w-full px-3 py-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "border-gray-800"}`}
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className={`w-full px-3 py-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "border-gray-800"}`}
          placeholder="Password"
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password</p>
          {currentState === "Login" ? (
            <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState("Login")} className="cursor-pointer">
              Login Here
            </p>
          )}
        </div>
        <button
          className={`mt-4 font-light px-8 py-2 ${
            theme === "dark" ? "bg-gray-700 text-white" : "bg-black text-white"
          }`}
        >
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
