import React from "react";
import { Link } from "react-router-dom";
import {
  RiBikeLine,
  RiMoneyDollarCircleLine,
  RiSmartphoneLine,
  RiLockLine,
  RiUserAddLine,
} from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";

const Start = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Mobile Design (default) */}
      <div className="lg:hidden bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full">
        <div className="px-8">
          <div className="bg-white rounded-lg shadow-lg p-4 inline-block">
            <h1 className="text-4xl font-bold text-orange-600">foodO</h1>
            <p className="text-sm text-gray-600">Captain Portal</p>
          </div>
        </div>
        <div className="bg-white pb-8 py-6 px-6 rounded-t-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Captain Portal
          </h2>
          <p className="text-gray-600 mb-6">Food Delivery Made Simple & Fast</p>
          <Link
            to="/captain-login"
            className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl mt-5 font-semibold text-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Captain Login
          </Link>
          <Link
            to="/captain-signup"
            className="flex items-center justify-center w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-xl mt-4 font-semibold text-lg shadow-lg hover:from-gray-800 hover:to-gray-900 transition-all"
          >
            Captain Signup
          </Link>
        </div>
      </div>

      {/* Desktop Design (large screens) */}
      <div className="hidden lg:flex h-screen w-full">
        {/* Left Side - Branding & Image */}
        <div className="w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex flex-col justify-center items-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-6xl font-bold text-white mb-3 drop-shadow-2xl">
              foodO
            </h1>
            <p className="text-2xl text-white font-light mb-6 drop-shadow-lg">
              Captain Portal
            </p>

            {/* Hero Image */}
            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=800&auto=format&fit=crop"
                alt="Food Delivery"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-white">
              <div className="text-center">
                <div className="text-4xl mb-2 flex justify-center">
                  <RiBikeLine />
                </div>
                <p className="text-xs font-semibold">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 flex justify-center">
                  <RiMoneyDollarCircleLine />
                </div>
                <p className="text-xs font-semibold">Good Earnings</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 flex justify-center">
                  <RiSmartphoneLine />
                </div>
                <p className="text-xs font-semibold">Easy to Use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center items-center p-8">
          <div className="max-w-md w-full">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-600 mb-1">foodO</h2>
              <p className="text-lg text-gray-600">Captain Portal</p>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h3>
              <p className="text-gray-600 text-sm">
                Start delivering and earning with foodO
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3 max-w-sm mx-auto">
              <Link
                to="/captain-login"
                className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold text-base shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02]"
              >
                <RiLockLine className="mr-2 text-lg" />
                Captain Login
              </Link>
              <Link
                to="/captain-signup"
                className="flex items-center justify-center w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-bold text-base shadow-lg hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-[1.02]"
              >
                <RiUserAddLine className="mr-2 text-lg" />
                Captain Signup
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-xs mb-4">
                Join thousands of captains delivering happiness
              </p>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">10K+</p>
                  <p className="text-xs text-gray-500">Active Captains</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600">50K+</p>
                  <p className="text-xs text-gray-500">Daily Deliveries</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                    4.8
                    <IoStarSharp className="text-yellow-500 text-base" />
                  </p>
                  <p className="text-xs text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
