const axios = require("axios");
const captainModel = require("../model/captain.model");

// Pakistani cities coordinates for fallback
const PAKISTANI_CITIES_COORDS = {
  sahiwal: { lat: 30.6682, lng: 73.1114 },
  lahore: { lat: 31.5204, lng: 74.3587 },
  karachi: { lat: 24.8607, lng: 67.0011 },
  islamabad: { lat: 33.6844, lng: 73.0479 },
  rawalpindi: { lat: 33.5651, lng: 73.0169 },
  faisalabad: { lat: 31.4504, lng: 73.135 },
  multan: { lat: 30.1575, lng: 71.5249 },
  gujranwala: { lat: 32.1877, lng: 74.1945 },
  peshawar: { lat: 34.0151, lng: 71.5249 },
  quetta: { lat: 30.1798, lng: 66.975 },
  sialkot: { lat: 32.4945, lng: 74.5229 },
  sargodha: { lat: 32.0836, lng: 72.6711 },
};

// Function to extract city from address
const getCityFromAddress = (address) => {
  if (!address) return null;

  const addressLower = address.toLowerCase();
  for (const [city, coords] of Object.entries(PAKISTANI_CITIES_COORDS)) {
    if (addressLower.includes(city)) {
      return { city, coords };
    }
  }
  return null;
};

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      console.log(`✅ Geocoded "${address}":`, location);
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error("❌ Maps API error for address:", address, error.message);

    // Try to extract city and use fallback coordinates
    const cityInfo = getCityFromAddress(address);
    if (cityInfo) {
      console.log(
        `📍 Using ${cityInfo.city} coordinates as fallback for:`,
        address
      );
      return cityInfo.coords;
    }

    // Ultimate fallback: Pakistan center
    console.warn("⚠️ Could not determine location, using Pakistan center");
    return {
      lat: 30.3753,
      lng: 69.3451,
    };
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  // If no API key, return default values
  if (!apiKey) {
    console.warn("Google Maps API key not found, using default distance/time");
    return {
      distance: { text: "5 km", value: 5000 },
      duration: { text: "15 min", value: 900 },
    };
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        console.warn("No routes found, using default distance/time");
        return {
          distance: { text: "5 km", value: 5000 },
          duration: { text: "15 min", value: 900 },
        };
      }

      return response.data.rows[0].elements[0];
    } else {
      console.error("Maps API error:", response.data.status);
      // Return default values instead of throwing error
      return {
        distance: { text: "5 km", value: 5000 },
        duration: { text: "15 min", value: 900 },
      };
    }
  } catch (err) {
    console.error("Error fetching distance/time:", err.message);
    // Return default values instead of throwing error
    return {
      distance: { text: "5 km", value: 5000 },
      duration: { text: "15 min", value: 900 },
    };
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions
        .map((prediction) => prediction.description)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    console.error("Autocomplete error:", err.message);
    // Return empty array instead of throwing error
    return [];
  }
};

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
  // radius in km
  console.log(
    `Searching for captains near: lat=${lat}, lng=${lng}, radius=${radius}km`
  );

  // Since we're storing location as {lat, lng} not GeoJSON, we need to search differently
  // For now, get all captains with location data and filter manually
  const captains = await captainModel.find({
    $or: [
      { "location.lat": { $exists: true }, "location.lng": { $exists: true } },
      { "location.ltd": { $exists: true }, "location.lng": { $exists: true } }, // Support old field name for backward compatibility
    ],
    status: "active", // Only active captains
    socketId: { $exists: true, $ne: null }, // Only captains with socket connection
  });

  console.log(
    `Total active captains with location and socketId: ${captains.length}`
  );

  if (captains.length > 0) {
    captains.forEach((captain, index) => {
      console.log(
        `Captain ${index + 1}: ID=${captain._id}, socketId=${
          captain.socketId
        }, location=${JSON.stringify(captain.location)}`
      );
    });
  }

  // For testing, return all active captains with location
  // TODO: Implement proper distance calculation later
  return captains;
};
