import React, { useEffect, useRef, useState } from "react";

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

const LiveLocationMap = ({ rideId, captainLocation, pickup, destination }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [captainMarker, setCaptainMarker] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Try to determine default center from pickup or destination
    let defaultCenter = { lat: 30.3753, lng: 69.3451 }; // Pakistan center

    if (pickup) {
      const cityInfo = getCityFromAddress(pickup);
      if (cityInfo) {
        defaultCenter = cityInfo.coords;
        console.log(`Using ${cityInfo.city} as map center`);
      }
    }

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
    console.log("Geocoding pickup for user map:", pickup);

    geocoder.geocode({ address: pickup + ", Pakistan" }, (results, status) => {
      if (status === "OK" && results[0]) {
        console.log("✅ Pickup geocoded successfully");
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
      } else {
        console.error("❌ Geocoding pickup failed:", status);
        // Use city-based fallback
        const cityInfo = getCityFromAddress(pickup);
        if (cityInfo) {
          console.log(`Using ${cityInfo.city} coordinates for pickup marker`);
          const marker = new window.google.maps.Marker({
            position: cityInfo.coords,
            map: map,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(35, 35),
            },
            title: "Pickup Location (Approximate)",
          });
          setPickupMarker(marker);
        }
      }
    });
  }, [map, pickup]);

  // Add destination marker
  useEffect(() => {
    if (!map || !destination || destinationMarker) return;

    // Geocode destination address
    const geocoder = new window.google.maps.Geocoder();
    console.log("Geocoding destination for user map:", destination);

    geocoder.geocode(
      { address: destination + ", Pakistan" },
      (results, status) => {
        if (status === "OK" && results[0]) {
          console.log("✅ Destination geocoded successfully");
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
        } else {
          console.error("❌ Geocoding destination failed:", status);
          // Use city-based fallback
          const cityInfo = getCityFromAddress(destination);
          if (cityInfo) {
            console.log(
              `Using ${cityInfo.city} coordinates for destination marker`
            );
            const marker = new window.google.maps.Marker({
              position: cityInfo.coords,
              map: map,
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(35, 35),
              },
              title: "Destination (Approximate)",
            });
            setDestinationMarker(marker);
          }
        }
      }
    );
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
