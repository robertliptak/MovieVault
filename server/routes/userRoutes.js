import express from "express";
import userAuth from "../middleware/userAuthMiddleware.js";
import {
  addMovieToUser,
  deleteMovieFromUser,
  getUserData,
  getUserMovies,
  updateMovieForUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post("/add-movie", userAuth, addMovieToUser);
userRouter.get("/movies", userAuth, getUserMovies);
userRouter.delete("/delete-movie", userAuth, deleteMovieFromUser);
userRouter.put("/update-movie", userAuth, updateMovieForUser);

export default userRouter;
