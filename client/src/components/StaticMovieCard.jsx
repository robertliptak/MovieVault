import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StaticMovieCard = ({ movie }) => {
  const rating = movie.userRating || 0;

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

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  return (
    <div className="bg-white dark:bg-light-black px-4 py-3 rounded-2xl relative">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {movie.title}
          </h1>
        </div>
        <hr className="mt-2 text-gray-200 dark:text-gray-600" />
        <div className="w-full flex items-center justify-center my-4">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-28 h-40 object-cover rounded-lg shadow-card dark:shadow-card-dark"
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
    </div>
  );
};

export default StaticMovieCard;
