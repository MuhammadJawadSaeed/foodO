import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { MdBlock, MdVerified } from "react-icons/md";

const AdvancedAllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sellerDetails, setSellerDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllSellers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to delete seller");
      });
  };

  const handleBlockSeller = async (id) => {
    try {
      await axios.put(
        `${server}/shop/block-seller/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Seller blocked successfully");
      dispatch(getAllSellers());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block seller");
    }
  };

  const handleUnblockSeller = async (id) => {
    try {
      await axios.put(
        `${server}/shop/unblock-seller/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Seller unblocked successfully");
      dispatch(getAllSellers());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock seller");
    }
  };

  const viewSellerDetails = (seller) => {
    setSellerDetails(seller);
    setShowDetails(true);
  };

  // Filter sellers
  const filteredSellers = sellers?.filter((seller) => {
    const matchesSearch =
      seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.shopInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !seller.blocked) ||
      (filterStatus === "blocked" && seller.blocked);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.avatar || "/default-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{params.row.name}</span>
        </div>
      ),
    },
    {
      field: "shopName",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 0.9,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "balance",
      headerName: "Balance",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          PKR {params.value?.toFixed(2)}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            params.value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 0.8,
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => viewSellerDetails(params.row.fullData)}
            variant="outlined"
            size="small"
            startIcon={<AiOutlineEye />}
          >
            View
          </Button>
          <Button
            onClick={() => {
              setOpen(true);
              setUserId(params.id);
            }}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<AiOutlineDelete />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const rows =
    filteredSellers?.map((item) => ({
      id: item._id,
      name: item.name,
      shopName: item.shopInfo?.name || item.name,
      email: item.email,
      phone: item.phoneNumber || "N/A",
      balance: item.availableBalance || 0,
      status: item.blocked ? "Blocked" : "Active",
      joinedAt: new Date(item.createdAt).toLocaleDateString(),
      avatar: item.avatar?.url,
      fullData: item,
    })) || [];

  // Calculate statistics
  const totalSellers = sellers?.length || 0;
  const activeSellers = sellers?.filter((s) => !s.blocked).length || 0;
  const blockedSellers = sellers?.filter((s) => s.blocked).length || 0;
  const totalBalance =
    sellers?.reduce((acc, s) => acc + (s.availableBalance || 0), 0) || 0;

  return (
    <div className="w-full p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Sellers</p>
          <p className="text-2xl font-bold text-gray-800">{totalSellers}</p>
          <p className="text-xs text-gray-500">Registered shops</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Active Sellers</p>
          <p className="text-2xl font-bold text-green-600">{activeSellers}</p>
          <p className="text-xs text-gray-500">Currently active</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Blocked Sellers</p>
          <p className="text-2xl font-bold text-red-600">{blockedSellers}</p>
          <p className="text-xs text-gray-500">Suspended accounts</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            PKR {totalBalance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Available funds</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Seller Management
            </h2>
            <p className="text-gray-600 text-sm">
              Total: {totalSellers} | Showing: {filteredSellers?.length || 0}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <AiOutlineSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, or shop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="w-full flex justify-end cursor-pointer mb-2">
              <RxCross1
                size={24}
                onClick={() => setOpen(false)}
                className="hover:text-red-500"
              />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center py-3 sm:py-5 font-Poppins text-gray-800">
              Are you sure you want to delete this seller?
            </h3>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
              <button
                className="w-full sm:w-36 bg-gray-700 hover:bg-gray-800 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-36 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => {
                  setOpen(false);
                  handleDelete(userId);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {showDetails && sellerDetails && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen overflow-y-auto p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Seller Details
              </h3>
              <RxCross1
                size={25}
                onClick={() => setShowDetails(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={
                      sellerDetails.avatar?.url ||
                      sellerDetails.avatar ||
                      "/default-avatar.png"
                    }
                    alt={sellerDetails.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-semibold">
                      {sellerDetails.name}
                    </h4>
                    <p className="text-gray-600">{sellerDetails.email}</p>
                    <span className="text-sm text-gray-500">
                      Member since{" "}
                      {new Date(sellerDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Shop Name</p>
                    <p className="text-lg font-semibold">
                      {sellerDetails.shopInfo?.name ||
                        sellerDetails.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-semibold">
                      {sellerDetails.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        sellerDetails.blocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {sellerDetails.blocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm break-all">{sellerDetails.email}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      PKR {(sellerDetails.availableBalance || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-lg font-semibold">
                      {sellerDetails.products?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Shop Address</p>
                    <p className="text-sm">
                      {sellerDetails.address || "Not provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Zip Code</p>
                    <p className="text-sm">{sellerDetails.zipCode || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">
                      {sellerDetails.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!sellerDetails.blocked ? (
                    <button
                      onClick={() => {
                        handleBlockSeller(sellerDetails._id);
                        setShowDetails(false);
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                    >
                      <MdBlock />
                      Block Seller
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleUnblockSeller(sellerDetails._id);
                        setShowDetails(false);
                      }}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                      <MdVerified />
                      Unblock Seller
                    </button>
                  )}
                  <button
                    onClick={() =>
                      window.open(
                        `/admin-restaurant-details/${sellerDetails._id}`,
                        "_blank"
                      )
                    }
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAllSellers;
