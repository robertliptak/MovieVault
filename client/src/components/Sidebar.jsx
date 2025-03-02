import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFilm, FaTv } from "react-icons/fa6";

const Sidebar = () => {
  const navigate = useNavigate();
  const { userData, isLoggedIn, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-6 dark:bg-medium-black flex flex-col justify-between fixed left-0 top-0 transition-all duration-500">
      <div>
        <h1 className="text-black dark:text-white text-xl">MovieVault</h1>
        <div className=" pt-10">
          <div className="py-2 px-4 bg-gray-300/50 dark:bg-light-black rounded-md flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-300/50 dark:hover:bg-light-black transition-all duration-200">
            <FaFilm className="dark:text-white" />
            <p className="dark:text-white">Movies</p>
          </div>
          <div className="py-2 px-4 rounded-md flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-300/50 dark:hover:bg-light-black transition-all duration-200">
            <FaTv className="dark:text-white" />
            <p className="dark:text-white">Series</p>
          </div>
        </div>
      </div>
      <div>
        <hr className="text-gray-300 dark:text-gray-600 mb-3" />
        {isLoggedIn ? (
          <h1
            onClick={() => logout()}
            className="dark:text-white cursor-pointer hover:text-dark-blue dark:hover:text-light-blue transition-all duration-200"
          >
            Log out
          </h1>
        ) : (
          <h1
            onClick={() => navigate("/login")}
            className="dark:text-white cursor-pointer hover:text-dark-blue dark:hover:text-light-blue transition-all duration-200"
          >
            Log in
          </h1>
        )}
        {isLoggedIn && userData && !userData.isAccountVerified && (
          <h1
            onClick={() => sendVerificationOtp()}
            className="dark:text-white cursor-pointer hover:text-dark-blue dark:hover:text-light-blue transition-all duration-200 mt-2"
          >
            Verify email
          </h1>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
