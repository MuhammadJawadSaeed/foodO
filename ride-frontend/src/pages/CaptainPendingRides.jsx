import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { SocketContext } from "../context/SocketContext";

const CaptainPendingRides = () => {
  const location = useLocation();
  const [myRides, setMyRides] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [activeTab, setActiveTab] = useState(
    location.state?.defaultTab === "active"
      ? "myRides"
      : location.state?.defaultTab === "history"
      ? "history"
      : "available"
  ); // 'available', 'myRides', or 'history'
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  // Fetch captain's active rides (accepted/started)
  const fetchMyRides = async () => {
    try {
      console.log("📥 Fetching my active rides...");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/my-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ My active rides response:", response.data);
      console.log(`   Found ${response.data.rides?.length || 0} active rides`);

      if (response.data.rides && response.data.rides.length > 0) {
        response.data.rides.forEach((ride, index) => {
          console.log(
            `   Ride ${index + 1}: Status=${ride.status}, ID=${ride._id}`
          );
        });
      }

      setMyRides(response.data.rides || []);
    } catch (error) {
      console.error("❌ Error fetching my rides:", error);
      if (error.response?.status === 401) {
        navigate("/captain-login");
      }
    }
  };

  // Fetch available pending rides (not accepted by anyone)
  const fetchAvailableRides = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/pending-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Available rides:", response.data);
      setAvailableRides(response.data.rides || []);

      // Set location message if available
      if (response.data.message) {
        setLocationMessage(response.data.message);
      } else {
        setLocationMessage("");
      }
    } catch (error) {
      console.error("Error fetching available rides:", error);
      if (error.response?.status === 401) {
        navigate("/captain-login");
      }
    }
  };

  // Fetch captain's completed ride history
  const fetchRideHistory = async () => {
    try {
      console.log("📥 Fetching ride history...");
      console.log("Captain data:", captain);

      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      if (token) {
        console.log("Token first 20 chars:", token?.substring(0, 20));
        console.log(
          "Token format valid (starts with eyJ):",
          token?.startsWith("eyJ")
        );
      }

      if (!token) {
        console.error("❌ No authentication token found in localStorage");
        navigate("/captain-login");
        return;
      }

      if (!captain) {
        console.warn("⚠️ Warning: Captain data not loaded in context");
      }

      console.log(
        "Making request to:",
        `${import.meta.env.VITE_BASE_URL}/rides/ride-history`
      );
      console.log(
        "Authorization header:",
        `Bearer ${token.substring(0, 20)}...`
      );

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/ride-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Ride history response:", response.data);
      console.log(
        `   Found ${response.data.rides?.length || 0} completed rides`
      );

      setCompletedRides(response.data.rides || []);
    } catch (error) {
      console.error("❌ Error fetching ride history:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);

      if (error.response?.status === 401) {
        console.log(
          "🔒 Authentication failed - Token might be invalid or expired"
        );
        console.log("Error details:", error.response?.data);

        // Check if the error message indicates we should re-login
        if (error.response?.data?.message?.includes("login")) {
          console.log("Clearing token and redirecting to login...");
          localStorage.removeItem("token");
          navigate("/captain-login");
        } else {
          console.log(
            "Auth error but not redirecting - might be a different issue"
          );
        }
      }
    }
  };

  const fetchAllRides = async () => {
    setLoading(true);
    const promises = [fetchMyRides(), fetchAvailableRides()];

    // Only fetch history if we're on the history tab
    if (activeTab === "history") {
      promises.push(fetchRideHistory());
    }

    await Promise.all(promises);
    setLoading(false);
  };

  useEffect(() => {
    console.log("🔵 CaptainPendingRides mounted/updated");
    fetchAllRides();

    // Listen for new rides via socket
    if (socket) {
      socket.on("new-ride", (data) => {
        console.log("New ride received in pending rides page:", data);
        fetchAvailableRides(); // Refresh available rides only
      });

      // Listen for ride status changes
      socket.on("ride-accepted", (data) => {
        console.log("Ride accepted event:", data);
        fetchAllRides(); // Refresh both lists
      });

      socket.on("ride-started", (data) => {
        console.log("Ride started event:", data);
        fetchAllRides(); // Refresh both lists
      });

      // Listen for order status updates
      socket.on("order-status-updated", (data) => {
        console.log("📦 Order status updated event:", data);
        fetchMyRides(); // Refresh active rides to show updated order status
      });

      return () => {
        socket.off("new-ride");
        socket.off("ride-accepted");
        socket.off("ride-started");
        socket.off("order-status-updated");
      };
    }

    // Poll active rides every 30 seconds to keep order status fresh
    const pollInterval = setInterval(() => {
      if (activeTab === "myRides") {
        console.log("🔄 Polling active rides for status updates...");
        fetchMyRides();
      }
    }, 30000); // 30 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [socket, activeTab]);

  // Fetch history when tab changes to history
  useEffect(() => {
    if (activeTab === "history") {
      fetchRideHistory();
    }
  }, [activeTab]);

  // Refresh rides when component becomes visible (user returns from another page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("📱 Page became visible - refreshing rides");
        fetchAllRides();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleAcceptRide = async (rideId) => {
    try {
      console.log("Accepting ride:", rideId);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: rideId,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Ride accepted successfully:", response.data);
      console.log(
        "   Accepted ride ID:",
        response.data._id || response.data.ride?._id
      );
      console.log(
        "   Accepted ride status:",
        response.data.status || response.data.ride?.status
      );

      // Refresh both lists to update UI immediately
      console.log("🔄 Refreshing ride lists...");
      await fetchAllRides();

      // Small delay to ensure database is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch my rides one more time to ensure it's in the list
      console.log("🔄 Double-checking my active rides...");
      await fetchMyRides();

      // Navigate to home with popup to confirm/start ride
      // This allows captain to immediately see the ride details and start
      navigate("/captain-home", {
        state: {
          acceptedRide: response.data,
          showConfirmPopup: true,
        },
      });

      // Note: The ride will now be visible in "My Active Rides" tab
      // Captain can return here anytime to start the ride
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert(
        error.response?.data?.message ||
          "Failed to accept ride. Please try again."
      );
    }
  };

  const RideCard = ({ ride, isMyRide = false }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow mb-3 border border-gray-100 overflow-hidden">
        {/* Header Bar */}
        <div
          className={`h-1 ${isMyRide ? "bg-green-500" : "bg-pink-500"}`}
        ></div>

        <div className="p-3">
          {/* Top Section - Customer & Distance */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-white text-sm"></i>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {ride.user?.name ||
                    ride.user?.fullname?.firstname ||
                    "Customer"}
                </p>
                {ride.distanceFromCaptain && (
                  <p className="text-xs text-gray-500">
                    <i className="ri-map-pin-time-line"></i>{" "}
                    {ride.distanceFromCaptain} km away
                  </p>
                )}
              </div>
            </div>

            {isMyRide && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                {ride.status === "ongoing" ? "Active" : "Accepted"}
              </span>
            )}
          </div>

          {/* Locations - Compact */}
          <div className="space-y-2 mb-3">
            {/* Pickup */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-record-circle-fill text-green-600 text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {ride.pickup}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-map-pin-fill text-red-600 text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Drop-off</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {ride.destination}
                </p>
              </div>
            </div>
          </div>

          {/* Order Info - Compact */}
          {ride.order && (
            <div className="bg-orange-50 rounded-lg p-2.5 mb-3 border border-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="ri-shopping-bag-3-fill text-orange-600 text-lg"></i>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Food Order
                    </p>
                    <p className="text-[10px] text-gray-600">
                      {ride.order.cart?.length || 0} items •
                      <span
                        className={`ml-1 ${
                          ride.order.status === "Preparing" ||
                          ride.order.status === "Prepared"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {ride.order.status || "Pending"}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-orange-700">
                  PKR {ride.order.totalPrice}
                </p>
              </div>
            </div>
          )}

          {/* Bottom - Fare & Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <i className="ri-money-dollar-circle-fill text-green-600 text-xl"></i>
              <div>
                <p className="text-xs text-gray-500">Delivery Fee</p>
                <p className="text-lg font-bold text-gray-800">
                  PKR {ride.fare}
                </p>
              </div>
            </div>

            {/* Action Button */}
            {!isMyRide ? (
              <button
                onClick={() => handleAcceptRide(ride._id)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                <i className="ri-check-line"></i>
                Accept
              </button>
            ) : (
              <div>
                {ride.status === "accepted" ? (
                  <Link
                    to="/captain-home"
                    state={{ activeRide: ride }}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                  >
                    <i className="ri-play-circle-fill"></i>
                    Start
                  </Link>
                ) : (
                  <Link
                    to="/captain-home"
                    state={{ activeRide: ride }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                  >
                    <i className="ri-navigation-fill"></i>
                    View
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {selectedRide === ride._id && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Distance:</span>
                <span className="ml-2 font-medium">
                  {ride.distance
                    ? `${(ride.distance / 1000).toFixed(2)} km`
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>
                <span className="ml-2 font-medium">
                  {ride.duration
                    ? `${Math.round(ride.duration / 60)} min`
                    : "N/A"}
                </span>
              </div>
              {ride.user?.phoneNumber && (
                <div className="col-span-2">
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 font-medium">
                    {ride.user.phoneNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Details Toggle */}
        <button
          onClick={() =>
            setSelectedRide(selectedRide === ride._id ? null : ride._id)
          }
          className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          {selectedRide === ride._id ? (
            <>
              <i className="ri-arrow-up-s-line"></i>
              Hide Details
            </>
          ) : (
            <>
              <i className="ri-arrow-down-s-line"></i>
              View Details
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 scrollbar-hide">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link
            to="/captain-home"
            className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-lg font-bold">Deliveries</h1>
          <button
            onClick={fetchAllRides}
            className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="ri-refresh-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 px-4 py-3.5 font-semibold text-sm transition-all relative ${
              activeTab === "available"
                ? "text-pink-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <i className="ri-store-2-line text-base"></i>
              <span>Available</span>
              {availableRides.length > 0 && (
                <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {availableRides.length}
                </span>
              )}
            </div>
            {activeTab === "available" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("myRides")}
            className={`flex-1 px-4 py-3.5 font-semibold text-sm transition-all relative ${
              activeTab === "myRides"
                ? "text-green-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <i className="ri-e-bike-2-line text-base"></i>
              <span>Active</span>
              {myRides.length > 0 && (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {myRides.length}
                </span>
              )}
            </div>
            {activeTab === "myRides" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3.5 font-semibold text-sm transition-all relative ${
              activeTab === "history"
                ? "text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <i className="ri-history-line text-base"></i>
              <span>History</span>
              {completedRides.length > 0 && (
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {completedRides.length}
                </span>
              )}
            </div>
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Location Warning Message - Only for available rides tab */}
        {activeTab === "available" && locationMessage && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-line text-yellow-600 text-xl"></i>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Location Update Pending
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {locationMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading rides...</p>
          </div>
        ) : activeTab === "available" ? (
          // Available Rides Tab
          availableRides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="ri-car-line text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Available Rides
              </h2>
              <p className="text-gray-500 text-center">
                There are no new rides in your area at the moment.
                <br />
                New rides will appear here automatically.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {availableRides.length}{" "}
                  {availableRides.length === 1 ? "Ride" : "Rides"} Available
                </h2>
                <span className="text-sm text-gray-600">Updated just now</span>
              </div>

              {/* Available Rides List */}
              {availableRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} isMyRide={false} />
              ))}
            </div>
          )
        ) : activeTab === "myRides" ? (
          // My Active Rides Tab
          myRides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="ri-steering-2-line text-6xl text-gray-300 mb-4"></i>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Active Rides
              </h2>
              <p className="text-gray-500 text-center">
                You don't have any active rides at the moment.
                <br />
                Accept a ride from the "Available Rides" tab to get started.
              </p>
              <button
                onClick={() => setActiveTab("available")}
                className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <i className="ri-eye-line"></i>
                View Available Rides
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {myRides.length} Active{" "}
                  {myRides.length === 1 ? "Ride" : "Rides"}
                </h2>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  In Progress
                </span>
              </div>

              {/* My Rides List */}
              {myRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} isMyRide={true} />
              ))}
            </div>
          )
        ) : // Ride History Tab
        completedRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-history-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Completed Rides
            </h2>
            <p className="text-gray-500 text-center">
              Your completed ride history will appear here.
              <br />
              Complete rides to build your history.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {completedRides.length} Completed{" "}
                {completedRides.length === 1 ? "Ride" : "Rides"}
              </h2>
              <span className="text-sm text-blue-600">All Time</span>
            </div>

            {/* Completed Rides List */}
            {completedRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow mb-3 border border-gray-100 overflow-hidden"
              >
                {/* Header Bar - Green for completed */}
                <div className="h-1 bg-green-500"></div>

                {/* Header - Customer & Date */}
                <div className="px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-white text-sm"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {ride.user?.name ||
                            ride.user?.fullname?.firstname ||
                            "Customer"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(ride.completedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                      <i className="ri-check-line"></i>
                      Completed
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-3">
                  {/* Locations - Compact */}
                  <div className="space-y-2 mb-3">
                    {/* Pickup */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-record-circle-fill text-green-600 text-xs"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {ride.pickup}
                        </p>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-map-pin-fill text-red-600 text-xs"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Drop-off</p>
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {ride.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Food Order Details */}
                  {ride.order && (
                    <div className="bg-orange-50 rounded-lg p-2.5 mb-3 border border-orange-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <i className="ri-shopping-bag-3-fill text-orange-600 text-base"></i>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">
                              Food Order
                            </p>
                            <p className="text-[10px] text-gray-600">
                              {ride.order.cart?.length || 0} items • #
                              {ride.order._id?.slice(-6).toUpperCase() || "N/A"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-orange-700">
                          PKR {ride.order.totalPrice}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bottom - Earnings & Proof */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <i className="ri-money-dollar-circle-fill text-green-600 text-xl"></i>
                      <div>
                        <p className="text-xs text-gray-500">You Earned</p>
                        <p className="text-lg font-bold text-green-600">
                          PKR {ride.fare}
                        </p>
                      </div>
                    </div>

                    {/* Completion Proof */}
                    {ride.completionEvidence?.url && (
                      <img
                        src={ride.completionEvidence.url}
                        alt="Delivery proof"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-green-200"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>You're online and available for rides</span>
        </div>
      </div>
    </div>
  );
};

export default CaptainPendingRides;
