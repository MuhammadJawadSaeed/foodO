import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinishRide = (props) => {
  const navigate = useNavigate();
  const [completionImage, setCompletionImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get phone number from multiple possible sources
  const phoneNumber =
    props.ride?.order?.shippingAddress?.phoneNumber ||
    props.ride?.user?.phoneNumber ||
    null;

  const customerName = props.ride?.user?.fullname
    ? props.ride.user.fullname.firstname
    : props.ride?.user?.name || "Customer";

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCompletionImage(reader.result);
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  // Capture image using camera
  const captureImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // Use back camera on mobile
    input.onchange = (e) => handleImageChange(e);
    input.click();
  };

  async function endRide() {
    if (!completionImage) {
      alert("Please capture delivery proof image before finishing ride");
      return;
    }

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: props.ride._id,
          completionImage: completionImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("Error ending ride:", error);
      alert("Error finishing ride. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>

      {/* Customer Card with Avatar and Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-indigo-200 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-14 rounded-full object-cover border-2 border-indigo-300 shadow-md"
              src={
                props.ride?.user?.avatar?.url ||
                "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
              }
              alt="Customer"
            />
            <div>
              <p className="text-xs text-gray-600 font-medium">Customer Name</p>
              <h2 className="text-lg font-bold text-gray-800">
                {customerName}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 font-medium">Distance</p>
            <h5 className="text-lg font-bold text-indigo-600">
              {props.ride?.distance
                ? `${(props.ride.distance / 1000).toFixed(1)} KM`
                : "N/A"}
            </h5>
          </div>
        </div>

        {/* Phone Number */}
        {phoneNumber && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-100">
            <i className="ri-phone-line text-indigo-600 text-lg"></i>
            <span className="text-sm font-semibold text-gray-700">
              {phoneNumber}
            </span>
            <a
              href={`tel:${phoneNumber}`}
              className="ml-auto w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="ri-phone-fill text-white text-sm"></i>
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          {/* Pickup Location */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-restaurant-2-fill text-green-600 text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill text-red-600"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="bg-green-50 rounded-lg p-4 mt-3 border-2 border-green-200">
            <h3 className="text-base font-bold text-green-800 mb-3 flex items-center gap-2">
              <i className="ri-money-dollar-circle-line text-xl"></i>
              Payment Details
            </h3>

            {/* Order Amount */}
            {props.ride?.order?.totalPrice && (
              <div className="flex items-center justify-between p-2 bg-white rounded-lg mb-2">
                <div className="flex items-center gap-2">
                  <i className="ri-shopping-bag-line text-orange-600"></i>
                  <span className="text-sm font-medium text-gray-700">
                    Order Amount
                  </span>
                </div>
                <span className="text-base font-bold text-orange-600">
                  PKR {props.ride.order.totalPrice}
                </span>
              </div>
            )}

            {/* Ride Fee */}
            <div className="flex items-center justify-between p-2 bg-white rounded-lg mb-2">
              <div className="flex items-center gap-2">
                <i className="ri-taxi-line text-blue-600"></i>
                <span className="text-sm font-medium text-gray-700">
                  Delivery Fee
                </span>
              </div>
              <span className="text-base font-bold text-blue-600">
                PKR {props.ride?.fare || 0}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg mt-2">
              <div className="flex items-center gap-2">
                <i className="ri-wallet-3-line text-white text-lg"></i>
                <span className="text-sm font-bold text-white">
                  Total Collection
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                PKR{" "}
                {(props.ride?.order?.totalPrice || 0) + (props.ride?.fare || 0)}
              </span>
            </div>

            <p className="text-xs text-green-700 mt-2 text-center font-medium">
              <i className="ri-hand-coin-line"></i> Cash on Delivery
            </p>
          </div>

          {/* Completion Evidence Section */}
          <div className="bg-yellow-50 rounded-lg p-4 mt-4 border-2 border-yellow-200">
            <h3 className="text-base font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <i className="ri-camera-line text-xl"></i>
              Delivery Proof (Required)
            </h3>

            {!imagePreview ? (
              <div className="text-center">
                <div className="bg-white rounded-lg p-6 border-2 border-dashed border-yellow-300 mb-3">
                  <i className="ri-image-add-line text-6xl text-yellow-400 mb-3"></i>
                  <p className="text-sm text-gray-600 mb-4">
                    Take a photo of the delivered order as proof
                  </p>
                  <button
                    onClick={captureImage}
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                  >
                    <i className="ri-camera-fill text-xl"></i>
                    Capture Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Delivery Proof"
                  className="w-full h-48 object-cover rounded-lg border-2 border-yellow-300"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setCompletionImage(null);
                  }}
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
                <div className="mt-2 flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 rounded-lg">
                  <i className="ri-check-line text-xl"></i>
                  <span className="text-sm font-semibold">Photo Captured</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={endRide}
            disabled={!completionImage || isUploading}
            className={`w-full flex items-center justify-center gap-2 text-lg font-semibold p-4 rounded-xl shadow-lg transition-all transform ${
              completionImage && !isUploading
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:from-green-700 hover:to-emerald-700 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <i className="ri-loader-4-line text-xl animate-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="ri-check-double-line text-xl"></i>
                Finish Ride
              </>
            )}
          </button>
          {!completionImage && (
            <p className="text-xs text-red-600 text-center mt-2">
              <i className="ri-error-warning-line"></i> Please capture delivery
              proof photo first
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
