import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  // Only one popup visible at a time

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);
  const [pendingRidesCount, setPendingRidesCount] = useState(0);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Function to fetch pending rides
  const fetchPendingRides = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/pending-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Pending rides fetched:", response.data);

      if (response.data.rides && response.data.rides.length > 0) {
        setPendingRidesCount(response.data.rides.length);

        // If captain has no active ride, auto-load the first pending ride
        if (!ride) {
          const firstPendingRide = response.data.rides[0];
          console.log("Auto-loading first pending ride:", firstPendingRide);
          setRide(firstPendingRide);
          setRidePopupPanel(true);
        }
      } else {
        setPendingRidesCount(0);
      }
    } catch (error) {
      console.error("Error fetching pending rides:", error);
    }
  };

  useEffect(() => {
    console.log("Captain data:", captain);
    console.log("Socket connected:", socket?.connected);

    // Remove any existing listeners first to prevent duplicates
    socket.off("new-ride");

    // Set up socket event listener for new rides
    socket.on("new-ride", (data) => {
      console.log("New ride received:", data);
      setRide(data);
      setRidePopupPanel(true);
      setConfirmRidePopupPanel(false);
      setPendingRidesCount((prev) => prev + 1);
    });

    // Only emit join event and update location if captain data is available
    if (captain && captain._id) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      // Fetch pending rides when component mounts
      fetchPendingRides();

      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            socket.emit("update-location-captain", {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          });
        }
      };

      const locationInterval = setInterval(updateLocation, 10000);
      updateLocation();

      // Refresh pending rides count every 30 seconds
      const ridesInterval = setInterval(fetchPendingRides, 30000);

      // Clean up function to remove event listeners and intervals
      return () => {
        clearInterval(locationInterval);
        clearInterval(ridesInterval);
        socket.off("new-ride");
      };
    } else {
      // If no captain data, just clean up the socket event
      return () => {
        socket.off("new-ride");
      };
    }
  }, [captain, socket]);

  // Accept ride, then show confirm/start popup
  async function confirmRide() {
    try {
      // Validate ride and captain data
      if (!ride || !ride._id) {
        console.error("Ride data missing:", ride);
        alert("Cannot confirm ride: Ride data is missing");
        return;
      }

      if (!captain || !captain._id) {
        console.error("Captain data missing:", captain);
        alert("Cannot confirm ride: Captain data is missing");
        return;
      }

      console.log("Confirming ride with:", {
        rideId: ride._id,
        captainId: captain._id,
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Ride confirmed successfully:", response.data);

      // First hide the ride popup
      setRidePopupPanel(false);
      // Then show confirm popup after a small delay for better transition
      setTimeout(() => {
        setConfirmRidePopupPanel(true);
      }, 300);
    } catch (error) {
      console.error("Error confirming ride:", error);
      console.error("Error response:", error.response?.data);
      alert(
        error.response?.data?.message ||
          "Failed to confirm ride. Please try again."
      );
    }
  }

  useGSAP(
    function () {
      console.log("Ride popup animation triggered. State:", ridePopupPanel);
      if (ridePopupPanel) {
        console.log("Showing ride popup");
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        console.log("Hiding ride popup");
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="p-6">
        <CaptainDetails />
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-map-2-line text-6xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-500 font-semibold">Live Map View</p>
            <p className="text-sm text-gray-400 mt-2">
              Your location is being tracked
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                Online & Available
              </span>
            </div>

            {/* Pending Rides Count Badge */}
            {pendingRidesCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <i className="ri-notification-badge-line text-blue-600"></i>
                <span className="text-sm font-medium text-blue-700">
                  {pendingRidesCount} Pending{" "}
                  {pendingRidesCount === 1 ? "Ride" : "Rides"}
                </span>
              </div>
            )}

            {/* Show Pending Ride Button */}
            {ride && !ridePopupPanel && !confirmRidePopupPanel && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    // Check ride status
                    if (ride.status === "pending") {
                      setRidePopupPanel(true);
                    } else if (ride.status === "accepted") {
                      setConfirmRidePopupPanel(true);
                    }
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2 mx-auto animate-pulse"
                >
                  <i className="ri-notification-3-line text-xl"></i>
                  View Pending Ride
                </button>
              </div>
            )}

            {/* View All Pending Rides Button */}
            <div className="mt-4">
              <Link
                to="/captain-pending-rides"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
              >
                <i className="ri-list-check-2 text-xl"></i>
                View All Pending Rides
                {pendingRidesCount > 0 && (
                  <span className="bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-bold">
                    {pendingRidesCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay for popups */}
      {(ridePopupPanel || confirmRidePopupPanel) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
      )}

      {/* Ride request popup - full screen */}
      {ridePopupPanel && (
        <div
          ref={ridePopupPanelRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <RidePopUp
                ride={ride}
                setRidePopupPanel={setRidePopupPanel}
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                confirmRide={confirmRide}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm ride popup - full screen */}
      {confirmRidePopupPanel && (
        <div
          ref={confirmRidePopupPanelRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
        >
          <div className="w-full h-full flex items-center justify-center">
            <ConfirmRidePopUp
              ride={ride}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              setRidePopupPanel={setRidePopupPanel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainHome;
