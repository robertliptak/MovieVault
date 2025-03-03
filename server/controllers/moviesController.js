import fetch from "node-fetch";
import movieModel from "../models/movieModel.js";

export const getMoviesByTitle = async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.status_message });
    }

    const movies = data.results;

    if (!movies.length) {
      return res.json({ movies: [], message: "No movies found." });
    }

    let userMovies = [];
    if (userId) {
      userMovies = await movieModel.find({ userId }, "tmdbId _id");
    }

    const userMoviesMap = new Map(
      userMovies.map((movie) => [movie.tmdbId, movie._id])
    );

    const moviesWithIds = movies.map((movie) => ({
      ...movie,
      movieId: userMoviesMap.get(movie.id?.toString()) || null,
    }));

    return res.json({ results: moviesWithIds });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMoviesByTitleNoAuth = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.status_message });
    }

    const movies = data.results;

    if (!movies.length) {
      return res.json({ movies: [], message: "No movies found." });
    }

    return res.json({ results: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMovieDetail = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    const tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

    const tmdbOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };

    // Fetch both movie details and credits in parallel
    const [tmdbResponse, creditsResponse] = await Promise.all([
      fetch(tmdbUrl, tmdbOptions),
      fetch(creditsUrl, tmdbOptions),
    ]);

    const tmdbData = await tmdbResponse.json();
    const creditsData = await creditsResponse.json();

    if (!tmdbResponse.ok) {
      return res
        .status(tmdbResponse.status)
        .json({ error: tmdbData.status_message });
    }

    // Extract the first three actors from the cast (if available)
    const firstThreeActors = creditsData.cast
      ? creditsData.cast.slice(0, 3).map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path,
        }))
      : [];

    const imdbId = tmdbData.imdb_id;
    if (!imdbId) {
      return res.json({ ...tmdbData, omdbData: null, cast: firstThreeActors });
    }

    const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`;
    const omdbResponse = await fetch(omdbUrl);
    const omdbData = await omdbResponse.json();

    if (omdbData.Response === "False") {
      console.warn("OMDB fetch failed:", omdbData.Error);
      return res.json({ ...tmdbData, omdbData: null, cast: firstThreeActors });
    }

    return res.json({ ...tmdbData, omdbData, cast: firstThreeActors });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
