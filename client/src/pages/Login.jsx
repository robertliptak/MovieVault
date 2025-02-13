import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (isLogin) {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(error.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <h1
        onClick={() => navigate("/")}
        className="text-blue-500 text-2xl absolute left-5 sm:left-20 top-5 cursor-pointer"
      >
        MovieVault
      </h1>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300">
        <h1 className=" text-2xl font-semibold text-white text-center mb-3">
          {isLogin ? "Log In" : "Create an account"}
        </h1>
        <form onSubmit={onSubmitHandler}>
          {!isLogin && (
            <input
              className="mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          )}
          <input
            className="mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            className="mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <p
            onClick={() => navigate("/reset-password")}
            className="text-indigo-500 cursor-pointer mb-4"
          >
            Forgot password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
            {isLogin ? "Log in" : "Sign up"}
          </button>
        </form>
        {isLogin ? (
          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setIsLogin((prev) => !prev)}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setIsLogin((prev) => !prev)}
              className="text-blue-400 cursor-pointer underline"
            >
              Log in here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
