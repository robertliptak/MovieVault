import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import moviesRouter from "./routes/moviesRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json()); // Processing Json payloads in request
app.use(cookieParser()); // Manages sessions or authentication tokens in cookies
app.use(cors({ origin: allowedOrigins, credentials: true })); // Communication with frontend

// API Endpoint
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movies", moviesRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
