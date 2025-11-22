import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4">
        <h2 className="text-white font-bold text-lg">My Account</h2>
      </div>

      <nav className="p-3">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 1
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(1)}
        >
          <RxPerson
            size={18}
            className={active === 1 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Profile</span>
        </button>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 2
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(2)}
        >
          <HiOutlineShoppingBag
            size={18}
            className={active === 2 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Orders</span>
        </button>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 4
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(4) || navigate("/inbox")}
        >
          <AiOutlineMessage
            size={18}
            className={active === 4 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Inbox</span>
        </button>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 5
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(5)}
        >
          <MdOutlineTrackChanges
            size={18}
            className={active === 5 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Track Order</span>
        </button>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 6
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(6)}
        >
          <RiLockPasswordLine
            size={18}
            className={active === 6 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Change Password</span>
        </button>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
            active === 7
              ? "bg-orange-50 text-orange-600 font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActive(7)}
        >
          <TbAddressBook
            size={18}
            className={active === 7 ? "text-orange-600" : "text-gray-600"}
          />
          <span className="text-sm">Address</span>
        </button>

        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <button
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all mb-1 ${
                active === 8
                  ? "bg-orange-50 text-orange-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActive(8)}
            >
              <MdOutlineAdminPanelSettings
                size={18}
                className={active === 8 ? "text-orange-600" : "text-gray-600"}
              />
              <span className="text-sm">Admin Dashboard</span>
            </button>
          </Link>
        )}

        <div className="border-t border-gray-200 mt-3 pt-3">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all text-red-600 hover:bg-red-50"
            onClick={logoutHandler}
          >
            <AiOutlineLogin size={18} className="text-red-600" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
