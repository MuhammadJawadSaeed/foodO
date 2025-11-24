import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { DataGrid } from "@material-ui/data-grid";
import {
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineDownload,
} from "react-icons/ai";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AdvancedAllOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const handleExportCSV = () => {
    const csvData = filteredOrders.map((order) => ({
      OrderID: order._id,
      Customer: order.user?.name || "N/A",
      Items: order.cart?.length || 0,
      Total: order.totalPrice,
      Status: order.status,
      Payment: order.paymentInfo?.type || "N/A",
      Date: new Date(order.createdAt).toLocaleDateString(),
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map((row) => Object.values(row).join(",")).join("\n");
    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Orders exported successfully!");
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${server}/order/update-order-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Order status updated to ${newStatus}`);
      dispatch(getAllOrdersOfAdmin());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Filter orders
  const filteredOrders = adminOrders?.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || order.paymentInfo?.type === filterPayment;

    let matchesDate = true;
    if (startDate && endDate) {
      const orderDate = new Date(order.createdAt);
      matchesDate =
        orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const statusColors = {
          Processing: "bg-blue-100 text-blue-800",
          "Transferred to delivery partner": "bg-yellow-100 text-yellow-800",
          Shipping: "bg-purple-100 text-purple-800",
          Received: "bg-orange-100 text-orange-800",
          "On the way": "bg-indigo-100 text-indigo-800",
          Delivered: "bg-green-100 text-green-800",
          Cancelled: "bg-red-100 text-red-800",
          "Processing Refund": "bg-pink-100 text-pink-800",
          "Refund Success": "bg-teal-100 text-teal-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              statusColors[params.value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">{params.value}</span>
      ),
    },
    {
      field: "paymentType",
      headerName: "Payment",
      minWidth: 120,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            params.value === "COD"
              ? "bg-orange-100 text-orange-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0.8,
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Link to={`/order/${params.id}`}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AiOutlineEye />}
            >
              View
            </Button>
          </Link>
          {params.row.status !== "Delivered" &&
            params.row.status !== "Cancelled" && (
              <select
                onChange={(e) => handleUpdateStatus(params.id, e.target.value)}
                className="px-2 py-1 border rounded text-xs"
                defaultValue=""
              >
                <option value="" disabled>
                  Update Status
                </option>
                <option value="Processing">Processing</option>
                <option value="Transferred to delivery partner">
                  Transfer to Delivery
                </option>
                <option value="Shipping">Shipping</option>
                <option value="On the way">On the way</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
        </div>
      ),
    },
  ];

  const rows =
    filteredOrders?.map((item) => ({
      id: item._id,
      customer: item.user?.name || "Guest",
      itemsQty: item.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: "PKR " + item.totalPrice?.toFixed(2),
      status: item.status,
      paymentType: item.paymentInfo?.type || "COD",
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];

  // Calculate statistics
  const totalOrders = adminOrders?.length || 0;
  const totalRevenue =
    adminOrders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
  const pendingOrders =
    adminOrders?.filter((o) => o.status === "Processing").length || 0;
  const deliveredOrders =
    adminOrders?.filter((o) => o.status === "Delivered").length || 0;

  return (
    <div className="w-full p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          <p className="text-xs text-gray-500">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            PKR {totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Gross earnings</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
          <p className="text-xs text-gray-500">Awaiting processing</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Delivered Orders</p>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
          <p className="text-xs text-gray-500">Successfully completed</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
            <p className="text-gray-600 text-sm">
              Total: {totalOrders} | Showing: {filteredOrders?.length || 0}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <AiOutlineDownload size={20} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <AiOutlineSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Order ID or Customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Transferred to delivery partner">Transferred</option>
            <option value="Shipping">Shipping</option>
            <option value="On the way">On the way</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Payment Types</option>
            <option value="COD">Cash on Delivery</option>
            <option value="Card">Card Payment</option>
            <option value="PayPal">PayPal</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          loading={adminOrderLoading}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default AdvancedAllOrders;
