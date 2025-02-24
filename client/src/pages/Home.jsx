import React from "react";
import Navbar from "../components/Navbar";
import MoviesList from "../components/MoviesList";

const Home = () => {
  return (
    <div className="flex flex-col pt-24 px-20 items-center justify-start min-h-screen bg-gray-100 dark:bg-medium-black transition-all duration-500">
      <Navbar />
      <MoviesList />
    </div>
  );
};

export default Home;
