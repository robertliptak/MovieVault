import React from "react";

const MovieCard = ({ movie }) => {
  return (
    <div className="mb-2 p-2 rounded border bg-gray-200 flex gap-2">
      <img
        src={
          movie.posterPath
            ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
            : "/default_poster.jpg"
        }
        alt={movie.title}
        className="w-24 h-32 object-cover rounded cursor-pointer"
      />
      <div>
        <h1>{movie.title}</h1>
        <h1>{movie.userRating}</h1>
        <h1>{movie.description ? movie.description : "No description"}</h1>
      </div>
    </div>
  );
};

export default MovieCard;
