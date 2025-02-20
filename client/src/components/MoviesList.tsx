import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";

const MoviesList = () => {
  const { userMovies } = useContext(AppContext);

  return (
    <div>
      {userMovies.map((movie) => (
        <h1 key={movie.imdbId}>
          <MovieCard movie={movie} />
        </h1>
      ))}
    </div>
  );
};

export default MoviesList;
