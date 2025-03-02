import express from "express";
import {
  getMovieDetail,
  getMoviesByTitle,
} from "../controllers/moviesController.js";
import userAuth from "../middleware/userAuthMiddleware.js";

const moviesRouter = express.Router();

moviesRouter.post("/movies-by-title", userAuth, getMoviesByTitle);
moviesRouter.post("/movie-detail", getMovieDetail);

export default moviesRouter;
