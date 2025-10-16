import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

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
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };
  return (
    <div className="pb-5">
      <div className="p-1 text-center w-full absolute top-0 left-0 cursor-pointer">
        <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <i
          className="text-3xl text-gray-200 ri-arrow-down-wide-line"
          onClick={() => {
            props.setConfirmRidePopupPanel(false);
          }}
        ></i>
      </div>
      <h3 className="text-2xl font-semibold mb-5 mt-4">
        Confirm this ride to Start
      </h3>
      <div className="flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src={
              props.ride?.user?.avatar?.url ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt="Customer"
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user?.fullname
              ? props.ride.user.fullname.firstname
              : props.ride?.user?.name || "Customer"}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {props.ride?.distance
            ? `${(props.ride.distance / 1000).toFixed(1)} KM`
            : "N/A"}
        </h5>
      </div>
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-restaurant-2-fill text-green-600 text-xl"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Pickup (Restaurant)</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-user-fill text-red-600"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Destination (Customer)</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-phone-fill text-blue-600"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Customer Contact</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.user?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-green-600"></i>
            <div>
              <h3 className="text-lg font-medium">
                PKR {props.ride?.fare || 0}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash on Delivery</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <form onSubmit={submitHander}>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter OTP received from passenger
            </label>
            <input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter OTP"
              autoComplete="off"
              maxLength="6"
            />

            <div className="mt-8 space-y-3">
              <button
                type="submit"
                className="w-full text-lg flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-semibold p-4 rounded-lg transition-colors"
              >
                <i className="ri-check-line mr-2"></i>
                Confirm Ride
              </button>

              <button
                type="button"
                onClick={() => {
                  props.setConfirmRidePopupPanel(false);
                  props.setRidePopupPanel(false);
                }}
                className="w-full text-lg flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-semibold p-4 rounded-lg transition-colors"
              >
                <i className="ri-close-line mr-2"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
