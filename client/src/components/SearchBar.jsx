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
import { ImSpinner2 } from "react-icons/im";
import { FaPlus, FaPen } from "react-icons/fa";
import _ from "lodash";
import MovieDetail from "./MovieDetail";
import { toast } from "react-toastify";
import AddMovie from "./AddMovie";
import EditMovie from "./EditMovie";

const SearchBar = () => {
  const { backendUrl, isLoggedIn } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToEdit, setMovieToEdit] = useState(null);
  const [addMovie, setAddMovie] = useState(null);
  const [loadingMovieId, setLoadingMovieId] = useState(null);

  const searchRef = useRef(null);

  const debouncedSearch = useCallback(
    _.debounce(async (query) => {
      if (query.trim().length === 0) {
        setMovies([]);
        setShowResults(false);
        return;
      }

      try {
        let res;
        if (isLoggedIn) {
          res = await axios.post(
            `${backendUrl}/api/movies/movies-by-title`,
            { title: query },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          res = await axios.post(
            `${backendUrl}/api/movies/movies-by-title-no-auth`,
            { title: query },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const sortedMovies = res.data.results
          ? res.data.results.sort((a, b) => b.vote_count - a.vote_count)
          : [];
        setMovies(sortedMovies);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }, 500),
    [isLoggedIn]
  );

  const onChangeHandler = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSearch(newTitle);
  };

  const fetchMovieDetail = async (tmdbId, movieId) => {
    setLoadingMovieId(tmdbId);

    try {
      const res = await axios.post(
        `${backendUrl}/api/movies/movie-detail`,
        { movieId: tmdbId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSelectedMovie({ ...res.data, movieId });
      setIsDetailModalOpen(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingMovieId(null);
    }
  };

  const fetchMovieToEdit = async (movieId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/movie/${movieId}`);

      setMovieToEdit(res.data.movie);
      setIsEditModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch movie");
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
      className={`relative w-full max-w-md mx-auto bg-gray-300/50 dark:bg-light-black/50 ${
        movies.length > 0 && showResults ? "rounded-t-xl" : "rounded-xl"
      }`}
    >
      <div className="m-2 flex items-center px-2 gap-2">
        <LuSearch className="text-gray-700 dark:text-gray-300 text-xl" />
        <input
          onChange={onChangeHandler}
          onClick={handleInputClick}
          value={title}
          type="text"
          className="w-full bg-transparent outline-none py-2 dark:text-gray-100 dark:placeholder:text-gray-300"
          placeholder="I've recently watched..."
        />
      </div>

      {showResults && movies.length > 0 && (
        <div className="absolute top-full left-0 w-full border-t border-gray-400 dark:border-gray-600 bg-gray-300/50 dark:bg-light-black/50 backdrop-blur-md rounded-b-lg max-h-120 overflow-y-auto z-50 no-scrollbar">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center gap-3 px-4 py-2 last:border-none hover:bg-gray-200/60 dark:hover:bg-light-black/60 transition-all duration-200"
            >
              {loadingMovieId === movie.id ? (
                <div className="w-full flex items-center justify-center py-4.5">
                  <ImSpinner2 className="animate-spin text-gray-700 dark:text-gray-300 text-2xl" />
                </div>
              ) : (
                <div className="flex justify-between w-full items-center">
                  <div className="flex items-center gap-2 justify-center">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/default_poster.jpg"
                      }
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded cursor-pointer"
                      onClick={() => fetchMovieDetail(movie.id, movie.movieId)}
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
                  </div>
                  {isLoggedIn && (
                    <>
                      {movie.movieId ? (
                        <button
                          onClick={() => fetchMovieToEdit(movie.movieId)}
                          className="rounded-full p-2 bg-gray-300 hover:bg-gray-400 transition-all duration-200 cursor-pointer"
                        >
                          <FaPen />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsAddModalOpen(true);
                            setAddMovie({
                              title: movie.title,
                              poster_path: movie.poster_path,
                              id: movie.id,
                            });
                          }}
                          className="rounded-full p-2 bg-gray-300 hover:bg-gray-400 transition-all duration-200 cursor-pointer"
                        >
                          <FaPlus />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isDetailModalOpen && selectedMovie && (
        <MovieDetail
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          movie={selectedMovie}
          setTitle={() => setTitle("")}
          hideResults={() => setShowResults(false)}
        />
      )}
      {isAddModalOpen && (
        <AddMovie
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          movie={addMovie}
          setShowResults={() => setShowResults(false)}
          setTitle={() => setTitle("")}
        />
      )}
      {isEditModalOpen && (
        <EditMovie
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          movie={movieToEdit}
        />
      )}
    </div>
  );
};

export default SearchBar;
