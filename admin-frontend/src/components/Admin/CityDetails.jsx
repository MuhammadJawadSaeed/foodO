import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaStore,
  FaMotorcycle,
  FaArrowLeft,
  FaSearch,
  FaChartBar,
  FaEye,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaEnvelope,
} from "react-icons/fa";
import {
  getUsersByCity,
  getShopsByCity,
  getCaptainsByCity,
  getCityAnalytics,
} from "../../redux/actions/city";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import AdminHeader from "../Layout/AdminHeader";
import AdminSideBar from "../Layout/AdminSideBar";

const CityDetails = () => {
  const { city } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersByCity, shopsByCity, captainsByCity, cityAnalytics, isLoading } =
    useSelector((state) => state.city);

  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getUsersByCity(city));
    dispatch(getShopsByCity(city));
    dispatch(getCaptainsByCity(city));
    dispatch(getCityAnalytics(city));
  }, [dispatch, city]);

  const handleViewDetails = (item, type) => {
    if (type === "shop") {
      navigate(`/admin-restaurant-details/${item._id}`);
    } else if (type === "captain") {
      navigate(`/admin-captain-details/${item._id}`);
    } else {
      setSelectedUser(item);
      setShowModal(true);
    }
  };

  const handleSuspendUser = async (userId, isSuspended) => {
    try {
      const endpoint = isSuspended ? "unsuspend-user" : "suspend-user";
      await axios.put(
        `${server}/user/${endpoint}/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(
        `User ${isSuspended ? "activated" : "suspended"} successfully!`
      );
      dispatch(getUsersByCity(city));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleBlockShop = async (shopId, isBlocked) => {
    try {
      const endpoint = isBlocked ? "unblock-seller" : "block-seller";
      await axios.put(
        `${server}/shop/${endpoint}/${shopId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(
        `Restaurant ${isBlocked ? "unblocked" : "blocked"} successfully!`
      );
      dispatch(getShopsByCity(city));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant"
      );
    }
  };

  const filterData = (data, type) => {
    if (!searchTerm) return data;

    return data?.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      if (type === "users") {
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower)
        );
      } else if (type === "shops") {
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower)
        );
      } else {
        return (
          item.fullname?.firstname?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower)
        );
      }
    });
  };

  const filteredUsers = filterData(usersByCity, "users");
  const filteredShops = filterData(shopsByCity, "shops");
  const filteredCaptains = filterData(captainsByCity, "captains");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={10} />
        </div>
        <div className="flex-1 w-full lg:w-auto p-3 sm:p-4 md:p-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate("/admin-cities")}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-3 sm:mb-4 font-medium text-sm sm:text-base px-3 py-2 rounded-lg hover:bg-orange-50 active:scale-95 transition-all"
            >
              <FaArrowLeft /> Back to Cities
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 capitalize">
              {city} - City Details
            </h1>
          </div>

          {/* City Analytics Overview */}
          {cityAnalytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <FaUsers className="text-xl sm:text-2xl text-blue-500" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    USERS
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {cityAnalytics.users?.total || 0}
                </h3>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  {cityAnalytics.users?.active || 0} active
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <FaStore className="text-xl sm:text-2xl text-orange-500" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    RESTAURANTS
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {cityAnalytics.shops?.total || 0}
                </h3>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  {cityAnalytics.shops?.active || 0} active
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <FaMotorcycle className="text-xl sm:text-2xl text-purple-500" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    RIDERS
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {cityAnalytics.captains?.total || 0}
                </h3>
                <p className="text-xs sm:text-sm text-green-600 mt-1">
                  {cityAnalytics.captains?.active || 0} active
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <FaChartBar className="text-xl sm:text-2xl text-green-500" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    REVENUE
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  Rs. {(cityAnalytics.orders?.revenue || 0).toLocaleString()}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {cityAnalytics.orders?.total || 0} orders
                </p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md mb-4 sm:mb-6 overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                  activeTab === "users"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 active:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaUsers className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">
                    Users ({filteredUsers?.length || 0})
                  </span>
                  <span className="sm:hidden">Users</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("shops")}
                className={`flex-1 min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                  activeTab === "shops"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 active:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaStore className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">
                    Restaurants ({filteredShops?.length || 0})
                  </span>
                  <span className="sm:hidden">Shops</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("riders")}
                className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 font-medium transition-colors text-sm sm:text-base ${
                  activeTab === "riders"
                    ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-gray-800 active:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <FaMotorcycle className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">
                    Riders ({filteredCaptains?.length || 0})
                  </span>
                  <span className="sm:hidden">Riders</span>
                </div>
              </button>
            </div>

            {/* Search */}
            <div className="p-3 sm:p-4 md:p-6 border-b">
              <div className="relative">
                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12 sm:py-20">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <>
                  {/* Users Tab */}
                  {activeTab === "users" && (
                    <div className="grid gap-3 sm:gap-4">
                      {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-orange-300 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                <img
                                  src={user.avatar?.url}
                                  alt={user.name}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-orange-200 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                                    {user.name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {user.email}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span
                                      className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                                        user.suspended
                                          ? "bg-red-100 text-red-600"
                                          : "bg-green-100 text-green-600"
                                      }`}
                                    >
                                      {user.suspended ? "Suspended" : "Active"}
                                    </span>
                                    <span className="text-[10px] sm:text-xs text-gray-500">
                                      Joined:{" "}
                                      {new Date(
                                        user.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                  onClick={() =>
                                    handleViewDetails(user, "user")
                                  }
                                  className="flex-1 sm:flex-none p-2 sm:p-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                                  title="View Details"
                                >
                                  <FaEye className="mx-auto" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleSuspendUser(user._id, user.suspended)
                                  }
                                  className={`flex-1 sm:flex-none p-2 sm:p-2.5 text-sm rounded-lg transition-colors active:scale-95 ${
                                    user.suspended
                                      ? "text-green-600 hover:bg-green-50"
                                      : "text-red-600 hover:bg-red-50"
                                  }`}
                                  title={
                                    user.suspended ? "Activate" : "Suspend"
                                  }
                                >
                                  {user.suspended ? (
                                    <FaCheckCircle className="mx-auto" />
                                  ) : (
                                    <FaBan className="mx-auto" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20">
                          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No users found</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shops Tab */}
                  {activeTab === "shops" && (
                    <div className="grid gap-4">
                      {filteredShops && filteredShops.length > 0 ? (
                        filteredShops.map((shop) => (
                          <div
                            key={shop._id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <img
                                  src={shop.avatar?.url}
                                  alt={shop.name}
                                  className="w-14 h-14 rounded-lg object-cover border-2 border-orange-200"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    {shop.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {shop.email}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        shop.blocked
                                          ? "bg-red-100 text-red-600"
                                          : "bg-green-100 text-green-600"
                                      }`}
                                    >
                                      {shop.blocked ? "Blocked" : "Active"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Balance: Rs.{" "}
                                      {shop.availableBalance?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleViewDetails(shop, "shop")
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Restaurant Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  onClick={() =>
                                    handleBlockShop(shop._id, shop.blocked)
                                  }
                                  className={`p-2 rounded-lg transition-colors ${
                                    shop.blocked
                                      ? "text-green-600 hover:bg-green-50"
                                      : "text-red-600 hover:bg-red-50"
                                  }`}
                                  title={shop.blocked ? "Unblock" : "Block"}
                                >
                                  {shop.blocked ? <FaCheckCircle /> : <FaBan />}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20">
                          <FaStore className="text-6xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No restaurants found</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Riders Tab */}
                  {activeTab === "riders" && (
                    <div className="grid gap-4">
                      {filteredCaptains && filteredCaptains.length > 0 ? (
                        filteredCaptains.map((captain) => (
                          <div
                            key={captain._id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <img
                                  src={captain.profileImage?.url}
                                  alt={captain.fullname?.firstname}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    {captain.fullname?.firstname}{" "}
                                    {captain.fullname?.lastname}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {captain.email}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        captain.status === "active"
                                          ? "bg-green-100 text-green-600"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {captain.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Rides:{" "}
                                      {captain.rideStats?.completedRides || 0}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Rs.{" "}
                                      {captain.earnings?.total?.toLocaleString() ||
                                        0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleViewDetails(captain, "captain")
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Rider Details"
                                >
                                  <FaEye />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20">
                          <FaMotorcycle className="text-6xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No riders found</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Details Modal */}
          {showModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">User Details</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={selectedUser.avatar?.url}
                      alt={selectedUser.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-bold">{selectedUser.name}</h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <span
                        className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                          selectedUser.suspended
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {selectedUser.suspended ? "Suspended" : "Active"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Phone Number
                      </label>
                      <p className="font-medium">
                        {selectedUser.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">City</label>
                      <p className="font-medium capitalize">
                        {selectedUser.city || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Role</label>
                      <p className="font-medium">
                        {selectedUser.role || "user"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Joined</label>
                      <p className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
