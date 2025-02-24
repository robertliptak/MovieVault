import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import MoviesList from "../components/MoviesList";
import SearchBar from "../components/SearchBar";
import { AppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-dark-black transition-all duration-500">
      <Sidebar />
      <div className="flex-grow ml-64">
        <div className="flex p-4 items-center justify-center">
          <SearchBar />
          <div className="pr-2">
            <div className="flex justify-between items-center gap-4">
              <ThemeToggle />
              {userData && (
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-light-blue text-dark-blue font-bold text-xl">
                  {userData.name[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
        <MoviesList />
      </div>
    </div>
  );
};

export default Home;
