import React, { useState } from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <DashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="w-full p-2 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Shop Info Sidebar */}
          <div
            className={`fixed lg:static top-0 left-0 h-screen lg:h-auto w-80 lg:w-1/4 bg-white shadow-lg lg:shadow-sm rounded-lg overflow-y-auto z-[45] lg:z-10 transition-transform duration-300 ease-in-out ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-white font-bold text-lg">Shop Info</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:bg-orange-600 rounded p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ShopInfo isOwner={true} />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;
