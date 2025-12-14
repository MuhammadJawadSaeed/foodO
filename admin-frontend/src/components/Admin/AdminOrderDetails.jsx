import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AdminHeader from "../Layout/AdminHeader";
import AdminSideBar from "../Layout/AdminSideBar";
import {
  AiOutlineArrowLeft,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineEnvironment,
  AiOutlineDollar,
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineCreditCard,
} from "react-icons/ai";
import { BsShop, BsTruck } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${server}/order/admin-all-orders`, {
        withCredentials: true,
      });
      const foundOrder = res.data.orders.find((o) => o._id === id);
      if (foundOrder) {
        setOrder(foundOrder);
        setSelectedStatus(foundOrder.status);
      } else {
        toast.error("Order not found");
        navigate("/admin-orders");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    if (selectedStatus === order.status) {
      toast.info("Status is already set to this value");
      return;
    }

    try {
      setUpdating(true);
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status: selectedStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully!");
      fetchOrderDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Transferred to delivery partner":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Shipping":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "On the way":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={4} />
            </div>
            <div className="w-full flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={4} />
            </div>
            <div className="w-full flex justify-center items-center h-screen">
              <p className="text-gray-600">Order not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
          </div>

          <div className="w-full min-h-screen bg-gray-50 p-4 800px:p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin-orders")}
              className="flex items-center gap-2 mb-6 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <AiOutlineArrowLeft size={20} />
              <span className="font-semibold">Back to Orders</span>
            </button>

            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col 800px:flex-row justify-between items-start 800px:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Order Details
                  </h1>
                  <p className="text-gray-600">Order ID: {order._id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold text-sm border-2 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 800px:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <AiOutlineUser className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Customer Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AiOutlineUser className="text-gray-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-800">
                        {order.user?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlineMail className="text-gray-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">
                        {order.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlinePhone className="text-gray-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {order.user?.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BsShop className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Shop Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BsShop className="text-gray-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Shop Name</p>
                      <p className="font-semibold text-gray-800">
                        {order.shop?.name ||
                          order.cart?.[0]?.shop?.name ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                  {order.shop?.email && (
                    <div className="flex items-start gap-3">
                      <AiOutlineMail className="text-gray-500 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Shop Email</p>
                        <p className="font-semibold text-gray-800">
                          {order.shop.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.shop?.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <AiOutlinePhone
                        className="text-gray-500 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-600">Shop Phone</p>
                        <p className="font-semibold text-gray-800">
                          {order.shop.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.shop?._id && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin-restaurant-details/${order.shop._id}`
                          )
                        }
                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                      >
                        View Shop Details →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MdLocationOn className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Delivery Address
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AiOutlineEnvironment
                      className="text-gray-500 mt-1"
                      size={20}
                    />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold text-gray-800">
                        {order.shippingAddress?.address1 || "N/A"}
                      </p>
                      {order.shippingAddress?.address2 && (
                        <p className="text-gray-600 text-sm mt-1">
                          {order.shippingAddress.address2}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-semibold text-gray-800">
                        {order.shippingAddress?.city || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Zip Code</p>
                      <p className="font-semibold text-gray-800">
                        {order.shippingAddress?.zipCode || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-semibold text-gray-800">
                      {order.shippingAddress?.country || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <AiOutlineCreditCard
                      className="text-purple-600"
                      size={24}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Payment Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-800">
                      {order.paymentInfo?.type || "Cash on Delivery"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        order.paymentInfo?.status === "succeeded"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentInfo?.status === "succeeded"
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        PKR {order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                    {order.shippingPrice > 0 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-gray-800">
                          PKR {order.shippingPrice?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold text-green-600">
                          - PKR {order.discount?.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                      <span className="text-lg font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        PKR {order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <AiOutlineShoppingCart
                    className="text-indigo-600"
                    size={24}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
              </div>
              <div className="space-y-4">
                {order.cart?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={item.images?.[0]?.url || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Shop: {item.shop?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.qty} × PKR{" "}
                        {item.discountPrice || item.originalPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        PKR{" "}
                        {(
                          (item.discountPrice || item.originalPrice) * item.qty
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AiOutlineCalendar className="text-yellow-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Timeline
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order Placed</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "medium",
                    })}
                  </p>
                </div>
                {order.deliveredAt && (
                  <div>
                    <p className="text-sm text-gray-600">Delivered At</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.deliveredAt).toLocaleString("en-US", {
                        dateStyle: "full",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Update Status Section */}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Update Order Status
                </h2>
                <div className="flex flex-col 800px:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select New Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Transferred to delivery partner">
                        Transfer to Delivery
                      </option>
                      <option value="Shipping">Shipping</option>
                      <option value="On the way">On the way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updating || selectedStatus === order.status}
                      className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                        updating || selectedStatus === order.status
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
