import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMotorcycle,
  FaArrowLeft,
  FaMoneyBillWave,
  FaClock,
  FaRoute,
  FaCheckCircle,
  FaBan,
  FaTrash,
  FaIdCard,
  FaCar,
} from "react-icons/fa";
import {
  getCaptainDetails,
  updateCaptainStatus,
  deleteCaptain,
  getCaptainsByCity,
} from "../../redux/actions/city";
import { toast } from "react-toastify";
import AdminHeader from "../Layout/AdminHeader";
import AdminSideBar from "../Layout/AdminSideBar";

const CaptainDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { captainDetails, isLoading } = useSelector((state) => state.city);

  useEffect(() => {
    dispatch(getCaptainDetails(id));
  }, [dispatch, id]);

  const handleStatusChange = async (status) => {
    try {
      await dispatch(updateCaptainStatus(id, status));
      toast.success(
        `Captain ${
          status === "active" ? "activated" : "deactivated"
        } successfully!`
      );
      dispatch(getCaptainDetails(id));
    } catch (error) {
      toast.error("Failed to update captain status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this captain?")) {
      try {
        await dispatch(deleteCaptain(id));
        toast.success("Captain deleted successfully!");
        navigate(-1);
      } catch (error) {
        toast.error("Failed to delete captain");
      }
    }
  };

  const profile = captainDetails?.profile;
  const stats = captainDetails?.statistics;
  const rides = captainDetails?.rides;

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
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : profile ? (
            <>
              {/* Captain Header */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={profile.profileImage?.url}
                      alt={profile.fullname?.firstname}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 sm:border-4 border-purple-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                        {profile.fullname?.firstname}{" "}
                        {profile.fullname?.lastname}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        {profile.email}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {profile.phoneNumber}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {profile.address}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${
                            stats?.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {stats?.status?.toUpperCase()}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 capitalize">
                          <FaIdCard className="inline mr-1" />
                          {profile.city}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          <FaClock className="inline mr-1" />
                          Joined:{" "}
                          {new Date(stats?.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {stats?.status === "active" ? (
                      <button
                        onClick={() => handleStatusChange("inactive")}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all active:scale-95 text-sm sm:text-base"
                      >
                        <FaBan /> Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange("active")}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all active:scale-95 text-sm sm:text-base"
                      >
                        <FaCheckCircle /> Activate
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all active:scale-95 text-sm sm:text-base"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-md border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaRoute className="text-xl sm:text-2xl text-purple-500" />
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      TOTAL RIDES
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stats?.totalRides || 0}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {stats?.cancelledRides || 0} cancelled
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaMoneyBillWave className="text-2xl text-green-500" />
                    <span className="text-xs text-gray-500">
                      TOTAL EARNINGS
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Rs. {stats?.totalEarnings?.toLocaleString() || 0}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaMoneyBillWave className="text-2xl text-blue-500" />
                    <span className="text-xs text-gray-500">RIDE FEES</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Rs. {stats?.rideFeeEarnings?.toLocaleString() || 0}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <FaClock className="text-2xl text-orange-500" />
                    <span className="text-xs text-gray-500">HOURS ONLINE</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {Math.round((stats?.hoursOnline || 0) / 60)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">hours</p>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCar className="text-orange-500" />
                  Vehicle Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">
                      Vehicle Type
                    </label>
                    <p className="font-medium capitalize">
                      {profile.vehicle?.vehicleType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Plate Number
                    </label>
                    <p className="font-medium">{profile.vehicle?.plate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">CNIC Number</label>
                    <p className="font-medium">{profile.cnicNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      CNIC Image
                    </label>
                    <img
                      src={profile.cnicImage?.url}
                      alt="CNIC"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      Driving License
                    </label>
                    <img
                      src={profile.drivingLicense?.url}
                      alt="License"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      Vehicle Image
                    </label>
                    <img
                      src={profile.vehicleImage?.url}
                      alt="Vehicle"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Rides */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRoute className="text-orange-500" />
                  Recent Rides ({rides?.length || 0})
                </h2>
                {rides && rides.length > 0 ? (
                  <div className="space-y-3">
                    {rides.map((ride, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:border-orange-300 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              Ride ID: {ride._id?.substring(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              From: {ride.pickup?.address || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              To: {ride.destination?.address || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(ride.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              Rs. {ride.fare?.toLocaleString() || 0}
                            </p>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full mt-2 inline-block">
                              {ride.status || "Completed"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-10">
                    No rides found
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">Captain not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
