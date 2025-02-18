import express from "express";
import { getMoviesByTitle } from "../controllers/moviesController.js";

const moviesRouter = express.Router();

moviesRouter.post("/movies-by-title", getMoviesByTitle);

export default moviesRouter;
