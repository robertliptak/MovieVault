import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import MoviesList from "../components/MoviesList";
import SearchBar from "../components/SearchBar";
import { AppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle";
import { ImSpinner2 } from "react-icons/im";

const Home = () => {
  const { userData, isLoggedIn, loadingMovies } = useContext(AppContext);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-medium-black transition-all duration-500">
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
        {!isLoggedIn ? (
          <div className="flex justify-center items-center mt-10 ">
            <div className="text-center text-dark-black dark:text-white transition-all duration-500">
              <h2 className="text-2xl font-semibold mb-4">
                Access Your Movie Vault
              </h2>
              <p className="text-lg mb-6">
                Please log in to enjoy your personalized movie experience.
              </p>
            </div>
          </div>
        ) : (
          <>
            {loadingMovies ? (
              <div className="flex justify-center items-center mt-10">
                <ImSpinner2 className="animate-spin text-gray-700 dark:text-gray-300 text-4xl" />
              </div>
            ) : (
              <MoviesList />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
