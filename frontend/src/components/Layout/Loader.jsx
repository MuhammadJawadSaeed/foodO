import React from "react";
import Lottie from "react-lottie";
import animationData from "../../Assests/animations/24151-ecommerce-animation.json";

const Loader = ({ fullScreen = true, size = "large", useAnimation = true }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4",
  };

  const loaderClass = sizeClasses[size] || sizeClasses.large;

  if (useAnimation) {
    return (
      <div
        className={`${
          fullScreen ? "w-full h-screen" : "w-full py-12"
        } flex items-center justify-center bg-white bg-opacity-90`}
      >
        <div className="flex flex-col items-center gap-4">
          <Lottie options={defaultOptions} width={300} height={300} />
          <p className="text-gray-600 text-lg animate-pulse">
            Loading delicious content...
          </p>
        </div>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`${loaderClass} border-orange-500 border-t-transparent rounded-full animate-spin`}
          ></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-700">food</span>
            <span className="text-2xl font-bold text-orange-500">O</span>
          </div>
          <p className="text-gray-600 animate-pulse">
            Loading delicious content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${loaderClass} border-orange-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
