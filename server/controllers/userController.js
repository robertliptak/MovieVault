import movieModel from "../models/movieModel.js";
import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addMovieToUser = async (req, res) => {
  const {
    tmdbId,
    posterPath,
    title,
    description,
    watchTime,
    userRating,
    userId,
  } = req.body;

  if (
    !tmdbId ||
    !title ||
    !posterPath ||
    !description ||
    !watchTime ||
    userRating == null
  ) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  try {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`;
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
        .json({ success: false, message: tmdbData.status_message });
    }

    const imdbId = tmdbData.imdb_id || null;

    const newMovie = new movieModel({
      tmdbId,
      imdbId,
      userId,
      title,
      description,
      posterPath,
      watchTime,
      userRating,
    });

    await newMovie.save();

    await userModel.findByIdAndUpdate(
      userId,
      { $push: { watchedMovies: newMovie._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Movie added to watched list",
      movie: newMovie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding movie",
      error: error.message,
    });
  }
};

export const getUserMovies = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId).populate("watchedMovies");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      movies: user.watchedMovies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching movies",
      error: error.message,
    });
  }
};
