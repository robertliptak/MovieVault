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
        id: user._id,
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

  if (!tmdbId || !title || !watchTime || userRating == null) {
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
      return res.json({ success: false, message: tmdbData.status_message });
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

    return res.json({
      success: true,
      message: "Movie added to watched list",
      movie: newMovie,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error adding movie",
      error: error.message,
    });
  }
};

export const getUserMovieById = async (req, res) => {
  const { userId } = req.body;
  const { movieId } = req.params;

  if (!userId || !movieId) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  try {
    const user = await userModel.findById(userId).populate({
      path: "watchedMovies",
      match: { _id: movieId },
    });

    if (!user || !user.watchedMovies.length) {
      return res.json({
        success: false,
        message: "Movie not found for this user",
      });
    }

    return res.json({
      success: true,
      movie: user.watchedMovies[0],
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error fetching movie",
      error: error.message,
    });
  }
};

export const getUserMovies = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId).populate("watchedMovies");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      movies: user.watchedMovies,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error fetching movies",
      error: error.message,
    });
  }
};

export const deleteMovieFromUser = async (req, res) => {
  const { userId, movieId } = req.body;

  if (!movieId || !userId) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  try {
    const deletedMovie = await movieModel.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.json({
        success: false,
        message: "Movie not found",
      });
    }

    await userModel.findByIdAndUpdate(
      userId,
      { $pull: { watchedMovies: movieId } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const updateMovieForUser = async (req, res) => {
  const {
    movieId,
    userId,
    title,
    description,
    posterPath,
    watchTime,
    userRating,
  } = req.body;

  if (!movieId || !userId) {
    return res.json({ success: false, message: "Missing required fields" });
  }

  try {
    const updatedMovie = await movieModel.findByIdAndUpdate(
      movieId,
      {
        title,
        description,
        posterPath,
        watchTime,
        userRating,
      },
      { new: true }
    );

    if (!updatedMovie) {
      return res.json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.json({
      success: true,
      message: "Movie updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};
