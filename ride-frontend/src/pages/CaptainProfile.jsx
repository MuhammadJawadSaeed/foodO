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
      setCaptain(null);
      navigate("/captain-login");
    } catch (error) {
      console.error("Error logging out:", error);
      localStorage.removeItem("token");
      navigate("/captain-login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Link
            to="/captain-home"
            className="flex items-center gap-2 text-gray-700 hover:text-black"
          >
            <i className="ri-arrow-left-line text-2xl"></i>
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-semibold">Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 font-medium"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Profile Image Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                  <i className="ri-camera-line text-xl"></i>
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
            <p className="text-gray-500 mt-1">{captain?.email}</p>
            <div className="mt-3 bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-700 font-medium">
                {captain?.vehicle?.vehicleType || "Motorcycle"} Rider
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleUpdateProfile}>
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={captain?.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>

              {/* City (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={captain?.city || "Not specified"}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  City cannot be changed after registration
                </p>
              </div>

              {/* CNIC (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNIC Number
                </label>
                <input
                  type="text"
                  value={captain?.cnicNumber}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>

            <div className="space-y-4">
              {/* Vehicle Type (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  value={captain?.vehicle?.vehicleType || "Motorcycle"}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 capitalize"
                />
              </div>

              {/* Plate Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>

            <div className="space-y-4">
              {/* CNIC Image */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">CNIC</p>
                <img
                  src={captain?.cnicImage?.url}
                  alt="CNIC"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>

              {/* Driving License */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Driving License
                </p>
                <img
                  src={captain?.drivingLicense?.url}
                  alt="License"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>

              {/* Vehicle Image */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Vehicle
                </p>
                <img
                  src={captain?.vehicleImage?.url}
                  alt="Vehicle"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Update Button */}
          {isEditing && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          )}
        </form>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <i className="ri-logout-box-line text-xl"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default CaptainProfile;
