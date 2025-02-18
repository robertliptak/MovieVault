import express from "express";
import {
  getMovieDetail,
  getMoviesByTitle,
} from "../controllers/moviesController.js";

const moviesRouter = express.Router();

moviesRouter.post("/movies-by-title", getMoviesByTitle);
moviesRouter.post("/movie-detail", getMovieDetail);

export default moviesRouter;
