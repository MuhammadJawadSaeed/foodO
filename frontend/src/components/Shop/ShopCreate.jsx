import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { IoRestaurantOutline } from "react-icons/io5";
import pakistanCities from "../../static/pakistanCities";
import PhoneInput from "../PhoneInput";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [country, setCountry] = useState("Pakistan");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalCity = useCustomCity ? customCity : city;

    if (!finalCity) {
      toast.error("Please select or enter your city");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
        city: finalCity,
        country,
      });
      toast.success(res.data.message);
      // Clear the form after submission
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
      setZipCode("");
      setAddress("");
      setPhoneNumber("");
      setCity("");
      setCustomCity("");
      setUseCustomCity(false);
      setCountry("Pakistan");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <h1 className="text-[42px] font-semibold text-gray-700">food</h1>
            <h1 className="text-[44px] font-semibold text-orange-500">O</h1>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="bg-orange-100 p-4 rounded-full">
            <IoRestaurantOutline className="text-orange-500 text-4xl" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Register as Home Chef
        </h2>
        <p className="text-center text-gray-600">
          Join our community and share your culinary passion
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shop/Kitchen Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="e.g., Mom's Kitchen, Chef's Delight"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="300 123 4567"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="chef@example.com"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zip/Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="54000"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="House #, Street, Area"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value="Pakistan"
                  disabled
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-600 cursor-not-allowed sm:text-sm"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                {!useCustomCity ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                  >
                    <option value="">Select your city</option>
                    {pakistanCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Enter city name"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                  />
                )}
              </div>
            </div>

            {/* City toggle */}
            <div className="flex items-center gap-4 -mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="radio"
                  name="shopCityOption"
                  checked={!useCustomCity}
                  onChange={() => setUseCustomCity(false)}
                  className="cursor-pointer accent-orange-500"
                />
                Select from list
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="radio"
                  name="shopCityOption"
                  checked={useCustomCity}
                  onChange={() => setUseCustomCity(true)}
                  className="cursor-pointer accent-orange-500"
                />
                Type custom city
              </label>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Create a strong password"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Logo/Photo (Optional)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-full w-full text-gray-400" />
                  )}
                </span>
                <label className="flex-1 flex items-center justify-center px-4 py-2.5 border-2 border-dashed border-orange-300 rounded-lg shadow-sm text-sm font-medium text-orange-500 bg-orange-50 hover:bg-orange-100 cursor-pointer transition-all">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Logo
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    accept=".jpg,.jpeg,.png"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
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
                  "Register as Chef"
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have a chef account?{" "}
                <Link
                  to="/shop-login"
                  className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Want to order food instead?
              </p>
              <Link
                to="/sign-up"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Create Customer Account
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By registering, you agree to our{" "}
          <Link to="/terms" className="text-orange-500 hover:text-orange-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-orange-500 hover:text-orange-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ShopCreate;
