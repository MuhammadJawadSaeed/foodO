import React from "react";

const Loader = ({ fullScreen = true, size = "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4",
  };

  const loaderClass = sizeClasses[size] || sizeClasses.large;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex flex-col items-center gap-6">
          {/* Animated FoodO Logo */}
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 w-32 h-32 border-8 border-orange-200 rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 w-28 h-28 border-8 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>

            {/* Center Logo */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-800 animate-pulse">
                    food
                  </span>
                  <span className="text-4xl font-bold text-orange-500 animate-bounce">
                    O
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading text with dots animation */}
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-lg font-medium">Loading</p>
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></span>
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-500 text-sm animate-pulse">
            Getting your ride ready...
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
