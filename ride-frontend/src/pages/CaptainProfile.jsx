import React, { useContext, useState } from "react";
import { CaptainDataContext } from "../context/CapatainContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProfile = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [firstname, setFirstname] = useState(
    captain?.fullname?.firstname || ""
  );
  const [lastname, setLastname] = useState(captain?.fullname?.lastname || "");
  const [phoneNumber, setPhoneNumber] = useState(captain?.phoneNumber || "");
  const [address, setAddress] = useState(captain?.address || "");
  const [plate, setPlate] = useState(captain?.vehicle?.plate || "");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(
    captain?.profileImage?.url ||
      "https://www.svgrepo.com/show/505031/uber-driver.svg"
  );

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        firstname,
        lastname,
        phoneNumber,
        address,
        plate,
      };

      // Only include profile image if changed
      if (profileImage) {
        updateData.profileImage = profileImage;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/captain/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setCaptain(response.data.captain);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      // Also clear accepted ride data on logout
      localStorage.removeItem("acceptedRide");
      setCaptain(null);
      navigate("/captain-login");
    } catch (error) {
      console.error("Error logging out:", error);
      localStorage.removeItem("token");
      // Also clear accepted ride data on logout error
      localStorage.removeItem("acceptedRide");
      navigate("/captain-login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Desktop & Mobile */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-5">
            <Link
              to="/captain-home"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <i className="ri-arrow-left-line text-2xl"></i>
              <span className="font-semibold text-lg hidden sm:inline">
                Back to Home
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <i className="ri-user-settings-line text-2xl text-orange-600"></i>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Captain Profile
              </h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 rounded-lg font-semibold transition-all ${
                isEditing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              }`}
            >
              <i
                className={`${
                  isEditing ? "ri-close-line" : "ri-edit-line"
                } text-xl`}
              ></i>
              <span className="hidden sm:inline">
                {isEditing ? "Cancel" : "Edit Profile"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content - Desktop Layout */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 lg:sticky lg:top-24">
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white text-center relative">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="relative inline-block">
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl mx-auto"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white text-orange-600 rounded-full p-3 cursor-pointer hover:bg-orange-50 shadow-lg transition-all">
                        <i className="ri-camera-fill text-xl"></i>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mt-4 capitalize">
                    {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                  </h2>
                  <p className="text-orange-100 mt-1 text-sm">
                    {captain?.email}
                  </p>
                </div>
              </div>

              {/* Stats & Status */}
              <div className="p-6">
                <div className="flex items-center justify-center gap-2 bg-green-50 px-4 py-3 rounded-xl mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-semibold text-sm">
                    {captain?.vehicle?.vehicleType || "Motorcycle"} Rider
                  </span>
                </div>

                {/* Quick Info Cards */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-blue-600 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="ri-map-pin-line text-purple-600 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">City</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {captain?.city || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="ri-e-bike-2-line text-orange-600 text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Vehicle Plate</p>
                      <p className="text-sm font-semibold text-gray-800 uppercase">
                        {plate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <i className="ri-logout-box-line text-xl"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Detailed Information */}
          <div className="lg:col-span-2">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="ri-user-line text-xl"></i>
                    Personal Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl disabled:bg-gray-50 disabled:text-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl disabled:bg-gray-50 disabled:text-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl disabled:bg-gray-50 disabled:text-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        required
                      />
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={captain?.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                        />
                        <i className="ri-lock-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    {/* City (Read Only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={captain?.city || "Not specified"}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                        />
                        <i className="ri-lock-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <i className="ri-information-line"></i>
                        Cannot be changed after registration
                      </p>
                    </div>

                    {/* CNIC (Read Only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CNIC Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={captain?.cnicNumber}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                        />
                        <i className="ri-lock-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl disabled:bg-gray-50 disabled:text-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                        required
                        placeholder="Enter your complete address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="ri-e-bike-2-line text-xl"></i>
                    Vehicle Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Type (Read Only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={captain?.vehicle?.vehicleType || "Motorcycle"}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 capitalize"
                        />
                        <i className="ri-lock-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>

                    {/* Plate Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Plate Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl disabled:bg-gray-50 disabled:text-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all uppercase font-mono"
                        required
                        placeholder="ABC-123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <i className="ri-file-text-line text-xl"></i>
                    Verification Documents
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* CNIC Image */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <i className="ri-id-card-line text-blue-600"></i>
                          CNIC
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Verified
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-blue-400 transition-all">
                        <img
                          src={captain?.cnicImage?.url}
                          alt="CNIC"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    {/* Driving License */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <i className="ri-car-line text-green-600"></i>
                          Driving License
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Verified
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-green-400 transition-all">
                        <img
                          src={captain?.drivingLicense?.url}
                          alt="License"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    {/* Vehicle Image */}
                    <div className="group md:col-span-2 xl:col-span-1">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <i className="ri-motorbike-line text-orange-600"></i>
                          Vehicle
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Verified
                        </span>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-orange-400 transition-all">
                        <img
                          src={captain?.vehicleImage?.url}
                          alt="Vehicle"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              {isEditing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <i className="ri-loader-4-line text-xl animate-spin"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line text-xl"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile;
