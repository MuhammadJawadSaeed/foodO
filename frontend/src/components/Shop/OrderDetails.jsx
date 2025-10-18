import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import {
  MdLocationOn,
  MdPayment,
  MdChat,
  MdCheckCircle,
  MdCancel,
  MdInfo,
  MdUpdate,
  MdList,
} from "react-icons/md";
import { FaBox, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let socket;

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [showRideConfirmPopup, setShowRideConfirmPopup] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [rideDetails, setRideDetails] = useState(null);
  const [otp, setOtp] = useState("");
  const [rideAccepted, setRideAccepted] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const { id } = useParams();

  // Socket connection for real-time updates
  useEffect(() => {
    socket = io(ENDPOINT);

    if (seller && seller._id) {
      // Join as shop with seller ID as room
      socket.emit("join", seller._id);
      console.log("Shop connected to socket and joined room:", seller._id);
    }

    // Listen for order delivered event
    socket.on("order-delivered", (data) => {
      console.log("Order delivered event received:", data);
      if (data.orderId === id) {
        toast.success("Order has been delivered successfully! ✅");
        setStatus("Delivered");
        // Refresh orders
        dispatch(getAllOrdersOfShop(seller._id));
      }
    });

    // Listen for ride accepted event
    socket.on("ride-accepted", (data) => {
      console.log("🎉 Ride accepted event received!");
      console.log("Event data:", JSON.stringify(data, null, 2));
      console.log("Current order ID:", id);

      if (data.orderId === id) {
        console.log("✅ Event is for current order");
        console.log("Ride details:", data.ride);

        // Get OTP from multiple possible sources
        const otpValue = data.ride?.otp || data.otp || data.ride?.OTP;
        console.log("OTP received:", otpValue);
        console.log("OTP type:", typeof otpValue);

        if (otpValue) {
          toast.success(
            "🎉 Captain accepted the ride! You can now confirm the order."
          );
          setRideAccepted(true);
          setRideDetails(data.ride);
          setOtp(String(otpValue)); // Convert to string to ensure display
          setShowOTP(true);

          console.log("✅ State updated - rideAccepted:", true);
          console.log("✅ State updated - otp:", String(otpValue));
          console.log("✅ State updated - showOTP:", true);
        } else {
          console.error("❌ OTP not found in event data!");
          console.log("Available data keys:", Object.keys(data));
          console.log(
            "Available ride keys:",
            data.ride ? Object.keys(data.ride) : "No ride object"
          );

          // Still set ride as accepted but show warning
          setRideAccepted(true);
          setRideDetails(data.ride);
          toast.warning(
            "Captain accepted but OTP not received. Please refresh page."
          );
        }

        // Refresh orders
        dispatch(getAllOrdersOfShop(seller._id));
      } else {
        console.log("ℹ️ Event is for different order:", data.orderId);
      }
    });

    // Listen for ride start event to hide OTP
    socket.on("ride-started", (data) => {
      console.log("🚗 Ride started event received!");
      console.log("Event data:", data);

      if (data.orderId === id) {
        console.log("✅ Ride started for current order - hiding OTP");
        toast.info("🚗 Captain has started the delivery!");
        setShowOTP(false);

        // Refresh orders to update ride status
        dispatch(getAllOrdersOfShop(seller._id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [seller, id, dispatch]);

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const data = orders && orders.find((item) => item._id === id);

  // Debug: Log order data
  useEffect(() => {
    if (data) {
      console.log("=== ORDER DATA DEBUG ===");
      console.log("Order ID:", data._id);
      console.log("Order Status:", data.status);
      console.log("Has Ride:", !!data.ride);
      console.log("Ride Status:", data.rideStatus);
      console.log("Ride OTP (order.rideOTP):", data.rideOTP);
      if (data.ride) {
        console.log("Ride Object:", data.ride);
        console.log("Ride OTP (ride.otp):", data.ride.otp);
        console.log("Ride Keys:", Object.keys(data.ride));
      }
      console.log("Current State - showOTP:", showOTP);
      console.log("Current State - otp:", otp);
      console.log("Current State - rideAccepted:", rideAccepted);
      console.log("========================");
    }
  }, [data, showOTP, otp, rideAccepted]);

  // Set initial status when data loads
  useEffect(() => {
    if (data && data.status) {
      setStatus(data.status);
    }

    // Check if ride exists and is accepted - Load OTP from order data
    if (data && data.ride) {
      console.log("📋 Order has ride:", data.ride);
      console.log("Ride status:", data.rideStatus);
      console.log("Ride OTP in order:", data.rideOTP);
      console.log("Full order data:", JSON.stringify(data, null, 2));

      const rideStatus = data.rideStatus || data.ride.status;

      // Show OTP if ride is accepted AND not started yet
      if (rideStatus === "accepted" || rideStatus === "started") {
        console.log("✅ Ride is accepted - showing confirm button and OTP");
        setRideAccepted(true);

        // Show OTP until ride starts
        if (rideStatus === "accepted") {
          setShowOTP(true);
          console.log("✅ Ride status is 'accepted' - OTP should be visible");
        } else if (rideStatus === "started") {
          setShowOTP(false);
          console.log("ℹ️ Ride has started - hiding OTP");
        }

        // Load OTP from order data (saved in database) OR from ride object
        // Check multiple possible locations
        let otpValue = null;

        if (data.rideOTP) {
          console.log("✅ Loading OTP from order.rideOTP:", data.rideOTP);
          otpValue = data.rideOTP;
        } else if (data.ride && data.ride.otp) {
          console.log("✅ Loading OTP from ride.otp:", data.ride.otp);
          otpValue = data.ride.otp;
        } else if (data.ride && typeof data.ride === "object") {
          // Check if ride has OTP in any case variation
          const rideKeys = Object.keys(data.ride);
          console.log("Available ride keys:", rideKeys);
          const otpKey = rideKeys.find((key) => key.toLowerCase() === "otp");
          if (otpKey) {
            console.log(
              `✅ Loading OTP from ride.${otpKey}:`,
              data.ride[otpKey]
            );
            otpValue = data.ride[otpKey];
          }
        }

        if (!otpValue) {
          console.log("⚠️ No OTP found in order data or ride object");
          console.log("order.rideOTP:", data.rideOTP);
          console.log("order.ride:", data.ride);
        }

        if (otpValue) {
          setOtp(String(otpValue)); // Convert to string
          console.log("✅ OTP set to state:", String(otpValue));
        } else {
          console.error("❌ Failed to load OTP from any source");
        }
      } else {
        console.log("ℹ️ Ride status:", rideStatus);
      }
    } else {
      console.log("ℹ️ Order has no ride yet");
    }
  }, [data]);

  const fetchRideOTP = async (rideId) => {
    try {
      // This would need a backend endpoint to fetch ride with OTP
      // For now, OTP will come from socket event or order data
      console.log("Fetching OTP for ride:", rideId);
    } catch (error) {
      console.error("Error fetching OTP:", error);
    }
  };

  const handleNotifyRider = async () => {
    try {
      console.log("Notifying riders for order:", id);
      console.log("Seller:", seller);

      const res = await axios.post(
        `${server}/order/notify-rider/${id}`,
        {},
        { withCredentials: true }
      );

      console.log("Notify rider response:", res.data);

      if (res.data.success) {
        toast.success(" Riders notified! Waiting for captain to accept...");

        // Store ride details but don't show OTP yet
        if (res.data.ride) {
          setRideDetails(res.data.ride);
        }

        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
      console.error("Notify rider error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to notify riders");
    }
  };

  const handleConfirmOrder = async () => {
    try {
      console.log("Confirming order:", id);
      console.log("Seller:", seller);

      const res = await axios.post(
        `${server}/order/confirm-order/${id}`,
        {},
        { withCredentials: true }
      );

      console.log("Confirm response:", res.data);

      if (res.data.success) {
        toast.success("✅ Order confirmed successfully!");

        // OTP already displayed on page
        dispatch(getAllOrdersOfShop(seller._id));

        // Navigate after short delay
        setTimeout(() => {
          navigate("/dashboard-orders");
        }, 2000);
      }
    } catch (error) {
      console.error("Confirm error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to confirm order");
    }
  };

  const handleCancelOrder = async () => {
    try {
      console.log("Cancelling order:", id);
      console.log("Seller:", seller);

      const res = await axios.post(
        `${server}/order/cancel-order/${id}`,
        {},
        { withCredentials: true }
      );

      console.log("Cancel response:", res.data);

      if (res.data.success) {
        toast.success("Order cancelled successfully");
        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
      console.error("Cancel error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleConfirmRideToStart = async () => {
    try {
      // When cook confirms the ride to start, show OTP
      if (rideDetails && rideDetails.otp) {
        setOtp(rideDetails.otp);
        setShowRideConfirmPopup(false);
        setShowOTPPopup(true);
      }
    } catch (error) {
      toast.error("Failed to get OTP");
    }
  };

  const orderUpdateHandler = async (e) => {
    // Prevent status update for cancelled orders
    if (data?.status === "Cancelled" || data?.status === "Cancelled by Shop") {
      toast.error("Cannot update status of a cancelled order!");
      return;
    }

    // Prevent updating to cancelled status (use cancel button instead)
    if (status === "Cancelled" || status === "Cancelled by Shop") {
      toast.error("Please use the Cancel Order button to cancel orders!");
      return;
    }

    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  console.log(data?.status);

  // Ride Confirmation Popup (Full Screen)
  const RideConfirmationPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Ride Confirmation
          </h2>
          <button
            onClick={() => setShowRideConfirmPopup(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <AiOutlineClose size={28} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Ride Created Successfully!
            </h3>
            <p className="text-gray-700 mb-2">
              A captain will accept this ride shortly.
            </p>
          </div>

          {rideDetails && (
            <>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Pickup Location
                  </p>
                  <p className="text-lg text-gray-800">{rideDetails.pickup}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Destination
                  </p>
                  <p className="text-lg text-gray-800">
                    {rideDetails.destination}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Fare</p>
                  <p className="text-2xl font-bold text-green-600">
                    PKR {rideDetails.fare}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-blue-600 capitalize">
                    {rideDetails.status}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  ℹ️ Once a captain accepts, click "Confirm Ride to Start" to
                  view the OTP
                </p>
              </div>
            </>
          )}

          <button
            onClick={handleConfirmRideToStart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Confirm Ride to Start
          </button>
        </div>
      </div>
    </div>
  );

  // OTP Display Popup (Full Screen)
  const OTPDisplayPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-2xl w-[95%] max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Delivery OTP</h2>
          <button
            onClick={() => setShowOTPPopup(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <AiOutlineClose size={28} />
          </button>
        </div>

        <div className="space-y-6 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
            <p className="text-lg text-gray-700 mb-4">
              Share this OTP with the delivery captain
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
              <p className="text-6xl font-bold text-purple-600 tracking-widest">
                {otp}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              ⚠️ Do not share this OTP until the captain arrives at pickup
              location
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              The captain needs this OTP to start the delivery
            </p>
          </div>

          <button
            onClick={() => setShowOTPPopup(false)}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      {/* Ride Confirmation Popup */}
      {showRideConfirmPopup && <RideConfirmationPopup />}

      {/* OTP Display Popup */}
      {showOTPPopup && <OTPDisplayPopup />}

      {/* Header Section - Responsive */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <FaBox size={24} className="text-blue-600 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Order Details
          </h1>
        </div>
        <Link to="/dashboard-orders">
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md flex items-center gap-2">
            <MdList size={18} />
            Order List
          </button>
        </Link>
      </div>

      {/* Order ID and Date - Responsive */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaHashtag className="text-blue-500" />
          <span>Order ID:</span>
          <span className="font-semibold text-gray-800">
            #{data?._id?.slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-green-500" />
          <span>Placed on:</span>
          <span className="font-semibold text-gray-800">
            {data?.createdAt?.slice(0, 10)}
          </span>
        </div>
      </div>

      {/* Order Items Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Order Items
        </h3>
        <div className="space-y-3">
          {data &&
            data?.cart.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={`${item.images[0]?.url}`}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                    {item.name}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    PKR {item.discountPrice} × {item.qty}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Subtotal: PKR {item.discountPrice * item.qty}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Total Price */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
          <span className="text-base sm:text-lg font-semibold text-gray-700">
            Total Price:
          </span>
          <span className="text-lg sm:text-xl font-bold text-green-600">
            PKR {data?.totalPrice}
          </span>
        </div>
      </div>

      {/* Shipping & Payment Info - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Shipping Address */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MdLocationOn size={20} className="text-blue-600" />
            Shipping Address
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{data?.shippingAddress.address1}</p>
            {data?.shippingAddress.address2 && (
              <p>{data?.shippingAddress.address2}</p>
            )}
            <p className="font-medium">
              {data?.shippingAddress.city}, {data?.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MdPayment size={20} className="text-purple-600" />
            Payment Info
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  data?.paymentInfo?.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data?.paymentInfo?.status === "Paid" && <MdCheckCircle />}
                {data?.paymentInfo?.status || "Not Paid"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Captain Accepted Alert - Shows when ride is accepted */}
      {rideAccepted && data?.ride && (
        <div className="mb-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <MdCheckCircle className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-green-900 mb-1">
                  🎉 Captain Accepted the Ride!
                </h4>
                <p className="text-sm text-green-800">
                  The delivery captain has accepted your order. You can now
                  confirm the order below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery OTP Info Box - Always visible when OTP available */}
      {data && otp && (
        <div className="mb-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 border-2 border-purple-300 rounded-xl p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl">🔑</span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                  Delivery Verification OTP
                  <MdCheckCircle className="text-green-500" />
                </h4>
                <p className="text-sm text-purple-800 mb-3">
                  The captain will need this OTP to pick up the order. Please
                  verify the captain's identity before sharing.
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Your OTP Code:
                      </p>
                      <p className="text-3xl font-black text-purple-600 tracking-widest select-all">
                        {otp}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(otp);
                        toast.success("OTP copied to clipboard!");
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat with Customer Button */}
      {data?.user?._id && (
        <div className="mb-6">
          <Link to={`/dashboard-messages?userId=${data.user._id}`}>
            <button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-6 rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <MdChat size={20} />
              Chat with Customer
            </button>
          </Link>
        </div>
      )}

      {/* Order Status Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MdInfo size={20} className="text-blue-600" />
          Order Status
        </h4>
      </div>

      {/* Current Status Display */}
      <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          Current Status:{" "}
          <span className="font-semibold text-gray-800">
            {data?.status || "Loading..."}
          </span>
        </p>
      </div>

      {/* Show Notify Rider / Confirm Order buttons based on ride status */}
      {data && data.status === "Pending" ? (
        <div className="mt-4 space-y-3 max-w-2xl">
          {/* Show info message based on state */}
          {!data.ride ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <p className="text-blue-800 font-medium text-sm flex items-center gap-2">
                <MdInfo size={18} />
                Click "Notify to Rider" to create a ride request for this order
              </p>
            </div>
          ) : !rideAccepted ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-yellow-800 font-medium text-sm flex items-center gap-2">
                <MdInfo size={18} />
                Waiting for captain to accept the ride...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-green-800 font-medium text-sm flex items-center gap-2">
                  <MdCheckCircle size={18} />
                  Captain accepted! You can now confirm the order.
                </p>
              </div>

              {/* Debug info - Remove after testing */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-gray-100 border border-gray-300 rounded p-2 mb-2 text-xs space-y-1">
                  <p>
                    <strong>Debug:</strong> showOTP={String(showOTP)}, otp="
                    {otp}", rideAccepted={String(rideAccepted)}
                  </p>
                  <p>
                    <strong>Order:</strong> rideOTP="{data?.rideOTP}",
                    rideStatus="{data?.rideStatus}"
                  </p>
                  {data?.ride && (
                    <p>
                      <strong>Ride:</strong> status="{data.ride.status}", otp="
                      {data.ride.otp}"
                    </p>
                  )}
                  <button
                    onClick={() => {
                      console.log("🧪 Test: Manually setting OTP");
                      setOtp("TEST1234");
                      setShowOTP(true);
                      setRideAccepted(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Test OTP Display
                  </button>
                </div>
              )}

              {/* Show OTP on order details page - Visible until ride starts */}
              {showOTP && otp ? (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-3">
                  <p className="text-purple-900 font-bold text-lg text-center mb-2">
                    🔐 Delivery OTP
                  </p>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-purple-600 tracking-widest">
                      {otp}
                    </p>
                  </div>
                  <p className="text-purple-700 text-xs text-center mt-2">
                    Give this OTP to captain when they arrive to pick up the
                    order
                  </p>
                </div>
              ) : showOTP && !otp ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <p className="text-red-800 font-medium text-sm flex items-center gap-2">
                    <MdInfo size={18} />
                    OTP not loaded yet. Please refresh the page.
                  </p>
                </div>
              ) : null}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {!data.ride ? (
              // Show Notify to Rider button if no ride created yet
              <button
                onClick={handleNotifyRider}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <MdCheckCircle size={18} />
                Notify to Rider
              </button>
            ) : rideAccepted ? (
              // Show Confirm Order button after captain accepts
              <button
                onClick={handleConfirmOrder}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <MdCheckCircle size={18} /> Confirm Order
              </button>
            ) : (
              // Show disabled button while waiting
              <button
                disabled
                className="flex-1 bg-gray-300 text-gray-500 py-2.5 px-4 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MdInfo size={18} />
                Waiting for Captain...
              </button>
            )}

            <button
              onClick={handleCancelOrder}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <MdCancel size={18} />
              Cancel Order
            </button>
          </div>
        </div>
      ) : data &&
        (data.status === "Cancelled" || data.status === "Cancelled by Shop") ? (
        /* Show cancelled message - Status update hidden for cancelled orders */
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl">
          <p className="text-red-800 font-medium text-sm sm:text-base flex items-center gap-2">
            <MdCancel size={20} />
            This order has been cancelled
          </p>
        </div>
      ) : data &&
        data.status &&
        data.status !== "Pending" &&
        data.status !== "Processing" ? (
        /* Show status dropdown for confirmed orders only (not for pending, cancelled or processing) */
        <div className="mt-4 space-y-3 max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 font-medium text-sm mb-2 flex items-center gap-2">
              <MdUpdate size={18} />
              Update order status:
            </p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {[
                "Confirmed by Shop",
                "Transferred to delivery partner",
                "Shipping",
                "Received",
                "On the way",
                "Delivered",
              ].map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={orderUpdateHandler}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-6 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <MdUpdate size={18} />
            Update Status
          </button>
        </div>
      ) : null}
    </div>
  );
};

// Add CSS animation for OTP display
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
if (!document.head.querySelector("style[data-otp-styles]")) {
  styleSheet.setAttribute("data-otp-styles", "true");
  document.head.appendChild(styleSheet);
}

export default OrderDetails;
