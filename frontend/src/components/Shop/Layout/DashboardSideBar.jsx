import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-lg overflow-y-scroll sticky top-0 left-0 z-10 border-r border-gray-200">
      {/* Dashboard */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link to="/dashboard" className="w-full flex items-center gap-3">
          <RxDashboard
            size={26}
            color={`${active === 1 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 1 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>

      {/* All Orders */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link to="/dashboard-orders" className="w-full flex items-center gap-3">
          <FiShoppingBag
            size={26}
            color={`${active === 2 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 2 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>

      {/* All Food Items */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link
          to="/dashboard-products"
          className="w-full flex items-center gap-3"
        >
          <FiPackage
            size={26}
            color={`${active === 3 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 3 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            All Food Items
          </h5>
        </Link>
      </div>

      {/* Create Food Item */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link
          to="/dashboard-create-product"
          className="w-full flex items-center gap-3"
        >
          <AiOutlineFolderAdd
            size={26}
            color={`${active === 4 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 4 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Create Food Item
          </h5>
        </Link>
      </div>

      {/* Withdraw Money */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link
          to="/dashboard-withdraw-money"
          className="w-full flex items-center gap-3"
        >
          <CiMoneyBill
            size={26}
            color={`${active === 7 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 7 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Withdraw Money
          </h5>
        </Link>
      </div>

      {/* Shop Inbox */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link
          to="/dashboard-messages"
          className="w-full flex items-center gap-3"
        >
          <BiMessageSquareDetail
            size={26}
            color={`${active === 8 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 8 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Shop Inbox
          </h5>
        </Link>
      </div>

      {/* Discount Codes */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link
          to="/dashboard-coupouns"
          className="w-full flex items-center gap-3"
        >
          <AiOutlineGift
            size={26}
            color={`${active === 9 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 9 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>

      {/* Settings */}
      <div className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors">
        <Link to="/settings" className="w-full flex items-center gap-3">
          <CiSettings
            size={26}
            color={`${active === 11 ? "#f97316" : "#6b7280"}`}
          />
          <h5
            className={`hidden 800px:block text-base font-medium ${
              active === 11 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSideBar;
