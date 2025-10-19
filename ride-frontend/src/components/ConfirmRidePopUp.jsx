import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Get phone number from multiple possible sources
  const phoneNumber =
    props.ride?.order?.shippingAddress?.phoneNumber ||
    props.ride?.user?.phoneNumber ||
    null;

  const customerName = props.ride?.user?.fullname
    ? props.ride.user.fullname.firstname
    : props.ride?.user?.name || "Customer";

  const submitHander = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      {
        params: {
          rideId: props.ride._id,
          otp: otp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      // Clear accepted ride from localStorage after starting
      localStorage.removeItem("acceptedRide");

      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-1 text-center w-full absolute top-2 left-0 cursor-pointer">
        <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <i
          className="text-3xl text-gray-400 ri-arrow-down-wide-line hover:text-gray-600 transition-colors"
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
          }}
        ></i>
      </div>

      <h3 className="text-2xl font-bold mb-5 mt-8 text-gray-900 text-center">
        Confirm Ride to Start
      </h3>

      {/* Order ID and Status */}
      {props.ride?.order && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-4 border border-blue-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-blue-700 font-semibold uppercase mb-0.5">
                Order ID
              </p>
              <p className="text-xs font-bold text-gray-900 truncate">
                #{props.ride.order._id?.slice(-8) || "N/A"}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] text-indigo-700 font-semibold uppercase mb-0.5">
                Order Status
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
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

      {/* Customer Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-xl shadow-md mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
              src={
                props.ride?.user?.avatar?.url ||
                "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
              }
              alt="Customer"
            />
            <div>
              <p className="text-xs text-gray-800 font-medium">Customer</p>
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {customerName}
              </h2>
            </div>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg shadow">
            <p className="text-xs text-gray-600 font-medium">Distance</p>
            <h5 className="text-base font-bold text-gray-900">
              {props.ride?.distance
                ? `${(props.ride.distance / 1000).toFixed(1)} KM`
                : "N/A"}
            </h5>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="space-y-3">
        {/* Restaurant Name & Order Items */}
        {props.ride?.order?.cart?.[0]?.shop && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border-2 border-orange-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-store-2-fill text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-orange-700 font-semibold uppercase">
                  Restaurant
                </p>
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {props.ride.order.cart[0].shop.name}
                </h3>
              </div>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-[10px] font-bold">
                PICKUP
              </div>
            </div>

            {/* Order Items */}
            {props.ride.order.cart && props.ride.order.cart.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs font-semibold text-orange-800 flex items-center gap-1">
                  <i className="ri-restaurant-line"></i>
                  {props.ride.order.cart.length} Item(s) to Deliver
                </p>
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {props.ride.order.cart.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white p-1.5 rounded text-xs"
                    >
                      <span className="font-semibold text-gray-900">
                        • {item.name}
                      </span>
                      <span className="text-gray-600">x{item.qty}</span>
                    </div>
                  ))}
                  {props.ride.order.cart.length > 3 && (
                    <p className="text-[10px] text-center text-orange-600 font-medium">
                      +{props.ride.order.cart.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pickup */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="ri-map-pin-line text-white text-lg"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-800 uppercase">
                Pickup Location
              </h3>
              <p className="text-sm text-gray-700 mt-1 leading-tight">
                {props.ride?.pickup || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="ri-map-pin-user-fill text-white text-lg"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 uppercase">
                Destination (Customer)
              </h3>
              <p className="text-sm text-gray-700 mt-1 leading-tight">
                {props.ride?.destination || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Phone Number */}
        {phoneNumber && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-phone-fill text-white text-lg"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-800 uppercase">
                  Customer Contact
                </h3>
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>
              <a
                href={`tel:${phoneNumber}`}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
              >
                <i className="ri-phone-line text-white text-lg"></i>
              </a>
            </div>
          </div>
        )}

        {/* Order Amount & Total Collection - Only for Cash on Delivery */}
        {props.ride?.order?.paymentInfo?.type === "Cash On Delivery" &&
          props.ride?.order?.totalPrice && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-orange-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shopping-bag-line text-white text-lg"></i>
                  </div>
                  <h3 className="text-sm font-bold text-orange-800 uppercase">
                    Order Amount
                  </h3>
                </div>
                <p className="text-xl font-bold text-orange-600">
                  PKR {props.ride.order.totalPrice}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="ri-hand-coin-line text-white text-lg"></i>
                    <p className="text-xs font-bold text-white uppercase">
                      Collect from Customer
                    </p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    PKR{" "}
                    {(props.ride.order.totalPrice || 0) +
                      (props.ride?.fare || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Fare */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-currency-line text-white text-lg"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-800 uppercase">
                Delivery Fee
              </h3>
              <p className="text-xl font-bold text-gray-900">
                PKR {props.ride?.fare || 0}
              </p>
              <p className="text-xs text-gray-600">Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Form */}
      <div className="mt-6 w-full">
        <form onSubmit={submitHander}>
          <label
            htmlFor="otp"
            className="block text-sm font-bold text-gray-800 mb-2"
          >
            Enter OTP received from customer
          </label>
          <input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            className="bg-gray-100 px-6 py-4 font-mono text-2xl rounded-lg w-full border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all text-center"
            placeholder="0000"
            autoComplete="off"
            maxLength="6"
          />

          <div className="mt-6 space-y-3">
            <button
              type="submit"
              className="w-full text-lg flex justify-center items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold p-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <i className="ri-check-line mr-2 text-xl"></i>
              Confirm & Start Ride
            </button>

            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-full text-lg flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold p-4 rounded-xl transition-all"
            >
              <i className="ri-close-line mr-2 text-xl"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
