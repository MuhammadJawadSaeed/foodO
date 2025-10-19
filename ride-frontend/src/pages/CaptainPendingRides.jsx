import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { SocketContext } from "../context/SocketContext";

const CaptainPendingRides = () => {
  const [myRides, setMyRides] = useState([]);
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [activeTab, setActiveTab] = useState("available"); // 'available' or 'myRides'
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

  const fetchAllRides = async () => {
    setLoading(true);
    await Promise.all([fetchMyRides(), fetchAvailableRides()]);
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

      return () => {
        socket.off("new-ride");
        socket.off("ride-accepted");
        socket.off("ride-started");
      };
    }
  }, [socket]);

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
      <div
        className={`bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 ${
          isMyRide ? "border-green-500" : "border-indigo-500"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-user-line text-gray-600"></i>
              <span className="font-semibold text-gray-800">
                {ride.user?.name ||
                  ride.user?.fullname?.firstname ||
                  "Customer"}
              </span>
              {ride.distanceFromCaptain && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {ride.distanceFromCaptain} km away
                </span>
              )}
              {isMyRide && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  {ride.status === "ongoing" ? "In Progress" : "Accepted"}
                </span>
              )}
            </div>

            {/* Pickup Location */}
            <div className="flex items-start gap-2 mb-2">
              <i className="ri-map-pin-line text-green-600 mt-1"></i>
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm font-medium text-gray-700">
                  {ride.pickup}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-2 mb-2">
              <i className="ri-map-pin-fill text-red-600 mt-1"></i>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium text-gray-700">
                  {ride.destination}
                </p>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center gap-2 mt-3">
              <i className="ri-money-dollar-circle-line text-green-600"></i>
              <span className="text-lg font-bold text-green-600">
                PKR {ride.fare}
              </span>
            </div>

            {/* Order Info if exists */}
            {ride.order && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <i className="ri-shopping-bag-line"></i>
                <span>Food Delivery Order</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {!isMyRide ? (
            <button
              onClick={() => handleAcceptRide(ride._id)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <i className="ri-check-line text-xl"></i>
              Accept
            </button>
          ) : (
            <div className="text-right">
              {ride.status === "accepted" ? (
                <Link
                  to="/captain-home"
                  state={{ activeRide: ride }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                >
                  <i className="ri-play-line"></i>
                  Start Ride
                </Link>
              ) : (
                <Link
                  to="/captain-home"
                  state={{ activeRide: ride }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                >
                  <i className="ri-navigation-line"></i>
                  Continue
                </Link>
              )}
            </div>
          )}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link
            to="/captain-home"
            className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-xl font-bold">Rides</h1>
          <button
            onClick={fetchAllRides}
            className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="ri-refresh-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${
              activeTab === "available"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <i className="ri-checkbox-blank-circle-line"></i>
              <span>Available Rides</span>
              {availableRides.length > 0 && (
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {availableRides.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("myRides")}
            className={`flex-1 px-4 py-3 font-semibold text-sm transition-all ${
              activeTab === "myRides"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <i className="ri-steering-2-line"></i>
              <span>My Active Rides</span>
              {myRides.length > 0 && (
                <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {myRides.length}
                </span>
              )}
            </div>
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
        ) : // My Active Rides Tab
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
