import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CapatainContext";
import { SocketContext } from "../context/SocketContext";

const CaptainPendingRides = () => {
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const { captain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const fetchPendingRides = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/pending-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Pending rides:", response.data);
      setPendingRides(response.data.rides || []);

      // Set location message if available
      if (response.data.message) {
        setLocationMessage(response.data.message);
      } else {
        setLocationMessage("");
      }
    } catch (error) {
      console.error("Error fetching pending rides:", error);

      // Show user-friendly error message
      if (error.response?.status === 401) {
        alert("Please login again");
        navigate("/captain-login");
      } else {
        alert("Failed to fetch pending rides. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRides();

    // Listen for new rides via socket
    if (socket) {
      socket.on("new-ride", (data) => {
        console.log("New ride received in pending rides page:", data);
        fetchPendingRides(); // Refresh the list
      });

      return () => {
        socket.off("new-ride");
      };
    }
  }, [socket]);

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

      console.log("Ride accepted successfully:", response.data);
      alert("Ride accepted! Starting ride confirmation...");

      // Navigate to home with accepted ride data to show confirm popup
      navigate("/captain-home", {
        state: {
          acceptedRide: response.data,
          showConfirmPopup: true,
        },
      });
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert(
        error.response?.data?.message ||
          "Failed to accept ride. Please try again."
      );
    }
  };

  const RideCard = ({ ride }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-indigo-500">
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

          {/* Accept Button */}
          <button
            onClick={() => handleAcceptRide(ride._id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <i className="ri-check-line text-xl"></i>
            Accept
          </button>
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
          <h1 className="text-xl font-bold">Pending Rides</h1>
          <button
            onClick={fetchPendingRides}
            className="flex items-center gap-2 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="ri-refresh-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location Warning Message */}
        {locationMessage && (
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
            <p className="text-gray-600">Loading pending rides...</p>
          </div>
        ) : pendingRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <i className="ri-car-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Pending Rides
            </h2>
            <p className="text-gray-500 text-center">
              There are no pending rides in your area at the moment.
              <br />
              New rides will appear here automatically.
            </p>
            <Link
              to="/captain-home"
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {pendingRides.length}{" "}
                {pendingRides.length === 1 ? "Ride" : "Rides"} Available
              </h2>
              <span className="text-sm text-gray-600">Updated just now</span>
            </div>

            {/* Rides List */}
            {pendingRides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
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
