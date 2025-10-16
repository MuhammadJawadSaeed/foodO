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

  const { id } = useParams();

  // Socket connection for real-time updates
  useEffect(() => {
    socket = io(ENDPOINT);

    if (seller && seller._id) {
      // Join as shop
      socket.emit("join", {
        userId: seller._id,
        userType: "shop",
      });
      console.log("Shop connected to socket:", seller._id);
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
      console.log("Order Data:", data);
      console.log("Order Status:", data.status);
    }
  }, [data]);

  // Set initial status when data loads
  useEffect(() => {
    if (data && data.status) {
      setStatus(data.status);
    }
  }, [data]);

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
        toast.success("Order confirmed! Ride created successfully.");

        // Show ride confirmation popup
        if (res.data.ride) {
          setRideDetails(res.data.ride);
          setShowRideConfirmPopup(true);
        }

        dispatch(getAllOrdersOfShop(seller._id));
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
              🚴 Ride Created Successfully!
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Once a captain accepts, click "Confirm Ride to Start" to
                  view the OTP
                </p>
              </div>
            </>
          )}

          <button
            onClick={handleConfirmRideToStart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              💡 The captain needs this OTP to start the delivery
            </p>
          </div>

          <button
            onClick={() => setShowOTPPopup(false)}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition"
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

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${item.images[0]?.url}`}
              alt=""
              className="w-[80x] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                PKR{item.discountPrice} x {item.qty}
              </h5>
            </div>
          </div>
        ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>PKR{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>

      {/* Debug: Show current status */}
      <p className="text-sm text-gray-500 mt-2">
        Current Status: <strong>{data?.status || "Loading..."}</strong>
      </p>

      {/* Show Confirm/Cancel buttons for Pending or Processing orders (backward compatibility) */}
      {data && (data.status === "Pending" || data.status === "Processing") ? (
        <div className="mt-4 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-medium">
              ⏳ This order is waiting for your confirmation
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleConfirmOrder}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition shadow-lg"
            >
              ✓ Confirm Order
            </button>

            <button
              onClick={handleCancelOrder}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-red-600 hover:to-red-700 transition shadow-lg"
            >
              ✗ Cancel Order
            </button>
          </div>
        </div>
      ) : data && data.status === "Cancelled" ? (
        /* Show cancelled message */
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium text-lg">
            ✗ This order has been cancelled
          </p>
        </div>
      ) : data &&
        data.status &&
        data.status !== "Pending" &&
        data.status !== "Cancelled" ? (
        /* Show status dropdown for confirmed orders */
        <>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
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

          <div
            className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
            onClick={orderUpdateHandler}
          >
            Update Status
          </div>
        </>
      ) : (
        /* Loading state */
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">Loading order status...</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
