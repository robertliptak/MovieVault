import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";
import { LuSearch } from "react-icons/lu";
import { FaSort } from "react-icons/fa";

const MoviesList = () => {
  const { userMovies } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  const groupedMovies = userMovies.reduce((acc, movie) => {
    const date = new Date(movie.watchTime);
    const monthYear = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(movie);

    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedMovies).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });

  const filteredMovies = sortedMonths
    .map((monthYear) => {
      const sortedMovies = groupedMovies[monthYear].sort((a, b) => {
        return new Date(b.watchTime) - new Date(a.watchTime);
      });

      const searchedMovies = sortedMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return { monthYear, movies: searchedMovies };
    })
    .filter((group) => group.movies.length > 0);

  return (
    <div className="p-4 space-y-2 w-full">
      <div className="mb-4 flex items-center jus gap-6">
        <button className="flex justify-center items-center py-2 pl-3 pr-5 gap-1 bg-dark-blue rounded-xl cursor-pointer">
          <FaSort className="text-white" />
          <p className=" text-white">Sort by</p>
        </button>
        <div className="relative flex justify-center items-center w-50">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LuSearch className="text-gray-700 dark:text-gray-300 " />
          </div>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 p-2 border text-sm bg-gray-200/50 dark:bg-light-black/50 border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-300 outline-none"
          />
        </div>
      </div>

      {filteredMovies.map(({ monthYear, movies }) => (
        <div key={monthYear}>
          <h2 className="text-md text-gray-900 dark:text-gray-100 mb-2">
            {monthYear}
          </h2>
          <hr className="text-gray-300 dark:text-gray-600 mb-6" />

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesList;
