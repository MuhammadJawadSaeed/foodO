const rideModel = require("../model/ride.model");
const mapService = require("./maps.service");
const crypto = require("crypto");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  try {
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
      auto: 30,
      car: 50,
      moto: 20,
    };

    const perKmRate = {
      auto: 10,
      car: 15,
      moto: 8,
    };

    const perMinuteRate = {
      auto: 2,
      car: 3,
      moto: 1.5,
    };

    const fare = {
      auto: Math.round(
        baseFare.auto +
          (distanceTime.distance.value / 1000) * perKmRate.auto +
          (distanceTime.duration.value / 60) * perMinuteRate.auto
      ),
      car: Math.round(
        baseFare.car +
          (distanceTime.distance.value / 1000) * perKmRate.car +
          (distanceTime.duration.value / 60) * perMinuteRate.car
      ),
      moto: Math.round(
        baseFare.moto +
          (distanceTime.distance.value / 1000) * perKmRate.moto +
          (distanceTime.duration.value / 60) * perMinuteRate.moto
      ),
    };

    return fare;
  } catch (error) {
    // If Maps API fails, return dummy fares for testing
    console.log("Maps API failed, using dummy fares for testing");
    return {
      auto: 150,
      car: 250,
      moto: 100,
    };
  }
}

module.exports.getFare = getFare;

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  orderId,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
    order: orderId || null,
  });

  return ride;
};

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

module.exports.endRide = async ({ rideId, captain, completionEvidence }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  // Prepare update object
  const updateData = {
    status: "completed",
    completedAt: new Date(),
  };

  // Add completion evidence if provided
  if (completionEvidence) {
    updateData.completionEvidence = completionEvidence;
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    updateData
  );

  // Update ride object with new data
  ride.status = "completed";
  ride.completedAt = updateData.completedAt;
  if (completionEvidence) {
    ride.completionEvidence = completionEvidence;
  }

  return ride;
};

module.exports.getAllPendingRides = async () => {
  try {
    // Get all pending rides without distance filtering
    const pendingRides = await rideModel
      .find({
        status: "pending",
      })
      .populate("user")
      .populate("order")
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log(`Found ${pendingRides.length} total pending rides`);
    return pendingRides;
  } catch (error) {
    console.error("Error getting all pending rides:", error);
    throw error;
  }
};

module.exports.getPendingRidesInRadius = async (
  latitude,
  longitude,
  radius
) => {
  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required");
  }

  // Radius in km, default to 5km if not provided
  const radiusInKm = radius || 5;

  try {
    // Get all pending rides
    const pendingRides = await rideModel
      .find({
        status: "pending",
      })
      .populate("user")
      .populate("order");

    // Filter by distance (simple calculation)
    // For more accurate distance, you can use mapService
    const ridesInRadius = [];

    for (const ride of pendingRides) {
      try {
        // Get pickup coordinates
        const pickupCoords = await mapService.getAddressCoordinate(ride.pickup);

        // Calculate distance - use lat (not ltd)
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          pickupCoords.lat, // Fixed: was pickupCoords.ltd
          pickupCoords.lng
        );

        console.log(
          `Ride ${ride._id}: Distance = ${distance.toFixed(2)}km from captain`
        );

        // Check if we got dummy/fallback coordinates (Lahore: 31.5204, 74.3587)
        const isDummyCoords =
          Math.abs(pickupCoords.lat - 31.5204) < 0.001 &&
          Math.abs(pickupCoords.lng - 74.3587) < 0.001;

        if (isDummyCoords) {
          console.log(
            `Ride ${ride._id}: Using dummy coordinates - INCLUDING anyway for testing`
          );
          // Include rides with dummy coordinates since geocoding might not be working
          ridesInRadius.push({
            ...ride.toObject(),
            distanceFromCaptain: "N/A (dummy coords)",
          });
        } else if (distance <= radiusInKm) {
          console.log(
            `Ride ${ride._id}: Within radius (${distance.toFixed(
              2
            )}km <= ${radiusInKm}km) - Including`
          );
          ridesInRadius.push({
            ...ride.toObject(),
            distanceFromCaptain: distance.toFixed(2),
          });
        } else {
          console.log(
            `Ride ${ride._id}: Outside radius (${distance.toFixed(
              2
            )}km > ${radiusInKm}km) - EXCLUDING`
          );
          // Don't include rides outside the radius
        }
      } catch (error) {
        console.log(`Error calculating distance for ride ${ride._id}:`, error);
        // If error in getting coordinates, skip the ride
        console.log(`Excluding ride ${ride._id} due to error`);
      }
    }

    return ridesInRadius;
  } catch (error) {
    console.error("Error getting pending rides:", error);
    throw error;
  }
};

// Helper function to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
