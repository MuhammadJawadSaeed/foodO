import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdvancedAllSellers from "../components/Admin/AdvancedAllSellers";

const AdminDashboardSellers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={3} />
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <AdvancedAllSellers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSellers;
