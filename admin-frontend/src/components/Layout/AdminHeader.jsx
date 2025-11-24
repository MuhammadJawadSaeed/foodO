import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[60px] sm:h-[70px] md:h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Logo - Centered on mobile, left on desktop */}
      <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
        <Link to="/admin/dashboard">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-gray-700">
              food
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-[38px] font-semibold text-orange-500">
              O
            </h1>
          </div>
        </Link>
      </div>

      {/* User Avatar - Always visible */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/dashboard/cupouns" className="hidden lg:block">
          <AiOutlineGift
            color="#555"
            size={28}
            className="hover:text-orange-500 transition-colors cursor-pointer"
          />
        </Link>
        <Link to="/dashboard-products" className="hidden lg:block">
          <FiShoppingBag
            color="#555"
            size={28}
            className="hover:text-orange-500 transition-colors cursor-pointer"
          />
        </Link>
        <Link to="/dashboard-orders" className="hidden lg:block">
          <FiPackage
            color="#555"
            size={28}
            className="hover:text-orange-500 transition-colors cursor-pointer"
          />
        </Link>
        <Link to="/dashboard-messages" className="hidden lg:block">
          <BiMessageSquareDetail
            color="#555"
            size={28}
            className="hover:text-orange-500 transition-colors cursor-pointer"
          />
        </Link>
        {user?.avatar?.url && (
          <img
            src={`${user.avatar.url}`}
            alt="Admin"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-orange-200"
          />
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
