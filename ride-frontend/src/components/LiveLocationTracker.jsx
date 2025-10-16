import React, { useEffect, useState } from "react";

const LiveLocationTracker = ({
  rideId,
  captainLocation,
  pickup,
  destination,
  showMap = true,
}) => {
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);

  useEffect(() => {
    if (captainLocation && pickup) {
      // Calculate rough distance and ETA
      // This is a simplified calculation
      const roughDistance = Math.random() * 5 + 1; // 1-6 km for demo
      const roughEta = Math.ceil(roughDistance * 3); // ~3 min per km

      setDistance(roughDistance.toFixed(1));
      setEta(roughEta);
    }
  }, [captainLocation, pickup]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <i className="ri-map-pin-time-line text-blue-600"></i>
        Live Tracking
      </h3>

      {/* Location Status */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <i className="ri-restaurant-2-fill text-green-600 text-xl mt-1"></i>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Pickup Location</p>
            <p className="text-xs text-gray-600 mt-1">
              {pickup || "Loading..."}
            </p>
          </div>
        </div>

        {captainLocation && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex flex-col items-center">
              <i className="ri-roadster-fill text-blue-600 text-2xl animate-bounce"></i>
              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-blue-600">
                  {distance ? `${distance} km away` : "Calculating..."}
                </p>
                <p className="text-xs text-gray-500">
                  {eta ? `ETA: ${eta} min` : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
          <i className="ri-map-pin-user-fill text-red-600 text-xl mt-1"></i>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Delivery Location
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {destination || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Map Placeholder or Embedded Map */}
      {showMap && (
        <div className="relative">
          <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <i className="ri-map-2-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-sm text-gray-500">Live Map</p>
              <p className="text-xs text-gray-400 mt-1">
                Google Maps integration required
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Tracking Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <i className="ri-timer-line text-blue-600 text-lg"></i>
          <p className="text-xs text-gray-600 mt-1">ETA</p>
          <p className="text-sm font-semibold text-blue-600">
            {eta ? `${eta} min` : "..."}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <i className="ri-route-line text-green-600 text-lg"></i>
          <p className="text-xs text-gray-600 mt-1">Distance</p>
          <p className="text-sm font-semibold text-green-600">
            {distance ? `${distance} km` : "..."}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <i className="ri-navigation-line text-purple-600 text-lg"></i>
          <p className="text-xs text-gray-600 mt-1">Status</p>
          <p className="text-sm font-semibold text-purple-600">En Route</p>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationTracker;
