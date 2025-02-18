import fetch from "node-fetch";

export const getMoviesByTitle = async (req, res) => {
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

    return res.json(data);
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
    const tmdbOptions = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };

    const tmdbResponse = await fetch(tmdbUrl, tmdbOptions);
    const tmdbData = await tmdbResponse.json();

    if (!tmdbResponse.ok) {
      return res
        .status(tmdbResponse.status)
        .json({ error: tmdbData.status_message });
    }

    const imdbId = tmdbData.imdb_id;
    if (!imdbId) {
      return res.json({ ...tmdbData, omdbData: null });
    }

    const omdbUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`;

    const [omdbResponse] = await Promise.all([fetch(omdbUrl)]);

    const omdbData = await omdbResponse.json();

    if (omdbData.Response === "False") {
      console.warn("OMDB fetch failed:", omdbData.Error);
      return res.json({ ...tmdbData, omdbData: null });
    }

    return res.json({ ...tmdbData, omdbData });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
