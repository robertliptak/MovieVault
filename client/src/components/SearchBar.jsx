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
import _ from "lodash";
import MovieDetail from "./MovieDetail";

const SearchBar = () => {
  const { backendUrl } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          ? res.data.results.sort((a, b) => b.popularity - a.popularity)
          : [];

        setMovies(sortedMovies);
        console.log(sortedMovies);
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
    // If the input is clicked and results are hidden, we should trigger a search
    if (title.trim().length > 0 && !showResults) {
      debouncedSearch(title);
      setShowResults(true);
    }
  };

  useEffect(() => {
    // Attach the click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
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
          onClick={handleInputClick} // Trigger fetching again when input is clicked
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
              className="flex items-center gap-3 px-4 py-2 last:border-none hover:bg-gray-200/60 dark:hover:bg-light-black/60 cursor-pointer transition-all duration-200"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/default_poster.jpg"
                }
                alt={movie.title}
                className="w-12 h-16 object-cover rounded"
                onClick={() => setIsModalOpen(true)}
              />
              <div>
                <p
                  className="text-sm font-medium dark:text-gray-100"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(movie.title, title),
                  }}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {movie.release_date.slice(0, 4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <MovieDetail isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SearchBar;
