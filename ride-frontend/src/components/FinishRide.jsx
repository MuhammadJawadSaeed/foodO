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
        // Clear the saved ride from localStorage
        localStorage.removeItem("acceptedRide");
        localStorage.removeItem("currentRide");

        // Navigate back with a flag to refresh stats
        navigate("/captain-home", {
          state: { rideCompleted: true },
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error ending ride:", error);
      alert("Error finishing ride. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="pb-6 bg-white relative">
      <h5
        className="p-1 text-center w-full absolute -top-6 lg:top-0 cursor-pointer z-10"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        <i className="text-3xl text-gray-400 hover:text-gray-600 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 mt-2">
        Finish this Ride
      </h3>{" "}
      {/* Order ID and Status */}
      {props.ride?.order && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-blue-700 font-semibold uppercase mb-1">
                Order ID
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                #{props.ride.order._id?.slice(0, 8) || "N/A"}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-gray-600 font-semibold uppercase mb-0.5">
                Order Status
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold ${
                  props.ride.order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : props.ride.order.status === "On the way"
                    ? "bg-blue-100 text-blue-700"
                    : props.ride.order.status === "Preparing" ||
                      props.ride.order.status === "Prepared"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {props.ride.order.status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Customer Card with Avatar and Details */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-300"
              src={
                props.ride?.user?.avatar?.url ||
                "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
              }
              alt="Customer"
            />
            <div>
              <p className="text-[10px] text-gray-600 font-medium">
                Customer Name
              </p>
              <h2 className="text-base font-bold text-gray-800">
                {customerName}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-600 font-medium">Distance</p>
            <h5 className="text-base font-bold text-gray-800">
              {props.ride?.distance
                ? `${(props.ride.distance / 1000).toFixed(1)} KM`
                : "N/A"}
            </h5>
          </div>
        </div>

        {/* Phone Number */}
        {phoneNumber && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <i className="ri-phone-line text-gray-600 text-base"></i>
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
      {/* Desktop: Two Column Layout | Mobile: Stacked */}
      <div className="flex gap-4 flex-col lg:flex-row mt-5">
        {/* LEFT COLUMN - Locations & Payment (Desktop: 60%, Mobile: full) */}
        <div className="w-full lg:w-[60%] space-y-4">
          {/* Locations Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pickup Location */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-restaurant-2-fill text-white text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-gray-800 mb-0.5">
                    Pickup Location
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {props.ride?.pickup}
                  </p>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-map-pin-user-fill text-white text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-gray-800 mb-0.5">
                    Destination
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {props.ride?.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <i className="ri-money-dollar-circle-line text-base"></i>
              Payment Details
            </h3>

            <div className="space-y-2">
              {/* Payment Method */}
              <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <i className="ri-bank-card-line text-gray-600 text-sm"></i>
                  <span className="text-xs font-medium text-gray-700">
                    Payment Method
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {props.ride?.order?.paymentInfo?.type || "Cash On Delivery"}
                </span>
              </div>

              {/* Order Amount (Items Only) */}
              {props.ride?.order?.totalPrice && (
                <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <i className="ri-shopping-bag-line text-gray-600 text-sm"></i>
                    <span className="text-xs font-medium text-gray-700">
                      Order Amount
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    PKR {Number(props.ride.order.totalPrice || 0).toFixed(0)}
                  </span>
                </div>
              )}

              {/* Rider Fee (Delivery Charge) */}
              <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <i className="ri-e-bike-2-line text-gray-600 text-sm"></i>
                  <span className="text-xs font-medium text-gray-700">
                    Rider Fee
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  PKR {Number(props.ride?.fare || 0).toFixed(0)}
                </span>
              </div>

              {/* Total Collection */}
              <div className="flex items-center justify-between p-2.5 bg-green-600 rounded-md">
                <div className="flex items-center gap-2">
                  <i className="ri-wallet-3-line text-white text-base"></i>
                  <span className="text-xs font-semibold text-white">
                    Total Collection
                  </span>
                </div>
                <span className="text-base font-bold text-white">
                  PKR{" "}
                  {Number(
                    (props.ride?.order?.totalPrice || 0) +
                      (props.ride?.fare || 0)
                  ).toFixed(0)}
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-2 text-center font-medium">
                <i className="ri-hand-coin-line"></i>{" "}
                {props.ride?.order?.paymentInfo?.type || "Cash on Delivery"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Delivery Proof (Desktop: 40%, Mobile: full) */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 lg:sticky lg:top-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <i className="ri-camera-line text-base"></i>
              Delivery Proof Required
            </h3>

            {!imagePreview ? (
              <div className="text-center">
                <div className="bg-white rounded-lg p-5 border-2 border-dashed border-gray-300">
                  <i className="ri-image-add-line text-5xl text-gray-400 mb-2"></i>
                  <p className="text-xs text-gray-600 mb-3">
                    Take a photo of the delivered order
                  </p>
                  <button
                    onClick={captureImage}
                    type="button"
                    className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors text-sm"
                  >
                    <i className="ri-camera-fill text-base"></i>
                    Capture Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Delivery Proof"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setCompletionImage(null);
                  }}
                  type="button"
                  className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-1.5 transition-colors"
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
                <div className="mt-2 flex items-center justify-center gap-2 text-green-700 bg-green-50 py-2 rounded-lg border border-green-200">
                  <i className="ri-check-line text-base"></i>
                  <span className="text-xs font-semibold">Photo Captured</span>
                </div>
              </div>
            )}

            {/* Desktop Finish Button */}
            <div className="hidden lg:block mt-3">
              <button
                onClick={endRide}
                disabled={!completionImage || isUploading}
                className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-all ${
                  completionImage && !isUploading
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isUploading ? (
                  <>
                    <i className="ri-loader-4-line text-base animate-spin"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="ri-check-double-line text-base"></i>
                    Finish Ride
                  </>
                )}
              </button>
              {!completionImage && (
                <p className="text-[10px] text-red-600 text-center mt-1.5">
                  <i className="ri-error-warning-line"></i> Capture photo first
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Finish Button */}
      <div className="lg:hidden mt-4 w-full pb-4">
        <button
          onClick={endRide}
          disabled={!completionImage || isUploading}
          className={`w-full flex items-center justify-center gap-2 text-base font-semibold py-3 rounded-lg transition-all ${
            completionImage && !isUploading
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isUploading ? (
            <>
              <i className="ri-loader-4-line text-lg animate-spin"></i>
              Uploading...
            </>
          ) : (
            <>
              <i className="ri-check-double-line text-lg"></i>
              Finish Ride
            </>
          )}
        </button>
        {!completionImage && (
          <p className="text-xs text-red-600 text-center mt-2 font-medium">
            <i className="ri-error-warning-line"></i> Please capture delivery
            proof photo first
          </p>
        )}
      </div>
    </div>
  );
};

export default FinishRide;
