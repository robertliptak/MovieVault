import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const MovieDetail = ({ isOpen, onClose, movie }) => {
  const [isSummaryShowed, setIsSummaryShowed] = useState(false);

  if (!isOpen) return null;

  console.log(movie);

  const getFlagsFromCodes = (countryCodes) => {
    return countryCodes
      .map((code) => {
        if (code.toUpperCase() === "XC") return "🇨🇿";
        return code
          .toUpperCase()
          .split("")
          .map((char) =>
            String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
          )
          .join("");
      })
      .join(" ");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white dark:bg-light-black p-1 rounded-2xl shadow-xl w-full max-w-xl relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 transition-all duration-200 dark:hover:text-gray-100 cursor-pointer"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        <div className="bg-gray-100 dark:bg-medium-black rounded-2xl">
          <div className="p-4">
            <h1 className="font-semibold dark:text-gray-100">{movie.title}</h1>
            <p className="text-xs text-light-black dark:text-gray-400">
              Movie details
            </p>
          </div>
          <hr className="my-1 text-white dark:text-light-black" />
          <div className="flex gap-4 p-4">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/default_poster.jpg"
              }
              alt={movie.title}
              className="w-48 h-64 object-cover rounded"
            />
            {movie.omdbData ? (
              <div className="grid grid-cols-2 gap-x-0 gap-y-0 mb-4">
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Director
                </p>
                <p className="text-medium-black text-sm dark:text-gray-100">
                  {movie.omdbData.Director}
                </p>

                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Actors
                </p>
                <p className="text-medium-black text-sm dark:text-gray-100">
                  {movie.omdbData.Actors.split(", ").map((actor, index) => (
                    <span key={index} className="block">
                      {actor}
                    </span>
                  ))}
                </p>

                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Genre
                </p>
                <p className="text-medium-black text-sm dark:text-gray-100">
                  {movie.omdbData.Genre}
                </p>

                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Rating
                </p>
                <p
                  className={`
                        text-sm
                        ${
                          movie.omdbData.imdbRating === "N/A" &&
                          "text-medium-black dark:text-gray-100"
                        } 
                        ${
                          parseFloat(movie.omdbData.imdbRating) >= 7.5
                            ? "text-green-500"
                            : ""
                        }
                        ${
                          parseFloat(movie.omdbData.imdbRating) < 7.5 &&
                          parseFloat(movie.omdbData.imdbRating) >= 3.5
                            ? "text-orange-500"
                            : ""
                        }
                        ${
                          parseFloat(movie.omdbData.imdbRating) < 3.5
                            ? "text-red-500"
                            : ""
                        }
                    `}
                >
                  {movie.omdbData.imdbRating}
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Released
                </p>
                <p className="text-medium-black text-sm dark:text-gray-100">
                  {movie.omdbData.Released}
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Runtime
                </p>
                <p className="text-medium-black text-sm dark:text-gray-100">
                  {movie.omdbData.Runtime}
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Origin
                </p>
                <p className="text-medium-black text-lg dark:text-gray-100">
                  {getFlagsFromCodes(movie.origin_country)}
                </p>
              </div>
            ) : (
              <h1>No data available</h1>
            )}
          </div>
          {isSummaryShowed && (
            <div className="p-4 transition-all duration-300">
              <p className="text-sm text-medium-black dark:text-gray-100">
                {movie.overview}
              </p>
            </div>
          )}
          <hr className="my-1 text-white dark:text-light-black" />
          <div className="w-full flex justify-between items-center gap-2 p-4 ">
            <h1
              onClick={() => setIsSummaryShowed((prev) => !prev)}
              className="text-light-black dark:text-gray-300 dark:hover:text-gray-200 hover:text-medium-black text-sm cursor-pointer transition-all duration-200"
            >
              {isSummaryShowed ? "Hide" : "Show"} summary
            </h1>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-md text-sm bg-gray-200 border border-gray-300 text-dark-black hover:bg-gray-300 transition-all duration-300  cursor-pointer dark:text-white dark:bg-light-black dark:border-none dark:hover:bg-dark-black"
              >
                Cancel
              </button>
              <button className="py-2 px-4 rounded-md text-sm bg-blue-800 hover:bg-blue-950 transition-all duration-300 text-white cursor-pointer">
                Add movie
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieDetail;
