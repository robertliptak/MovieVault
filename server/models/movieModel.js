import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: { type: String, required: true, unique: true },
  imdbId: { type: String },
  title: { type: String, required: true },
  posterPath: { type: String },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  watchTime: { type: Date, required: true },
  userRating: { type: Number, required: true },
});

const movieModel =
  mongoose.models.movie || mongoose.model("movie", movieSchema);

export default movieModel;
