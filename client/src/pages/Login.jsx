import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full dark:bg-dark-black">
      {/* Left Side */}
      <div className="w-1/2 h-screen flex items-center justify-center p-5">
        <div className=" w-full h-full rounded-xl bg-gradient-to-br from-blue-700 to-gray-900 relative">
          <div
            onClick={() => navigate("/")}
            className="absolute bg-gray-200/20 hover:bg-gray-200/30 transition-all duration-300 backdrop-blur-lg top-5 right-5 py-2 px-4 rounded-2xl text-white font-light flex items-center justify-center gap-2 cursor-pointer"
          >
            Back to website
            <FaArrowRight />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 h-screen flex items-center justify-center p-5">
        <div className="w-full h-full max-w-md p-5 flex flex-col justify-center items-center">
          <h1 className="text-4xl text-black dark:text-gray-200 font-medium text-left w-full mb-6">
            {isLogin ? "Log In" : "Create an account"}
          </h1>

          <p className="text-gray-800 dark:text-gray-400 w-full text-left font-light mb-10">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => {
                setIsLogin((prev) => !prev);
                setEmail("");
                setPassword("");
              }}
              className="text-blue-800 hover:text-blue-900 transition-all duration-300 cursor-pointer underline"
            >
              {isLogin ? "Sign up here" : "Log in here"}
            </span>
          </p>

          <form onSubmit={onSubmitHandler} className="w-full">
            {!isLogin && (
              <input
                className="outline-none dark:bg-medium-black dark:text-gray-200 dark:placeholder:text-gray-600 mb-4 w-full px-5 py-2.5 rounded-md bg-gray-200"
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            )}

            <input
              className="outline-none dark:bg-medium-black dark:text-gray-200 dark:placeholder:text-gray-600 mb-4 w-full px-5 py-2.5 rounded-md bg-gray-200"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />

            {/* Password Field with Toggle */}
            <div className="relative w-full mb-3">
              <input
                className="outline-none dark:bg-medium-black dark:text-gray-200 dark:placeholder:text-gray-600 w-full px-5 py-2.5 rounded-md bg-gray-200 pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 dark:hover:text-gray-400 transition-all duration-200"
              >
                {showPassword ? (
                  <FaEyeSlash className="cursor-pointer" />
                ) : (
                  <FaEye className="cursor-pointer" />
                )}
              </button>
            </div>

            {isLogin && (
              <div className="text-blue-800 hover:text-blue-900 transition-all duration-300">
                <span
                  onClick={() => navigate("/reset-password")}
                  className="cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            )}

            <button className="w-full py-2.5 rounded-md mt-10 bg-blue-800 hover:bg-blue-950 transition-all duration-300 text-white cursor-pointer">
              {isLogin ? "Log in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
