import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaArrowLeft,
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaStar,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaClock,
} from "react-icons/fa";
import { getRestaurantDetails } from "../../redux/actions/city";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import AdminHeader from "../Layout/AdminHeader";
import AdminSideBar from "../Layout/AdminSideBar";

const RestaurantDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantDetails, isLoading } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getRestaurantDetails(id));
  }, [dispatch, id]);

  const handleBlockShop = async () => {
    try {
      const endpoint = restaurantDetails?.shop?.blocked
        ? "unblock-seller"
        : "block-seller";
      await axios.put(
        `${server}/shop/${endpoint}/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(
        `Restaurant ${
          restaurantDetails?.shop?.blocked ? "unblocked" : "blocked"
        } successfully!`
      );
      dispatch(getRestaurantDetails(id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant"
      );
    }
  };

  const productColumns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.images?.[0]?.url}
            alt={params.value}
            className="w-10 h-10 rounded object-cover"
          />
          <span>{params.value}</span>
        </div>
      ),
    },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "originalPrice",
      headerName: "Price",
      width: 120,
      renderCell: (params) => `Rs. ${params.value}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 100,
    },
    {
      field: "sold_out",
      headerName: "Sold",
      width: 100,
    },
  ];

  const orderColumns = [
    { field: "_id", headerName: "Order ID", width: 100 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            params.value === "Delivered"
              ? "bg-green-100 text-green-600"
              : params.value === "Processing"
              ? "bg-blue-100 text-blue-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => `Rs. ${params.value}`,
    },
  ];

  const stats = restaurantDetails?.statistics;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={10} />
        </div>
        <div className="flex-1 w-full lg:w-auto p-3 sm:p-4 md:p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 sm:mb-6 font-medium text-sm sm:text-base px-3 py-2 rounded-lg hover:bg-orange-50 active:scale-95 transition-all"
          >
            <FaArrowLeft /> Back
          </button>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : restaurantDetails ? (
            <>
              {/* Restaurant Header */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={restaurantDetails.shop?.avatar?.url}
                      alt={restaurantDetails.shop?.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-orange-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                        {restaurantDetails.shop?.name}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        {restaurantDetails.shop?.email}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {restaurantDetails.shop?.address},{" "}
                        {restaurantDetails.shop?.city}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${
                            stats?.isBlocked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {stats?.isBlocked ? "Blocked" : "Active"}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          <FaClock className="inline mr-1" />
                          Joined:{" "}
                          {new Date(stats?.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBlockShop}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium transition-all active:scale-95 text-sm sm:text-base ${
                        stats?.isBlocked
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {stats?.isBlocked ? (
                        <>
                          <FaCheckCircle /> <span>Unblock Restaurant</span>
                        </>
                      ) : (
                        <>
                          <FaBan /> <span>Block Restaurant</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaBox className="text-xl sm:text-2xl text-blue-500" />
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      PRODUCTS
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stats?.totalProducts || 0}
                  </h3>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaShoppingCart className="text-xl sm:text-2xl text-orange-500" />
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      ORDERS
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stats?.totalOrders || 0}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {stats?.pendingOrders || 0} pending
                  </p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaMoneyBillWave className="text-xl sm:text-2xl text-green-500" />
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      REVENUE
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    Rs. {stats?.totalRevenue?.toLocaleString() || 0}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Balance: Rs.{" "}
                    {stats?.availableBalance?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaStar className="text-xl sm:text-2xl text-yellow-500" />
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      RATING
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stats?.averageRating || "N/A"}
                  </h3>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaBox className="text-orange-500" />
                  Products ({restaurantDetails.products?.length || 0})
                </h2>
                <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                  <div className="min-w-[600px]">
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={restaurantDetails.products || []}
                        columns={productColumns}
                        pageSize={10}
                        getRowId={(row) => row._id}
                        disableSelectionOnClick
                        className="product-table"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 overflow-hidden">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaShoppingCart className="text-orange-500" />
                  Recent Orders ({restaurantDetails.orders?.length || 0})
                </h2>
                <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                  <div className="min-w-[600px]">
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={restaurantDetails.orders || []}
                        columns={orderColumns}
                        pageSize={10}
                        getRowId={(row) => row._id}
                        disableSelectionOnClick
                        className="order-table"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">Restaurant not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
