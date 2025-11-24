import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";
import { getAllUsers } from "../../redux/actions/user";
import { getAllProducts } from "../../redux/actions/product";
import {
  AiOutlineMoneyCollect,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineRise,
  AiOutlineFall,
} from "react-icons/ai";
import { MdPendingActions, MdOutlineDeliveryDining } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { DataGrid } from "@material-ui/data-grid";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../Layout/Loader";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EnhancedAdminDashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState("week");
  const [loading, setLoading] = useState(true);

  const { adminOrders } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);
  const { users } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    Promise.all([
      dispatch(getAllOrdersOfAdmin()),
      dispatch(getAllSellers()),
      dispatch(getAllUsers()),
      dispatch(getAllProducts()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  // Calculate statistics
  const totalRevenue =
    adminOrders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
  const platformFee = (totalRevenue * 0.1).toFixed(2);
  const todayOrders =
    adminOrders?.filter(
      (order) =>
        new Date(order.createdAt).toDateString() === new Date().toDateString()
    ).length || 0;

  const pendingOrders =
    adminOrders?.filter(
      (order) =>
        order.status === "Processing" ||
        order.status === "Transferred to delivery partner"
    ).length || 0;

  const deliveredOrders =
    adminOrders?.filter((order) => order.status === "Delivered").length || 0;

  const activeUsers =
    users?.filter(
      (user) =>
        new Date(user.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0;

  const activeSellers =
    sellers?.filter((seller) => seller.availableBalance > 0).length || 0;

  // Get last 7 days orders for chart
  const getLast7DaysData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders =
        adminOrders?.filter(
          (order) =>
            new Date(order.createdAt).toDateString() === date.toDateString()
        ) || [];
      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((acc, order) => acc + order.totalPrice, 0),
      });
    }
    return last7Days;
  };

  const chartData = getLast7DaysData();

  // Revenue Chart Data
  const revenueChartData = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Revenue (PKR)",
        data: chartData.map((d) => d.revenue),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Orders Chart Data
  const ordersChartData = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Orders",
        data: chartData.map((d) => d.orders),
        backgroundColor: "rgba(249, 115, 22, 0.7)",
      },
    ],
  };

  // Status Distribution Chart
  const statusChartData = {
    labels: ["Delivered", "Processing", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          adminOrders?.filter((o) => o.status === "Delivered").length || 0,
          adminOrders?.filter((o) => o.status === "Processing").length || 0,
          adminOrders?.filter(
            (o) => o.status === "Transferred to delivery partner"
          ).length || 0,
          adminOrders?.filter((o) => o.status === "Cancelled").length || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  // Recent Orders Table
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    { field: "customer", headerName: "Customer", minWidth: 130, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        const status = params.getValue(params.id, "status");
        return status === "Delivered"
          ? "greenColor"
          : status === "Cancelled"
          ? "redColor"
          : "orangeColor";
      },
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 130,
      flex: 0.6,
    },
  ];

  const rows =
    adminOrders?.slice(0, 10).map((order) => ({
      id: order._id,
      customer: order.user?.name || "N/A",
      status: order.status,
      total: `PKR ${order.totalPrice}`,
      date: new Date(order.createdAt).toLocaleDateString(),
    })) || [];

  if (loading) return <Loader />;

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin control center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                PKR {totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <AiOutlineRise className="mr-1" />
                Platform Fee: PKR {platformFee}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AiOutlineMoneyCollect className="text-orange-600" size={28} />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {adminOrders?.length || 0}
              </h3>
              <p className="text-xs text-blue-600 mt-2">Today: {todayOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <AiOutlineShoppingCart className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {users?.length || 0}
              </h3>
              <p className="text-xs text-green-600 mt-2">
                Active: {activeUsers}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <AiOutlineUser className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sellers</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {sellers?.length || 0}
              </h3>
              <p className="text-xs text-purple-600 mt-2">
                Active: {activeSellers}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <AiOutlineShop className="text-purple-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <MdPendingActions className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <h4 className="text-xl font-bold text-gray-800">
                {pendingOrders}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <MdOutlineDeliveryDining className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Delivered Orders</p>
              <h4 className="text-xl font-bold text-gray-800">
                {deliveredOrders}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <BiPackage className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <h4 className="text-xl font-bold text-gray-800">
                {products?.length || 0}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Trend (Last 7 Days)
          </h3>
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: true, position: "top" },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status
          </h3>
          <Doughnut
            data={statusChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: true, position: "bottom" },
              },
            }}
          />
        </div>
      </div>

      {/* Orders Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Daily Orders (Last 7 Days)
        </h3>
        <Bar
          data={ordersChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
