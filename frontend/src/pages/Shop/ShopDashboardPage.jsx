import React, { useState } from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <DashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {/* Sidebar Container */}
        <DashboardSideBar
          active={1}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        {/* Main Content with left margin to account for fixed sidebar on desktop */}
        <div className="w-full lg:ml-64">
          <DashboardHero />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
