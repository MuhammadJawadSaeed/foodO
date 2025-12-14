import React, { useState, useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import { useSelector, useDispatch } from "react-redux";
import {
  AiOutlineFileExcel,
  AiOutlineFilePdf,
  AiOutlineDownload,
} from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { getAllUsers } from "../redux/actions/user";
import { getAllSellers } from "../redux/actions/sellers";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { getAllProducts } from "../redux/actions/product";

const AdminReportsPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const { sellers } = useSelector((state) => state.seller);
  const { adminOrders } = useSelector((state) => state.order);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllSellers());
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllProducts());
  }, [dispatch]);

  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("pdf");

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: "💰" },
    { value: "users", label: "User Activity Report", icon: "👥" },
    { value: "sellers", label: "Seller Performance Report", icon: "🏪" },
    { value: "products", label: "Product Analytics Report", icon: "📦" },
    { value: "financial", label: "Financial Summary Report", icon: "💵" },
    { value: "inventory", label: "Inventory Report", icon: "📊" },
  ];

  const handleGenerateReport = () => {
    // Report generation logic
    toast.success(
      `Generating ${reportType} report in ${format.toUpperCase()} format...`
    );

    setTimeout(() => {
      toast.success("Report generated successfully!");
    }, 2000);
  };

  const handleScheduleReport = () => {
    toast.success("Report scheduled! You will receive it via email.");
  };

  const handleEmailReport = () => {
    toast.success("Report sent to your email!");
  };

  // Calculate statistics based on report type
  const getReportStats = () => {
    switch (reportType) {
      case "sales":
        const totalRevenue =
          adminOrders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
        const platformFee = totalRevenue * 0.1;
        return {
          totalOrders: adminOrders?.length || 0,
          totalRevenue: totalRevenue.toFixed(2),
          platformFee: platformFee.toFixed(2),
          avgOrderValue: (totalRevenue / (adminOrders?.length || 1)).toFixed(2),
        };
      case "users":
        const activeUsers = users?.filter((u) => !u.suspended).length || 0;
        return {
          totalUsers: users?.length || 0,
          activeUsers: activeUsers,
          suspendedUsers: (users?.length || 0) - activeUsers,
          avgOrdersPerUser: (
            (adminOrders?.length || 0) / (users?.length || 1)
          ).toFixed(2),
        };
      case "sellers":
        return {
          totalSellers: sellers?.length || 0,
          activeSellers:
            sellers?.filter((s) => s.availableBalance > 0).length || 0,
          totalProducts: products?.length || 0,
          avgProductsPerSeller: (
            (products?.length || 0) / (sellers?.length || 1)
          ).toFixed(2),
        };
      case "products":
        return {
          totalProducts: products?.length || 0,
          avgRating: (
            products?.reduce((acc, p) => acc + (p.ratings || 0), 0) /
            (products?.length || 1)
          ).toFixed(2),
          totalReviews:
            products?.reduce((acc, p) => acc + (p.reviews?.length || 0), 0) ||
            0,
          outOfStock: products?.filter((p) => p.stock === 0).length || 0,
        };
      default:
        return {};
    }
  };

  const stats = getReportStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={10} />
        </div>

        <div className="flex-1 w-full lg:w-auto flex justify-center">
          <div className="w-full max-w-7xl px-3 sm:px-4 md:px-8 my-4 sm:my-6 md:my-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              Reports Generator
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Configuration */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Configure Report</h2>

                {/* Report Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">
                    Select Report Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {reportTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setReportType(type.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          reportType === type.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-semibold text-sm">
                            {type.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">
                    Date Range
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {["today", "week", "month", "year"].map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          dateRange === range
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Export Format */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">
                    Export Format
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormat("pdf")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 ${
                        format === "pdf"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <AiOutlineFilePdf size={24} />
                      <span className="font-semibold">PDF</span>
                    </button>
                    <button
                      onClick={() => setFormat("excel")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 ${
                        format === "excel"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <AiOutlineFileExcel size={24} />
                      <span className="font-semibold">Excel</span>
                    </button>
                    <button
                      onClick={() => setFormat("csv")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 ${
                        format === "csv"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <AiOutlineFileExcel size={24} />
                      <span className="font-semibold">CSV</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateReport}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
                  >
                    <AiOutlineDownload size={20} />
                    Generate & Download
                  </button>
                  <button
                    onClick={handleEmailReport}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                  >
                    <MdOutlineEmail size={20} />
                    Email
                  </button>
                </div>
              </div>

              {/* Report Preview/Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Report Preview</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Report Type</p>
                    <p className="font-semibold capitalize">
                      {reportType.replace("-", " ")}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Period</p>
                    <p className="font-semibold capitalize">{dateRange}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Format</p>
                    <p className="font-semibold uppercase">{format}</p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-3">Quick Stats</h3>
                    <div className="space-y-2">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduled Reports */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Scheduled Reports</h2>
                <button
                  onClick={handleScheduleReport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <BiCalendar size={20} />
                  Schedule Report
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Weekly Sales Report",
                    frequency: "Every Monday",
                    format: "PDF",
                    email: "Yes",
                  },
                  {
                    name: "Monthly Financial Summary",
                    frequency: "1st of Month",
                    format: "Excel",
                    email: "Yes",
                  },
                  {
                    name: "Daily Order Report",
                    frequency: "Daily at 9 AM",
                    format: "CSV",
                    email: "Yes",
                  },
                ].map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">
                        {schedule.frequency} • {schedule.format}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Report Name</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Generated</th>
                      <th className="text-left py-3 px-4">Format</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Sales Report - December 2024",
                        type: "Sales",
                        date: "2024-12-01",
                        format: "PDF",
                      },
                      {
                        name: "User Activity - November 2024",
                        type: "Users",
                        date: "2024-11-30",
                        format: "Excel",
                      },
                      {
                        name: "Seller Performance - Q4 2024",
                        type: "Sellers",
                        date: "2024-12-15",
                        format: "PDF",
                      },
                    ].map((report, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{report.name}</td>
                        <td className="py-3 px-4">{report.type}</td>
                        <td className="py-3 px-4">{report.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 text-xs font-semibold bg-gray-100 rounded">
                            {report.format}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
                            <AiOutlineDownload />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
