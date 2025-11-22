import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-20 bg-white shadow-md sticky top-0 left-0 z-30 flex items-center justify-between px-6 border-b-2 border-orange-100">
      <div>
        <Link to="/dashboard">
          <div className="flex items-center hover:opacity-80 transition-opacity">
            <h1 className="text-4xl font-bold text-gray-700">food</h1>
            <h1 className="text-4xl font-bold text-orange-500">O</h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/dashboard-coupouns" className="800px:block hidden">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <AiOutlineGift
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to="/dashboard-products" className="800px:block hidden">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <FiShoppingBag
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to="/dashboard-orders" className="800px:block hidden">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <FiPackage color="#f97316" size={26} className="cursor-pointer" />
          </div>
        </Link>
        <Link to="/dashboard-messages" className="800px:block hidden">
          <div className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
            <BiMessageSquareDetail
              color="#f97316"
              size={26}
              className="cursor-pointer"
            />
          </div>
        </Link>
        <Link to={`/shop/${seller._id}`} className="ml-3">
          <img
            src={`${seller.avatar?.url}`}
            alt="Shop Avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 hover:border-orange-600 transition-colors"
          />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
