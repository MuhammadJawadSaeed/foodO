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
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        {/* Status badge at top right - uses orderStatus for real-time updates */}
        {(orderStatus || data?.status) &&
          getStatusBadge(orderStatus || data?.status)}
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
        data?.cart.map((item, index) => {
          return (
            <div className="w-full flex items-start mb-5">
              <img
                src={`${item.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  PKR{item.discountPrice} x {item.qty}
                </h5>
              </div>
              {!item.isReviewed && data?.status === "Delivered" ? (
                <div
                  className={`${styles.button} text-[#fff]`}
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Give Review
                </div>
              ) : null}
            </div>
          );
        })}

      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  PKR{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full pt-4">
        {/* Items Subtotal */}
        <div className="flex justify-between items-center px-2 mb-2">
          <h5 className="text-[16px] text-gray-600">Items Subtotal:</h5>
          <h5 className="text-[16px] font-semibold">
            PKR {data?.totalPrice || 0}
          </h5>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
          <h5 className="text-[18px] font-[600]">Total Price:</h5>
          <h5 className="text-[18px] font-bold text-green-600">
            PKR {data?.totalPrice}
          </h5>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1}
            {data?.shippingAddress.address2
              ? ` ${data?.shippingAddress.address2}`
              : ""}
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
          <br />
        </div>
      </div>
      <br />
      <div
        className={`${styles.button} bg-[#000] mt-3 w-[70%] ml-8 rounded-[2px] h-11`}
        onClick={handleMessageSubmit}
      >
        <span className="text-[#fff] flex items-center">
          Send Message <AiOutlineMessage className="ml-1" />
        </span>
      </div>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
