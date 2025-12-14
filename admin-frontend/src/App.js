import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadUser } from "./redux/actions/user";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDashboardUsers from "./pages/AdminDashboardUsers";
import AdminDashboardSellers from "./pages/AdminDashboardSellers";
import AdminDashboardOrders from "./pages/AdminDashboardOrders";
import AdminDashboardProducts from "./pages/AdminDashboardProducts";
import AdminDashboardWithdraw from "./pages/AdminDashboardWithdraw";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSystemSettings from "./pages/AdminSystemSettings";
import AdminReportsPage from "./pages/AdminReportsPage";
import CityManagement from "./components/Admin/CityManagement";
import CityDetails from "./components/Admin/CityDetails";
import CityComparison from "./components/Admin/CityComparison";
import RestaurantDetails from "./components/Admin/RestaurantDetails";
import CaptainDetails from "./components/Admin/CaptainDetails";
import AdminOrderDetails from "./components/Admin/AdminOrderDetails";
import AdminProductDetails from "./components/Admin/AdminProductDetails";

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/" element={<Navigate to="/admin-login" replace />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUsers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-sellers"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardSellers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardOrders />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardProducts />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-withdraw"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardWithdraw />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedAdminRoute>
              <AdminAnalytics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSystemSettings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedAdminRoute>
              <AdminReportsPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-cities"
          element={
            <ProtectedAdminRoute>
              <CityManagement />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-city-details/:city"
          element={
            <ProtectedAdminRoute>
              <CityDetails />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-city-comparison"
          element={
            <ProtectedAdminRoute>
              <CityComparison />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-restaurant-details/:id"
          element={
            <ProtectedAdminRoute>
              <RestaurantDetails />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-captain-details/:id"
          element={
            <ProtectedAdminRoute>
              <CaptainDetails />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedAdminRoute>
              <AdminOrderDetails />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedAdminRoute>
              <AdminProductDetails />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
};

export default App;
