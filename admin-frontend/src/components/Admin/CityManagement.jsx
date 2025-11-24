import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaCity,
  FaUsers,
  FaStore,
  FaMotorcycle,
  FaChartLine,
  FaArrowRight,
  FaMapMarkedAlt,
} from "react-icons/fa";
import {
  getPlatformOverview,
  getAllShopCities,
} from "../../redux/actions/city";
import { toast } from "react-toastify";

const CityManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { platformOverview, shopCities, isLoading } = useSelector(
    (state) => state.city
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getPlatformOverview());
    dispatch(getAllShopCities());
  }, [dispatch]);

  const handleCityClick = (cityName) => {
    navigate(`/admin-city-details/${cityName}`);
  };

  const filteredCities = shopCities?.filter((city) =>
    city.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <FaMapMarkedAlt className="text-2xl sm:text-3xl text-orange-500" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            City Management
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and monitor all cities
        </p>
      </div>

      {/* Platform Overview Stats */}
      {platformOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FaCity className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">Total</span>
            </div>
            <h2 className="text-4xl font-bold mb-1">
              {platformOverview.cities}
            </h2>
            <p className="text-sm opacity-90">Active Cities</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-3xl opacity-80" />
              <span className="text-sm opacity-80">Platform</span>
            </div>
            <h2 className="text-4xl font-bold mb-1">
              {platformOverview.totalUsers?.toLocaleString()}
            </h2>
            <p className="text-sm opacity-90">
              {platformOverview.activeUsers?.toLocaleString()} Active Users
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FaStore className="text-2xl sm:text-3xl opacity-80" />
              <span className="text-xs sm:text-sm opacity-80">Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
              {platformOverview.totalShops?.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm opacity-90">
              {platformOverview.activeShops?.toLocaleString()} Active
              Restaurants
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <FaMotorcycle className="text-2xl sm:text-3xl opacity-80" />
              <span className="text-xs sm:text-sm opacity-80">Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
              {platformOverview.totalCaptains?.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm opacity-90">
              {platformOverview.activeCaptains?.toLocaleString()} Active Riders
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => navigate("/admin-city-comparison")}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
          >
            <FaChartLine />
            <span className="hidden sm:inline">Compare Cities</span>
            <span className="sm:hidden">Compare</span>
          </button>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <FaCity className="text-orange-500" />
          All Cities ({filteredCities?.length || 0})
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredCities && filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCityClick(city.city)}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer group active:scale-95"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 capitalize mb-1 group-hover:text-orange-600 transition-colors">
                      {city.city}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Tap to view details
                    </p>
                  </div>
                  <FaArrowRight className="text-orange-500 text-lg sm:text-xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <FaStore className="text-orange-500 text-xs sm:text-sm" />
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        Restaurants
                      </span>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                      {city.shopCount}
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-600">
                      {city.activeShops} active
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <FaChartLine className="text-blue-500 text-xs sm:text-sm" />
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        Revenue
                      </span>
                    </div>
                    <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800">
                      Rs. {(city.totalBalance || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {city.blockedShops > 0 && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-600 font-medium">
                      {city.blockedShops} blocked restaurant(s)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FaCity className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No cities found" : "No cities available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityManagement;
