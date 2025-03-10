import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaAnglesRight, FaCalendar } from "react-icons/fa6";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const EditMovie = ({ isOpen, onClose, movie }) => {
  if (!isOpen) return null;

  const { getUserMovies, backendUrl } = useContext(AppContext);
  const [rating, setRating] = useState(movie.userRating ? movie.userRating : 0);
  const [watchTime, setWatchTime] = useState(
    movie.watchTime ? new Date(movie.watchTime) : new Date()
  );
  const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [description, setDescription] = useState(
    movie.description ? movie.description : ""
  );
  const [watchTimeError, setWatchTimeError] = useState(false);

  const editMovie = async () => {
    if (!watchTime) {
      setWatchTimeError(true);
      return;
    }
    setWatchTimeError(false);

    try {
      await axios.put(`${backendUrl}/api/user/update-movie`, {
        movieId: movie._id,
        tmdbId: movie.tmdbId,
        title: movie.title,
        posterPath: movie.posterPath,
        watchTime: watchTime.toISOString(),
        userRating: rating,
        description,
      });

      getUserMovies();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const getHSLColor = (value) => {
    const hue = (value * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
  };

  const getRatingColor = (rating) => {
    const normalizedRating = rating >= 0 && rating <= 5 ? rating / 5 : 0;
    return getHSLColor(normalizedRating);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white dark:bg-medium-black p-1 rounded-2xl shadow-xl w-full max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 transition-all duration-200 dark:hover:text-gray-100 cursor-pointer"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <div className="dark:bg-medium-black rounded-2xl">
          <div className="pl-4 pr-6 pt-4">
            <h1 className="font-semibold text-xl dark:text-gray-100">
              {movie.title}
            </h1>
            <p className="text-sm text-light-black dark:text-gray-400">
              Add movie
            </p>
          </div>

          <hr className="my-1 text-white dark:text-medium-black" />

          <div className="p-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Your Rating:{" "}
                  <span className="text-base text-dark-black dark:text-gray-100 font-semibold">
                    {rating.toFixed(1)}
                  </span>
                </label>
                <div className="relative flex items-center">
                  {rating === 0 && (
                    <div className="absolute flex justify-center items-center gap-1 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900 text-sm pointer-events-none animate-pulse">
                      Drag to Rate <FaAnglesRight />
                    </div>
                  )}

                  <input
                    type="range"
                    min="0"
                    max="5" // Changed max from 10 to 5
                    step="0.1" // Adjusted for half-star ratings
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-9 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${getRatingColor(
                        rating
                      )} ${rating * 20}%, #ddd ${rating * 20}%)`, // Updated percentage
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Watch Date
                </label>
                <div className="relative">
                  <div
                    onClick={() => setIsCalendarShown((prev) => !prev)}
                    className={`w-full bg-gray-200 dark:bg-light-black rounded-lg py-2 px-4 relative flex items-center cursor-pointer 
                              ${
                                isCalendarShown
                                  ? "border border-blue-800"
                                  : "border dark:border-light-black border-gray-200"
                              } 
                              ${
                                watchTime
                                  ? "dark:text-gray-200"
                                  : "text-gray-500 dark:text-gray-300"
                              } 
                              ${
                                watchTimeError
                                  ? "border border-red-500 dark:border-red-500"
                                  : "mb-2"
                              }`}
                  >
                    <p className="text-md">
                      {watchTime ? formatDate(watchTime) : "Select a date"}
                    </p>
                    <FaCalendar className="absolute right-4" />
                  </div>
                  {watchTimeError && (
                    <p className="text-sm text-red-500">
                      Watch time is required
                    </p>
                  )}
                  {isCalendarShown && (
                    <div className="absolute flex justify-center items-center left-0 right-0 z-10 mt-1">
                      <DayPicker
                        mode="single"
                        selected={watchTime}
                        onSelect={(date) => {
                          setWatchTime(date);
                          setIsCalendarShown(false);
                          setWatchTimeError(false);
                        }}
                        className="rounded-xl bg-white custom-shadow px-4 py-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 py-2 px-4 outline-none rounded-lg bg-gray-200 dark:bg-light-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  placeholder="Enter a description"
                />
              </div>
            </div>
          </div>

          <hr className="my-1 text-white dark:text-medium-black" />

          <div className="w-full flex justify-end items-center gap-2 px-4 pb-4">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-md text-sm bg-gray-200 border border-gray-300 text-dark-black transition-all duration-300 cursor-pointer dark:text-white dark:bg-light-black dark:border-none "
            >
              Cancel
            </button>
            <button
              onClick={() => editMovie()}
              className="py-2 px-4 rounded-md text-sm bg-dark-blue transition-all duration-300 text-white cursor-pointer"
            >
              Update movie
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditMovie;
