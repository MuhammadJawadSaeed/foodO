import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CapatainContext";
import { Link } from "react-router-dom";
import axios from "axios";

const CaptainDetails = ({ refreshKey = 0 }) => {
  const { captain } = useContext(CaptainDataContext);
  const [stats, setStats] = useState({
    earnings: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    rideFeeEarnings: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    orderFeeEarnings: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    hoursOnline: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
    rideStats: {
      totalRides: 0,
      completedRides: 0,
      cancelledRides: 0,
      todayRides: 0,
      thisWeekRides: 0,
      thisMonthRides: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaptainStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchCaptainStats, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]); // Re-fetch when refreshKey changes

  const fetchCaptainStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Ensure all required fields exist with default values
      const data = response.data;
      setStats({
        earnings: data.earnings || {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
        rideFeeEarnings: data.rideFeeEarnings || {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
        orderFeeEarnings: data.orderFeeEarnings || {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
        hoursOnline: data.hoursOnline || {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
        },
        rideStats: data.rideStats || {
          totalRides: 0,
          completedRides: 0,
          cancelledRides: 0,
          todayRides: 0,
          thisWeekRides: 0,
          thisMonthRides: 0,
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching captain stats:", error);
      setLoading(false);
    }
  };

  const formatHours = (minutes) => {
    if (!minutes) return "0.0";
    return (minutes / 60).toFixed(1);
  };

  // Calculate total earnings (Ride Fee + Order Fee)
  const totalEarningsWithOrder =
    (stats.rideFeeEarnings?.total || 0) + (stats.orderFeeEarnings?.total || 0);
  const weekTotalEarnings =
    (stats.rideFeeEarnings?.thisWeek || 0) +
    (stats.orderFeeEarnings?.thisWeek || 0);

  return (
    <div>
      {/* Professional Header with Profile */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg mb-4">
        <Link
          to="/captain-profile"
          className="flex items-center justify-between hover:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <img
              className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md"
              src={
                captain?.profileImage?.url ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23ff6b35'/%3E%3Cpath d='M30 45 Q50 35 70 45 L70 55 Q50 65 30 55 Z' fill='white'/%3E%3Ccircle cx='40' cy='42' r='3' fill='%23ff6b35'/%3E%3Ccircle cx='60' cy='42' r='3' fill='%23ff6b35'/%3E%3Cpath d='M35 60 Q50 70 65 60' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E"
              }
              alt="Captain Profile"
            />
            <div className="text-white">
              <h4 className="text-lg font-bold capitalize">
                {captain.fullname.firstname + " " + captain.fullname.lastname}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center bg-white/20 rounded-full px-2 py-0.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  <span className="text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <h4 className="text-2xl font-bold text-white">
                {loading ? "..." : `${totalEarningsWithOrder.toFixed(0)}`}
              </h4>
              <p className="text-xs text-white/80 font-medium">Total Account</p>
            </div>
          </div>
        </Link>
      </div>
      {/* Modern Stats Cards - Today */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="text-xl text-blue-600 ri-timer-2-line"></i>
            </div>
          </div>
          <h5 className="text-lg font-bold text-gray-800 text-center">
            {loading ? "..." : formatHours(stats.hoursOnline?.today || 0)}
          </h5>
          <p className="text-xs text-gray-500 text-center font-medium">
            Hours Today
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="text-xl text-purple-600 ri-taxi-line"></i>
            </div>
          </div>
          <h5 className="text-lg font-bold text-gray-800 text-center">
            {loading ? "..." : stats.rideStats?.todayRides || 0}
          </h5>
          <p className="text-xs text-gray-500 text-center font-medium">
            Rides Today
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i className="text-xl text-green-600 ri-money-dollar-circle-line"></i>
            </div>
          </div>
          <h5 className="text-lg font-bold text-gray-800 text-center">
            {loading ? "..." : `${(stats.earnings?.today || 0).toFixed(0)}`}
          </h5>
          <p className="text-xs text-gray-500 text-center font-medium">
            Earned Today
          </p>
        </div>
      </div>

      {/* Weekly Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="ri-calendar-week-line"></i>
            This Week Summary
          </h3>
          <span className="text-xs text-white/80">Last 7 days</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <i className="text-2xl mb-1 text-white ri-timer-2-line"></i>
            <h5 className="text-lg font-bold text-white">
              {loading ? "..." : formatHours(stats.hoursOnline?.thisWeek || 0)}
            </h5>
            <p className="text-xs text-white/80 font-medium">Hours</p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <i className="text-2xl mb-1 text-white ri-taxi-line"></i>
            <h5 className="text-lg font-bold text-white">
              {loading ? "..." : stats.rideStats?.thisWeekRides || 0}
            </h5>
            <p className="text-xs text-white/80 font-medium">Rides</p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center">
            <i className="text-2xl mb-1 text-white ri-money-dollar-circle-line"></i>
            <h5 className="text-lg font-bold text-white">
              {loading ? "..." : `${weekTotalEarnings.toFixed(0)}`}
            </h5>
            <p className="text-xs text-white/80 font-medium">Total</p>
          </div>
        </div>
      </div>

      {/* Professional Earnings Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <i className="ri-wallet-3-line text-green-600"></i>
            Weekly Earnings Breakdown
          </h3>
        </div>

        <div className="space-y-3">
          {/* Ride Fee */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="text-white text-sm ri-bike-line"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">
                    Delivery Fee
                  </p>
                  <p className="text-[10px] text-gray-500">Ride charges</p>
                </div>
              </div>
              <h5 className="text-xl font-bold text-blue-700">
                {loading
                  ? "..."
                  : `${(stats.rideFeeEarnings?.thisWeek || 0).toFixed(0)}`}
              </h5>
            </div>
          </div>

          {/* Order Fee */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="text-white text-sm ri-restaurant-line"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">
                    Order Amount
                  </p>
                  <p className="text-[10px] text-gray-500">Food payment</p>
                </div>
              </div>
              <h5 className="text-xl font-bold text-green-700">
                {loading
                  ? "..."
                  : `${(stats.orderFeeEarnings?.thisWeek || 0).toFixed(0)}`}
              </h5>
            </div>
          </div>

          {/* Total Weekly */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <i className="text-white text-sm ri-money-dollar-circle-line"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Total This Week
                  </p>
                  <p className="text-[10px] text-white/80">Combined earnings</p>
                </div>
              </div>
              <h5 className="text-2xl font-black text-white">
                {loading ? "..." : `${weekTotalEarnings.toFixed(0)}`}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
