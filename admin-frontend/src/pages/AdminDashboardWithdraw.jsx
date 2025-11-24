import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import AdvancedAllWithdraw from "../components/Admin/AdvancedAllWithdraw";

const AdminDashboardWithdraw = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={7} />
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <AdvancedAllWithdraw />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardWithdraw;
