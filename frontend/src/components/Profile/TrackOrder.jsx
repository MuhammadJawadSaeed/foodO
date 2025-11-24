import React, { useEffect, useState, useRef } from "react";
import { FaPhoneAlt, FaMotorcycle, FaBox, FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import { server } from "../../server";

// Pakistani cities coordinates for fallback
const PAKISTANI_CITIES_COORDS = {
  sahiwal: [30.6682, 73.1114],
  lahore: [31.5204, 74.3587],
  karachi: [24.8607, 67.0011],
  islamabad: [33.6844, 73.0479],
  rawalpindi: [33.5651, 73.0169],
  faisalabad: [31.4504, 73.135],
  multan: [30.1575, 71.5249],
  gujranwala: [32.1877, 74.1945],
  peshawar: [34.0151, 71.5249],
  quetta: [30.1798, 66.975],
  sialkot: [32.4945, 74.5229],
  sargodha: [32.0836, 72.6711],
};

// Function to extract city coordinates from address
const getCoordsFromAddress = (address) => {
  if (!address) return null;

  const addressLower = address.toLowerCase();
  for (const [city, coords] of Object.entries(PAKISTANI_CITIES_COORDS)) {
    if (addressLower.includes(city)) {
      console.log(`📍 Found ${city} in address:`, address);
      return coords;
    }
  }
  return null;
};

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const captainIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const socketRef = useRef(null);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null); // Will be set dynamically

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  // Initialize map center based on available data
  useEffect(() => {
    if (!data) return;

    // Try to get coordinates from ride data or extract from addresses
    let initialCenter = null;

    if (data.ride?.pickupCoordinates) {
      initialCenter = [
        data.ride.pickupCoordinates.lat,
        data.ride.pickupCoordinates.lng,
      ];
      console.log("📍 Using pickup coordinates from DB:", initialCenter);
    } else if (data.ride?.pickup) {
      const coords = getCoordsFromAddress(data.ride.pickup);
      if (coords) {
        initialCenter = coords;
        console.log("📍 Using pickup city coordinates:", initialCenter);
      }
    }

    if (!initialCenter && data.ride?.destinationCoordinates) {
      initialCenter = [
        data.ride.destinationCoordinates.lat,
        data.ride.destinationCoordinates.lng,
      ];
      console.log("📍 Using destination coordinates from DB:", initialCenter);
    } else if (!initialCenter && data.ride?.destination) {
      const coords = getCoordsFromAddress(data.ride.destination);
      if (coords) {
        initialCenter = coords;
        console.log("📍 Using destination city coordinates:", initialCenter);
      }
    }

    if (!initialCenter) {
      initialCenter = [30.3753, 69.3451]; // Pakistan center as last resort
      console.log("📍 Using Pakistan center as fallback");
    }

    setMapCenter(initialCenter);
  }, [data]);

  // Setup socket connection for live captain location updates
  useEffect(() => {
    if (data?.ride?.captain?._id) {
      const socketUrl = server.replace("/api/v2", "");
      console.log("🔌 Connecting to socket:", socketUrl);
      socketRef.current = io(socketUrl);

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current.id);
      });

      // Join room for captain updates
      socketRef.current.emit("join", {
        userId: data.ride.captain._id,
        userType: "captain",
      });
      console.log("📡 Joined room for captain:", data.ride.captain._id);

      // Listen for captain location updates
      socketRef.current.on("captain-location-updated", (locationData) => {
        console.log("📍 Captain location update received:", locationData);
        if (locationData.captainId === data.ride.captain._id) {
          console.log("✅ Location update is for our captain, updating map");
          setCaptainLocation({
            lat: locationData.location.lat,
            lng: locationData.location.lng,
          });
        } else {
          console.log("⚠️ Location update is for different captain");
        }
      });

      // Set initial captain location if available
      if (data.ride.captain.location) {
        console.log(
          "📍 Setting initial captain location:",
          data.ride.captain.location
        );
        setCaptainLocation({
          lat: data.ride.captain.location.lat,
          lng: data.ride.captain.location.lng,
        });
      } else {
        console.log("⚠️ No captain location available in ride data");
      }

      return () => {
        console.log("🔌 Disconnecting socket");
        socketRef.current?.disconnect();
      };
    } else {
      console.log("⚠️ No captain assigned to this ride yet");
    }
  }, [data?.ride?.captain]);

  // Update map center when captain location changes
  useEffect(() => {
    if (!mapCenter) return; // Wait for initial center to be set

    console.log("🗺️ Updating map center...");

    if (captainLocation) {
      console.log("📍 Using live captain location:", captainLocation);
      setMapCenter([captainLocation.lat, captainLocation.lng]);
    } else if (data?.ride?.captain?.location) {
      // Use captain's saved location if no live updates yet
      console.log(
        "📍 Using saved captain location:",
        data.ride.captain.location
      );
      setMapCenter([
        data.ride.captain.location.lat,
        data.ride.captain.location.lng,
      ]);
    }
    // Note: We don't update to pickup/destination here anymore
    // as initial center is already set in the previous useEffect
  }, [captainLocation, data?.ride?.captain?.location]);

  const getStatusMessage = () => {
    if (!data) return null;

    if (data.status === "Pending") {
      return {
        title: "Order Placed",
        message: "Your order is waiting for shop confirmation.",
        color: "text-gray-700",
      };
    }
    if (data.status === "Confirmed by Shop") {
      return {
        title: "Confirmed",
        message:
          "Your order has been confirmed! Delivery partner is being assigned.",
        color: "text-blue-600",
      };
    }
    if (data.status === "Cancelled") {
      return {
        title: "Cancelled",
        message: "Your order has been cancelled by the shop.",
        color: "text-red-600",
      };
    }
    if (data.status === "Processing") {
      return {
        title: "Processing",
        message: "Your order is being prepared in the shop.",
        color: "text-yellow-600",
      };
    }
    if (
      data.status === "Transferred to delivery partner" ||
      data.rideStatus === "accepted"
    ) {
      return {
        title: "Rider Assigned",
        message: "Your order has been assigned to a delivery partner.",
        color: "text-blue-600",
      };
    }
    if (data.status === "Shipping" || data.rideStatus === "started") {
      return {
        title: "On the Way",
        message: "Your delivery partner is on the way to deliver your order.",
        color: "text-green-600",
      };
    }
    if (data.status === "Delivered") {
      return {
        title: "✅ Delivered Successfully",
        message:
          "Your order has been delivered successfully! Thank you for ordering.",
        color: "text-green-700",
      };
    }
    if (data.rideStatus === "completed") {
      return {
        title: "✅ Delivered Successfully",
        message:
          "Your order has been delivered successfully! Thank you for ordering.",
        color: "text-green-700",
      };
    }
    return {
      title: "In Progress",
      message: "Your order is being processed.",
      color: "text-gray-700",
    };
  };

  const statusInfo = getStatusMessage();

  // Debug logs
  console.log("🔍 TrackOrder Debug:", {
    orderId: data?._id,
    status: data?.status,
    rideStatus: data?.rideStatus,
    hasRide: !!data?.ride,
    hasCaptain: !!data?.ride?.captain,
    captainId: data?.ride?.captain?._id,
    captainLocationInDB: data?.ride?.captain?.location,
    captainLocationLive: captainLocation,
    pickupCoords: data?.ride?.pickupCoordinates,
    destinationCoords: data?.ride?.destinationCoordinates,
  });

  // ALWAYS show map if captain is assigned AND ride not delivered
  const showMap =
    data?.ride?.captain &&
    data?.status !== "Delivered" &&
    data?.rideStatus !== "completed"
      ? true
      : false;

  console.log("🗺️ Show Map Decision:", showMap);
  console.log("🗺️ Map will display:", showMap ? "✅ YES" : "❌ NO");
  console.log("🗺️ Captain exists:", !!data?.ride?.captain);
  console.log("🗺️ Full ride object:", data?.ride);

  return (
    <div
      className="w-full min-h-[80vh] bg-gray-50 py-8 px-4"
      style={{
        marginTop: "70px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${statusInfo?.color}`}>
            {statusInfo?.title}
          </h2>
          <p className="text-gray-600 text-lg">{statusInfo?.message}</p>

          {/* Delivered Success Message with Icon */}
          {(data?.status === "Delivered" ||
            data?.rideStatus === "completed") && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-500">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-green-800 mb-1">
                    Order Delivered!
                  </h3>
                  <p className="text-green-700 font-medium">
                    Your order has been successfully delivered. Enjoy your meal!
                    🍽️
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Captain Info - Only show if NOT delivered */}
          {data?.ride?.captain &&
            data?.status !== "Delivered" &&
            data?.rideStatus !== "completed" && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">
                  Delivery Partner Details
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={
                      data.ride.captain.profileImage?.url ||
                      "https://via.placeholder.com/60"
                    }
                    alt={data.ride.captain.fullname?.firstname}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {data.ride.captain.fullname?.firstname}{" "}
                      {data.ride.captain.fullname?.lastname}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaPhoneAlt className="inline-block mr-1" />{" "}
                      {data.ride.captain.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaMotorcycle className="inline-block mr-1" />{" "}
                      {data.ride.captain.vehicle?.vehicleType} -{" "}
                      {data.ride.captain.vehicle?.plate}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Map */}
        {showMap ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-600">
              <h3 className="font-semibold text-lg text-white">
                Live Tracking
              </h3>
              <p className="text-sm text-pink-100">
                {captainLocation
                  ? "Rider is on the way to your location"
                  : "Waiting for rider location..."}
              </p>
            </div>
            <div className="h-[500px] relative overflow-hidden">
              {/* Warning if coordinates missing */}
              {!data?.ride?.pickupCoordinates &&
                !data?.ride?.destinationCoordinates && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">
                      ⚠️ Using approximate city locations. Exact coordinates not
                      available.
                    </p>
                  </div>
                )}

              {mapCenter && (
                <div className="w-full h-full overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapUpdater center={mapCenter} />

                    {/* Captain Marker - Use live location or saved location */}
                    {(captainLocation || data?.ride?.captain?.location) && (
                      <Marker
                        position={[
                          captainLocation?.lat ||
                            data.ride.captain.location.lat,
                          captainLocation?.lng ||
                            data.ride.captain.location.lng,
                        ]}
                        icon={captainIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <strong className="flex items-center justify-center gap-1">
                              <FaMotorcycle /> Delivery Partner
                            </strong>
                            <br />
                            {data.ride.captain.fullname?.firstname}{" "}
                            {data.ride.captain.fullname?.lastname}
                            <br />
                            <small className="text-gray-500">
                              {captainLocation
                                ? "Live Location"
                                : "Last Known Location"}
                            </small>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Pickup Location Marker */}
                    {data?.ride?.pickupCoordinates ? (
                      <Marker
                        position={[
                          data.ride.pickupCoordinates.lat,
                          data.ride.pickupCoordinates.lng,
                        ]}
                        icon={pickupIcon}
                      >
                        <Popup>
                          <strong className="flex items-center gap-1">
                            <FaBox /> Pickup Location
                          </strong>
                          <br />
                          {data.ride.pickup || "Shop"}
                        </Popup>
                      </Marker>
                    ) : data?.ride?.pickup &&
                      getCoordsFromAddress(data.ride.pickup) ? (
                      <Marker
                        position={getCoordsFromAddress(data.ride.pickup)}
                        icon={pickupIcon}
                      >
                        <Popup>
                          <strong className="flex items-center gap-1">
                            <FaBox /> Pickup Location (Approximate)
                          </strong>
                          <br />
                          {data.ride.pickup || "Shop"}
                        </Popup>
                      </Marker>
                    ) : null}

                    {/* Drop Location Marker */}
                    {data?.ride?.destinationCoordinates ? (
                      <Marker
                        position={[
                          data.ride.destinationCoordinates.lat,
                          data.ride.destinationCoordinates.lng,
                        ]}
                        icon={dropIcon}
                      >
                        <Popup>
                          <strong className="flex items-center gap-1">
                            <FaHome /> Delivery Location
                          </strong>
                          <br />
                          {data.ride.destination || "Your address"}
                        </Popup>
                      </Marker>
                    ) : data?.ride?.destination &&
                      getCoordsFromAddress(data.ride.destination) ? (
                      <Marker
                        position={getCoordsFromAddress(data.ride.destination)}
                        icon={dropIcon}
                      >
                        <Popup>
                          <strong className="flex items-center gap-1">
                            <FaHome /> Delivery Location (Approximate)
                          </strong>
                          <br />
                          {data.ride.destination || "Your address"}
                        </Popup>
                      </Marker>
                    ) : null}
                  </MapContainer>
                </div>
              )}
            </div>
          </div>
        ) : (
          !data?.ride?.captain && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaMotorcycle className="text-6xl mb-4 mx-auto text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Waiting for Delivery Partner
              </h3>
              <p className="text-gray-500">
                A delivery partner will be assigned to your order soon.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
