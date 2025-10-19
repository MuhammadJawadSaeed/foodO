import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load ride data from location.state or localStorage
  useEffect(() => {
    const loadRideData = () => {
      // First, try to get from location.state
      if (location.state?.ride) {
        setRideData(location.state.ride);
        // Save to localStorage for refresh
        localStorage.setItem(
          "currentRide",
          JSON.stringify(location.state.ride)
        );
        setLoading(false);
      } else {
        // If not in location.state, try localStorage
        const savedRide = localStorage.getItem("currentRide");
        if (savedRide) {
          try {
            const parsedRide = JSON.parse(savedRide);
            setRideData(parsedRide);
            setLoading(false);
          } catch (error) {
            console.error("Error parsing saved ride:", error);
            // If data is corrupted, redirect back
            navigate("/captain-home");
          }
        } else {
          // No data available, redirect to captain home
          navigate("/captain-home");
        }
      }
    };

    loadRideData();
  }, [location.state, navigate]);

  // Get phone number from multiple possible sources
  const phoneNumber =
    rideData?.order?.shippingAddress?.phoneNumber ||
    rideData?.user?.phoneNumber ||
    null;

  const customerName =
    rideData?.user?.name ||
    rideData?.user?.fullname?.firstname ||
    "Customer Name";

  // GSAP animation hook - must be called before any conditional returns
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

  // Show loading state
  if (loading || !rideData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ride details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative flex flex-col lg:flex-row overflow-hidden">
      {/* Header - Mobile Only */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen lg:hidden z-30">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <i className="ri-restaurant-2-fill text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            foodO
          </span>
        </div>
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map Section - Top on Mobile, Right side on Desktop */}
      <div className="flex-1 relative lg:h-screen order-1 lg:order-2">
        <div className="h-full w-full">
          <LiveTracking ride={rideData} />
        </div>
      </div>

      {/* Left Side - Ride Details (Desktop) / Bottom Panel (Mobile) */}
      <div
        className="lg:w-[450px] lg:h-screen lg:overflow-y-auto lg:bg-white lg:shadow-2xl lg:z-10 flex-shrink-0 
        order-2 lg:order-1"
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <i className="ri-restaurant-2-fill text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              foodO
            </span>
          </div>
          <Link
            to="/captain-home"
            className="h-10 w-10 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full transition-colors"
          >
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>

        {/* Mobile Bottom Panel */}
        <div
          className="h-auto max-h-[35vh] lg:max-h-none p-3 lg:p-4 flex flex-col relative bg-white shadow-2xl rounded-t-3xl lg:rounded-none overflow-y-auto"
          onClick={() => {
            setFinishRidePanel(true);
          }}
        >
          {/* Drag Indicator */}
          <div className="p-1 text-center w-full absolute top-1 left-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>

          {/* Order ID and Status */}
          {rideData?.order && (
            <div className="mt-5 mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2.5 border border-blue-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[9px] text-blue-700 font-semibold uppercase mb-0.5">
                    Order ID
                  </p>
                  <p className="text-xs font-bold text-gray-900 truncate">
                    #{rideData.order._id?.slice(-8) || "N/A"}
                  </p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[9px] text-indigo-700 font-semibold uppercase mb-0.5">
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      rideData.order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : rideData.order.status === "On the way"
                        ? "bg-blue-100 text-blue-700"
                        : rideData.order.status === "Preparing" ||
                          rideData.order.status === "Prepared"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {rideData.order.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Restaurant/Shop Name - NEW */}
          {rideData?.order?.cart?.[0]?.shop && (
            <div className="mt-3 mb-2 bg-gradient-to-r from-orange-50 to-red-50 p-2.5 rounded-lg border-2 border-orange-300">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                  <i className="ri-store-2-fill text-white text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-orange-700 font-semibold uppercase tracking-wide">
                    Restaurant
                  </p>
                  <p className="text-sm sm:text-base font-black text-gray-900 truncate">
                    {rideData.order.cart[0].shop.name}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-md">
                    <p className="text-[9px] font-bold">PICKUP</p>
                  </div>
                </div>
              </div>
              {/* Shop Address if available */}
              {rideData.order.cart[0].shop.address && (
                <div className="mt-1.5 flex items-start gap-1 bg-white px-2 py-1.5 rounded-md">
                  <i className="ri-map-pin-line text-orange-600 text-xs mt-0.5 flex-shrink-0"></i>
                  <p className="text-[10px] text-gray-700 leading-tight">
                    {rideData.order.cart[0].shop.address}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Customer Info Section - Compact */}
          <div className="mb-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <i className="ri-user-line text-white text-base"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-600 font-medium">
                  Customer
                </p>
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

          {/* Order Items Preview - NEW */}
          {rideData?.order?.cart && rideData.order.cart.length > 0 && (
            <div className="mb-2 bg-gradient-to-r from-orange-50 to-yellow-50 p-2.5 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-restaurant-line text-white text-xs"></i>
                </div>
                <div>
                  <p className="text-[10px] text-orange-700 font-semibold uppercase">
                    Order Items
                  </p>
                  <p className="text-[9px] text-orange-600">
                    {rideData.order.cart.length} item(s)
                  </p>
                </div>
              </div>

              {/* Items List - Scrollable */}
              <div className="space-y-1.5 max-h-20 overflow-y-auto">
                {rideData.order.cart.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white p-1.5 rounded-md border border-orange-100"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placeholder.png"}
                      alt={item.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-gray-600">
                        Qty: {item.qty} × PKR {item.discountPrice}
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-orange-600 flex-shrink-0">
                      PKR {item.qty * item.discountPrice}
                    </p>
                  </div>
                ))}
                {rideData.order.cart.length > 3 && (
                  <p className="text-[9px] text-center text-orange-600 font-medium pt-1">
                    +{rideData.order.cart.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}

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
              {/* Order Amount */}
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
                  PKR {Number(rideData?.order?.totalPrice || 0).toFixed(0)}
                </p>
              </div>

              {/* Rider Fee */}
              <div className="flex items-center justify-between mb-1.5 bg-white px-2 py-1 rounded-md">
                <div className="flex items-center gap-1.5">
                  <i className="ri-e-bike-2-line text-blue-600 text-xs"></i>
                  <p className="text-[10px] text-gray-700 font-medium">
                    Rider Fee
                  </p>
                </div>
                <p className="text-xs font-bold text-blue-600">
                  PKR {Number(rideData?.fare || 0).toFixed(0)}
                </p>
              </div>

              {/* Total to Collect */}
              <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-1.5 rounded-md">
                <p className="text-[10px] text-white font-semibold">
                  <i className="ri-hand-coin-line mr-0.5"></i>
                  TOTAL TO COLLECT
                </p>
                <p className="text-base font-bold text-white">
                  PKR{" "}
                  {Number(
                    (rideData?.order?.totalPrice || 0) + (rideData?.fare || 0)
                  ).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions - Compact */}
          <div className="grid grid-cols-3 gap-1.5 lg:gap-2 pt-2 border-t border-gray-200">
            {/* Distance */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-md lg:rounded-lg shadow-sm">
              <p className="text-[8px] lg:text-[9px] text-blue-100 font-medium">
                Distance
              </p>
              <p className="text-xs lg:text-sm font-bold text-white">
                {rideData?.distance
                  ? `${(rideData.distance / 1000).toFixed(1)} KM`
                  : "4 KM"}
              </p>
            </div>

            {/* Fare */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-md lg:rounded-lg shadow-sm">
              <p className="text-[8px] lg:text-[9px] text-green-100 font-medium">
                Fare
              </p>
              <p className="text-xs lg:text-sm font-bold text-white">
                PKR {rideData?.fare || "250"}
              </p>
            </div>

            {/* Complete Button */}
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-1 lg:py-1.5 px-2 lg:px-3 rounded-md lg:rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-0.5 lg:gap-1">
              <i className="ri-check-double-line text-xs lg:text-sm"></i>
              <span className="text-xs lg:text-sm">Complete</span>
            </button>
          </div>
        </div>
      </div>
      {/* End of Bottom Panel */}

      {/* Finish Ride Modal */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full lg:inset-0 lg:flex lg:items-center lg:justify-center z-[500] bottom-0 translate-y-full bg-white lg:bg-transparent px-3 py-10 pt-12 lg:p-4"
      >
        {/* Desktop overlay backdrop */}
        <div
          className="hidden lg:block absolute inset-0 bg-black bg-opacity-60 -z-10"
          onClick={() => setFinishRidePanel(false)}
        ></div>

        {/* Modal container */}
        <div className="lg:bg-white lg:rounded-2xl lg:shadow-2xl lg:max-w-4xl lg:w-full lg:max-h-[90vh] lg:overflow-y-auto lg:p-6 scroll-smooth">
          <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
