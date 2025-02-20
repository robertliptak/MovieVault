import express from "express";
import userAuth from "../middleware/userAuthMiddleware.js";
import {
  addMovieToUser,
  getUserData,
  getUserMovies,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post("/add-movie", userAuth, addMovieToUser);
userRouter.get("/movies", userAuth, getUserMovies);

export default userRouter;
