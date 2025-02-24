import React, { useContext, useState } from "react";
import { FaTrash, FaEdit, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im"; // Import the spinner
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import MovieDetail from "./MovieDetail";
import UpdateMovie from "./UpdateMovie";

const MovieCard = ({ movie }) => {
  const { backendUrl, getUserMovies } = useContext(AppContext);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const rating = movie.userRating || 0;

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(
          <FaStar key={i} className="text-gray-100 dark:text-gray-500" />
        );
      }
    }

    return stars;
  };

  const handleRemove = async (movieId) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/user/delete-movie`, {
        data: { movieId },
      });
      if (!res.data.success) {
        toast.error(res.data.message);
      }
      getUserMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete movie");
    }
  };

  const fetchMovieDetail = async (movieId) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/movies/movie-detail`,
        { movieId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMovieDetail(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-light-black px-4 py-3 rounded-2xl relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white bg-opacity-75 dark:bg-light-black dark:bg-opacity-75 z-10">
          <ImSpinner2 className="animate-spin text-gray-600" size={30} />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1
            onClick={() => fetchMovieDetail(movie.tmdbId)}
            className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 cursor-pointer"
          >
            {movie.title}
          </h1>
          <div className="flex justify-center items-center gap-2 pl-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-full text-gray-600 dark:text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-300 duration-200 cursor-pointer"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => handleRemove(movie._id)}
              className="rounded-full text-gray-600 dark:text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-300 duration-200 cursor-pointer"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
        <hr className="mt-2 text-gray-200 dark:text-gray-600" />
        <div className="w-full flex items-center justify-center my-4">
          <img
            onClick={() => fetchMovieDetail(movie.tmdbId)}
            src={
              movie.posterPath
                ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                : "/default_poster.jpg"
            }
            alt={movie.title}
            className="w-28 h-40 object-cover rounded-lg shadow-card cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 dark:text-gray-300 rounded-xl text-sm">
            Rating
          </p>
          <div className="flex justify-center items-center gap-2">
            <p className="text-sm font-semibold dark:text-gray-100">{rating}</p>
            <div className="flex items-center">{renderStars(rating)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-700 dark:text-gray-300 rounded-xl text-sm">
            Watched on
          </p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">
            {formatDate(new Date(movie.watchTime))}
          </p>
        </div>
      </div>
      {isDetailModalOpen && (
        <MovieDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          movie={movieDetail}
        />
      )}
      {isEditModalOpen && (
        <UpdateMovie
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          movie={movie}
        />
      )}
    </div>
  );
};

export default MovieCard;
