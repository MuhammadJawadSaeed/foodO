import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CapatainContext";
import { Link } from "react-router-dom";
import axios from "axios";

const CaptainDetails = () => {
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
  }, []);

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          to="/captain-profile"
          className="flex items-center justify-start gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-orange-300 bg-gradient-to-br from-orange-400 to-red-500"
            src={
              captain?.profileImage?.url ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%23ff6b35'/%3E%3Ctext x='50' y='65' font-size='50' text-anchor='middle' fill='white' font-family='Arial, sans-serif'%3E🍔%3C/text%3E%3C/svg%3E"
            }
            alt="Captain Profile"
          />
          <h4 className="text-lg font-medium capitalize">
            {captain.fullname.firstname + " " + captain.fullname.lastname}
          </h4>
        </Link>
        <div>
          <h4 className="text-xl font-semibold">
            {loading ? "..." : `PKR ${(stats.earnings?.total || 0).toFixed(2)}`}
          </h4>
          <p className="text-sm text-gray-600">Total Earned</p>
        </div>
      </div>
      {/* Daily Stats */}
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : formatHours(stats.hoursOnline?.today || 0)}
          </h5>
          <p className="text-sm text-gray-600">Hours Today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-taxi-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : stats.rideStats?.todayRides || 0}
          </h5>
          <p className="text-sm text-gray-600">Rides Today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-money-dollar-circle-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : `PKR ${(stats.earnings?.today || 0).toFixed(0)}`}
          </h5>
          <p className="text-sm text-gray-600">Earned Today</p>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">This Week</h3>
        <div className="flex justify-between gap-4">
          <div className="flex-1 text-center bg-white rounded-lg p-2">
            <i className="text-2xl mb-1 text-blue-600 ri-timer-2-line"></i>
            <h5 className="text-base font-semibold">
              {loading ? "..." : formatHours(stats.hoursOnline?.thisWeek || 0)}
            </h5>
            <p className="text-xs text-gray-600">Hours</p>
          </div>
          <div className="flex-1 text-center bg-white rounded-lg p-2">
            <i className="text-2xl mb-1 text-blue-600 ri-taxi-line"></i>
            <h5 className="text-base font-semibold">
              {loading ? "..." : stats.rideStats?.thisWeekRides || 0}
            </h5>
            <p className="text-xs text-gray-600">Rides</p>
          </div>
          <div className="flex-1 text-center bg-white rounded-lg p-2">
            <i className="text-2xl mb-1 text-green-600 ri-money-dollar-circle-line"></i>
            <h5 className="text-base font-semibold">
              {loading
                ? "..."
                : `${(stats.earnings?.thisWeek || 0).toFixed(0)}`}
            </h5>
            <p className="text-xs text-gray-600">Earned</p>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Earnings Breakdown (This Week)
        </h3>
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Ride Fee</span>
              <i className="text-blue-600 ri-bike-line"></i>
            </div>
            <h5 className="text-lg font-bold text-blue-700">
              {loading
                ? "..."
                : `PKR ${(stats.rideFeeEarnings?.thisWeek || 0).toFixed(0)}`}
            </h5>
            <p className="text-xs text-gray-500">Delivery charges</p>
          </div>
          <div className="flex-1 bg-white rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Order Fee</span>
              <i className="text-green-600 ri-restaurant-line"></i>
            </div>
            <h5 className="text-lg font-bold text-green-700">
              {loading
                ? "..."
                : `PKR ${(stats.orderFeeEarnings?.thisWeek || 0).toFixed(0)}`}
            </h5>
            <p className="text-xs text-gray-500">Food payment</p>
          </div>
        </div>
        <div className="mt-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600">Total This Week</p>
          <h5 className="text-xl font-bold text-orange-700">
            {loading
              ? "..."
              : `PKR ${(stats.earnings?.thisWeek || 0).toFixed(0)}`}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
