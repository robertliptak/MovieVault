import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userMovies, setUserMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const getAuthState = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
        setUserData(null);
      }
    } catch (error) {
      toast.error(error.message);
      setUserData(null);
    }
  };

  const getUserMovies = async () => {
    let timeout;

    const setLoadingWithDelay = new Promise((resolve) => {
      timeout = setTimeout(() => {
        setLoadingMovies(true);
        resolve();
      }, 200);
    });

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/movies`);
      await setLoadingWithDelay;

      if (data.success) {
        setUserMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      clearTimeout(timeout);
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    userMovies,
    loadingMovies,
    setUserData,
    getUserData,
    getUserMovies,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
