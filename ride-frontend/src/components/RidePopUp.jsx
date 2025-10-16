import React from "react";

const RidePopUp = (props) => {
  return (
    <div className="pb-5">
      <div className="p-1 text-center w-full absolute top-0 left-0 cursor-pointer">
        <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <i
          className="text-3xl text-gray-200 ri-arrow-down-wide-line"
          onClick={() => {
            props.setRidePopupPanel(false);
          }}
        ></i>
      </div>
      <h3 className="text-2xl font-semibold mb-5 mt-4">New Ride Available!</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 rounded-full object-cover w-12"
            src={
              props.ride?.user?.avatar?.url ||
              "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            }
            alt="Customer"
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user?.fullname
              ? `${props.ride.user.fullname.firstname || ""} ${
                  props.ride.user.fullname.lastname || ""
                }`
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
        <div className="mt-8 w-full space-y-3">
          <button
            onClick={async () => {
              // First confirm the ride through the API
              await props.confirmRide();
              // The confirmRide function will handle:
              // 1. Making the API call
              // 2. Hiding the ride popup
              // 3. Showing the confirm ride popup
            }}
            className="bg-green-600 hover:bg-green-700 w-full text-white font-semibold p-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <i className="ri-check-double-line mr-2"></i>
            Accept Ride
          </button>

          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold p-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <i className="ri-close-line mr-2"></i>
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
