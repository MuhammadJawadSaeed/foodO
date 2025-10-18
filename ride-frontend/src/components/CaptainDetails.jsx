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
      setStats(response.data);
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
            className="h-12 w-12 rounded-full object-cover border-2 border-gray-300"
            src={
              captain?.profileImage?.url ||
              "https://www.svgrepo.com/show/505031/uber-driver.svg"
            }
            alt="Captain Profile"
          />
          <h4 className="text-lg font-medium capitalize">
            {captain.fullname.firstname + " " + captain.fullname.lastname}
          </h4>
        </Link>
        <div>
          <h4 className="text-xl font-semibold">
            {loading ? "..." : `PKR ${stats.earnings.total.toFixed(2)}`}
          </h4>
          <p className="text-sm text-gray-600">Total Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : formatHours(stats.hoursOnline.today)}
          </h5>
          <p className="text-sm text-gray-600">Hours Today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-taxi-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : stats.rideStats.todayRides}
          </h5>
          <p className="text-sm text-gray-600">Rides Today</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-money-dollar-circle-line"></i>
          <h5 className="text-lg font-medium">
            {loading ? "..." : `PKR ${stats.earnings.today.toFixed(0)}`}
          </h5>
          <p className="text-sm text-gray-600">Earned Today</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
