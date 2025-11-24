import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { FiShoppingBag, FiPackage } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { MdPending, MdDeliveryDining } from "react-icons/md";
import { BiDollar } from "react-icons/bi";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders =
    orders?.filter(
      (order) => order.status === "Processing" || order.status === "Pending"
    ).length || 0;
  const deliveredOrders =
    orders?.filter((order) => order.status === "Delivered").length || 0;
  const totalRevenue =
    orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
  const totalProducts = products?.length || 0;
  const totalItemsSold =
    products?.reduce((acc, product) => acc + (product.sold_out || 0), 0) || 0;

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "PKR " + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="w-full p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-orange-100 min-h-screen">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        Dashboard Overview
      </h3>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Account Balance Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Account Balance
              </h3>
              <AiOutlineMoneyCollect
                size={24}
                className="text-white sm:w-7 sm:h-7"
              />
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              PKR {availableBalance}
            </p>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">
              (with 10% service charge)
            </p>
            <Link to="/dashboard-withdraw-money">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm sm:text-base">
                Withdraw Money
              </button>
            </Link>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Total Revenue
              </h3>
              <BiDollar size={24} className="text-white sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              PKR {totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">
              All time earnings
            </p>
            <Link to="/dashboard-orders">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm sm:text-base">
                View Details
              </button>
            </Link>
          </div>
        </div>

        {/* All Orders Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-base sm:text-lg">
                All Orders
              </h3>
              <FiShoppingBag size={24} className="text-white sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {totalOrders}
            </p>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">
              Total orders received
            </p>
            <Link to="/dashboard-orders">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm sm:text-base">
                View Orders
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <MdPending size={20} className="text-yellow-600 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {pendingOrders}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Pending Orders</p>
          <p className="text-xs text-gray-500 mt-1">Need processing</p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <MdDeliveryDining
                size={20}
                className="text-green-600 sm:w-6 sm:h-6"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {deliveredOrders}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Delivered Orders
          </p>
          <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <FiPackage size={20} className="text-purple-600 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {totalProducts}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Total Products</p>
          <p className="text-xs text-gray-500 mt-1">Listed items</p>
        </div>

        {/* Items Sold */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
              <BsCart3 size={20} className="text-orange-600 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {totalItemsSold}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700">Items Sold</p>
          <p className="text-xs text-gray-500 mt-1">Total units sold</p>
        </div>
      </div>
      {/* Latest Orders Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-white font-bold text-base sm:text-lg">
            Latest Orders
          </h3>
        </div>
        <div className="p-3 sm:p-6 overflow-x-auto">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight
            className="border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
