import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const MovieDetail = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-xl w-full max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        <div>This is simple modal</div>
      </motion.div>
    </div>
  );
};

export default MovieDetail;
