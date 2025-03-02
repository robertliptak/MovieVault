import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LeftSide from "../components/LeftSide";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, setIsLoggedIn, getUserData } =
    useContext(AppContext);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*\d).{6,}$/.test(password);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!isLogin) {
      if (!name.trim()) newErrors.name = "Name cannot be empty";
    }
    if (!validateEmail(email)) newErrors.email = "Invalid email address";
    if (!validatePassword(password))
      newErrors.password =
        "Password must be at least 6 characters and contain a number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!isLogin && !validateForm()) return;
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        let newErrors = {};
        newErrors.email = data.message;
        newErrors.name = data.message;
        newErrors.password = data.message;
        setErrors(newErrors);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex min-h-screen w-full dark:bg-medium-black">
      <LeftSide />
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
                setErrors({});
              }}
              className="text-dark-blue hover:text-blue-700 transition-all duration-300 cursor-pointer underline"
            >
              {isLogin ? "Sign up here" : "Log in here"}
            </span>
          </p>

          <form onSubmit={onSubmitHandler} className="w-full">
            {!isLogin && (
              <input
                className={`outline-none border ${
                  errors.name ? "border-red-500" : "border-transparent"
                } dark:bg-light-black dark:text-gray-200 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-5 py-2.5 rounded-md bg-gray-200 mb-2`}
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                onClick={() => setErrors({})}
                value={name}
              />
            )}

            <input
              className={`outline-none border ${
                errors.email ? "border-red-500" : "border-transparent"
              } dark:bg-light-black dark:text-gray-200 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-5 py-2.5 rounded-md bg-gray-200 mb-2`}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onClick={() => setErrors({})}
              value={email}
            />

            <div className="mb-2">
              <div className="relative w-full ">
                <input
                  className={`outline-none border ${
                    errors.password ? "border-red-500" : "border-transparent"
                  } dark:bg-light-black dark:text-gray-200 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-5 py-2.5 rounded-md bg-gray-200 pr-10`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={() => setErrors({})}
                  value={password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200"
                >
                  {showPassword ? (
                    <FaEyeSlash className="cursor-pointer" />
                  ) : (
                    <FaEye className="cursor-pointer" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {isLogin && (
              <div className="text-dark-blue hover:text-blue-700 transition-all duration-300">
                <span
                  onClick={() => navigate("/reset-password")}
                  className="cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            )}

            <button
              className="w-full py-2.5 rounded-md mt-10 bg-dark-blue hover:bg-blue-700 transition-all duration-300 text-white cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? "Loading..." : isLogin ? "Log in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
