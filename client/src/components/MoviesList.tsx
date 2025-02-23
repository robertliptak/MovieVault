import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";

const MoviesList = () => {
  const { userMovies } = useContext(AppContext);

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 p-4">
      {userMovies.map((movie) => (
        <div key={movie.imdbId}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MoviesList;
