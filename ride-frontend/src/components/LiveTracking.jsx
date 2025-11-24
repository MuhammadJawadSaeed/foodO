import React, { useState, useEffect, useRef } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

// Pakistani cities coordinates for fallback
const PAKISTANI_CITIES_COORDS = {
  Sahiwal: { lat: 30.6682, lng: 73.1114 },
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Faisalabad: { lat: 31.4504, lng: 73.135 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Gujranwala: { lat: 32.1877, lng: 74.1945 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Quetta: { lat: 30.1798, lng: 66.975 },
  Sialkot: { lat: 32.4945, lng: 74.5229 },
  Sargodha: { lat: 32.0836, lng: 72.6711 },
};

// Function to extract city from address
const getCityFromAddress = (address) => {
  if (!address) return null;

  const addressLower = address.toLowerCase();
  for (const [city, coords] of Object.entries(PAKISTANI_CITIES_COORDS)) {
    if (addressLower.includes(city.toLowerCase())) {
      return { city, coords };
    }
  }
  return null;
};

const LiveTracking = ({ ride }) => {
  const [currentPosition, setCurrentPosition] = useState(center);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const mapRef = useRef(null);

  // Geocode addresses to coordinates
  useEffect(() => {
    if (ride && googleMapsLoaded && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();

      // Geocode pickup address
      if (ride.pickup) {
        console.log("Geocoding pickup address:", ride.pickup);
        geocoder.geocode(
          { address: ride.pickup + ", Pakistan" },
          (results, status) => {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              const coords = {
                lat: location.lat(),
                lng: location.lng(),
              };
              console.log("✅ Pickup coordinates found:", coords);
              setPickupCoords(coords);
            } else {
              console.error("❌ Geocoding pickup failed:", status);
              // Extract city and use fallback coordinates
              const cityInfo = getCityFromAddress(ride.pickup);
              if (cityInfo) {
                console.log(
                  `Using ${cityInfo.city} coordinates for pickup:`,
                  cityInfo.coords
                );
                setPickupCoords(cityInfo.coords);
              } else {
                console.warn(
                  "⚠️ Could not determine pickup location from address:",
                  ride.pickup
                );
              }
            }
          }
        );
      }

      // Geocode destination address
      if (ride.destination) {
        console.log("Geocoding destination address:", ride.destination);
        geocoder.geocode(
          { address: ride.destination + ", Pakistan" },
          (results, status) => {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              const coords = {
                lat: location.lat(),
                lng: location.lng(),
              };
              console.log("✅ Destination coordinates found:", coords);
              setDestinationCoords(coords);
            } else {
              console.error("❌ Geocoding destination failed:", status);
              // Extract city and use fallback coordinates
              const cityInfo = getCityFromAddress(ride.destination);
              if (cityInfo) {
                console.log(
                  `Using ${cityInfo.city} coordinates for destination:`,
                  cityInfo.coords
                );
                setDestinationCoords(cityInfo.coords);
              } else {
                console.warn(
                  "⚠️ Could not determine destination location from address:",
                  ride.destination
                );
              }
            }
          }
        );
      }
    }
  }, [ride, googleMapsLoaded]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({
        lat: latitude,
        lng: longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        console.log("Position updated:", latitude, longitude);
        setCurrentPosition({
          lat: latitude,
          lng: longitude,
        });
      });
    };

    updatePosition(); // Initial position update

    const intervalId = setInterval(updatePosition, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Calculate directions when all coordinates are available
  useEffect(() => {
    if (
      pickupCoords &&
      destinationCoords &&
      googleMapsLoaded &&
      window.google &&
      window.google.maps
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickupCoords,
          destination: destinationCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);

            // Extract distance and duration from the route
            if (result.routes[0] && result.routes[0].legs[0]) {
              const leg = result.routes[0].legs[0];
              setDistance(leg.distance.text);
              setDuration(leg.duration.text);
            }
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    }
  }, [pickupCoords, destinationCoords, googleMapsLoaded]);

  // Auto-fit map bounds to show all markers
  useEffect(() => {
    if (
      mapRef.current &&
      pickupCoords &&
      destinationCoords &&
      googleMapsLoaded &&
      window.google &&
      window.google.maps
    ) {
      const bounds = new window.google.maps.LatLngBounds();

      // Include pickup and destination in bounds
      bounds.extend(pickupCoords);
      bounds.extend(destinationCoords);

      // Include captain's location if available
      if (currentPosition.lat !== center.lat) {
        bounds.extend(currentPosition);
      }

      // Fit the map to show all markers with padding
      mapRef.current.fitBounds(bounds, {
        top: 100,
        right: 50,
        bottom: 50,
        left: 50,
      });

      // Set a maximum zoom level to avoid being too close
      const listener = window.google.maps.event.addListenerOnce(
        mapRef.current,
        "bounds_changed",
        () => {
          const currentZoom = mapRef.current.getZoom();
          if (currentZoom > 16) {
            mapRef.current.setZoom(16);
          }
        }
      );

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
        }
      };
    }
  }, [pickupCoords, destinationCoords, currentPosition]);

  const onMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);

    // Initialize traffic layer
    if (window.google && window.google.maps) {
      const traffic = new window.google.maps.TrafficLayer();
      setTrafficLayer(traffic);
    }
  };

  const toggleTraffic = () => {
    if (trafficLayer && mapRef.current) {
      if (showTraffic) {
        trafficLayer.setMap(null);
      } else {
        trafficLayer.setMap(mapRef.current);
      }
      setShowTraffic(!showTraffic);
    }
  };

  const onGoogleMapsLoad = () => {
    console.log("✅ Google Maps API loaded successfully");
    setGoogleMapsLoaded(true);
  };

  // Don't render anything until Google Maps API is loaded
  if (!googleMapsLoaded) {
    return (
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={onGoogleMapsLoad}
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Map...</p>
          </div>
        </div>
      </LoadScript>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={onGoogleMapsLoad}
    >
      <div className="relative w-full h-full">
        {/* Route Info Card */}
        {(distance || duration) && (
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 sm:p-4 max-w-[180px] sm:max-w-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="font-semibold text-gray-800 text-xs sm:text-base">
                    Route
                  </span>
                </div>
                {distance && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm">{distance}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm">{duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Traffic Toggle Button */}
        <button
          onClick={toggleTraffic}
          className={`absolute top-24 right-4 z-10 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg font-medium transition-all duration-200 text-xs sm:text-base ${
            showTraffic
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="hidden sm:inline">
              {showTraffic ? "Hide Traffic" : "Show Traffic"}
            </span>
          </div>
        </button>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2 sm:p-3">
          <div className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-2">
            Legend
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full"></div>
              <span className="text-[10px] sm:text-xs text-gray-600">You</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full"></div>
              <span className="text-[10px] sm:text-xs text-gray-600">
                Pickup
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full"></div>
              <span className="text-[10px] sm:text-xs text-gray-600">Drop</span>
            </div>
          </div>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={13}
          onLoad={onMapLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
              position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
            },
            controlSize: 32,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {/* Captain's current location - Blue marker */}
          {mapLoaded && window.google && window.google.maps && (
            <Marker
              position={currentPosition}
              title="Your Current Location"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* Pickup location - Green marker with label */}
          {pickupCoords && mapLoaded && window.google && window.google.maps && (
            <Marker
              position={pickupCoords}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              label={{
                text: "PICKUP",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "bold",
                className: "marker-label",
              }}
              title={`Pickup: ${ride?.pickup || "Pickup Location"}`}
            />
          )}

          {/* Destination location - Red marker with label */}
          {destinationCoords &&
            mapLoaded &&
            window.google &&
            window.google.maps && (
              <Marker
                position={destinationCoords}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                label={{
                  text: "DESTINATION",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  className: "marker-label",
                }}
                title={`Destination: ${ride?.destination || "Destination"}`}
              />
            )}

          {/* Route from pickup to destination */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true, // We're using custom markers
                polylineOptions: {
                  strokeColor: "#2563eb", // Blue color
                  strokeWeight: 6, // Thicker line
                  strokeOpacity: 0.9, // More visible
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default LiveTracking;
