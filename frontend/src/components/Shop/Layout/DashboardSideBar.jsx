import React, { useState } from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { FaBars, FaTimes } from "react-icons/fa";

const DashboardSideBar = ({ active, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 1, name: "Dashboard", icon: RxDashboard, path: "/dashboard" },
    {
      id: 2,
      name: "All Orders",
      icon: FiShoppingBag,
      path: "/dashboard-orders",
    },
    {
      id: 3,
      name: "All Food Items",
      icon: FiPackage,
      path: "/dashboard-products",
    },
    {
      id: 4,
      name: "Create Food Item",
      icon: AiOutlineFolderAdd,
      path: "/dashboard-create-product",
    },
    {
      id: 7,
      name: "Withdraw Money",
      icon: CiMoneyBill,
      path: "/dashboard-withdraw-money",
    },
    {
      id: 8,
      name: "Shop Inbox",
      icon: BiMessageSquareDetail,
      path: "/dashboard-messages",
    },
    {
      id: 9,
      name: "Discount Codes",
      icon: AiOutlineGift,
      path: "/dashboard-coupouns",
    },
    { id: 11, name: "Settings", icon: CiSettings, path: "/settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 lg:top-[5rem] left-0 h-screen lg:h-[calc(100vh-5rem)] bg-white overflow-hidden z-[45] lg:z-[20] transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-white font-bold text-lg">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu Items - Scrollable */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)] lg:h-full">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="w-full flex items-center p-4 hover:bg-orange-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Link to={item.path} className="w-full flex items-center gap-3">
                  <IconComponent
                    size={26}
                    color={active === item.id ? "#f97316" : "#6b7280"}
                  />
                  <h5
                    className={`text-base font-medium ${
                      active === item.id ? "text-orange-500" : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </h5>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DashboardSideBar;
