import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { getAllSellers } from "../redux/actions/sellers";
import { getAllUsers } from "../redux/actions/user";
import { getAllProducts } from "../redux/actions/product";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut, Radar, Pie } from "react-chartjs-2";
import { AiOutlineDownload, AiOutlineFilter } from "react-icons/ai";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState("30days");
  const [compareMode, setCompareMode] = useState(false);

  const { adminOrders } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);
  const { users } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
    dispatch(getAllUsers());
    dispatch(getAllProducts());
  }, [dispatch]);

  // Helper function to get date range
  const getDateRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return { startDate, endDate };
  };

  // Filter orders by date range
  const getFilteredOrders = (days) => {
    const { startDate } = getDateRange(days);
    return (
      adminOrders?.filter((order) => new Date(order.createdAt) >= startDate) ||
      []
    );
  };

  // Get monthly revenue data
  const getMonthlyData = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const monthOrders =
        adminOrders?.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear()
          );
        }) || [];

      months.push({
        month: monthName,
        revenue: monthOrders.reduce((acc, order) => acc + order.totalPrice, 0),
        orders: monthOrders.length,
        customers: new Set(monthOrders.map((o) => o.user?._id)).size,
      });
    }
    return months;
  };

  const monthlyData = getMonthlyData();

  // Revenue comparison chart
  const revenueComparisonData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (PKR)",
        data: monthlyData.map((d) => d.revenue),
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Orders Count",
        data: monthlyData.map((d) => d.orders * 1000),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  // Top selling categories
  const categoryData =
    adminOrders?.reduce((acc, order) => {
      order.cart?.forEach((item) => {
        const category = item.category || "Other";
        acc[category] = (acc[category] || 0) + item.qty;
      });
      return acc;
    }, {}) || {};

  const topCategoriesData = {
    labels: Object.keys(categoryData).slice(0, 8),
    datasets: [
      {
        label: "Items Sold",
        data: Object.values(categoryData).slice(0, 8),
        backgroundColor: [
          "rgba(249, 115, 22, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  // Seller performance radar
  const topSellers =
    sellers?.slice(0, 5).map((seller) => {
      const sellerOrders =
        adminOrders?.filter(
          (order) => order.cart?.[0]?.shopId === seller._id
        ) || [];
      return {
        name: seller.name,
        orders: sellerOrders.length,
        revenue: sellerOrders.reduce((acc, o) => acc + o.totalPrice, 0),
        products:
          products?.filter((p) => p.shop?._id === seller._id).length || 0,
      };
    }) || [];

  const sellerPerformanceData = {
    labels: [
      "Orders",
      "Revenue (÷1000)",
      "Products",
      "Rating (x10)",
      "Reviews",
    ],
    datasets: topSellers.map((seller, index) => ({
      label: seller.name,
      data: [
        seller.orders,
        seller.revenue / 1000,
        seller.products,
        (seller.rating || 4) * 10,
        seller.numOfReviews || 0,
      ],
      borderColor: `hsla(${index * 72}, 70%, 50%, 1)`,
      backgroundColor: `hsla(${index * 72}, 70%, 50%, 0.2)`,
    })),
  };

  // Customer growth trend
  const customerGrowthData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "New Customers",
        data: monthlyData.map((d) => d.customers),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
    ],
  };

  // Order status distribution
  const statusDistribution = {
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
        borderWidth: 2,
      },
    ],
  };

  // Calculate growth metrics
  const currentMonthRevenue = monthlyData[11]?.revenue || 0;
  const lastMonthRevenue = monthlyData[10]?.revenue || 0;
  const revenueGrowth = lastMonthRevenue
    ? (
        ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
        100
      ).toFixed(1)
    : 0;

  const currentMonthOrders = monthlyData[11]?.orders || 0;
  const lastMonthOrders = monthlyData[10]?.orders || 0;
  const ordersGrowth = lastMonthOrders
    ? (
        ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) *
        100
      ).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={8} />
        </div>

        <div className="flex-1 w-full lg:w-auto min-h-[90vh] p-3 sm:p-4 md:p-6 bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Advanced Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Deep insights into your platform performance
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <AiOutlineFilter />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                <AiOutlineDownload />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-sm text-gray-600 mb-2">Revenue Growth</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {revenueGrowth}%
                </span>
                {parseFloat(revenueGrowth) >= 0 ? (
                  <BiTrendingUp className="text-green-500" size={24} />
                ) : (
                  <BiTrendingDown className="text-red-500" size={24} />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">vs last month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-sm text-gray-600 mb-2">Orders Growth</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {ordersGrowth}%
                </span>
                {parseFloat(ordersGrowth) >= 0 ? (
                  <BiTrendingUp className="text-green-500" size={24} />
                ) : (
                  <BiTrendingDown className="text-red-500" size={24} />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">vs last month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-sm text-gray-600 mb-2">Avg Order Value</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  PKR{" "}
                  {adminOrders?.length
                    ? (
                        adminOrders.reduce((acc, o) => acc + o.totalPrice, 0) /
                        adminOrders.length
                      ).toFixed(0)
                    : 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">current period</p>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-sm text-gray-600 mb-2">Conversion Rate</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {users?.length
                    ? (
                        ((adminOrders?.length || 0) / users.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">orders/users ratio</p>
            </div>
          </div>

          {/* Revenue Comparison Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Revenue & Orders Trend (12 Months)
            </h3>
            <Line
              data={revenueComparisonData}
              options={{
                responsive: true,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  legend: { display: true, position: "top" },
                },
                scales: {
                  y: {
                    type: "linear",
                    display: true,
                    position: "left",
                    beginAtZero: true,
                  },
                  y1: {
                    type: "linear",
                    display: true,
                    position: "right",
                    beginAtZero: true,
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Top Selling Categories
              </h3>
              <Bar
                data={topCategoriesData}
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

            {/* Order Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Status Distribution
              </h3>
              <Pie
                data={statusDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: "right" },
                  },
                }}
              />
            </div>
          </div>

          {/* Customer Growth & Seller Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Growth */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Customer Growth
              </h3>
              <Bar
                data={customerGrowthData}
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

            {/* Seller Performance Radar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Top 5 Seller Performance
              </h3>
              <Radar
                data={sellerPerformanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { display: true, position: "bottom" },
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
