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

const LiveTracking = ({ ride }) => {
  const [currentPosition, setCurrentPosition] = useState(center);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const mapRef = useRef(null);

  // Geocode addresses to coordinates
  useEffect(() => {
    if (ride && googleMapsLoaded && window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();

      // Geocode pickup address
      if (ride.pickup) {
        geocoder.geocode({ address: ride.pickup }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            setPickupCoords({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            console.error("Geocoding pickup failed:", status);
            // Fallback to dummy coordinates if geocoding fails
            setPickupCoords({ lat: 31.5204, lng: 74.3587 });
          }
        });
      }

      // Geocode destination address
      if (ride.destination) {
        geocoder.geocode({ address: ride.destination }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            setDestinationCoords({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            console.error("Geocoding destination failed:", status);
            // Fallback to dummy coordinates if geocoding fails
            setDestinationCoords({ lat: 31.5304, lng: 74.3487 });
          }
        });
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
    </LoadScript>
  );
};

export default LiveTracking;
