const captainModel = require("../model/captain.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  phoneNumber,
  cnicNumber,
  address,
  city,
  cnicImage,
  drivingLicense,
  vehicleImage,
  profileImage,
  plate,
  vehicleType,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !phoneNumber ||
    !cnicNumber ||
    !address ||
    !city ||
    !cnicImage ||
    !drivingLicense ||
    !vehicleImage ||
    !plate ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captainData = {
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    phoneNumber,
    cnicNumber,
    address,
    city,
    cnicImage,
    drivingLicense,
    vehicleImage,
    vehicle: {
      plate,
      vehicleType,
    },
  };

  // Add profile image if provided
  if (profileImage) {
    captainData.profileImage = profileImage;
  }

  const captain = captainModel.create(captainData);

  return captain;
};
