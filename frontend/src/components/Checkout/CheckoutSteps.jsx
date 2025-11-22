import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center mb-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between">
          {/* Step 1 - Shipping */}
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                active >= 1
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium ${
                active >= 1 ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Shipping
            </span>
          </div>

          {/* Connector 1-2 */}
          <div
            className={`flex-1 h-1 mx-2 transition-all ${
              active > 1 ? "bg-orange-500" : "bg-gray-200"
            }`}
          />

          {/* Step 2 - Payment */}
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                active >= 2
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium ${
                active >= 2 ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Payment
            </span>
          </div>

          {/* Connector 2-3 */}
          <div
            className={`flex-1 h-1 mx-2 transition-all ${
              active > 2 ? "bg-orange-500" : "bg-gray-200"
            }`}
          />

          {/* Step 3 - Success */}
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                active >= 3
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm font-medium ${
                active >= 3 ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
