import React, { useEffect, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let socket;

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [orderStatus, setOrderStatus] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const [hasShownDeliveryMessage, setHasShownDeliveryMessage] = useState(false);

  const data = orders && orders.find((item) => item._id === id);

  // Socket connection for real-time updates
  useEffect(() => {
    socket = io(ENDPOINT);

    if (user && user._id) {
      // Join as user
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
      console.log("User connected to socket:", user._id);
    }

    // Listen for order delivered event
    const handleOrderDelivered = (data) => {
      console.log("Order delivered event received:", data);
      if (data.orderId === id && !hasShownDeliveryMessage) {
        toast.success("🎉 Your order has been delivered successfully!");
        setHasShownDeliveryMessage(true);
        setOrderStatus("Delivered");
        // Refresh orders
        dispatch(getAllOrdersOfUser(user._id));
      }
    };

    socket.on("order-delivered", handleOrderDelivered);

    return () => {
      socket.off("order-delivered", handleOrderDelivered);
      socket.disconnect();
    };
  }, [user, id, dispatch, hasShownDeliveryMessage]);

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  // Set initial status
  useEffect(() => {
    if (data && data.status) {
      setOrderStatus(data.status);
    }
  }, [data]);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  // Status badge UI
  const getStatusBadge = (status) => {
    let color = "bg-gray-400";
    let text = status;
    if (status === "Pending") color = "bg-yellow-500";
    if (status === "Confirmed by Shop") color = "bg-blue-500";
    if (status === "Cancelled") color = "bg-red-600";
    if (status === "Processing") color = "bg-blue-400"; // Backward compatibility
    if (status === "Delivered") color = "bg-green-600";
    if (status === "Processing refund") color = "bg-orange-400";
    if (status === "Refund Success") color = "bg-green-400";
    if (status === "Transferred to delivery partner") color = "bg-purple-500";
    if (status === "Shipping" || status === "On the way") color = "bg-cyan-500";
    if (status === "Received") color = "bg-green-400";
    return (
      <span
        className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${color}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BsFillBagFill size={28} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h1>
                <p className="text-sm text-gray-500">
                  Order ID: #{data?._id?.slice(0, 8)}
                </p>
              </div>
            </div>
            {/* Status badge */}
            {(orderStatus || data?.status) &&
              getStatusBadge(orderStatus || data?.status)}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm">
              <span className="text-gray-500">Placed on:</span>
              <span className="ml-2 font-medium text-gray-900">
                {data?.createdAt?.slice(0, 10)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {data &&
              data?.cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={`${item.images[0]?.url}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-orange-200"
                  />
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-gray-900">
                      {item.name}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      PKR {item.discountPrice} × {item.qty}
                    </p>
                    <p className="text-base font-bold text-orange-600 mt-1">
                      PKR {item.discountPrice * item.qty}
                    </p>
                  </div>
                  {!item.isReviewed && data?.status === "Delivered" && (
                    <button
                      onClick={() => {
                        setOpen(true);
                        setSelectedItem(item);
                      }}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Give Review
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* review popup */}
        {open && (
          <div className="fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Give a Review</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RxCross1 size={24} className="text-white" />
                </button>
              </div>

              <div className="p-6">
                {/* Product Info */}
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg mb-6">
                  <img
                    src={`${selectedItem?.images[0]?.url}`}
                    alt={selectedItem?.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-orange-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedItem?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      PKR {selectedItem?.discountPrice} × {selectedItem?.qty}
                    </p>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="mb-6">
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Give a Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) =>
                      rating >= i ? (
                        <AiFillStar
                          key={i}
                          className="cursor-pointer transform hover:scale-110 transition-transform"
                          color="rgb(246,186,0)"
                          size={32}
                          onClick={() => setRating(i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          className="cursor-pointer transform hover:scale-110 transition-transform"
                          color="rgb(246,186,0)"
                          size={32}
                          onClick={() => setRating(i)}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Comment Section */}
                <div className="mb-6">
                  <label className="block text-base font-semibold text-gray-900 mb-2">
                    Write a comment
                    <span className="ml-2 font-normal text-sm text-gray-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    name="comment"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was your product? Share your experience..."
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={rating > 1 ? reviewHandler : null}
                  disabled={!rating || rating < 1}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Price Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-gray-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold">PKR {data?.totalPrice || 0}</span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Price:
                </span>
                <span className="text-xl font-bold text-orange-600">
                  PKR {data?.totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Shipping Address
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{data?.shippingAddress.address1}</p>
                {data?.shippingAddress.address2 && (
                  <p>{data?.shippingAddress.address2}</p>
                )}
                <p>
                  {data?.shippingAddress.city}, {data?.shippingAddress.country}
                </p>
                <p className="flex items-center gap-2 text-orange-600 font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {data?.user?.phoneNumber}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      data?.paymentInfo?.status === "succeeded" ||
                      data?.paymentInfo?.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data?.paymentInfo?.status || "Not Paid"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Shop Button */}
        <button
          onClick={handleMessageSubmit}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <AiOutlineMessage size={20} />
          Send Message to Shop
        </button>
      </div>
    </div>
  );
};

export default UserOrderDetails;
