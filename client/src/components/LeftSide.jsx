import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StaticMovieCard from "./StaticMovieCard";

const LeftSide = () => {
  const navigate = useNavigate();

  const movie1 = {
    _id: "1",
    title: "Pulp Fiction",
    posterPath: "/pulp_fiction_poster.jpg",
    userRating: 4.5,
    watchTime: new Date(),
    tmdbId: "123456",
  };

  const movie2 = {
    _id: "2",
    title: "Se7en",
    posterPath: "/seven_poster.jpg",
    userRating: 5.0,
    watchTime: new Date(),
    tmdbId: "654321",
  };

  const movie3 = {
    _id: "3",
    title: "The Shawshank Redemption",
    posterPath: "/shawshank_poster.jpg",
    userRating: 4.8,
    watchTime: new Date(),
    tmdbId: "112233",
  };

  return (
    <div className="w-1/2 h-screen flex items-center justify-center p-5 overflow-hidden">
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-light-blue via-dark-blue to-medium-black relative">
        <div
          onClick={() => navigate("/")}
          className="absolute bg-gray-200/20 hover:bg-gray-200/30 transition-all duration-300 backdrop-blur-lg top-5 right-5 py-2 px-4 rounded-2xl text-white font-light flex items-center justify-center gap-2 cursor-pointer z-10"
        >
          Back to website
          <FaArrowRight />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center space-y-5 overflow-hidden">
          {/* Upper card with reduced opacity */}
          <div className="w-60 opacity-60">
            <StaticMovieCard movie={movie1} />
          </div>

          {/* Middle card with full opacity */}
          <div className="w-60 opacity-100">
            <StaticMovieCard movie={movie2} />
          </div>

          {/* Lower card with reduced opacity */}
          <div className="w-60 opacity-60">
            <StaticMovieCard movie={movie3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
