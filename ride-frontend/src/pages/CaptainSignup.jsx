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

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      <div className="h-screen flex flex-col">
        {/* Scrollable Form Section */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <img
            className="w-20 mb-3"
            src="https://www.svgrepo.com/show/505031/uber-driver.svg"
            alt=""
          />

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {/* Profile Image Upload (Optional) */}
            <div className="mb-5">
              <h3 className="text-base font-medium mb-2">
                Profile Photo (Optional)
              </h3>
              {profileImagePreview ? (
                <div className="relative">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 mx-auto object-cover rounded-full border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(setProfileImage, setProfileImagePreview)
                    }
                    className="absolute top-0 right-1/2 translate-x-16 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <i className="ri-user-add-line text-3xl text-gray-400"></i>
                    <p className="text-xs text-gray-400 mt-1">Add Photo</p>
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

            <h3 className="text-lg w-full font-medium mb-2">
              What's our Captain's name
            </h3>
            <div className="flex gap-4 mb-5">
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <input
                required
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />

            {/* Professional Phone Input Component */}
            <div className="mb-5">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={(value) => {
                  setPhoneNumber(value);
                  // Validate the phone number
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

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type="password"
              placeholder="password"
              minLength="6"
            />

            <h3 className="text-lg font-medium mb-2">Identity Verification</h3>
            <input
              required
              value={cnicNumber}
              onChange={(e) =>
                handleCNICInput(e.target.value, setCnicNumber, setCnicError)
              }
              className={`bg-[#eeeeee] mb-1 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base ${
                cnicError
                  ? "border-red-500"
                  : cnicNumber
                  ? "border-green-500"
                  : ""
              }`}
              type="text"
              placeholder="CNIC Number (e.g., 12345-6789012-3)"
            />
            {cnicError && (
              <p className="text-red-500 text-sm mb-2">{cnicError}</p>
            )}
            {!cnicError && cnicNumber.length === 15 && (
              <p className="text-green-500 text-sm mb-2">✓ Valid CNIC format</p>
            )}

            <textarea
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              placeholder="Complete Address"
              rows="3"
              minLength="10"
            />

            {/* City Input with Custom Searchable Dropdown */}
            <div ref={cityDropdownRef} className="mb-5 w-full relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                required
                type="text"
                value={city}
                onChange={(e) => handleCityInput(e.target.value)}
                onFocus={() => setShowCitySuggestions(true)}
                className="bg-[#eeeeee] rounded-lg px-4 py-3 border w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type to search city (e.g., Karachi)"
                autoComplete="off"
              />

              {/* Suggestions Dropdown */}
              {showCitySuggestions && filteredCities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.slice(0, 50).map((cityName) => (
                    <div
                      key={cityName}
                      onClick={() => selectCity(cityName)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-base sm:text-lg"
                    >
                      {cityName}
                    </div>
                  ))}
                  {filteredCities.length > 50 && (
                    <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                      + {filteredCities.length - 50} more cities... Keep typing
                      to narrow down
                    </div>
                  )}
                </div>
              )}

              {/* No results message */}
              {showCitySuggestions &&
                filteredCities.length === 0 &&
                city.trim() !== "" && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    No cities found matching "{city}"
                  </div>
                )}

              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>
                  Type to search from 180+ Pakistani cities or scroll to select
                </span>
              </p>
            </div>

            {/* CNIC Image Upload */}
            <div className="mb-5">
              <h3 className="text-base font-medium mb-2">Upload CNIC Image</h3>
              {cnicImagePreview ? (
                <div className="relative">
                  <img
                    src={cnicImagePreview}
                    alt="CNIC Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(setCnicImage, setCnicImagePreview)
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Click to upload CNIC
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, setCnicImage, setCnicImagePreview)
                    }
                  />
                </label>
              )}
            </div>

            {/* Driving License Upload */}
            <div className="mb-5">
              <h3 className="text-base font-medium mb-2">
                Upload Driving License
              </h3>
              {drivingLicensePreview ? (
                <div className="relative">
                  <img
                    src={drivingLicensePreview}
                    alt="License Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(setDrivingLicense, setDrivingLicensePreview)
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Click to upload License
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
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

            <h3 className="text-lg font-medium mb-2">Motorcycle Information</h3>
            <input
              required
              className="bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="text"
              placeholder="Motorcycle Plate Number"
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value);
              }}
            />

            {/* Vehicle Image Upload */}
            <div className="mb-5">
              <h3 className="text-base font-medium mb-2">
                Upload Vehicle Image
              </h3>
              {vehicleImagePreview ? (
                <div className="relative">
                  <img
                    src={vehicleImagePreview}
                    alt="Vehicle Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      deleteImage(setVehicleImage, setVehicleImagePreview)
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Click to upload Vehicle
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
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
          </form>
        </div>

        {/* Fixed Bottom Section - Button and Links */}
        <div className="border-t border-gray-200 bg-white px-5 py-4 shadow-lg">
          <button
            onClick={submitHandler}
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base disabled:bg-gray-400 active:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Captain Account"}
          </button>

          <p className="text-center text-sm mb-2">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-blue-600 font-medium">
              Login here
            </Link>
          </p>

          <p className="text-[10px] text-center text-gray-500 leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default CaptainSignup;
