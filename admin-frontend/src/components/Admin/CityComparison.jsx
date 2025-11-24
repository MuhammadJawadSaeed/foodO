import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCity,
  FaUsers,
  FaStore,
  FaMotorcycle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { getCityComparison } from "../../redux/actions/city";
import { Bar } from "react-chartjs-2";

const CityComparison = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cityComparison, isLoading } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getCityComparison());
  }, [dispatch]);

  const chartData = {
    labels: cityComparison?.map((city) => city.city) || [],
    datasets: [
      {
        label: "Users",
        data: cityComparison?.map((city) => city.users) || [],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
      {
        label: "Restaurants",
        data: cityComparison?.map((city) => city.shops) || [],
        backgroundColor: "rgba(249, 115, 22, 0.6)",
      },
      {
        label: "Riders",
        data: cityComparison?.map((city) => city.captains) || [],
        backgroundColor: "rgba(168, 85, 247, 0.6)",
      },
    ],
  };

  const revenueData = {
    labels: cityComparison?.map((city) => city.city) || [],
    datasets: [
      {
        label: "Revenue (Rs.)",
        data: cityComparison?.map((city) => city.revenue) || [],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
    ],
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate("/admin-cities")}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
      >
        <FaArrowLeft /> Back to Cities
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaCity className="text-orange-500" />
        City Comparison Report
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Users, Restaurants & Riders by City
              </h2>
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Revenue by City</h2>
              <Bar data={revenueData} options={{ responsive: true }} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">City</th>
                    <th className="px-6 py-4 text-center">
                      <FaUsers className="inline mr-2" />
                      Users
                    </th>
                    <th className="px-6 py-4 text-center">
                      <FaStore className="inline mr-2" />
                      Restaurants
                    </th>
                    <th className="px-6 py-4 text-center">
                      <FaMotorcycle className="inline mr-2" />
                      Riders
                    </th>
                    <th className="px-6 py-4 text-center">Orders</th>
                    <th className="px-6 py-4 text-right">
                      <FaMoneyBillWave className="inline mr-2" />
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cityComparison?.map((city, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        navigate(`/admin-city-details/${city.city}`)
                      }
                    >
                      <td className="px-6 py-4 font-semibold capitalize">
                        {city.city}
                      </td>
                      <td className="px-6 py-4 text-center">{city.users}</td>
                      <td className="px-6 py-4 text-center">{city.shops}</td>
                      <td className="px-6 py-4 text-center">{city.captains}</td>
                      <td className="px-6 py-4 text-center">{city.orders}</td>
                      <td className="px-6 py-4 text-right font-semibold">
                        Rs. {city.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CityComparison;
