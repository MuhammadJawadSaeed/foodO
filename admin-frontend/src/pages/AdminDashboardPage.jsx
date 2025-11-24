import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import EnhancedAdminDashboard from "../components/Admin/EnhancedAdminDashboard";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={1} />
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <EnhancedAdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
