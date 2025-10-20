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
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]); // Default Pakistan center

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

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
    } else if (data?.ride?.pickupCoordinates) {
      // If no captain location, center on pickup
      console.log("📍 Using pickup coordinates:", data.ride.pickupCoordinates);
      setMapCenter([
        data.ride.pickupCoordinates.lat,
        data.ride.pickupCoordinates.lng,
      ]);
    } else if (data?.ride?.destinationCoordinates) {
      // Last resort: center on destination
      console.log(
        "📍 Using destination coordinates:",
        data.ride.destinationCoordinates
      );
      setMapCenter([
        data.ride.destinationCoordinates.lat,
        data.ride.destinationCoordinates.lng,
      ]);
    } else {
      // Ultimate fallback: Pakistan center
      console.log("📍 Using default Pakistan center");
      setMapCenter([30.3753, 69.3451]);
    }
  }, [
    captainLocation,
    data?.ride?.captain?.location,
    data?.ride?.pickupCoordinates,
    data?.ride?.destinationCoordinates,
  ]);

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
        title: "Delivered",
        message: "Your order has been delivered successfully!",
        color: "text-green-600",
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

  // ALWAYS show map if captain is assigned - SIMPLIFIED
  const showMap = data?.ride?.captain ? true : false;

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
          <p className="text-gray-600">{statusInfo?.message}</p>

          {/* Captain Info */}
          {data?.ride?.captain && (
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
                      ⚠️ Location data not available for this order. Only
                      showing captain location.
                    </p>
                  </div>
                )}

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
                        captainLocation?.lat || data.ride.captain.location.lat,
                        captainLocation?.lng || data.ride.captain.location.lng,
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
                  {data?.ride?.pickupCoordinates && (
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
                  )}

                  {/* Drop Location Marker */}
                  {data?.ride?.destinationCoordinates && (
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
                  )}
                </MapContainer>
              </div>
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
