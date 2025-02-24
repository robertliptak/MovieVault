import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";
import { LuSearch } from "react-icons/lu";
import { FaSort } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa"; // Checkmark for active sort option

const MoviesList = () => {
  const { userMovies } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("watchTimeDesc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [groupByMonth, setGroupByMonth] = useState(true); // Toggle for month grouping

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortMenu(false); // Close menu after selecting
  };

  const sortedMovies = [...userMovies].sort((a, b) => {
    switch (sortOption) {
      case "watchTimeAsc":
        return new Date(a.watchTime) - new Date(b.watchTime);
      case "watchTimeDesc":
        return new Date(b.watchTime) - new Date(a.watchTime);
      case "ratingAsc":
        return a.userRating - b.userRating;
      case "ratingDesc":
        return b.userRating - a.userRating;
      default:
        return 0;
    }
  });

  const groupedMovies = sortedMovies.reduce((acc, movie) => {
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

  const filteredMovies = Object.entries(groupedMovies)
    .map(([monthYear, movies]) => ({
      monthYear,
      movies: movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.movies.length > 0);

  const flatFilteredMovies = sortedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-2 w-full">
      {/* Search & Sort Controls */}
      <div className="mb-4 flex items-center gap-4">
        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex justify-center items-center text-sm py-2 pl-3 pr-5 gap-1 bg-dark-blue rounded-xl cursor-pointer text-white"
          >
            <FaSort />
            <p>Sort by</p>
          </button>

          {/* Dropdown Menu */}
          {showSortMenu && (
            <div className="absolute left-0 mt-2 px-2 pt-2 pb-1 border border-gray-300 dark:border-light-black bg-gray-100 dark:bg-dark-black rounded-xl shadow-md z-10 w-56">
              <ul className="text-sm text-gray-900 dark:text-gray-200">
                {[
                  {
                    label: "↑ Watch Time (Oldest First)",
                    value: "watchTimeAsc",
                  },
                  {
                    label: "↓ Watch Time (Newest First)",
                    value: "watchTimeDesc",
                  },
                  { label: "↑ Rating (Lowest First)", value: "ratingAsc" },
                  { label: "↓ Rating (Highest First)", value: "ratingDesc" },
                ].map(({ label, value }) => (
                  <li
                    key={value}
                    onClick={() => handleSortChange(value)}
                    className={`p-2 flex justify-between items-center rounded-xl mb-1 ${
                      sortOption === value
                        ? "dark:bg-light-black bg-gray-300"
                        : "dark:bg-dark-black bg-gray-100"
                    } hover:bg-gray-300 dark:hover:bg-light-black cursor-pointer`}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex justify-center items-center w-50">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LuSearch className="text-gray-700 dark:text-gray-300" />
          </div>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 p-2 text-sm bg-gray-200/50 dark:bg-light-black/50 border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-300 outline-none"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setGroupByMonth(!groupByMonth)}
            className={`w-4 h-4 border-2 border-gray-700 rounded cursor-pointer dark:border-gray-300 ${
              groupByMonth && "bg-gray-700 dark:bg-gray-300"
            }`}
          >
            {groupByMonth && (
              <FaCheck className="pb-1 text-gray-100 dark:text-dark-black" />
            )}
          </button>
          <p className="text-sm dark:text-gray-200">Group by month</p>
        </div>
      </div>

      {/* Movie List - Grouped or Flat */}
      {groupByMonth ? (
        filteredMovies.map(({ monthYear, movies }) => (
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
        ))
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {flatFilteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesList;
