import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
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
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-24 py-4 absolute top-0 bg-gray-100 dark:bg-medium-black transition-all duration-500">
      <img src="/MovieVault_logo.png" className="w-10 h-10" />
      <SearchBar />
      <div className="flex items-center justify-center gap-3">
        {userData ? (
          <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-800 text-white relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-1 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded-md">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify email
                  </li>
                )}

                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="p-2.5 px-5 rounded-md  bg-blue-800 hover:bg-blue-950 transition-all duration-300 text-white cursor-pointer"
          >
            Log in
          </button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
