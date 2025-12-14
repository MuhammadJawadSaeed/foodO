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
  FaEye,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commissionRate, setCommissionRate] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [balanceAction, setBalanceAction] = useState("add"); // 'add' or 'deduct'

  useEffect(() => {
    dispatch(getRestaurantDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (restaurantDetails?.shop) {
      setCommissionRate(restaurantDetails.shop.commissionRate || 0);
    }
  }, [restaurantDetails]);

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

  const handleDeleteShop = async () => {
    try {
      await axios.delete(`${server}/shop/delete-seller/${id}`, {
        withCredentials: true,
      });
      toast.success("Restaurant deleted successfully!");
      setShowDeleteModal(false);
      navigate("/admin-sellers");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete restaurant"
      );
    }
  };

  const handleUpdateCommission = async () => {
    try {
      const rate = parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error("Please enter a valid commission rate between 0 and 100");
        return;
      }
      await axios.put(
        `${server}/shop/update-commission/${id}`,
        { commissionRate: rate },
        { withCredentials: true }
      );
      toast.success("Commission rate updated successfully!");
      setShowCommissionModal(false);
      dispatch(getRestaurantDetails(id));
    } catch (error) {
      console.error("Commission update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update commission"
      );
    }
  };

  const handleUpdateBalance = async () => {
    try {
      await axios.put(
        `${server}/shop/update-balance/${id}`,
        { amount: balanceAmount, action: balanceAction },
        { withCredentials: true }
      );
      toast.success(
        `Balance ${
          balanceAction === "add" ? "added" : "deducted"
        } successfully!`
      );
      setShowBalanceModal(false);
      setBalanceAmount(0);
      dispatch(getRestaurantDetails(id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update balance");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${server}/product/delete-shop-product/${productId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted successfully!");
      dispatch(getRestaurantDetails(id));
    } catch (error) {
      console.error("Product deletion error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleToggleProductAvailability = async (productId, currentStock) => {
    try {
      const newStock = currentStock > 0 ? 0 : 100;
      await axios.put(
        `${server}/product/update-product-stock/${productId}`,
        { stock: newStock },
        { withCredentials: true }
      );
      toast.success(
        `Product ${newStock > 0 ? "enabled" : "disabled"} successfully!`
      );
      dispatch(getRestaurantDetails(id));
    } catch (error) {
      console.error("Product toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const productColumns = [
    {
      field: "name",
      headerName: "Product Name",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.images?.[0]?.url}
            alt={params.value}
            className="w-10 h-10 rounded object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
          <span className="truncate">{params.value}</span>
        </div>
      ),
    },
    { field: "category", headerName: "Category", width: 130 },
    {
      field: "originalPrice",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `Rs. ${params.value}`,
    },
    {
      field: "discountPrice",
      headerName: "Discounted",
      width: 110,
      renderCell: (params) => (params.value ? `Rs. ${params.value}` : "-"),
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 80,
      renderCell: (params) => (
        <span
          className={`font-medium ${
            params.value === 0
              ? "text-red-600"
              : params.value < 10
              ? "text-orange-600"
              : "text-green-600"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "sold_out",
      headerName: "Sold",
      width: 80,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => viewProductDetails(params.row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={() => navigate(`/product/${params.row._id}`)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="View Full Product"
          >
            <FaCheckCircle />
          </button>
          <button
            onClick={() =>
              handleToggleProductAvailability(params.row._id, params.row.stock)
            }
            className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title={params.row.stock > 0 ? "Disable" : "Enable"}
          >
            {params.row.stock > 0 ? <FaBan /> : <FaCheckCircle />}
          </button>
          <button
            onClick={() => handleDeleteProduct(params.row._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Product"
          >
            <FaTrash />
          </button>
        </div>
      ),
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleBlockShop}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all active:scale-95 text-xs sm:text-sm ${
                        stats?.isBlocked
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {stats?.isBlocked ? (
                        <>
                          <FaCheckCircle /> <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <FaBan /> <span>Block</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCommissionModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all active:scale-95 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <FaMoneyBillWave /> <span>Commission</span>
                    </button>
                    <button
                      onClick={() => setShowBalanceModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all active:scale-95 text-xs sm:text-sm bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <FaMoneyBillWave /> <span>Manage Balance</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all active:scale-95 text-xs sm:text-sm bg-gray-700 hover:bg-gray-800 text-white"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact & Additional Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                    Restaurant Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        ZIP Code
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.zipCode || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Commission Rate
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.commissionRate || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Withdraw Method
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.withdrawMethod || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Description
                      </p>
                      <p className="text-sm sm:text-base text-gray-700">
                        {restaurantDetails.shop?.description ||
                          "No description"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                    Owner & Bank Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Owner Name
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.ownerName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Bank Name
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.bankName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Account Number
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.accountNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Account Holder
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.accountHolderName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        CNIC/Tax ID
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        {restaurantDetails.shop?.cnic || "N/A"}
                      </p>
                    </div>
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

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Delete Restaurant
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to permanently delete this restaurant?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteShop}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Commission Modal */}
          {showCommissionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Update Commission Rate
                </h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) =>
                      setCommissionRate(parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCommissionModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCommission}
                    className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Balance Management Modal */}
          {showBalanceModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Manage Balance
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action
                  </label>
                  <select
                    value={balanceAction}
                    onChange={(e) => setBalanceAction(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="add">Add Balance</option>
                    <option value="deduct">Deduct Balance</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={balanceAmount}
                    onChange={(e) =>
                      setBalanceAmount(parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowBalanceModal(false);
                      setBalanceAmount(0);
                    }}
                    className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateBalance}
                    className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Details Modal */}
          {showProductModal && selectedProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl p-6 max-w-3xl w-full my-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Product Details
                  </h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Product Images */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedProduct.images?.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>

                  {/* Product Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Original Price</p>
                      <p className="text-base font-medium text-gray-800">
                        Rs. {selectedProduct.originalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Discounted Price</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.discountPrice
                          ? `Rs. ${selectedProduct.discountPrice}`
                          : "No discount"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.stock}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sold Out</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.sold_out || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tags</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.tags || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedProduct.ratings?.toFixed(1) || "N/A"} (
                        {selectedProduct.reviews?.length || 0} reviews)
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-base text-gray-700">
                      {selectedProduct.description ||
                        "No description available"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowProductModal(false);
                        navigate(`/product/${selectedProduct._id}`);
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                    >
                      View Full Product
                    </button>
                    <button
                      onClick={() => {
                        handleToggleProductAvailability(
                          selectedProduct._id,
                          selectedProduct.stock
                        );
                        setShowProductModal(false);
                      }}
                      className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all"
                    >
                      {selectedProduct.stock > 0 ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteProduct(selectedProduct._id);
                        setShowProductModal(false);
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
