import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  // Load accepted ride from localStorage on page load (for page reload)
  // BUT validate it against database first to ensure it still exists
  // This runs ONLY on initial mount, NOT when coming from pending rides page
  useEffect(() => {
    const validateAndLoadRide = async () => {
      // Skip if coming from navigation with new ride data
      if (location.state?.acceptedRide || location.state?.activeRide) {
        return;
      }

      const savedRide = localStorage.getItem("acceptedRide");

      if (savedRide) {
        try {
          const rideData = JSON.parse(savedRide);

          // Validate that the ride still exists in the database
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/rides/${rideData._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            // Check if ride is still accepted/ongoing
            if (
              response.data.ride &&
              (response.data.ride.status === "accepted" ||
                response.data.ride.status === "ongoing")
            ) {
              setRide(response.data.ride);
              setConfirmRidePopupPanel(true);
              setRidePopupPanel(false);
            } else {
              localStorage.removeItem("acceptedRide");
              setRide(null);
              setConfirmRidePopupPanel(false);
            }
          } catch (validationError) {
            localStorage.removeItem("acceptedRide");
            setRide(null);
            setConfirmRidePopupPanel(false);
          }
        } catch (error) {
          console.error("Error parsing saved ride:", error);
          localStorage.removeItem("acceptedRide");
        }
      }
    };

    validateAndLoadRide();
  }, []); // Empty dependency array - runs only once on mount

  // Check if coming from pending rides page with accepted ride
  useEffect(() => {
    if (location.state?.acceptedRide && location.state?.showConfirmPopup) {
      setRide(location.state.acceptedRide);

      // Save to localStorage for page reload persistence
      const rideToSave = JSON.stringify(location.state.acceptedRide);
      localStorage.setItem("acceptedRide", rideToSave);

      setConfirmRidePopupPanel(true);
      setRidePopupPanel(false);

      // Clear the location state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check if coming from "My Active Rides" tab with active ride to start
  useEffect(() => {
    if (location.state?.activeRide) {
      const activeRide = location.state.activeRide;
      setRide(activeRide);

      // Check ride status to determine next action
      if (activeRide.status === "ongoing") {
        // Ride is already started - go directly to riding page
        localStorage.removeItem("acceptedRide"); // Clear from storage
        navigate("/captain-riding", { state: { ride: activeRide } });
      } else if (activeRide.status === "accepted") {
        // Ride is accepted but not started - show OTP popup

        // Save to localStorage for page reload persistence
        const rideToSave = JSON.stringify(activeRide);
        localStorage.setItem("acceptedRide", rideToSave);

        // Show confirm popup so captain can enter OTP and start
        setConfirmRidePopupPanel(true);
        setRidePopupPanel(false);
      }

      // Clear the location state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Start online session when component mounts
  useEffect(() => {
    const startSession = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/captains/start-session`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Online session started");
      } catch (error) {
        console.error("Error starting session:", error);
      }
    };

    if (captain && captain._id) {
      startSession();
    }

    // End session when component unmounts (captain closes app/logs out)
    return () => {
      const endSession = async () => {
        try {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/captains/end-session`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Online session ended");
        } catch (error) {
          console.error("Error ending session:", error);
        }
      };
      endSession();
    };
  }, [captain]);

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

        // ONLY auto-load if captain has NO active ride AND confirm popup is not open
        // This prevents overwriting an accepted ride with a pending one
        if (!ride && !confirmRidePopupPanel) {
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

      // ONLY show new ride popup if there's NO active accepted ride
      // Don't override an accepted ride with a new pending one
      if (!confirmRidePopupPanel) {
        setRide(data);
        setRidePopupPanel(true);
        setConfirmRidePopupPanel(false);
        setPendingRidesCount((prev) => prev + 1);
      } else {
        console.log("⚠️ Ignoring new ride - captain has active accepted ride");
        // Just update the count
        setPendingRidesCount((prev) => prev + 1);
      }
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

      // Periodic validation: Check if current ride still exists every 30 seconds
      const validateCurrentRide = async () => {
        const savedRide = localStorage.getItem("acceptedRide");

        // ONLY validate if there's actually an accepted ride with confirm popup open
        if (savedRide && ride && ride._id && confirmRidePopupPanel) {
          try {
            console.log(
              "🔄 Validating current ride exists in database:",
              ride._id
            );
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/rides/${ride._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            // Check if ride status is still active
            if (
              !response.data.ride ||
              (response.data.ride.status !== "accepted" &&
                response.data.ride.status !== "ongoing")
            ) {
              console.log("⚠️ Current ride no longer active, clearing from UI");
              localStorage.removeItem("acceptedRide");
              setRide(null);
              setConfirmRidePopupPanel(false);
              setRidePopupPanel(false);
            } else {
              console.log("✅ Ride validation successful - ride still active");
            }
          } catch (error) {
            console.error(
              "❌ Current ride validation failed (deleted from DB?)"
            );
            console.log("🗑️ Clearing ride from localStorage and UI");
            localStorage.removeItem("acceptedRide");
            setRide(null);
            setConfirmRidePopupPanel(false);
            setRidePopupPanel(false);
          }
        }
      };

      // Validate current ride every 30 seconds
      const rideValidationInterval = setInterval(validateCurrentRide, 30000);
      // Also validate once after 10 seconds (not immediately to avoid conflicts)
      const initialValidationTimeout = setTimeout(validateCurrentRide, 10000);

      // Clean up function to remove event listeners and intervals
      return () => {
        clearInterval(locationInterval);
        clearInterval(ridesInterval);
        clearInterval(rideValidationInterval);
        clearTimeout(initialValidationTimeout);
        socket.off("new-ride");
      };
    } else {
      // If no captain data, just clean up the socket event
      return () => {
        socket.off("new-ride");
      };
    }
  }, [captain, socket]); // Removed 'ride' dependency to prevent re-running on ride changes

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
