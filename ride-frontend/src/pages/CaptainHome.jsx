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
  const captainDetailsRef = useRef(null);
  const [ride, setRide] = useState(null);
  const [pendingRidesCount, setPendingRidesCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if returning from a completed ride
  useEffect(() => {
    if (location.state?.rideCompleted) {
      console.log("🎉 Ride completed! Refreshing stats...");
      // Force refresh of CaptainDetails component
      setRefreshKey((prev) => prev + 1);
      // Also refresh pending rides count
      fetchPendingRides();
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      if (!ridePopupPanelRef.current) {
        console.warn("ridePopupPanelRef is null, skipping animation");
        return;
      }

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
      if (!confirmRidePopupPanelRef.current) {
        console.warn("confirmRidePopupPanelRef is null, skipping animation");
        return;
      }

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
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50">
      {/* Left Sidebar - Captain Details (Enhanced for Desktop) */}
      <div className="lg:w-[380px] xl:w-[420px] h-screen overflow-y-auto border-r border-gray-200 bg-white flex-shrink-0 shadow-lg scrollbar-hide">
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          <CaptainDetails key={refreshKey} refreshKey={refreshKey} />

          {/* Quick Actions Section */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <i className="ri-dashboard-line text-orange-600"></i>
              Quick Actions
            </h3>

            {/* View All Pending Rides */}
            <Link
              to="/captain-pending-rides"
              className="relative flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm w-full"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <i className="ri-notification-3-line text-xl"></i>
              </div>
              <div className="flex-1">
                <div className="font-bold">Pending Rides</div>
                <div className="text-xs text-white/80">
                  View all available rides
                </div>
              </div>
              {pendingRidesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center animate-pulse shadow-lg">
                  {pendingRidesCount}
                </span>
              )}
            </Link>

            {/* My Active Rides */}
            <Link
              to="/captain-pending-rides"
              state={{ defaultTab: "active" }}
              className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-500 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm w-full"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-taxi-line text-xl text-orange-600"></i>
              </div>
              <div className="flex-1">
                <div className="font-bold">My Active Rides</div>
                <div className="text-xs text-gray-500">
                  View ongoing deliveries
                </div>
              </div>
            </Link>

            {/* Ride History */}
            <Link
              to="/captain-pending-rides"
              state={{ defaultTab: "history" }}
              className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-500 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all text-sm w-full"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-history-line text-xl text-green-600"></i>
              </div>
              <div className="flex-1">
                <div className="font-bold">Ride History</div>
                <div className="text-xs text-gray-500">
                  View completed rides
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Main Content Area (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 lg:w-auto relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
        {/* Hero Section */}
        <div className="min-h-full flex items-center justify-center py-8 px-4 w-full">
          <div className="text-center w-full max-w-3xl">
            {/* Map Icon & Status */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                <i className="ri-map-2-line text-6xl text-white"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3 shadow-lg animate-pulse">
                <i className="ri-record-circle-line text-2xl text-white"></i>
              </div>
            </div>

            {/* Status Text */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              You're Online & Ready!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your location is being tracked. New ride requests will appear
              here.
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-base font-bold text-gray-800">
                Online & Available
              </span>
            </div>

            {/* Pending Rides Alert */}
            {pendingRidesCount > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-300 rounded-2xl p-6 mb-6 shadow-lg animate-pulse">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <i className="ri-notification-badge-line text-4xl text-orange-600"></i>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {pendingRidesCount} New{" "}
                      {pendingRidesCount === 1 ? "Ride" : "Rides"}!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customers are waiting for delivery
                    </p>
                  </div>
                </div>

                <Link
                  to="/captain-pending-rides"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all text-base"
                >
                  <i className="ri-eye-line text-xl"></i>
                  View Pending Rides
                </Link>
              </div>
            )}

            {/* Show Single Pending Ride Button */}
            {ride && !ridePopupPanel && !confirmRidePopupPanel && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    if (ride.status === "pending") {
                      setRidePopupPanel(true);
                    } else if (ride.status === "accepted") {
                      setConfirmRidePopupPanel(true);
                    }
                  }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg animate-bounce"
                >
                  <i className="ri-notification-3-line text-2xl"></i>
                  View Your Pending Ride
                </button>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-timer-line text-2xl text-blue-600"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Quick Response</h4>
                <p className="text-xs text-gray-600">
                  Accept rides instantly and start earning
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Earn More</h4>
                <p className="text-xs text-gray-600">
                  Higher earnings during peak hours
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shield-check-line text-2xl text-purple-600"></i>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Safe Delivery</h4>
                <p className="text-xs text-gray-600">
                  OTP verification for secure handoff
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay for popups */}
      {(ridePopupPanel || confirmRidePopupPanel) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
      )}

      {/* Ride request popup - centered on screen */}
      {ridePopupPanel && (
        <div
          ref={ridePopupPanelRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl lg:max-w-3xl">
            <RidePopUp
              ride={ride}
              setRidePopupPanel={setRidePopupPanel}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              confirmRide={confirmRide}
            />
          </div>
        </div>
      )}

      {/* Confirm ride popup - centered on screen */}
      {confirmRidePopupPanel && (
        <div
          ref={confirmRidePopupPanelRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl lg:max-w-3xl">
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
