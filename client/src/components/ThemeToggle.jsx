import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full cursor-pointer transition-all duration-300"
    >
      {theme === "dark" ? (
        <IoSunnyOutline className="text-white text-2xl hover:text-light-blue transition-all duration-300" />
      ) : (
        <FaMoon className="hover:text-dark-blue transition-all duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
