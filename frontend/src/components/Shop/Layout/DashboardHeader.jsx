import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const DashboardHeader = ({ toggleSidebar }) => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-16 sm:h-20 bg-white shadow-md sticky top-0 left-0 z-50 flex items-center justify-between px-3 sm:px-6 border-b-2 border-orange-100">
      {/* Hamburger Menu Button - Mobile Only */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <HiOutlineMenuAlt3 size={24} className="text-orange-500" />
      </button>

      {/* Logo - Centered on mobile, left on desktop */}
      <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
        <Link to="/dashboard">
          <div className="flex items-center hover:opacity-80 transition-opacity">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-700">
              food
            </h1>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500">
              O
            </h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Link to="/dashboard-coupouns" className="hidden lg:block">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <AiOutlineGift
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to="/dashboard-products" className="hidden lg:block">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <FiShoppingBag
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to="/dashboard-orders" className="hidden lg:block">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <FiPackage color="#f97316" size={26} className="cursor-pointer" />
          </div>
        </Link>
        <Link to="/dashboard-messages" className="hidden lg:block">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <BiMessageSquareDetail
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to={`/shop/${seller._id}`} className="ml-2 sm:ml-3 relative">
          <img
            src={`${seller.avatar?.url}`}
            alt="Shop Avatar"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-orange-500 hover:border-orange-600 transition-colors"
          />
          {/* Online/Offline Status Indicator */}
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <span
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                seller?.isOnline !== false ? "bg-green-500" : "bg-red-500"
              }`}
              title={
                seller?.isOnline !== false
                  ? "Restaurant Online"
                  : "Restaurant Offline"
              }
            ></span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
