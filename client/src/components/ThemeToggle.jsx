import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full cursor-pointer bg-gray-200 dark:bg-light-black transition-all duration-300"
    >
      {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
