import React, { useEffect, useRef, useState } from "react";

const LiveLocationMap = ({ rideId, captainLocation, pickup, destination }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [captainMarker, setCaptainMarker] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Default center (Lahore, Pakistan)
    const defaultCenter = { lat: 31.5204, lng: 74.3587 };

    const newMap = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: captainLocation || defaultCenter,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(newMap);
  }, []);

  // Update captain marker
  useEffect(() => {
    if (!map || !captainLocation) return;

    if (captainMarker) {
      captainMarker.setPosition(captainLocation);
      map.panTo(captainLocation);
    } else {
      const marker = new window.google.maps.Marker({
        position: captainLocation,
        map: map,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: "Captain Location",
      });
      setCaptainMarker(marker);
    }
  }, [map, captainLocation]);

  // Add pickup marker
  useEffect(() => {
    if (!map || !pickup || pickupMarker) return;

    // Geocode pickup address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: pickup }, (results, status) => {
      if (status === "OK" && results[0]) {
        const marker = new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            scaledSize: new window.google.maps.Size(35, 35),
          },
          title: "Pickup Location",
        });
        setPickupMarker(marker);
      }
    });
  }, [map, pickup]);

  // Add destination marker
  useEffect(() => {
    if (!map || !destination || destinationMarker) return;

    // Geocode destination address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destination }, (results, status) => {
      if (status === "OK" && results[0]) {
        const marker = new window.google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(35, 35),
          },
          title: "Destination",
        });
        setDestinationMarker(marker);
      }
    });
  }, [map, destination]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-lg" />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm">Captain</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm">Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm">Destination</span>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationMap;
