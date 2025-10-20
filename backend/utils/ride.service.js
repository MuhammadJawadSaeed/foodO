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

  // Get coordinates for pickup and destination
  let pickupCoords = null;
  let destinationCoords = null;

  try {
    pickupCoords = await mapService.getAddressCoordinate(pickup);
    console.log("✅ Pickup coordinates:", pickupCoords);
  } catch (error) {
    console.log("⚠️ Could not get pickup coordinates:", error.message);
  }

  try {
    destinationCoords = await mapService.getAddressCoordinate(destination);
    console.log("✅ Destination coordinates:", destinationCoords);
  } catch (error) {
    console.log("⚠️ Could not get destination coordinates:", error.message);
  }

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    pickupCoordinates: pickupCoords,
    destinationCoordinates: destinationCoords,
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

  console.log("🔄 Updating ride status to 'accepted'...");
  console.log("  Ride ID:", rideId);
  console.log("  Captain ID:", captain._id);

  const updateResult = await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    },
    { new: true } // Return the updated document
  );

  console.log("✅ Ride updated:", {
    id: updateResult._id,
    status: updateResult.status,
    captain: updateResult.captain,
  });

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

  console.log("✅ Ride confirmed and populated successfully");
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

  // Calculate earnings for Cash on Delivery orders
  if (ride.order) {
    try {
      const Order = require("../model/order");
      const order = await Order.findById(ride.order);

      console.log("🔍 Checking order for earnings calculation:");
      console.log("   - Order ID:", order?._id);
      console.log("   - Payment Type:", order?.paymentInfo?.type);
      console.log("   - Total Price:", order?.totalPrice);

      if (
        order &&
        order.paymentInfo &&
        order.paymentInfo.type === "Cash On Delivery"
      ) {
        // Calculate captain's earnings (only ride fare - delivery fee)
        const rideFare = ride.fare || 0;
        const orderAmount = order.totalPrice || 0;
        const captainEarnings = rideFare; // Captain only earns delivery fee

        console.log(`\n💰 === EARNINGS CALCULATION START ===`);
        console.log(`📦 Order ID: ${order._id}`);
        console.log(
          `🚴 Ride Fare (Delivery Fee - Captain Earns): PKR ${rideFare}`
        );
        console.log(
          `🍔 Order Amount (Food - Goes to Shop): PKR ${orderAmount}`
        );
        console.log(`💵 Total Captain Earnings: PKR ${captainEarnings}`);

        // Update captain's earnings (total + separated by type)
        const captainModel = require("../model/captain.model");

        // Get captain and check if resets are needed
        const captainBefore = await captainModel.findById(captain._id);

        // Check and apply resets before incrementing
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const resetUpdates = {};

        // Reset daily stats if needed
        if (
          captainBefore.lastDayReset &&
          new Date(captainBefore.lastDayReset) < today
        ) {
          resetUpdates["earnings.today"] = 0;
          resetUpdates["rideFeeEarnings.today"] = 0;
          resetUpdates["orderFeeEarnings.today"] = 0;
          resetUpdates["rideStats.todayRides"] = 0;
          resetUpdates["lastDayReset"] = now;
        }

        // Reset weekly stats if needed
        if (
          captainBefore.lastWeekReset &&
          new Date(captainBefore.lastWeekReset) < startOfWeek
        ) {
          resetUpdates["earnings.thisWeek"] = 0;
          resetUpdates["rideFeeEarnings.thisWeek"] = 0;
          resetUpdates["orderFeeEarnings.thisWeek"] = 0;
          resetUpdates["rideStats.thisWeekRides"] = 0;
          resetUpdates["lastWeekReset"] = now;
        }

        // Reset monthly stats if needed
        if (
          captainBefore.lastMonthReset &&
          new Date(captainBefore.lastMonthReset) < startOfMonth
        ) {
          resetUpdates["earnings.thisMonth"] = 0;
          resetUpdates["rideFeeEarnings.thisMonth"] = 0;
          resetUpdates["orderFeeEarnings.thisMonth"] = 0;
          resetUpdates["rideStats.thisMonthRides"] = 0;
          resetUpdates["lastMonthReset"] = now;
        }

        // Apply resets if any
        if (Object.keys(resetUpdates).length > 0) {
          await captainModel.findByIdAndUpdate(captain._id, {
            $set: resetUpdates,
          });
          console.log(
            "✅ Applied time period resets:",
            Object.keys(resetUpdates)
          );
        }

        console.log(`\n📊 Captain BEFORE Update:`);
        console.log(
          `   - Total Earnings: PKR ${captainBefore.earnings?.total || 0}`
        );
        console.log(
          `   - Ride Fee Total: PKR ${
            captainBefore.rideFeeEarnings?.total || 0
          }`
        );
        console.log(
          `   - Order Fee Total: PKR ${
            captainBefore.orderFeeEarnings?.total || 0
          }`
        );

        const updatedCaptain = await captainModel.findByIdAndUpdate(
          captain._id,
          {
            $inc: {
              // Total earnings (only delivery fee)
              "earnings.total": captainEarnings,
              "earnings.today": captainEarnings,
              "earnings.thisWeek": captainEarnings,
              "earnings.thisMonth": captainEarnings,
              // Ride fee earnings (delivery charges)
              "rideFeeEarnings.total": rideFare,
              "rideFeeEarnings.today": rideFare,
              "rideFeeEarnings.thisWeek": rideFare,
              "rideFeeEarnings.thisMonth": rideFare,
              // Order fee earnings (for tracking - not captain's money)
              "orderFeeEarnings.total": orderAmount,
              "orderFeeEarnings.today": orderAmount,
              "orderFeeEarnings.thisWeek": orderAmount,
              "orderFeeEarnings.thisMonth": orderAmount,
              // Ride statistics
              "rideStats.totalRides": 1,
              "rideStats.completedRides": 1,
              "rideStats.todayRides": 1,
              "rideStats.thisWeekRides": 1,
              "rideStats.thisMonthRides": 1,
            },
          },
          { new: true }
        );

        console.log(`\n✅ Captain AFTER Update:`);
        console.log(
          `   - Total Earnings: PKR ${updatedCaptain.earnings.total}`
        );
        console.log(
          `   - Ride Fee Total: PKR ${
            updatedCaptain.rideFeeEarnings?.total || 0
          }`
        );
        console.log(
          `   - Order Fee Total: PKR ${
            updatedCaptain.orderFeeEarnings?.total || 0
          }`
        );
        console.log(
          `   - Completed Rides: ${updatedCaptain.rideStats.completedRides}`
        );
        console.log(`💰 === EARNINGS CALCULATION END ===\n`);

        // Update shop's available balance (order amount minus 10% service charge)
        if (order.cart && order.cart.length > 0 && order.cart[0].shopId) {
          const Shop = require("../model/shop");

          // Calculate shop earnings (order amount - 10% service charge)
          const serviceCharge = orderAmount * 0.1;
          const shopEarnings = orderAmount - serviceCharge;

          // Get shop before update
          const shopBefore = await Shop.findById(order.cart[0].shopId);
          console.log(`\n🏪 === SHOP BALANCE UPDATE START ===`);
          console.log(`🏪 Shop: ${shopBefore.name}`);
          console.log(
            `💰 Shop Balance BEFORE: PKR ${shopBefore.availableBalance || 0}`
          );
          console.log(`� Order Amount: PKR ${orderAmount}`);
          console.log(
            `💸 Service Charge (10%): PKR ${serviceCharge.toFixed(2)}`
          );
          console.log(`💵 Shop Earnings: PKR ${shopEarnings.toFixed(2)}`);

          const updatedShop = await Shop.findByIdAndUpdate(
            order.cart[0].shopId,
            {
              $inc: {
                availableBalance: shopEarnings,
              },
            },
            { new: true }
          );

          console.log(
            `✅ Shop Balance AFTER: PKR ${updatedShop.availableBalance}`
          );
          console.log(`📊 Balance Increase: PKR ${shopEarnings.toFixed(2)}`);
          console.log(`🏪 === SHOP BALANCE UPDATE END ===\n`);
        } else {
          console.log(
            `⚠️ WARNING: Could not update shop balance - no shop ID found in cart`
          );
        }
      } else {
        console.log(`ℹ️ Not a COD order - skipping earnings calculation`);
        console.log(
          `   Payment Type: ${order?.paymentInfo?.type || "Unknown"}`
        );
      }
    } catch (earningsError) {
      console.error("❌ ERROR updating earnings:", earningsError);
      console.error("Error stack:", earningsError.stack);
      // Don't throw error - ride should still complete
    }
  } else {
    console.log(
      `ℹ️ No order associated with this ride - skipping earnings calculation`
    );
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

// NEW: Get only UNACCEPTED pending rides (not assigned to any captain yet)
module.exports.getUnacceptedPendingRidesInRadius = async (
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
    // Get only UNACCEPTED pending rides (no captain assigned)
    const pendingRides = await rideModel
      .find({
        status: "pending",
        captain: null, // Only rides not accepted by anyone
      })
      .populate("user")
      .populate("order");

    console.log(`Found ${pendingRides.length} unaccepted pending rides`);

    // Filter by distance
    const ridesInRadius = [];

    for (const ride of pendingRides) {
      try {
        // Get pickup coordinates
        const pickupCoords = await mapService.getAddressCoordinate(ride.pickup);

        // Calculate distance
        const distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          pickupCoords.lat,
          pickupCoords.lng
        );

        // Check if dummy coordinates
        const isDummyCoords =
          Math.abs(pickupCoords.lat - 31.5204) < 0.001 &&
          Math.abs(pickupCoords.lng - 74.3587) < 0.001;

        if (isDummyCoords) {
          ridesInRadius.push({
            ...ride.toObject(),
            distanceFromCaptain: "N/A",
          });
        } else if (distance <= radiusInKm) {
          ridesInRadius.push({
            ...ride.toObject(),
            distanceFromCaptain: distance.toFixed(2),
          });
        }
      } catch (error) {
        console.log(`Error calculating distance for ride ${ride._id}:`, error);
      }
    }

    console.log(`Returning ${ridesInRadius.length} unaccepted rides in radius`);
    return ridesInRadius;
  } catch (error) {
    console.error("Error getting unaccepted pending rides:", error);
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
