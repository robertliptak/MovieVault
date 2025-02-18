import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 transition-all duration-500">
      <Navbar />
      <Header />
      <SearchBar />
    </div>
  );
};

export default Home;
