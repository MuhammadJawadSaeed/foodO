import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  // Get phone number from multiple possible sources
  const phoneNumber =
    rideData?.order?.shippingAddress?.phoneNumber ||
    rideData?.user?.phoneNumber ||
    null;

  const customerName =
    rideData?.user?.name ||
    rideData?.user?.fullname?.firstname ||
    "Customer Name";

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div
        className="h-auto max-h-[35vh] p-3 flex flex-col relative bg-white shadow-2xl rounded-t-3xl overflow-y-auto"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        {/* Drag Indicator */}
        <div className="p-1 text-center w-full absolute top-1 left-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>

        {/* Customer Info Section - Compact */}
        <div className="mt-3 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <i className="ri-user-line text-white text-base"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-600 font-medium">Customer</p>
              <p className="text-sm font-bold text-gray-800 truncate">
                {customerName}
              </p>
            </div>
            {/* Call Button */}
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow hover:bg-green-600 transition-colors flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="ri-phone-line text-white text-sm"></i>
              </a>
            )}
          </div>

          {/* Phone Number Display */}
          {phoneNumber && (
            <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-md">
              <i className="ri-phone-line text-indigo-600 text-xs"></i>
              <span className="text-xs font-semibold text-gray-700">
                {phoneNumber}
              </span>
            </div>
          )}
        </div>

        {/* Ride Information - Compact */}
        <div className="space-y-2 mb-2">
          {/* Pickup */}
          <div className="flex items-start gap-2 bg-green-50 p-2 rounded-lg border border-green-200">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-line text-white text-xs"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-green-700 font-semibold uppercase">
                Pickup
              </p>
              <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-1">
                {rideData?.pickup || "Pickup Location"}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-2 bg-red-50 p-2 rounded-lg border border-red-200">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-fill text-white text-xs"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-red-700 font-semibold uppercase">
                Destination
              </p>
              <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-1">
                {rideData?.destination || "Destination"}
              </p>
            </div>
          </div>

          {/* Payment Collection - Compact */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-2 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-shopping-bag-line text-white text-xs"></i>
                </div>
                <p className="text-[10px] text-orange-700 font-semibold uppercase">
                  Order Amount
                </p>
              </div>
              <p className="text-sm font-bold text-orange-600">
                PKR {rideData?.order?.totalPrice || 0}
              </p>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-1 rounded-md">
              <p className="text-[10px] text-white font-semibold">
                <i className="ri-hand-coin-line mr-0.5"></i>
                COLLECT FROM CUSTOMER
              </p>
              <p className="text-sm font-bold text-white">
                PKR {(rideData?.order?.totalPrice || 0) + (rideData?.fare || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions - Compact */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200">
          {/* Distance & Fare */}
          <div className="flex gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-2.5 py-1.5 rounded-lg shadow-sm">
              <p className="text-[9px] text-blue-100 font-medium">Distance</p>
              <p className="text-sm font-bold text-white">
                {rideData?.distance
                  ? `${(rideData.distance / 1000).toFixed(1)} KM`
                  : "4 KM"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-2.5 py-1.5 rounded-lg shadow-sm">
              <p className="text-[9px] text-green-100 font-medium">Fare</p>
              <p className="text-sm font-bold text-white">
                PKR {rideData?.fare || "250"}
              </p>
            </div>
          </div>

          {/* Complete Button */}
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all">
            <i className="ri-check-double-line mr-1 text-sm"></i>
            <span className="text-sm">Complete</span>
          </button>
        </div>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>

      <div className="h-screen fixed w-screen top-0 z-[-1]">
        <LiveTracking ride={rideData} />
      </div>
    </div>
  );
};

export default CaptainRiding;
