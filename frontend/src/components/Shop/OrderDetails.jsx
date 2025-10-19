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
  MdLock,
  MdSecurity,
  MdWarning,
  MdPhone,
  MdPerson,
} from "react-icons/md";
import {
  FaBox,
  FaCalendarAlt,
  FaHashtag,
  FaShieldAlt,
  FaKey,
  FaMotorcycle,
  FaIdCard,
} from "react-icons/fa";
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
    }

    // Listen for order delivered event
    socket.on("order-delivered", (data) => {
      if (data.orderId === id) {
        toast.success("Order has been delivered successfully! ✅");
        setStatus("Delivered");
        // Refresh orders
        dispatch(getAllOrdersOfShop(seller._id));
      }
    });

    // Listen for ride accepted event
    socket.on("ride-accepted", (data) => {
      // Normalize ID comparison (stringify both sides)
      if (String(data.orderId) === String(id)) {
        // IMMEDIATELY set states
        setRideAccepted(true);

        // Get OTP from multiple possible sources
        const otpValue = data.ride?.otp || data.otp || data.ride?.OTP;

        if (otpValue) {
          setOtp(String(otpValue));
          setShowOTP(true);
          setRideDetails(data.ride);

          toast.success("🎉 Captain accepted! You can now confirm the order.");
        } else {
          toast.info("Captain accepted! Loading OTP...");
          setRideDetails(data.ride);
        }

        // Force refresh orders
        setTimeout(() => {
          dispatch(getAllOrdersOfShop(seller._id));
        }, 300);
        setTimeout(() => {
          dispatch(getAllOrdersOfShop(seller._id));
        }, 1000);
        setTimeout(() => {
          dispatch(getAllOrdersOfShop(seller._id));
        }, 2000);
      }
    });

    // Listen for ride start event to hide OTP
    socket.on("ride-started", (data) => {
      if (data.orderId === id) {
        toast.info("🚗 Captain has started the delivery!");
        setShowOTP(false);
        setStatus("On the way"); // Auto-update status to "On the way"

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

  // Set initial status when data loads and handle OTP display
  useEffect(() => {
    if (data && data.status) {
      setStatus(data.status);
    }

    // Debug captain data
    if (data?.ride) {
      console.log("🔍 Ride Data Debug:", {
        rideExists: !!data.ride,
        rideType: typeof data.ride,
        rideId: data.ride._id,
        captainExists: !!data.ride.captain,
        captainType: typeof data.ride.captain,
        captain: data.ride.captain,
      });

      if (data.ride.captain) {
        console.log("🔍 Captain Data Debug:", {
          fullname: data.ride.captain.fullname,
          phone: data.ride.captain.phoneNumber,
          vehicle: data.ride.captain.vehicle,
          allKeys: Object.keys(data.ride.captain),
          allCaptainData: data.ride.captain,
        });
      } else {
        console.warn("⚠️ Captain data is missing or not populated!");
      }
    }

    // Check if ride exists and is accepted - Load OTP from order data
    if (data && data.ride) {
      const rideStatus = data.rideStatus || data.ride.status;

      // Show OTP if ride is accepted; hide when ride becomes ongoing
      if (rideStatus === "accepted" || rideStatus === "ongoing") {
        setRideAccepted(true);

        // Show OTP until ride starts
        if (rideStatus === "accepted") {
          setShowOTP(true);
        } else if (rideStatus === "ongoing") {
          setShowOTP(false);
        }

        // Load OTP from order data (saved in database) OR from ride object
        let otpValue = null;

        if (data.rideOTP) {
          otpValue = data.rideOTP;
        } else if (data.ride && data.ride.otp) {
          otpValue = data.ride.otp;
        } else if (data.ride && typeof data.ride === "object") {
          // Check if ride has OTP in any case variation
          const rideKeys = Object.keys(data.ride);
          const otpKey = rideKeys.find((key) => key.toLowerCase() === "otp");
          if (otpKey) {
            otpValue = data.ride[otpKey];
          }
        }

        if (otpValue) {
          setOtp(String(otpValue)); // Convert to string
          setShowOTP(true);
        } else {
          // AGGRESSIVE FALLBACK: Try to fetch OTP directly from ride endpoint
          if (data.ride?._id) {
            setTimeout(async () => {
              try {
                const rideResponse = await axios.get(
                  `${server}/rides/${data.ride._id}`,
                  { withCredentials: true }
                );
                if (rideResponse.data?.ride?.otp) {
                  setOtp(String(rideResponse.data.ride.otp));
                  setShowOTP(true);
                  setRideAccepted(true);
                }
              } catch (err) {
                console.error("Error fetching ride:", err);
              }
            }, 500);
          }

          // Schedule multiple retries with increasing delays
          setTimeout(() => {
            dispatch(getAllOrdersOfShop(seller._id));
          }, 800);
          setTimeout(() => {
            const retryOtp = data.rideOTP || data.ride?.otp;
            if (retryOtp) {
              setOtp(String(retryOtp));
              setShowOTP(true);
              setRideAccepted(true);
            }
          }, 1500);
          setTimeout(() => {
            dispatch(getAllOrdersOfShop(seller._id));
          }, 2500);
        }
      }
    }
  }, [data, dispatch, seller]);

  const fetchRideOTP = async (rideId) => {
    try {
      // This would need a backend endpoint to fetch ride with OTP
      // For now, OTP will come from socket event or order data
    } catch (error) {
      console.error("Error fetching OTP:", error);
    }
  };

  const handleNotifyRider = async () => {
    try {
      const res = await axios.post(
        `${server}/order/notify-rider/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(" Riders notified! Waiting for captain to accept...");

        // Store ride details but don't show OTP yet
        if (res.data.ride) {
          setRideDetails(res.data.ride);
        }

        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to notify riders");
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const res = await axios.post(
        `${server}/order/confirm-order/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(" Order confirmed successfully!");

        // OTP already displayed on page
        dispatch(getAllOrdersOfShop(seller._id));

        // Navigate after short delay
        setTimeout(() => {
          navigate("/dashboard-orders");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm order");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const res = await axios.post(
        `${server}/order/cancel-order/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Order cancelled successfully");
        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
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

      {/* Captain Details Card - Shows when captain accepts */}
      {(rideAccepted ||
        data?.rideStatus === "accepted" ||
        data?.rideStatus === "ongoing") &&
        data?.ride?.captain && (
          <div className="mb-3 animate-fadeIn">
            {/* Compact Captain Info Card */}
            <div className="bg-white rounded-lg border border-blue-200 shadow-md overflow-hidden">
              {/* Header - Compact */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex items-center gap-2">
                <MdCheckCircle className="text-base text-white" />
                <h3 className="text-sm font-bold text-white">
                  Delivery Captain
                </h3>
              </div>

              <div className="p-3">
                {/* Compact Info Row */}
                <div className="flex items-center gap-3">
                  {/* Profile Image - Smaller */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        data.ride.captain.profileImage?.url ||
                        "https://ui-avatars.com/api/?name=Captain&background=3B82F6&color=fff&size=128"
                      }
                      alt="Captain"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-300 shadow"
                    />
                  </div>

                  {/* Info Grid - Compact */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Rider Name */}
                    <div className="bg-blue-50 px-2 py-1.5 rounded border border-blue-200">
                      <div className="flex items-center gap-1 mb-0.5">
                        <MdPerson className="text-blue-600 text-sm" />
                        <p className="text-[9px] font-semibold text-blue-700 uppercase">
                          Rider
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {(() => {
                          const captain = data.ride.captain;
                          if (!captain) return "Loading...";

                          // Try different name formats
                          if (captain.fullname?.firstname) {
                            return `${captain.fullname.firstname} ${
                              captain.fullname.lastname || ""
                            }`.trim();
                          }
                          if (captain.fullName) return captain.fullName;
                          if (captain.name) return captain.name;

                          // If captain object exists but no name, show Captain
                          return "Captain";
                        })()}
                      </p>
                    </div>

                    {/* Bike Plate - Simple */}
                    <div className="bg-yellow-50 px-2 py-1.5 rounded border border-yellow-300">
                      <div className="flex items-center gap-1 mb-0.5">
                        <FaMotorcycle className="text-orange-600 text-xs" />
                        <p className="text-[9px] font-semibold text-orange-700 uppercase">
                          Plate
                        </p>
                      </div>
                      <p className="text-sm font-black text-gray-900 tracking-wide">
                        {(() => {
                          const captain = data.ride.captain;
                          if (!captain) return "Loading...";
                          if (!captain.vehicle) return "N/A";

                          return (
                            captain.vehicle.plate ||
                            captain.vehicle.vehicleNumber ||
                            captain.vehicle.plateNumber ||
                            "N/A"
                          );
                        })()}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="bg-green-50 px-2 py-1.5 rounded border border-green-200">
                      <div className="flex items-center gap-1 mb-0.5">
                        <MdPhone className="text-green-600 text-sm" />
                        <p className="text-[9px] font-semibold text-green-700 uppercase">
                          Phone
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {(() => {
                          const captain = data.ride.captain;
                          if (!captain) return "Loading...";

                          return (
                            captain.phoneNumber ||
                            captain.phone ||
                            captain.mobile ||
                            "N/A"
                          );
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Call Button - Compact */}
                  <div className="flex-shrink-0 hidden sm:block">
                    <a
                      href={`tel:${data.ride.captain.phoneNumber}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-bold transition-all duration-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center"
                      title="Call Rider"
                    >
                      <MdPhone className="text-lg" />
                    </a>
                  </div>
                </div>

                {/* Mobile Call Button */}
                <div className="mt-2 sm:hidden">
                  <a
                    href={`tel:${data.ride.captain.phoneNumber}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <MdPhone className="text-base" />
                    <span>Call Rider</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Beautiful OTP Display - Shows when ride is accepted and OTP is available */}
      {(rideAccepted ||
        data?.rideStatus === "accepted" ||
        data?.rideStatus === "ongoing") && (
        <div className="mb-4 animate-fadeIn">
          {/* Professional OTP Card - Desktop Optimized, Mobile Responsive */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">
              {/* Left Side - OTP Display (Mobile: Full width, Desktop: 50%) */}
              <div className="flex-1 bg-white p-4 sm:p-5 border-b sm:border-b-0 sm:border-r border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <FaKey className="text-sm text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Delivery OTP
                    </h3>
                    <p className="text-xs text-gray-500">Verification Code</p>
                  </div>
                </div>

                {/* OTP Display */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center border border-purple-300">
                  {data?.rideOTP || data?.ride?.otp || otp ? (
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        YOUR CODE
                      </p>
                      <p className="text-4xl sm:text-5xl font-black text-purple-600 tracking-widest font-mono">
                        {data?.rideOTP || data?.ride?.otp || otp}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3">
                      <div className="animate-spin rounded-full h-7 w-7 border-2 border-purple-300 border-t-purple-600"></div>
                      <p className="text-sm text-gray-600 font-medium">
                        Loading...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Instructions (Mobile: Full width, Desktop: 50%) */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                    <MdCheckCircle className="text-sm" />
                    <span className="text-xs font-semibold">
                      Captain Accepted
                    </span>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">
                          1
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Wait for captain to arrive at pickup location
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">
                          2
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Verify captain identity and share this OTP
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">
                          3
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Captain enters OTP to start delivery
                      </p>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-start gap-2 bg-amber-50 rounded-md p-2.5 border border-amber-200">
                    <MdWarning className="text-amber-600 text-sm flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] sm:text-xs text-amber-800 leading-tight">
                      <span className="font-semibold">Security:</span> Do not
                      share OTP via phone/message
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Removed Captain Accepted Alert */}
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
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-md">
          <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MdInfo size={20} className="text-indigo-600" />
            Order Status
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span>Current Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  data?.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : data?.status === "Processing"
                    ? "bg-blue-100 text-blue-700"
                    : data?.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {data?.status || "Loading..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show Notify Rider / Confirm Order buttons based on ride status */}
      {data && data.status === "Pending" ? (
        <div className="mt-4 space-y-3 max-w-md">
          {/* Show info message based on state */}
          {!data.ride ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
              <p className="text-blue-800 font-medium text-xs flex items-center gap-2">
                <MdInfo size={16} />
                Click "Notify Rider" to create a ride request
              </p>
            </div>
          ) : !rideAccepted ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
              <p className="text-yellow-800 font-medium text-xs flex items-center gap-2">
                <MdInfo size={16} />
                Waiting for captain to accept...
              </p>
            </div>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                <p className="text-green-800 font-medium text-xs flex items-center gap-2">
                  <MdCheckCircle size={16} />
                  Captain accepted! You can now confirm.
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Show Confirm Order button ONLY if captain accepted */}
            {rideAccepted ||
            data?.rideStatus === "accepted" ||
            data?.rideStatus === "ongoing" ? (
              <button
                onClick={handleConfirmOrder}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-lg font-semibold text-xs hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <MdCheckCircle size={16} /> Confirm Order
              </button>
            ) : !data.ride || data.ride.status === "pending" ? (
              // Show Notify to Rider button if no ride OR ride is still pending
              <button
                onClick={handleNotifyRider}
                disabled={data.ride && data.ride.status === "pending"}
                className={`flex-1 ${
                  data.ride && data.ride.status === "pending"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                } py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5`}
              >
                <MdInfo size={16} />
                {data.ride && data.ride.status === "pending"
                  ? "Waiting..."
                  : "Notify Rider"}
              </button>
            ) : (
              // Show disabled waiting button
              <button
                disabled
                className="flex-1 bg-gray-300 text-gray-500 py-2 px-3 rounded-lg font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <MdInfo size={16} />
                Waiting...
              </button>
            )}

            <button
              onClick={handleCancelOrder}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-3 rounded-lg font-semibold text-xs hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <MdCancel size={16} />
              Cancel Order
            </button>
          </div>
        </div>
      ) : data &&
        (data.status === "Cancelled" || data.status === "Cancelled by Shop") ? (
        /* Show cancelled message - Status update hidden for cancelled orders */
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md">
          <p className="text-red-800 font-medium text-xs flex items-center gap-2">
            <MdCancel size={16} />
            This order has been cancelled
          </p>
        </div>
      ) : data &&
        data.status &&
        data.status !== "Pending" &&
        data.status !== "Processing" &&
        data.status !== "On the way" &&
        data.status !== "Delivered" ? (
        /* Show status dropdown for confirmed orders only (not for pending, cancelled, processing, on the way, or delivered) */
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
                "Confirmed",
                "Preparing",
                "Prepared",
                "Transferred to delivery partner",
                "On the way",
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
      ) : data && data.status === "On the way" ? (
        /* Show locked message when order is on the way */
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 max-w-md">
          <p className="text-green-800 font-medium text-xs flex items-center gap-2">
            <MdCheckCircle size={16} />
            Order is on the way - Status will update to "Delivered" when captain
            completes delivery
          </p>
        </div>
      ) : data && data.status === "Delivered" ? (
        /* Show delivered message */
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 max-w-md">
          <p className="text-green-800 font-medium text-xs flex items-center gap-2">
            <MdCheckCircle size={16} />
            Order has been delivered successfully!
          </p>
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
