/**
 * Script to fix old ride coordinates from Lahore to actual city coordinates
 * Run this once to update existing rides in database
 */

const mongoose = require("mongoose");
const PendingRide = require("../model/ride.model");
const CompletedRide = require("../model/completedRide.model");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config/.env") });

// Pakistani cities coordinates
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

// Lahore coordinates (the dummy ones we want to replace)
const LAHORE_COORDS = { lat: 31.5204, lng: 74.3587 };

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

// Function to check if coordinates are Lahore dummy coordinates
const isLahoreCoords = (coords) => {
  if (!coords || !coords.lat || !coords.lng) return false;
  return (
    Math.abs(coords.lat - LAHORE_COORDS.lat) < 0.001 &&
    Math.abs(coords.lng - LAHORE_COORDS.lng) < 0.001
  );
};

async function fixRideCoordinates() {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to database");

    // Fix Pending Rides
    console.log("\n📍 Checking Pending Rides...");
    const pendingRides = await PendingRide.find({});
    let pendingFixed = 0;

    for (const ride of pendingRides) {
      let updated = false;

      // Check and fix pickup coordinates
      if (isLahoreCoords(ride.pickupCoordinates)) {
        const cityInfo = getCityFromAddress(ride.pickup);
        if (cityInfo && cityInfo.city !== "lahore") {
          console.log(`  Fixing pickup: ${ride.pickup} → ${cityInfo.city}`);
          ride.pickupCoordinates = cityInfo.coords;
          updated = true;
        }
      }

      // Check and fix destination coordinates
      if (isLahoreCoords(ride.destinationCoordinates)) {
        const cityInfo = getCityFromAddress(ride.destination);
        if (cityInfo && cityInfo.city !== "lahore") {
          console.log(
            `  Fixing destination: ${ride.destination} → ${cityInfo.city}`
          );
          ride.destinationCoordinates = cityInfo.coords;
          updated = true;
        }
      }

      if (updated) {
        await ride.save();
        pendingFixed++;
      }
    }

    console.log(`✅ Fixed ${pendingFixed} pending rides`);

    // Fix Completed Rides
    console.log("\n📍 Checking Completed Rides...");
    const completedRides = await CompletedRide.find({});
    let completedFixed = 0;

    for (const ride of completedRides) {
      let updated = false;

      // Check and fix pickup coordinates
      if (isLahoreCoords(ride.pickupCoordinates)) {
        const cityInfo = getCityFromAddress(ride.pickup);
        if (cityInfo && cityInfo.city !== "lahore") {
          console.log(`  Fixing pickup: ${ride.pickup} → ${cityInfo.city}`);
          ride.pickupCoordinates = cityInfo.coords;
          updated = true;
        }
      }

      // Check and fix destination coordinates
      if (isLahoreCoords(ride.destinationCoordinates)) {
        const cityInfo = getCityFromAddress(ride.destination);
        if (cityInfo && cityInfo.city !== "lahore") {
          console.log(
            `  Fixing destination: ${ride.destination} → ${cityInfo.city}`
          );
          ride.destinationCoordinates = cityInfo.coords;
          updated = true;
        }
      }

      if (updated) {
        await ride.save();
        completedFixed++;
      }
    }

    console.log(`✅ Fixed ${completedFixed} completed rides`);

    console.log("\n🎉 Migration completed successfully!");
    console.log(`Total rides fixed: ${pendingFixed + completedFixed}`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit();
  }
}

// Run the migration
fixRideCoordinates();
