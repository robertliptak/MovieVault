import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-30 px-4 text-center">
      <h1 className="text-gray-600 text-2xl">
        Hey {userData ? userData.name : "Developer"}
      </h1>
    </div>
  );
};

export default Header;
