import React, { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { MdAnalytics } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaCity, FaBars, FaTimes } from "react-icons/fa";

const AdminSideBar = ({ active }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 lg:w-full h-screen lg:h-[90vh] bg-white shadow-lg lg:shadow-sm overflow-y-scroll transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-gray-200 bg-orange-50">
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        </div>

        {/* single item */}
        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin/dashboard" className="w-full flex items-center">
            <RxDashboard
              size={28}
              color={`${active === 1 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 1 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              Dashboard
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-orders" className="w-full flex items-center">
            <FiShoppingBag
              size={28}
              color={`${active === 2 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 2 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              All Orders
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-sellers" className="w-full flex items-center">
            <GrWorkshop
              size={28}
              color={`${active === 3 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 3 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              All Sellers
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-users" className="w-full flex items-center">
            <HiOutlineUserGroup
              size={28}
              color={`${active === 4 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 4 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              All Users
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-products" className="w-full flex items-center">
            <BsHandbag
              size={28}
              color={`${active === 5 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 5 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              All Products
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-withdraw" className="w-full flex items-center">
            <CiMoneyBill
              size={28}
              color={`${active === 7 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 7 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              Withdraw Request
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin-cities" className="w-full flex items-center">
            <FaCity size={28} color={`${active === 11 ? "crimson" : "#555"}`} />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 11 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              City Management
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin/analytics" className="w-full flex items-center">
            <MdAnalytics
              size={28}
              color={`${active === 8 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 8 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              Analytics
            </h5>
          </Link>
        </div>

        <div
          className="w-full flex items-center p-4 hover:bg-gray-50"
          onClick={() => setIsOpen(false)}
        >
          <Link to="/admin/settings" className="w-full flex items-center">
            <AiOutlineSetting
              size={28}
              color={`${active === 9 ? "crimson" : "#555"}`}
            />
            <h5
              className={`pl-3 text-base font-medium ${
                active === 9 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              Settings
            </h5>
          </Link>
        </div>

        <div className="w-full flex items-center p-4">
          <Link to="/admin/reports" className="w-full flex items-center">
            <HiOutlineDocumentReport
              size={30}
              color={`${active === 10 ? "crimson" : "#555"}`}
            />
            <h5
              className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
                active === 10 ? "text-[crimson]" : "text-[#555]"
              }`}
            >
              Settings
            </h5>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSideBar;
