import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const inputRefs = useRef([]);

  const validatePassword = (password) => {
    return /^(?=.*\d).{6,}$/.test(password);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!validatePassword(newPassword))
      newErrors.password =
        "Password must be at least 6 characters and contain a number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    const otpArray = inputRefs.current.map((input) => input.value);
    if (otpArray.every((digit) => digit !== "")) {
      setTimeout(() => onSubmitOtp(e), 500);
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

      setTimeout(() => onSubmitOtp(e), 500);
    } else {
      toast.error("Invalid OTP format");
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        let newErrors = {};
        newErrors.email = data.message;
        setErrors(newErrors);
      }
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingEmail(false);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otp = otpArray.join("");
    setOtp(otp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoadingPassword(true);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full dark:bg-medium-black">
      {/* Left Side */}
      <div className="w-1/2 h-screen flex items-center justify-center p-5">
        <div className=" w-full h-full rounded-xl bg-gradient-to-br from-blue-700 to-gray-900 relative">
          <div
            onClick={() => navigate("/login")}
            className="absolute bg-gray-200/20 hover:bg-gray-200/30 transition-all duration-300 backdrop-blur-lg top-5 right-5 py-2 px-4 rounded-2xl text-white font-light flex items-center justify-center gap-2 cursor-pointer"
          >
            Back to log in
            <FaArrowRight />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 h-screen flex items-center justify-center p-5 relative">
        {/* Email form */}
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="w-full h-full max-w-md p-5 flex flex-col justify-center "
          >
            <h1 className="text-4xl text-black dark:text-gray-200 font-medium text-left w-full mb-4">
              Reset password
            </h1>
            <p className="text-gray-800 dark:text-gray-400 w-full text-left font-light mb-8">
              Enter your registered email address
            </p>
            <div className="mb-4">
              <input
                className={`outline-none border ${
                  errors.email ? "border-red-500" : "border-transparent"
                } dark:bg-light-black dark:text-gray-200 dark:placeholder:text-gray-400 w-full px-5 py-2.5 rounded-md bg-gray-200`}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                onClick={() => setErrors({})}
                value={email}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <button
              className="w-full py-2.5 rounded-md mt-2 bg-blue-800 hover:bg-blue-950 transition-all duration-300 text-white cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={loadingEmail || errors.email}
            >
              {loadingEmail ? "Sending..." : "Send reset code"}
            </button>
          </form>
        )}
        {/* Reset code form */}
        {!isOtpSubmitted && isEmailSent && (
          <form className="w-full h-full max-w-md p-5 flex flex-col justify-center items-start">
            <h1 className="text-4xl text-black dark:text-gray-200 font-medium text-left w-full mb-4">
              Reset password
            </h1>
            <p className="text-gray-800 dark:text-gray-400 w-full text-left font-light mb-8">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold">{email}</span>
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
                    className="w-12 h-14 border border-gray-400 dark:text-gray-200 outline-none text-center text-xl font-bold rounded-md"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>
          </form>
        )}
        {/* New password form */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="w-full h-full max-w-md p-5 flex flex-col justify-center"
          >
            <h1 className="text-4xl text-black dark:text-gray-200 font-medium text-left w-full mb-4">
              Reset password
            </h1>
            <p className="text-gray-800  dark:text-gray-400 w-full text-left font-light mb-6">
              Enter new password
            </p>
            <div className="mb-3">
              <div className="relative w-full">
                <input
                  className={`outline-none border ${
                    errors.password ? "border-red-500" : "border-transparent"
                  } dark:bg-light-black dark:text-gray-200 dark:placeholder:text-gray-400 w-full px-5 py-2.5 rounded-md bg-gray-200 pr-10`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  onClick={() => setErrors({})}
                  value={newPassword}
                  required
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

            <button
              className="w-full py-2.5 rounded-md mt-2 bg-blue-800 hover:bg-blue-950 transition-all duration-300 text-white cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={loadingPassword || errors.password}
            >
              {loadingPassword ? "Resetting..." : "Submit"}
            </button>
          </form>
        )}
        <div className="absolute bottom-14 transform -translate-y-1/2 w-1/3 flex items-center justify-between">
          <div
            className={`w-16 h-2 rounded-full ${
              !isEmailSent ? "bg-blue-800" : "bg-gray-300 dark:bg-gray-600"
            }`}
          ></div>
          <div
            className={`w-16 h-2 rounded-full  ${
              !isOtpSubmitted && isEmailSent
                ? "bg-blue-800"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          ></div>
          <div
            className={`w-16 h-2 rounded-full ${
              isOtpSubmitted && isEmailSent
                ? "bg-blue-800"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
