import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";

const EmailVerify = () => {
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpArray = inputRefs.current.map((input) => input.value);
    if (otpArray.every((digit) => digit !== "")) {
      setTimeout(() => onSubmitHandler(e), 500);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && (e.target.value === "") & (index > 0)) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();

    if (paste.length === 6 && /^\d+$/.test(paste)) {
      paste.split("").forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });

      setTimeout(() => onSubmitHandler(e), 500);
    } else {
      toast.error("Invalid OTP format");
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex min-h-screen w-full">
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
      <div className="w-1/2 h-screen flex items-center justify-center p-5 relative">
        <form className="w-full h-full max-w-md p-5 flex flex-col justify-center items-start">
          <h1 className="text-4xl text-black font-medium text-left w-full mb-4">
            Email Verification
          </h1>
          <p className="text-gray-800 w-full text-left font-light mb-8">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold">{userData.email}</span>
          </p>
          <div
            className="flex justify-between mb-6 gap-2"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-14 border border-gray-400 text-center text-xl font-bold rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
