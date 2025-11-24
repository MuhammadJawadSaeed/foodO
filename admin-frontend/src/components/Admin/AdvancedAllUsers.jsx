import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import { BiBlock, BiCheckCircle } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AdvancedAllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to delete user");
      });
  };

  const handleSuspend = async (id) => {
    await axios
      .put(`${server}/user/suspend-user/${id}`, {}, { withCredentials: true })
      .then((res) => {
        toast.success("User suspended successfully");
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to suspend user");
      });
  };

  const handleUnsuspend = async (id) => {
    await axios
      .put(`${server}/user/unsuspend-user/${id}`, {}, { withCredentials: true })
      .then((res) => {
        toast.success("User activated successfully");
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to activate user");
      });
  };

  const handleSendEmail = async (id) => {
    await axios
      .post(
        `${server}/user/send-email/${id}`,
        { subject: "Platform Update", message: "..." },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Email sent successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to send email");
      });
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      const promises = selectedUsers.map((id) =>
        axios.delete(`${server}/user/delete-user/${id}`, {
          withCredentials: true,
        })
      );
      await Promise.all(promises)
        .then(() => {
          toast.success(`${selectedUsers.length} users deleted`);
          setSelectedUsers([]);
          dispatch(getAllUsers());
        })
        .catch(() => {
          toast.error("Some deletions failed");
        });
    }
  };

  const viewUserDetails = async (id) => {
    await axios
      .get(`${server}/user/user-info/${id}`, { withCredentials: true })
      .then((res) => {
        setUserDetails(res.data.user);
        setShowDetails(true);
      })
      .catch((error) => {
        toast.error("Failed to load user details");
      });
  };

  // Filter users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.suspended) ||
      (filterStatus === "suspended" && user.suspended);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      field: "select",
      headerName: "",
      minWidth: 50,
      flex: 0.3,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(params.row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, params.row.id]);
            } else {
              setSelectedUsers(
                selectedUsers.filter((id) => id !== params.row.id)
              );
            }
          }}
          className="w-4 h-4"
        />
      ),
    },
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.avatar || "/default-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{params.row.name}</span>
          {params.row.verified && <MdVerified className="text-blue-500" />}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      type: "text",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            params.row.role === "Admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.row.role || "User"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            params.row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "orders",
      headerName: "Orders",
      type: "number",
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 0.8,
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => viewUserDetails(params.id)}
            variant="outlined"
            size="small"
            startIcon={<AiOutlineEye />}
          >
            View
          </Button>
          <Button
            onClick={() => {
              setOpen(true);
              setUserId(params.id);
            }}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<AiOutlineDelete />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const rows =
    filteredUsers?.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.suspended ? "Suspended" : "Active",
      joinedAt: new Date(user.createdAt).toLocaleDateString(),
      orders: user.orders?.length || 0,
      avatar: user.avatar?.url,
      verified: user.verified,
    })) || [];

  return (
    <div className="w-full p-4">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              User Management
            </h2>
            <p className="text-gray-600 text-sm">
              Total Users: {users?.length || 0} | Showing:{" "}
              {filteredUsers?.length || 0}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            <AiOutlineUserAdd size={20} />
            <span>Add User</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <AiOutlineSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Roles</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-gray-700">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <AiOutlineDelete />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="w-full flex justify-end cursor-pointer mb-2">
              <RxCross1
                size={24}
                onClick={() => setOpen(false)}
                className="hover:text-red-500"
              />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center py-3 sm:py-5 font-Poppins text-gray-800">
              Are you sure you want to delete this user?
            </h3>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
              <button
                className="w-full sm:w-36 bg-gray-700 hover:bg-gray-800 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-36 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => {
                  setOpen(false);
                  handleDelete(userId);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetails && userDetails && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen overflow-y-auto p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
              <RxCross1
                size={25}
                onClick={() => setShowDetails(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={userDetails.avatar?.url || "/default-avatar.png"}
                alt={userDetails.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xl font-semibold">{userDetails.name}</h4>
                <p className="text-gray-600">{userDetails.email}</p>
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(userDetails.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-semibold">
                  {userDetails.role || "User"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-semibold">
                  {userDetails.phoneNumber || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold">
                  {userDetails.orders?.length || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  {userDetails.suspended ? "Suspended" : "Active"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h5 className="font-semibold text-gray-700 mb-2">Addresses</h5>
              {userDetails.addresses?.length > 0 ? (
                <div className="space-y-2">
                  {userDetails.addresses.map((addr, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">{addr.addressType}</p>
                      <p className="text-gray-600">{`${addr.address1}, ${addr.city}, ${addr.country}`}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No addresses added</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSendEmail(userDetails._id)}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <AiOutlineMail />
                Send Email
              </button>
              {userDetails.suspended ? (
                <button
                  onClick={() => {
                    handleUnsuspend(userDetails._id);
                    setShowDetails(false);
                  }}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <BiCheckCircle />
                  Activate
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSuspend(userDetails._id);
                    setShowDetails(false);
                  }}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2"
                >
                  <BiBlock />
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAllUsers;
