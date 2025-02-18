import axios from "axios";
import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AppContext } from "../context/AppContext";
import { LuSearch } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im"; // Import spinner icon
import _ from "lodash";
import MovieDetail from "./MovieDetail";

const SearchBar = () => {
  const { backendUrl } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingMovieId, setLoadingMovieId] = useState(null); // Track which movie is being fetched

  const searchRef = useRef(null);

  const debouncedSearch = useCallback(
    _.debounce(async (query) => {
      if (query.trim().length === 0) {
        setMovies([]);
        setShowResults(false);
        return;
      }

      try {
        const res = await axios.post(
          `${backendUrl}/api/movies/movies-by-title`,
          { title: query },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const sortedMovies = res.data.results
          ? res.data.results.sort((a, b) => b.vote_count - a.vote_count)
          : [];

        setMovies(sortedMovies);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }, 500),
    []
  );

  const onChangeHandler = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSearch(newTitle);
  };

  const fetchMovieDetail = async (movieId) => {
    setLoadingMovieId(movieId); // Set loading state for clicked movie

    try {
      const res = await axios.post(
        `${backendUrl}/api/movies/movie-detail`,
        { movieId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSelectedMovie(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoadingMovieId(null); // Reset loading state after request completes
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      (match) =>
        `<span class="bg-gray-500/50 dark:bg-gray-400/50 font-semibold">${match}</span>`
    );
  };

  // Close results when clicking outside the search bar
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  const handleInputClick = () => {
    if (title.trim().length > 0 && !showResults) {
      debouncedSearch(title);
      setShowResults(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchRef}
      className="w-full max-w-md mx-auto bg-gray-200/50 dark:bg-light-black/50 rounded-xl"
    >
      <div className="m-2 w-full flex items-center px-2 gap-2">
        <LuSearch className="text-gray-700 dark:text-gray-300 text-xl" />
        <input
          onChange={onChangeHandler}
          onClick={handleInputClick}
          value={title}
          type="text"
          className="w-full bg-transparent outline-none py-2 dark:text-gray-100 dark:placeholder:text-gray-300"
          placeholder="Search for a movie"
        />
      </div>

      {showResults && movies.length > 0 && (
        <div className="mt-2 max-h-120 overflow-y-auto">
          <hr className="text-gray-400 dark:text-gray-600" />
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center gap-3 px-4 py-2 last:border-none hover:bg-gray-200/60 dark:hover:bg-light-black/60 transition-all duration-200"
            >
              {loadingMovieId === movie.id ? (
                <div className="w-full flex items-center justify-center py-4">
                  <ImSpinner2 className="animate-spin text-gray-700 dark:text-gray-300 text-2xl" />
                </div>
              ) : (
                <>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/default_poster.jpg"
                    }
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded cursor-pointer"
                    onClick={() => fetchMovieDetail(movie.id)}
                  />
                  <div>
                    <p
                      className="text-sm font-medium dark:text-gray-100 cursor-pointer"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(movie.title, title),
                      }}
                      onClick={() => fetchMovieDetail(movie.id)}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {movie.release_date
                        ? movie.release_date.slice(0, 4)
                        : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedMovie && (
        <MovieDetail
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default SearchBar;
