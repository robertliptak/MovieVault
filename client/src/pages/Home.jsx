import React from "react";
import Navbar from "../components/Navbar";
import MoviesList from "../components/MoviesList";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-medium-black transition-all duration-500">
      <Navbar />
      <MoviesList />
    </div>
  );
};

export default Home;
