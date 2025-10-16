const axios = require("axios");
const captainModel = require("../model/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error("Maps API error:", error.message);
    // Return dummy coordinates for testing (Lahore, Pakistan)
    return {
      lat: 31.5204,
      lng: 74.3587,
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
