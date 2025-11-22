import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { getAllProducts } from "../../redux/actions/product";
import { toast } from "react-toastify";
import pakistanCities from "../../static/pakistanCities";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);
  const [city, setCity] = useState(seller && seller.city);
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [country, setCountry] = useState(seller && seller.country);
  const [isOnline, setIsOnline] = useState(
    seller?.isOnline !== undefined ? seller.isOnline : true
  );

  const dispatch = useDispatch();

  // Sync state when seller data updates
  useEffect(() => {
    if (seller) {
      setIsOnline(seller.isOnline !== undefined ? seller.isOnline : true);
    }
  }, [seller]);

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    const finalCity = useCustomCity ? customCity : city;

    if (!finalCity) {
      toast.error("Please select or enter your city");
      return;
    }

    // Log to ensure city value is updated correctly
    console.log("City value:", finalCity);

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
          city: finalCity, // Ensure the city field is sent in the request
          country,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleStatusToggle = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    console.log("=== Status Toggle ===");
    console.log("New status:", newStatus);
    console.log("Server URL:", server);
    console.log("Full URL:", `${server}/shop/update-shop-status`);

    await axios
      .put(
        `${server}/shop/update-shop-status`,
        { isOnline: newStatus },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Status update success:", res.data);
        toast.success(res.data.message);
        dispatch(loadSeller());
        // Reload all products to reflect the new status
        dispatch(getAllProducts());
      })
      .catch((error) => {
        console.error("Status update error:", error);
        console.error("Error response:", error.response);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to update status";
        toast.error(errorMsg);
        setIsOnline(!newStatus); // Revert on error
      });
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Shop Status Toggle Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div
            className={`px-6 py-4 bg-gradient-to-r ${
              isOnline
                ? "from-green-500 to-green-600"
                : "from-gray-500 to-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">
                  Restaurant Status
                </h3>
                <p className="text-white text-sm opacity-90 mt-1">
                  {isOnline
                    ? "Your restaurant is currently accepting orders"
                    : "Your restaurant is currently offline"}
                </p>
              </div>
              <button
                onClick={handleStatusToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  isOnline ? "bg-white" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full transition-transform ${
                    isOnline
                      ? "translate-x-9 bg-green-500"
                      : "translate-x-1 bg-gray-500"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">
              {isOnline
                ? "✅ Customers can view and order from your menu"
                : "❌ Customers cannot access your products when offline"}
            </p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 className="text-white font-bold text-xl">
              Shop Profile Settings
            </h2>
          </div>

          <div className="p-8">
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={avatar ? avatar : `${seller.avatar?.url}`}
                  alt="Shop Avatar"
                  className="w-40 h-40 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                />
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-md">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex items-center justify-center w-full h-full"
                  >
                    <AiOutlineCamera className="text-white" size={20} />
                  </label>
                </div>
              </div>
            </div>

            {/* Shop Info Form */}
            <form onSubmit={updateHandler} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter shop name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Description
                </label>
                <textarea
                  placeholder="Enter shop description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter shop address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter zip code"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value="Pakistan"
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>

                {/* Toggle between dropdown and custom input */}
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="settingsCityOption"
                      checked={!useCustomCity}
                      onChange={() => setUseCustomCity(false)}
                      className="cursor-pointer text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      Select from list
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="settingsCityOption"
                      checked={useCustomCity}
                      onChange={() => setUseCustomCity(true)}
                      className="cursor-pointer text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      Type your city
                    </span>
                  </label>
                </div>

                {!useCustomCity ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Choose your city</option>
                    {pakistanCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter your city name"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    required
                  />
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
                >
                  Update Shop Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
