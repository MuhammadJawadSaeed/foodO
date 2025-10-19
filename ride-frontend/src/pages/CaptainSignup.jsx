import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  validateAndFormatPhone,
  handlePhoneInput,
} from "../utils/phoneValidator";
import { validateAndFormatCNIC, handleCNICInput } from "../utils/cnicValidator";
import { PAKISTANI_CITIES } from "../utils/pakistaniCities";
import PhoneInput from "../components/PhoneInput";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaIdCard,
  FaFileAlt,
  FaMotorcycle,
  FaCamera,
  FaAddressCard,
  FaImage,
} from "react-icons/fa";
import { MdLocationOn, MdPerson } from "react-icons/md";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cnicNumber, setCnicNumber] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState(PAKISTANI_CITIES);

  const [vehiclePlate, setVehiclePlate] = useState("");

  // Image states
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [cnicImage, setCnicImage] = useState("");
  const [cnicImagePreview, setCnicImagePreview] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [drivingLicensePreview, setDrivingLicensePreview] = useState("");
  const [vehicleImage, setVehicleImage] = useState("");
  const [vehicleImagePreview, setVehicleImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  // Ref for city dropdown to handle outside clicks
  const cityDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle image file selection and convert to base64
  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete image
  const deleteImage = (setImage, setPreview) => {
    setImage("");
    setPreview("");
  };

  // Handle city input with search/filter
  const handleCityInput = (value) => {
    setCity(value);

    if (value.trim() === "") {
      setFilteredCities(PAKISTANI_CITIES);
      setShowCitySuggestions(false);
    } else {
      const filtered = PAKISTANI_CITIES.filter((cityName) =>
        cityName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    }
  };

  // Select city from suggestions
  const selectCity = (cityName) => {
    setCity(cityName);
    setShowCitySuggestions(false);
    setFilteredCities(PAKISTANI_CITIES);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate phone number before submitting
    if (phoneError) {
      alert("Please fix the phone number error before submitting");
      return;
    }

    // Validate CNIC before submitting
    if (cnicError) {
      alert("Please fix the CNIC error before submitting");
      return;
    }

    // Validate all images are uploaded
    if (!cnicImage || !drivingLicense || !vehicleImage) {
      alert(
        "Please upload all required documents (CNIC, Driving License, Vehicle Image)"
      );
      return;
    }

    // Validate phone number format one more time
    try {
      validateAndFormatPhone(phoneNumber);
    } catch (error) {
      alert(`Phone validation error: ${error.message}`);
      return;
    }

    // Validate CNIC format one more time
    try {
      validateAndFormatCNIC(cnicNumber);
    } catch (error) {
      alert(`CNIC validation error: ${error.message}`);
      return;
    }

    setLoading(true);

    try {
      const captainData = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        cnicNumber: cnicNumber,
        address: address,
        city: city,
        cnicImage: cnicImage,
        drivingLicense: drivingLicense,
        vehicleImage: vehicleImage,
        vehicle: {
          plate: vehiclePlate,
          vehicleType: "motorcycle",
        },
      };

      // Add profile image if uploaded
      if (profileImage) {
        captainData.profileImage = profileImage;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }

      // Reset form
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setPhoneNumber("");
      setCnicNumber("");
      setAddress("");
      setCity("");
      setVehiclePlate("");
      setProfileImage("");
      setProfileImagePreview("");
      setCnicImage("");
      setCnicImagePreview("");
      setDrivingLicense("");
      setDrivingLicensePreview("");
      setVehicleImage("");
      setVehicleImagePreview("");
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        errorMessage = error.response.data.errors.map((e) => e.msg).join(", ");
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Full Screen Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4">
            {/* Spinner */}
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
            </div>

            {/* Loading Text */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Creating Your Account
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Please wait while we set up your captain profile...
            </p>

            {/* Progress Steps */}
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Validating information</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 animate-pulse"></div>
                <span>Uploading documents</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                <span>Creating account</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-5 py-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-3xl">🍔</span>
            </div>
            <div>
              <h1 className="text-2xl font-black">
                food<span className="text-orange-200">O</span>
              </h1>
              <p className="text-sm text-orange-100">Captain Registration</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="px-5 py-6 max-w-2xl mx-auto">
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Profile Image Upload (Optional) */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCamera className="text-2xl text-orange-500" />
                Profile Photo (Optional)
              </h3>
              {profileImagePreview ? (
                <div className="relative">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 mx-auto object-cover rounded-full border-4 border-orange-200 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(setProfileImage, setProfileImagePreview)
                    }
                    className="absolute top-0 right-1/2 translate-x-16 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-orange-300 rounded-full cursor-pointer hover:bg-orange-50 transition-colors">
                  <div className="text-center">
                    <FaUser className="text-4xl text-orange-400 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      Add Photo
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(
                        e,
                        setProfileImage,
                        setProfileImagePreview
                      )
                    }
                  />
                </label>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MdPerson className="text-2xl text-purple-500" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                    type="email"
                    placeholder="captain@example.com"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      try {
                        validateAndFormatPhone(value);
                        setPhoneError("");
                      } catch (error) {
                        setPhoneError(error.message);
                      }
                    }}
                    error={phoneError}
                    placeholder="300 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-xl" />
                      ) : (
                        <FaEye className="text-xl" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaIdCard className="text-2xl text-blue-500" />
                Identity Verification
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC Number
                  </label>
                  <input
                    required
                    value={cnicNumber}
                    onChange={(e) =>
                      handleCNICInput(
                        e.target.value,
                        setCnicNumber,
                        setCnicError
                      )
                    }
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all ${
                      cnicError
                        ? "border-red-500 focus:border-red-500"
                        : cnicNumber.length === 15
                        ? "border-green-500 focus:border-green-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                    type="text"
                    placeholder="12345-6789012-3"
                  />
                  {cnicError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span> {cnicError}
                    </p>
                  )}
                  {!cnicError && cnicNumber.length === 15 && (
                    <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                      <span>✓</span> Valid CNIC format
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Enter your full address"
                    rows="3"
                    minLength="10"
                  />
                </div>

                {/* City Input */}
                <div ref={cityDropdownRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => handleCityInput(e.target.value)}
                    onFocus={() => setShowCitySuggestions(true)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Type to search city (e.g., Karachi)"
                    autoComplete="off"
                  />

                  {/* Suggestions Dropdown */}
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {filteredCities.slice(0, 50).map((cityName) => (
                        <div
                          key={cityName}
                          onClick={() => selectCity(cityName)}
                          className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          {cityName}
                        </div>
                      ))}
                      {filteredCities.length > 50 && (
                        <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                          + {filteredCities.length - 50} more cities...
                        </div>
                      )}
                    </div>
                  )}

                  {showCitySuggestions &&
                    filteredCities.length === 0 &&
                    city.trim() !== "" && (
                      <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 text-center text-gray-500">
                        No cities found matching "{city}"
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaFileAlt className="text-2xl text-green-500" />
                Required Documents
              </h3>

              <div className="space-y-6">
                {/* CNIC Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC Image
                  </label>
                  {cnicImagePreview ? (
                    <div className="relative">
                      <img
                        src={cnicImagePreview}
                        alt="CNIC Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(setCnicImage, setCnicImagePreview)
                        }
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all">
                      <div className="text-center p-4">
                        <FaAddressCard className="text-5xl mb-2 text-orange-500 mx-auto" />
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload CNIC
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setCnicImage,
                            setCnicImagePreview
                          )
                        }
                      />
                    </label>
                  )}
                </div>

                {/* Driving License */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Driving License
                  </label>
                  {drivingLicensePreview ? (
                    <div className="relative">
                      <img
                        src={drivingLicensePreview}
                        alt="License Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(
                            setDrivingLicense,
                            setDrivingLicensePreview
                          )
                        }
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all">
                      <div className="text-center p-4">
                        <FaIdCard className="text-5xl mb-2 text-blue-500 mx-auto" />
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload License
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setDrivingLicense,
                            setDrivingLicensePreview
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMotorcycle className="text-2xl text-red-500" />
                Motorcycle Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plate Number
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                    type="text"
                    placeholder="ABC-123"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                  />
                </div>

                {/* Vehicle Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Image
                  </label>
                  {vehicleImagePreview ? (
                    <div className="relative">
                      <img
                        src={vehicleImagePreview}
                        alt="Vehicle Preview"
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(setVehicleImage, setVehicleImagePreview)
                        }
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all">
                      <div className="text-center p-4">
                        <FaMotorcycle className="text-5xl mb-2 text-red-500 mx-auto" />
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload Vehicle
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG (Max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(
                            e,
                            setVehicleImage,
                            setVehicleImagePreview
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Bottom Section - Button and Links */}
        <div className="sticky bottom-0 border-t-2 border-gray-200 bg-white px-5 py-5 shadow-2xl">
          <button
            onClick={submitHandler}
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl w-full text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Captain Account"
            )}
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/captain-login"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
            >
              Login here
            </Link>
          </p>

          <p className="text-xs text-center text-gray-500 mt-3 leading-relaxed">
            © 2025 foodO. By signing up, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
};

export default CaptainSignup;
