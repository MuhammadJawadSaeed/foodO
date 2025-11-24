import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-center mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
